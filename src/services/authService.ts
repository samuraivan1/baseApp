// src/services/authService.ts
import apiClient from './apiClient';
import { UserSession } from '@/store/store.types';

type UsuarioDTO = {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  iniciales: string;
  correoElectronico: string;
  nombreUsuario: string;
  rolId: number;
};

type RolDTO = {
  idRol: number;
  nombre: string;
  descripcion?: string;
  permisosIds: number[];
};

type PermisoDTO = {
  idPermiso: number;
  permiso: string; // e.g. "page:administracion_roles:view"
};

export interface LoginCredentials {
  username: string;
  password: string; // json-server: no validación real
}

export interface LoginResult {
  user: UserSession;
  accessToken: string;
  refreshToken: string;
}

/**
 * Simula login contra json-server. Construye la sesión con datos de usuario + rol + permisos.
 * En backend real, esto sería un POST /auth/login que ya devuelve todo armado.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  // 1) Encontrar usuario por nombreUsuario
  const { data: usuarios } = await apiClient.get<UsuarioDTO[]>(
    `/usuarios`,
    { params: { nombreUsuario: credentials.username } }
  );
  const usuario = usuarios?.[0];
  if (!usuario) {
    throw new Error('Usuario o contraseña inválidos');
  }
  // Nota: con json-server no validamos password.

  // 2) Cargar rol y permisos
  const [{ data: roles }, { data: permisos }] = await Promise.all([
    apiClient.get<RolDTO[]>(`/roles`),
    apiClient.get<PermisoDTO[]>(`/permisos`),
  ]);

  const rol = roles.find((r) => r.idRol === usuario.rolId);
  const permisosIds = rol?.permisosIds ?? [];
  const permisosStrings = permisos
    .filter((p) => permisosIds.includes(p.idPermiso))
    .map((p) => p.permiso);

  // 3) Construir UserSession
  const user: UserSession = {
    id: usuario.idUsuario,
    nombreCompleto: `${usuario.nombre} ${usuario.apellidoPaterno}${usuario.apellidoMaterno ? ' ' + usuario.apellidoMaterno : ''}`,
    iniciales: usuario.iniciales,
    email: usuario.correoElectronico,
    rol: rol?.nombre ?? 'N/A',
    permisos: permisosStrings,
    permisosIds,
  };

  // 4) Generar tokens simulados
  const accessToken = `mock-access-${usuario.idUsuario}-${Date.now()}`;
  const refreshToken = `mock-refresh-${usuario.idUsuario}-${Date.now()}`;

  return { user, accessToken, refreshToken };
}
