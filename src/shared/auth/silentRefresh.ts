import axios from 'axios';
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
      getAuthStore().setUser(session.user);
    } catch {
      // Si no hay endpoint de sesión, seguimos con token solo
    }
    return true;
  } catch {
    // Fallback: si hay un usuario persistido, asumimos logged-in y dejaremos que el
    // primer 401 dispare el refresh interceptor.
    const hasUser = Boolean(getAuthStore().getUser());
    if (hasUser) {
      getAuthStore().setLoggedIn(true);
      return true;
    }
    getAuthStore().logout();
    return false;
  }
  finally {
    // Señalizamos que auth está listo (éxito o fallo) para desbloquear el UI
    getAuthStore().setAuthReady(true);
  }
}
