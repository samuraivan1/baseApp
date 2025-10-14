import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, getSession } from '@/shared/api/authService';
import { AuthStoreType } from './store.types';
import { SESSION_STORAGE_KEYS } from '@/constants/sessionConstants';
import type { UserSession } from '@/features/security/types';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      authReady: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      async login(username: string, password: string): Promise<UserSession> {
        // 1) Login para obtener tokens
        const res = await apiLogin({ username, password });
        const accessToken =
          ((res as unknown as Record<string, unknown>)?.['access_token'] as string | undefined) ??
          ((res as unknown as Record<string, unknown>)?.['accessToken'] as string | undefined) ??
          null;

        // Setear token primero para habilitar getSession en mocks (requiere Bearer)
        set({ accessToken });

        // 2) Obtener sesión (usuario) con permisos derivados vía mocks
        let sessionUser: UserSession | null = null;
        try {
          const session = await getSession();
          sessionUser = session.user as unknown as UserSession;
        } catch {
          sessionUser = res.user as unknown as UserSession;
        }

        // 3) Marcar logged-in y authReady solo al final
        set({
          isLoggedIn: true,
          authReady: true,
          user: sessionUser,
          accessToken,
          refreshToken: null,
        });
        try {
          console.log('[Auth] login complete, authReady:true');
        } catch (err) {
          // Ignorar errores de consola en entornos sin console
        }

        localStorage.removeItem(SESSION_STORAGE_KEYS.AUTH_REVOKED);
        return sessionUser as UserSession;
      },

      logout() {
        try {
          const keysToClear = [
            SESSION_STORAGE_KEYS.AUTH_REVOKED,
            SESSION_STORAGE_KEYS.CSRF_TOKEN,
            SESSION_STORAGE_KEYS.AUTH_STATE,
            SESSION_STORAGE_KEYS.MOCK_CURRENT_USER_ID,
          ];

          // La clave AUTH_REVOKED se setea, el resto se elimina
          localStorage.setItem(SESSION_STORAGE_KEYS.AUTH_REVOKED, '1');
          keysToClear.slice(1).forEach((key) => localStorage.removeItem(key));

          // Limpieza específica para desarrollo
          if (import.meta.env.DEV) {
            localStorage.removeItem(SESSION_STORAGE_KEYS.MSW_DB);
          }
        } catch (e) {
          console.error('Failed to clear session storage on logout', e);
        }
        set({
          isLoggedIn: false,
          authReady: true,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      setToken(accessToken: string, _refreshToken?: string | null) {
        set({ accessToken });
      },

      getToken() {
        return get().accessToken;
      },

      getRefreshToken() {
        return null; // Forzar uso de cookie HttpOnly
      },

      setLoggedIn(flag: boolean) {
        set({ isLoggedIn: flag });
      },

      setUser(user: UserSession | null) {
        set({ user });
      },

      setAuthReady(flag: boolean) {
        set({ authReady: flag });
      },

      hasPermission(permissionString) {
        const u = get().user;
        if (!u) return false;
        return (
          u.permissions?.some(
            (p) => p.permission_string === permissionString
          ) ?? false
        );
      },
    }),
    {
      name: SESSION_STORAGE_KEYS.AUTH_STATE,
      version: 3, // Incrementar versión por cambio en la lógica de permisos
      migrate: (persistedState: unknown, version) => {
        if (version < 3) {
          // Lógica de migración si es necesaria. Por ahora, solo reiniciamos.
          return { user: null };
        }
        return persistedState as unknown as AuthStoreType;
      },
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        const nextState: Partial<AuthStoreType> = { authReady: true };
        const isRevoked =
          localStorage.getItem(SESSION_STORAGE_KEYS.AUTH_REVOKED) === '1';
        if (state?.user && !isRevoked) {
          nextState.isLoggedIn = true;
        }
        useAuthStore.setState(nextState);
      },
    }
  )
);

// ✅ Export a "getter" to access the store outside of React components
export const getAuthStore = () => useAuthStore.getState();
