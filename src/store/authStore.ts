import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { authMessages } from '@/constants/commonMessages';
import { AuthState, AuthActions } from './store.types';
import { getConfig } from '@/services/configService';

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      loading: false,

      login: async (emailOrUsername, password) => {
        const config = getConfig();
        const API_USERS_URL = `${config.API_BASE_URL}/usuario`;
        const API_ROLES_URL = `${config.API_BASE_URL}/roles`;

        set({ loading: true });
        try {
          const userByEmailResponse = await axios.get(API_USERS_URL, {
            params: { correo_electronico: emailOrUsername },
          });
          const userByUsernameResponse = await axios.get(API_USERS_URL, {
            params: { nombre_usuario: emailOrUsername },
          });
          const potentialUser =
            userByEmailResponse.data[0] || userByUsernameResponse.data[0];

          if (potentialUser) {
            // ✅ --- INICIO DE LA CORRECCIÓN --- ✅
            // Ahora que encontramos al usuario, COMPARAMOS LA CONTRASEÑA
            if (potentialUser.hash_contrasena === password) {
              // Si la contraseña es correcta, procedemos
              const roleResponse = await axios.get(
                `${API_ROLES_URL}/${potentialUser.rolId}`
              );
              const userPermissions = roleResponse.data.permisos;

              set({
                isLoggedIn: true,
                user: {
                  id: potentialUser.id_usuario,
                  name:
                    potentialUser.nombre + ' ' + potentialUser.apellido_paterno,
                  initials: potentialUser.iniciales,
                  email: potentialUser.correo_electronico,
                  role: roleResponse.data.nombre,
                  permisos: userPermissions,
                  bearerToken: 'este_es_un_token_de_ejemplo_jwt',
                },
                loading: false,
              });
              return true;
            } else {
              // La contraseña es incorrecta
              set({ loading: false });
              throw new Error(authMessages.loginError);
            }
            // ✅ --- FIN DE LA CORRECCIÓN --- ✅
          } else {
            // El usuario no fue encontrado
            set({ loading: false });
            throw new Error(authMessages.loginError);
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          loading: false,
        });
        // Ya no hay toast aquí
      },

      hasPermission: (requiredPermission) => {
        const { user } = get();
        if (!user || !user.permisos) {
          return false;
        }
        return user.permisos.includes(requiredPermission);
      },
    }),
    // ✅ 3. Opciones de configuración para la persistencia
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
    }
  )
);
