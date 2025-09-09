import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { authMessages } from '@/constants/commonMessages';
import { AuthState, AuthActions } from './store.types';
import { getConfig } from '@/services/configService';
import { UsuarioType, RolType, PermisoType } from '@/services/api.types';

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      loading: false,

      login: async (emailOrUsername, password) => {
        const config = getConfig();
        const API_BASE_URL = config.API_BASE_URL;

        set({ loading: true });
        try {
          // 1. Obtener todos los datos necesarios del json-server
          const [usuariosRes, rolesRes, permisosRes] = await Promise.all([
            axios.get<UsuarioType[]>(`${API_BASE_URL}/usuarios`),
            axios.get<RolType[]>(`${API_BASE_URL}/roles`),
            axios.get<PermisoType[]>(`${API_BASE_URL}/permisos`),
          ]);

          const usuarios = usuariosRes.data;
          const roles = rolesRes.data;
          const permisos = permisosRes.data;

          // 2. Encontrar al usuario por correo o nombre de usuario
          const potentialUser = usuarios.find(
            (u) =>
              u.correoElectronico === emailOrUsername ||
              u.nombreUsuario === emailOrUsername
          );

          // 3. Validar contraseña (en un caso real, esto sería contra un hash)
          if (potentialUser && potentialUser.hashContrasena === password) {
            const userRole = roles.find((r) => r.idRol === potentialUser.rolId);
            if (!userRole) throw new Error('Rol de usuario no encontrado.');

            // 4. Construir la lista de permisos del usuario a partir de su rol
            const userPermissions = userRole.permisosIds
              .map((id) => {
                const permission = permisos.find((p) => p.idPermiso === id);
                return permission ? permission.permiso : '';
              })
              .filter(Boolean);

            set({
              isLoggedIn: true,
              user: {
                id: potentialUser.idUsuario,
                nombreCompleto: `${potentialUser.nombre} ${potentialUser.apellidoPaterno}`,
                iniciales: potentialUser.iniciales,
                email: potentialUser.correoElectronico,
                rol: userRole.nombre,
                permisos: userPermissions,
                bearerToken: 'token_simulado_jwt_para_desarrollo',
              },
              loading: false,
            });
            return true;
          } else {
            throw new Error(authMessages.loginError);
          }
        } catch (error) {
          set({ loading: false });
          // Si es un error de Axios, relanzamos el mensaje del error, si no, el error genérico
          if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Error de red');
          }
          throw error;
        }
      },
      logout: () => {
        set({ isLoggedIn: false, user: null, loading: false });
      },
      hasPermission: (requiredPermission) => {
        const { user } = get();
        return user?.permisos.includes(requiredPermission) ?? false;
      },
    }),
    { name: 'auth-storage' }
  )
);
