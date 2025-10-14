import React from 'react';
import { useAuthStore } from '@/features/shell/state/authStore';

interface PermissionGateProps {
  perm: string | string[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ perm, mode = 'all', fallback = null, children }) => {
  const { hasPermission } = useAuthStore((s) => ({ hasPermission: s.hasPermission }));

  const allowed = Array.isArray(perm)
    ? mode === 'any'
      ? perm.some((p) => hasPermission(p))
      : perm.every((p) => hasPermission(p))
    : hasPermission(perm);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};

export default PermissionGate;
