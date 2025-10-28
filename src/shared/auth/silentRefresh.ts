// apiClient no requerido aquí tras unificar refresh vía authService
import { getAuthStore } from '@/features/shell';
import { getSession, refresh } from '@/shared/api/authService';
import type { IPermission as Permission, IUserSession as UserSession, IRole as Role } from '@/features/security/types/models'; // Import IUserSession and IRole
import type { UserResponseDTO } from '@/features/security/types/dto';
import { mapUserFromDto } from '@/features/security/types/dto';

/**
 * Deriva los permisos de un usuario a partir de la base de datos mock.
 * Esta función solo se usa en desarrollo y simula la lógica del backend.
 * @param userId - El ID del usuario.
 * @returns Un array de permisos o undefined si falla.
 */
async function getMockDerivedPermissions(
  userId: number
): Promise<Permission[] | undefined> {
  if (Number.isNaN(userId)) return undefined;

  const { db } = await import('@/mocks/data/db');
  const userRoleLinks = (db.user_roles as Array<{ user_id: number; role_id: number }>).filter(
    (r) => Number(r.user_id) === userId
  );
  if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH === '1') {
    try {
      console.log('[Auth] derived roles (ids):', userRoleLinks.map(r => Number(r.role_id)));
    } catch { /* noop */ }
  }
  const roleIds = userRoleLinks.map((r) => Number(r.role_id));
  const rolePermissions = (db.role_permissions as Array<{ role_id: number; permission_id: number }>).filter((r) =>
    roleIds.includes(Number(r.role_id))
  );
  const permissionIds = new Set(
    rolePermissions.map((r) => Number(r.permission_id))
  );
  const permissions = (db.permissions as Array<{ permission_id: number; permission_string: string }>).filter((p) =>
    permissionIds.has(Number(p.permission_id))
  );

  return permissions.map((p) => ({
    permissionId: Number(p.permission_id),
    permissionKey: String(p.permission_string),
    resource: null,
    action: null,
    scope: null,
    description: null,
  } as Permission));
}

/**
 * Intenta refrescar sesión usando la cookie HttpOnly.
 * - Si tiene éxito: setea accessToken y marca logged in.
 * - Si falla: limpia sesión (logout).
 */
export async function silentRefresh(): Promise<boolean> {
  try {
    // Usar la constante definida para consistencia y seguridad
    const { SESSION_STORAGE_KEYS } = await import(
      '@/constants/sessionConstants'
    );
    if (localStorage.getItem(SESSION_STORAGE_KEYS.AUTH_REVOKED) === '1') {
      getAuthStore().setLoggedIn(false);
      return false;
    }

    const { access_token: accessToken } = await refresh();

    if (!accessToken) {
      throw new Error('No access_token in refresh response');
    }

    getAuthStore().setToken(accessToken, null);
    getAuthStore().setLoggedIn(true);

    const session = await getSession().catch(() => null);
    if (session?.user) {
      const userDto = session.user as unknown as UserResponseDTO;
      const user = mapUserFromDto(userDto);
      // Debug: imprimir permisos derivados por usuario para soporte
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH === '1') {
        try {
          const username = 'username' in (user as object) ? (user as { username?: string }).username : undefined;
          console.log('[Auth] session user:', { id: user.userId, username });
        } catch { /* noop */ }
      }
      const derivedPermissions = (await getMockDerivedPermissions(
        user.userId
      ).catch(() => undefined)) || [];
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH === '1') {
        try {
          console.log('[Auth] derived permissions:', derivedPermissions.map((p: Permission) => p.permissionKey));
        } catch { /* noop */ }
      }
      // Construir un UserSession mínimo para cumplir la firma del store
      const sessionUser: UserSession = {
        ...(user as unknown as UserSession),
        permissions: derivedPermissions,
        roles: ((session as { roles?: Role[] } | null)?.roles ?? []) as Role[],
        fullName: (user.firstName ?? '') + ' ' + (user.lastNameP ?? ''),
      };
      getAuthStore().setUser(sessionUser);
      if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH === '1') {
        try {
          console.log('[Auth] set user permissions in store:', sessionUser.permissions?.map((p: Permission) => p.permissionKey));
        } catch { /* noop */ }
      }
    }

    return true;
  } catch {
    getAuthStore().logout();
    return false;
  } finally {
    // Señalizamos que auth está listo (éxito o fallo) para desbloquear el UI
    getAuthStore().setAuthReady(true);
  }
}