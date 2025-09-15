import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthActions } from './store.types';
// ✅ 1. Importamos la función de login de nuestro nuevo servicio
import { login as apiLogin } from '@/services/authService';
import logger from '@/services/logger';

type AuthStoreType = AuthState & AuthActions;

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set, get) => ({
      // Estado inicial (sin cambios)
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,

      // ✅ 2. Refactorizamos la acción de login
      login: async (emailOrUsername, password) => {
        set({ loading: true });
        try {
          // Llamamos a nuestro servicio, que se encargará de la petición a la API
          const { user, accessToken, refreshToken } = await apiLogin(
            emailOrUsername,
            password
          );

          // Si la petición es exitosa, actualizamos el estado con los datos reales
          set({
            isLoggedIn: true,
            user,
            accessToken,
            refreshToken,
            loading: false,
          });
          return true; // Indicamos que el login fue exitoso
        } catch (error) {
          // Si el servicio lanza un error (ej. 401), lo capturamos
          logger.error(error as Error, {
            context: 'Falló el inicio de sesión',
            username: emailOrUsername,
          });
          set({ loading: false });
          // Relanzamos el error para que el componente de UI (LoginPage) pueda manejarlo
          throw error;
        }
      },

      // Resto de las acciones (sin cambios)
      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      setToken: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken: refreshToken || get().refreshToken,
          isLoggedIn: !!accessToken,
        }),

      hasPermission: (requiredPermission) => {
        const { user } = get();
        return user?.permisos.includes(requiredPermission) ?? false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Función auxiliar (sin cambios)
export function getAuthStore() {
  const state = useAuthStore.getState();
  return {
    getToken: () => state.accessToken,
    getRefreshToken: () => state.refreshToken,
    setToken: state.setToken,
    logout: state.logout,
  };
}
