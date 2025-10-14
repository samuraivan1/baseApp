import apiClient from '@/shared/api/apiClient';
import { getSession } from '@/shared/api/authService';
import { getAuthStore, useAuthStore } from '@/features/shell/state/authStore';
import { derivePermissions } from '@/shared/auth/derivePermissions';

async function getDb() {
  const mod = await import('@/mocks/data/db');
  return mod.db;
}

export async function bootstrapAuth(): Promise<void> {
  const store = getAuthStore();
  useAuthStore.setState({ phase: 'loading' });
  try {
    const res = await apiClient.post('/auth/refresh', null).catch(() => null);
    const accessToken = (res?.data as { access_token: string } | null)?.access_token ?? null;
    if (!accessToken) {
      // No hay sesión; app lista sin usuario
      useAuthStore.setState({ isLoggedIn: false, user: null, phase: 'ready', authReady: true });
      return;
    }
    store.setToken(accessToken, null);

    const session = await getSession().catch(() => null);
    if (session?.user) {
      const db = await getDb();
      const userId = session.user.user_id;
      const perms = derivePermissions(userId, db);
      const user = { ...session.user, permissions: perms };
      store.setUser(user);
      useAuthStore.setState({ isLoggedIn: true, phase: 'ready', authReady: true });
      try {
        console.log('[Auth] bootstrap ready', { user_id: user.user_id, perms: perms.map((p) => p.permission_string) });
      } catch {}
      return;
    }
    useAuthStore.setState({ isLoggedIn: false, user: null, phase: 'ready', authReady: true });
  } catch {
    useAuthStore.setState({ isLoggedIn: false, user: null, phase: 'ready', authReady: true });
  }
}

export async function finalizeLogin(): Promise<void> {
  const store = getAuthStore();
  useAuthStore.setState({ phase: 'loading' });
  try {
    const session = await getSession();
    const db = await getDb();
    const userId = session.user.user_id;
    const perms = derivePermissions(userId, db);
    const user = { ...session.user, permissions: perms };
    store.setUser(user);
    useAuthStore.setState({ isLoggedIn: true, phase: 'ready', authReady: true });
    try {
      console.log('[Auth] finalizeLogin ready', { user_id: user.user_id, perms: perms.map((p) => p.permission_string) });
    } catch {}
  } catch {
    useAuthStore.setState({ isLoggedIn: false, user: null, phase: 'error' });
    throw new Error('No se pudo completar la sesión post-login');
  }
}
