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
        const refreshToken = (res as Record<string, unknown>)?.['refresh_token'] as string | undefined
          ?? (res as Record<string, unknown>)?.['refreshToken'] as string | undefined
          ?? null;
        set({
          isLoggedIn: true,
          user: res.user,
          accessToken,
          refreshToken: refreshToken ?? null,
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

      setToken(accessToken: string, refreshToken?: string | null) {
        set({
          accessToken,
          refreshToken: refreshToken ?? get().refreshToken ?? null,
        });
      },

      getToken() {
        return get().accessToken;
      },

      getRefreshToken() {
        return get().refreshToken;
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
        refreshToken: state.refreshToken,
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
