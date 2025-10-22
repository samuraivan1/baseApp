import { getSession, refresh } from '@/shared/api/authService';
import { getAuthStore, useAuthStore } from '@/features/shell/state/authStore';
import { derivePermissions } from '@/shared/auth/derivePermissions';
import { mapUserFromDto, type UserResponseDTO } from '@/features/security/types/dto';

async function getDb() {
  const mod = await import('@/mocks/data/db');
  return mod.db;
}

export async function bootstrapAuth(): Promise<void> {
  const store = getAuthStore();
  useAuthStore.setState({ authReady: false });
  try {
    const refreshRes = await refresh().catch(() => null);
    const accessToken = refreshRes?.access_token ?? null;
    if (!accessToken) {
      // No hay sesión; app lista sin usuario
      useAuthStore.setState({ isLoggedIn: false, user: null, authReady: true });
      return;
    }
    store.setToken(accessToken, null);

    const session = await getSession().catch(() => null);
    if (session?.user) {
      const db = await getDb();
      const userDto = session.user as unknown as UserResponseDTO;
      const domainUser = mapUserFromDto(userDto);
      const perms = derivePermissions(domainUser.userId, db);
      const user = {
        ...domainUser,
        permissions: perms,
        roles: [],
        fullName: `${domainUser.firstName ?? ''} ${domainUser.lastNameP ?? ''}`.trim(),
      } as unknown as typeof store extends { user: infer U } ? U : never;
      store.setUser(user);
      useAuthStore.setState({ isLoggedIn: true, authReady: true });
      // eslint-disable-next-line no-console
      console.log('[Auth] bootstrap ready', { user_id: (domainUser.userId), perms: perms.map((p) => p.permissionKey) });
      return;
    }
    useAuthStore.setState({ isLoggedIn: false, user: null, authReady: true });
  } catch {
    useAuthStore.setState({ isLoggedIn: false, user: null, authReady: true });
  }
}

export async function finalizeLogin(): Promise<void> {
  const store = getAuthStore();
  useAuthStore.setState({ authReady: false });
  try {
    const session = await getSession();
    const db = await getDb();
    const userId = (session.user as unknown as { user_id?: number; userId?: number }).user_id ?? (session.user as unknown as { user_id?: number; userId?: number }).userId!; // aligned to DTO/domain
    const perms = derivePermissions(userId, db);
    const user = { ...session.user, permissions: perms };
    store.setUser(user);
    useAuthStore.setState({ isLoggedIn: true, authReady: true });
    // eslint-disable-next-line no-console
    console.log('[Auth] finalizeLogin ready', { user_id: (user as unknown as { userId?: number; user_id?: number }).userId ?? (user as unknown as { userId?: number; user_id?: number }).user_id, perms: perms.map((p) => p.permissionKey) });
  } catch {
    useAuthStore.setState({ isLoggedIn: false, user: null });
    throw new Error('No se pudo completar la sesión post-login');
  }
}
