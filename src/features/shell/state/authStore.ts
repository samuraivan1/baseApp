// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin } from '@/shared/api/authService';
import { AuthStoreType } from './store.types';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
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
        set({
          isLoggedIn: true,
          user: res.user,
          accessToken,
          refreshToken: null,
        });
        return res.user;
      },

      logout() {
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
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
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        accessToken: state.accessToken,
        // refreshToken NO se persiste en almacenamiento
      }),
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
  };
}
