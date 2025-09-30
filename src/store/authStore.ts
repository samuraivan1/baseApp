// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin } from '@/services/authService';
import { AuthStoreType } from './store.types';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      async login(username, password) {
        const res = await apiLogin({ username, password });
        set({
          isLoggedIn: true,
          user: res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken ?? null,
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

      setToken(accessToken, refreshToken) {
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
