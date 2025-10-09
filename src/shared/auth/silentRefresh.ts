import apiClient from '@/shared/api/apiClient';
import { getAuthStore } from '@/features/shell/state/authStore';
import { getSession } from '@/shared/api/authService';
import type { User, Permission } from '@/shared/types/security';

/**
 * Deriva los permisos de un usuario a partir de la base de datos mock.
 * Esta función solo se usa en desarrollo y simula la lógica del backend.
 * @param userId - El ID del usuario.
 * @returns Un array de permisos o undefined si falla.
 */
async function getMockDerivedPermissions(
  userId: number
): Promise<Pick<Permission, 'permission_string'>[] | undefined> {
  if (Number.isNaN(userId)) return undefined;

  const { db } = await import('@/mocks/data/db');
  const userRoleLinks = (db.user_roles as any[]).filter(
    (r) => Number(r.user_id) === userId
  );
  const roleIds = userRoleLinks.map((r) => Number(r.role_id));
  const rolePermissions = (db.role_permissions as any[]).filter((r) =>
    roleIds.includes(Number(r.role_id))
  );
  const permissionIds = new Set(
    rolePermissions.map((r) => Number(r.permission_id))
  );
  const permissions = (db.permissions as any[]).filter((p) =>
    permissionIds.has(Number(p.permission_id))
  );

  return permissions.map((p) => ({
    permission_string: String(p.permission_string),
  }));
}

/**
 * Intenta refrescar sesión usando la cookie HttpOnly.
 * - Si tiene éxito: setea accessToken y marca logged in.
 * - Si falla: limpia sesión (logout).
 */
export async function silentRefresh(): Promise<boolean> {
  try {
    if (localStorage.getItem('auth:revoked') === '1') {
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
      const derivedPermissions = await getMockDerivedPermissions(
        user.user_id
      ).catch(() => undefined);
      getAuthStore().setUser({ ...user, permissions: derivedPermissions });
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
