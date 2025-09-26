// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin } from '@/services/authService';

// Modelo de usuario en sesión
export interface UserSession {
  id: number;
  nombreCompleto: string;
  iniciales: string;
  email: string;
  rol: string;
  permisos: string[];
  permisosIds: number[];
}

// Estado
interface AuthState {
  isLoggedIn: boolean;
  user: UserSession | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Acciones
interface AuthActions {
  login: (credentials: { username: string; password: string }) => Promise<UserSession>;
  logout: () => void;
  setToken: (accessToken: string, refreshToken?: string | null) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  hasPermission: (permiso: string) => boolean;
}

type AuthStoreType = AuthState & AuthActions;

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      async login(credentials) {
        const res = await apiLogin(credentials);
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

      hasPermission(permiso) {
        const u = get().user;
        if (!u) return false;
        return u.permisos?.includes(permiso) ?? false;
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

// ✅ Helper seguro para acceder desde servicios e interceptores
export function getAuthStore() {
  const state = useAuthStore.getState();
  return {
    getToken: () => state.getToken(),
    getRefreshToken: () => state.getRefreshToken(),
    setToken: state.setToken,
    logout: state.logout,
  };
}
