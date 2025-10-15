import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin } from '@/shared/api/authService';
import { AuthStoreType } from './store.types';
import { SESSION_STORAGE_KEYS } from '@/constants/sessionConstants';
import type { UserSession } from '@/features/security/types';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      authReady: false,
      phase: 'idle' as 'idle' | 'loading' | 'ready' | 'error',
      user: null,
      accessToken: null,
      refreshToken: null,

      async login(username: string, password: string): Promise<UserSession> {
        // Solo obtiene tokens y prepara el pipeline; la sesión completa se hará en finalizeLogin()
        const res = await apiLogin({ username, password });
        const accessToken =
          ((res as unknown as Record<string, unknown>)?.['access_token'] as string | undefined) ??
          ((res as unknown as Record<string, unknown>)?.['accessToken'] as string | undefined) ??
          null;

        set({ accessToken, phase: 'loading' });
        localStorage.removeItem(SESSION_STORAGE_KEYS.AUTH_REVOKED);
        // Devolvemos el user si vino en la respuesta, pero NO marcamos listo aquí
        const sessionUser = (res?.user ?? null) as UserSession | null;
        return sessionUser ?? (null as unknown as UserSession);
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
          user: null,
          accessToken: null,
          refreshToken: null,
          phase: 'ready',
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
        set({ authReady: Boolean(flag) });
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
      onRehydrateStorage: () => () => {
        // No forzar loggedIn ni authReady desde persistencia; bootstrapAuth decidirá
        useAuthStore.setState({ authReady: false, phase: 'idle' });
      },
    }
  )
);

// ✅ Export a "getter" to access the store outside of React components
export const getAuthStore = () => useAuthStore.getState();
