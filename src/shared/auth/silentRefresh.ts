import apiClient from '@/shared/api/apiClient';
import { getAuthStore } from '@/features/shell/state/authStore';
import { getSession } from '@/shared/api/authService';

/**
 * Intenta refrescar sesión usando la cookie HttpOnly.
 * - Si tiene éxito: setea accessToken y marca logged in.
 * - Si falla: limpia sesión (logout).
 */
export async function silentRefresh(): Promise<boolean> {
  try {
    // Si se solicitó logout explícito, no intentes refrescar
    try {
      if (localStorage.getItem('auth:revoked') === '1') {
        getAuthStore().setLoggedIn(false);
        return false;
      }
    } catch {}
    // Usar el apiClient para mantener baseURL y withCredentials consistentes
    const res = await apiClient.post('/auth/refresh', null);
    const access = (res.data as any)?.access_token as string | undefined;
    if (!access) throw new Error('no access_token');
    // Marca sesión activa inmediatamente para evitar redirecciones tempranas
    getAuthStore().setToken(access, null);
    getAuthStore().setLoggedIn(true);
    try {
      const session = await getSession();
      // Derivar permisos como en login (desde mock DB)
      try {
        const { db } = await import('@/mocks/data/db');
        const userId = Number((session as any).user?.user_id);
        let derivedPermissions: Array<{ permission_string: string }> | undefined = undefined;
        if (!Number.isNaN(userId)) {
          const links = (db.user_roles as any[]).filter(r => Number(r.user_id) === userId);
          const roleIds = links.map(r => Number(r.role_id));
          const rp = (db.role_permissions as any[]).filter(r => roleIds.includes(Number(r.role_id)));
          const permIds = new Set(rp.map(r => Number(r.permission_id)));
          const perms = (db.permissions as any[]).filter(p => permIds.has(Number(p.permission_id)));
          derivedPermissions = perms.map(p => ({ permission_string: String(p.permission_string) }));
        }
        getAuthStore().setUser({ ...(session as any).user, permissions: derivedPermissions });
      } catch {
        getAuthStore().setUser((session as any).user);
      }
    } catch {
      // Si no hay endpoint de sesión, seguimos con token solo
    }
    return true;
  } catch {
    // No asumir sesión por tener user persistido: respetar logout explícito
    getAuthStore().logout();
    return false;
  }
  finally {
    // Señalizamos que auth está listo (éxito o fallo) para desbloquear el UI
    getAuthStore().setAuthReady(true);
  }
}
