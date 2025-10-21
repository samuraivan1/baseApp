import { useAuthStore } from '@/features/shell/state/authStore';
import PageHeader from '@/shared/components/common/PageHeader';
import { PERMISSIONS } from '@/features/security/constants/permissions';

export default function ProfileDev() {
  const { user, hasPermission } = useAuthStore((s) => ({ user: s.user, hasPermission: s.hasPermission }));
  const perms = user?.permissions ?? [];
  console.log('[Dev/Profile] User:', user?.userId, (user && 'username' in user ? (user as { username?: string }).username : undefined));
  console.log('[Dev/Profile] Permissions:', perms.map(p => p.permissionKey));
  const checks = [
    PERMISSIONS.HOME_DASHBOARD_VIEW,
    PERMISSIONS.KANBAN_BOARD_VIEW,
    PERMISSIONS.SECURITY_OVERVIEW_VIEW,
    PERMISSIONS.SECURITY_USERS_VIEW,
    PERMISSIONS.SECURITY_ROLES_VIEW,
    PERMISSIONS.SECURITY_PERMISSIONS_VIEW,
  ];
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Perfil (DEV)" />
      <pre style={{ background: '#111', color: '#ddd', padding: 16, borderRadius: 8 }}>
        {JSON.stringify({ user }, null, 2)}
      </pre>
      <h3>Permisos efectivos ({perms.length})</h3>
      <ul>
        {perms.map((p, i: number) => (
          <li key={i}>{String(p.permissionKey)}</li>
        ))}
      </ul>
      <h3>Checks</h3>
      <ul>
        {checks.map((c) => (
          <li key={c}>{c}: {hasPermission(c) ? 'OK' : 'NO'}</li>
        ))}
      </ul>
    </div>
  );
}
