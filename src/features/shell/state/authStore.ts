// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin } from '@/shared/api/authService';
import { db } from '@/mocks/data/db';
import { AuthStoreType } from './store.types';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      authReady: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      async login(username: string, password: string) {
        const res = await apiLogin({ username, password });
        // Mapear snake_case del response a camelCase en el store
        const accessToken = (res as Record<string, unknown>)?.['access_token'] as string | undefined
          ?? (res as Record<string, unknown>)?.['accessToken'] as string | undefined
          ?? null;
        // No persistimos refreshToken en frontend: se usará cookie HttpOnly
        // Derivar permisos efectivos desde roles del usuario (mock)
        let derivedPermissions: Array<{ permission_string: string }> | undefined = undefined;
        try {
          const userId = Number(res.user?.user_id);
          if (!Number.isNaN(userId)) {
            const links = (db.user_roles as any[]).filter(r => Number(r.user_id) === userId);
            const roleIds = links.map(r => Number(r.role_id));
            const rp = (db.role_permissions as any[]).filter(r => roleIds.includes(Number(r.role_id)));
            const permIds = new Set(rp.map(r => Number(r.permission_id)));
            const perms = (db.permissions as any[]).filter(p => permIds.has(Number(p.permission_id)));
            derivedPermissions = perms.map(p => ({ permission_string: String(p.permission_string) }));
          }
        } catch {}

        set({
          isLoggedIn: true,
          authReady: true,
          user: { ...res.user, permissions: derivedPermissions ?? res.user?.permissions },
          accessToken,
          refreshToken: null,
        });
        try { localStorage.removeItem('auth:revoked'); } catch {}
        return res.user;
      },

      logout() {
        try {
          localStorage.setItem('auth:revoked', '1');
          localStorage.removeItem('csrf_token');
          // Borrar persistencia del store 'auth'
          localStorage.removeItem('auth');
          // Borrar marcador de usuario actual en mocks
          localStorage.removeItem('mock:current_user_id');
          // Opcional: limpiar DB mock para evitar residuos (solo en dev)
          if (typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE === 'development') {
            localStorage.removeItem('msw:db');
          }
        } catch {}
        set({ isLoggedIn: false, authReady: true, user: null, accessToken: null, refreshToken: null });
      },

      setToken(accessToken: string, _refreshToken?: string | null) {
        // Solo actualizamos accessToken. El refresh va por cookie HttpOnly
        set({ accessToken });
      },

      getToken() {
        return get().accessToken;
      },

      getRefreshToken() {
        // Devolvemos siempre null para forzar uso de cookie HttpOnly en el refresh
        return null;
      },

      setLoggedIn(flag: boolean) {
        set({ isLoggedIn: flag });
      },

      setUser(user) {
        set({ user });
      },

      setAuthReady(flag: boolean) {
        set({ authReady: flag });
      },

      hasPermission(permissionString) {
        const u = get().user;
        if (!u) return false;
        // Bypass total para super admin (user_id === 1) en desarrollo/mocks
        if (Number(u.user_id) === 1) return true;
        return (
          u.permissions?.some(
            (p) => p.permission_string === permissionString
          ) ?? false
        );
      },
    }),
    {
      name: 'auth',
      version: 2,
      migrate: (persistedState: any, version) => {
        // Elimina claves antiguas (isLoggedIn, tokens) y conserva solo user
        const user = persistedState?.user ?? null;
        return { user };
      },
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        // Al finalizar la rehidratación indicamos que el store está listo;
        // si hay usuario persistido, marcamos sesión mientras llega el token.
        const next: Partial<ReturnType<typeof useAuthStore.getState>> = { authReady: true } as any;
        const revoked = (() => { try { return localStorage.getItem('auth:revoked') === '1'; } catch { return false; } })();
        if (state?.user && !revoked) Object.assign(next, { isLoggedIn: true });
        useAuthStore.setState(next);
      },
    }
  )
);

export function getAuthStore() {
  const state = useAuthStore.getState();
  return {
    getToken: () => state.getToken(),
    getRefreshToken: () => state.getRefreshToken(),
    setToken: state.setToken,
    logout: state.logout,
    getUser: () => state.user,
    setLoggedIn: state.setLoggedIn,
    setUser: state.setUser,
    setAuthReady: state.setAuthReady,
  };
}
