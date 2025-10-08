import React from 'react';
import { useAuthStore } from '@/features/shell/state/authStore';

const btnStyle: React.CSSProperties = {
  position: 'fixed',
  right: 12,
  bottom: 12,
  zIndex: 9999,
  padding: '6px 10px',
  background: '#222',
  color: '#fff',
  borderRadius: 6,
  fontSize: 12,
  opacity: 0.6,
  cursor: 'pointer',
};

export default function DevAuthInspector() {
  if (!(import.meta as any).env?.DEV) return null;
  const user = useAuthStore((s) => s.user);

  const onClick = async () => {
    try {
      const { db } = await import('@/mocks/data/db');
      const { PERMISSIONS } = await import('@/features/security/constants/permissions');
      const uid = Number(user?.user_id);
      const roles = (db.user_roles as any[])
        .filter((ur) => Number(ur.user_id) === uid)
        .map((ur) => Number(ur.role_id));
      const roleRows = (db.roles as any[]).filter((r) => roles.includes(Number(r.role_id)));
      const rp = (db.role_permissions as any[]).filter((r) => roles.includes(Number(r.role_id)));
      const permIds = new Set(rp.map((r) => Number(r.permission_id)));
      const perms = (db.permissions as any[])
        .filter((p) => permIds.has(Number(p.permission_id)))
        .map((p) => String(p.permission_string));

      // Chequeos útiles
      const checks = {
        pages: {
          security_users: perms.includes(PERMISSIONS.SECURITY_USERS_VIEW),
          security_roles: perms.includes(PERMISSIONS.SECURITY_ROLES_VIEW),
          security_permissions: perms.includes(PERMISSIONS.SECURITY_PERMISSIONS_VIEW),
        },
        users: {
          create: perms.includes(PERMISSIONS.SECURITY_USERS_CREATE),
          update: perms.includes(PERMISSIONS.SECURITY_USERS_UPDATE),
          delete: perms.includes(PERMISSIONS.SECURITY_USERS_DELETE),
        },
        roles: {
          create: perms.includes(PERMISSIONS.SECURITY_ROLES_CREATE),
          update: perms.includes(PERMISSIONS.SECURITY_ROLES_UPDATE),
          delete: perms.includes('roles:delete'),
        },
        permissions: {
          create: perms.includes('permissions:create'),
          update: perms.includes('permissions:update'),
          delete: perms.includes('permissions:delete'),
        },
      } as const;

      // Log compacto
      // eslint-disable-next-line no-console
      console.group('[DevAuthInspector]');
      // eslint-disable-next-line no-console
      console.log('user', { id: uid, username: user?.username });
      // eslint-disable-next-line no-console
      console.log('roles', roleRows);
      // eslint-disable-next-line no-console
      console.log('perms', perms);
      // eslint-disable-next-line no-console
      console.log('checks', checks);
      // eslint-disable-next-line no-console
      console.groupEnd();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[DevAuthInspector] error', e);
    }
  };

  return (
    <button type="button" style={btnStyle} onClick={onClick} title="Auth Info">
      Auth Info
    </button>
  );
}

