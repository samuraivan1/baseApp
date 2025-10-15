import apiClient from '@/shared/api/apiClient';
import { getAuthStore } from '@/features/shell';
import { getSession } from '@/shared/api/authService';
import type { User, Permission, UserSession } from '@/features/security/types';
import type { Role } from '@/features/security/types/models';

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
  try {
    console.log('[Auth] derived roles (ids):', userRoleLinks.map(r => Number(r.role_id)));
  } catch (_err) {
    // Ignorar errores de consola en entornos que no expongan console
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
    permission_id: Number(p.permission_id),
    permission_string: String(p.permission_string),
    resource: '',
    action: '',
    scope: '',
    description: '',
    created_at: undefined,
    updated_at: undefined,
  } satisfies Permission));
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

    const res = await apiClient.post('/auth/refresh', null);
    const accessToken = (res.data as { access_token: string })?.access_token;

    if (!accessToken) {
      throw new Error('No access_token in refresh response');
    }

    getAuthStore().setToken(accessToken, null);
    getAuthStore().setLoggedIn(true);

    const session = await getSession().catch(() => null);
    if (session?.user) {
      const user = session.user as unknown as User;
      // Debug: imprimir permisos derivados por usuario para soporte
      try {
        const username = 'username' in (user as object) ? (user as { username?: string }).username : undefined;
        console.log('[Auth] session user:', { id: user.user_id, username });
  } catch (_err) {
        // Ignorar errores de log en navegadores sin consola
      }
      const derivedPermissions = (await getMockDerivedPermissions(
        user.user_id
      ).catch(() => undefined)) || [];
      try {
        console.log('[Auth] derived permissions:', derivedPermissions.map(p => p.permission_string));
  } catch (_err) {
        // Ignorar errores de log en navegadores sin consola
      }
      // Construir un UserSession mínimo para cumplir la firma del store
      const sessionUser: UserSession = {
        ...(user as unknown as UserSession),
        permissions: derivedPermissions,
        roles: ((session as { roles?: Role[] } | null)?.roles ?? []) as Role[],
        full_name: (user.first_name ?? '') + ' ' + (user.last_name_p ?? ''),
      };
      getAuthStore().setUser(sessionUser);
      try {
        console.log('[Auth] set user permissions in store:', sessionUser.permissions?.map(p => p.permission_string));
  } catch (_err) {
        // Ignorar errores de log en navegadores sin consola
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
