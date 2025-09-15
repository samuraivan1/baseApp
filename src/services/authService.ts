import apiClient from './apiClient';
import { UserSession } from '@/store/store.types';
import { PermisoType, UsuarioType, RolType } from './api.types';

// La respuesta que construiremos después de hablar con json-server
interface LoginResponse {
  user: UserSession;
  accessToken: string;
  refreshToken: string;
}

/**
 * Realiza la autenticación contra json-server.
 * NOTA: Esto simula lo que un backend real haría en un solo endpoint /login.
 * Aquí lo hacemos en el frontend por la naturaleza de json-server.
 */
export const loginConJsonServer = async (
  emailOrUsername: string,
  password: string
): Promise<LoginResponse> => {
  // 1. Buscamos al usuario en la "base de datos" (db.json)
  const { data: usuarios } = await apiClient.get<UsuarioType[]>('/usuarios');

  const usuarioEncontrado = usuarios.find(
    (u) =>
      u.nombreUsuario === emailOrUsername ||
      u.correoElectronico === emailOrUsername
  );

  // 2. Si el usuario no existe o la contraseña no coincide, lanzamos un error.
  if (!usuarioEncontrado || usuarioEncontrado.hashContrasena !== password) {
    throw new Error('Credenciales incorrectas.');
  }

  // 3. Si el usuario es válido, buscamos su rol para obtener los permisos.
  //  const { data: roles } = await apiClient.get<RolType[]>('/roles');

  const [{ data: roles }, { data: permisos }] = await Promise.all([
    apiClient.get<RolType[]>('/roles'),
    apiClient.get<PermisoType[]>('/permisos'),
  ]);
  const rolDelUsuario = roles.find((r) => r.idRol === usuarioEncontrado.rolId);
  const permisosIdsDelRol = rolDelUsuario?.permisosIds || [];
  // ✅ --- INICIO DE LA SOLUCIÓN --- ✅
  // 3. Mapeamos los IDs de los permisos del rol a los objetos de permiso completos.
  // Luego, extraemos la cadena de texto 'permiso' de cada objeto.
  const permisosStringDelRol = permisos
    .filter((p) => permisosIdsDelRol.includes(p.idPermiso))
    .map((p) => p.permiso); // Extraemos la cadena de texto, ej: "page:kanban:view"
  // ✅ --- FIN DE LA SOLUCIÓN --- ✅

  // 4. Construimos el objeto de sesión del usuario con datos reales.
  const sessionUser: UserSession = {
    id: usuarioEncontrado.idUsuario,
    nombreCompleto: `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellidoPaterno}`,
    iniciales: usuarioEncontrado.iniciales,
    email: usuarioEncontrado.correoElectronico,
    rol: rolDelUsuario?.nombre || 'Sin Rol',
    // Usamos los permisosIds que vienen del rol
    permisos: permisosStringDelRol, // ✅ ¡Ahora contiene los strings correctos!
    permisosIds: permisosIdsDelRol,
  };

  // 5. Devolvemos la sesión completa, simulando tokens.
  return {
    user: sessionUser,
    accessToken: `real-jwt-token-for-user-${usuarioEncontrado.idUsuario}`,
    refreshToken: `real-refresh-token-for-user-${usuarioEncontrado.idUsuario}`,
  };
};

// Mantenemos esta función por compatibilidad. Ahora llama a la nueva lógica.
export const login = async (
  emailOrUsername: string,
  password: string
): Promise<LoginResponse> => {
  return loginConJsonServer(emailOrUsername, password);
};
