import React from 'react';
import { useAuthStore } from '@/features/shell/state/authStore';
import PageHeader from '@/shared/components/common/PageHeader';

export default function ProfileDev() {
  const { user, hasPermission } = useAuthStore((s) => ({ user: s.user, hasPermission: s.hasPermission }));
  const perms = user?.permissions ?? [];
  const checks = [
    'page:home:view',
    'page:kanban:view',
    'page:seguridad:view',
    'page:seguridad_usuarios:view',
    'page:seguridad_roles:view',
    'page:seguridad_permisos:view',
  ];
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Perfil (DEV)" />
      <pre style={{ background: '#111', color: '#ddd', padding: 16, borderRadius: 8 }}>
        {JSON.stringify({ user }, null, 2)}
      </pre>
      <h3>Permisos efectivos ({perms.length})</h3>
      <ul>
        {perms.map((p: any, i: number) => (
          <li key={i}>{String(p.permission_string)}</li>
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

