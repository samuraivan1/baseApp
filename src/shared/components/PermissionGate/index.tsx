import React from 'react';
import { useAuthStore } from '@/features/shell/state/authStore';

interface PermissionGateBaseProps {
  hasPermission: (perm: string) => boolean;
  perm: string | string[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

interface PermissionGateProps {
  perm: string | string[];
  mode?: 'any' | 'all';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGateBase: React.FC<PermissionGateBaseProps> = ({ hasPermission, perm, mode = 'all', fallback = null, children }) => {
  const allowed = Array.isArray(perm)
    ? mode === 'any'
      ? perm.some((p) => hasPermission(p))
      : perm.every((p) => hasPermission(p))
    : hasPermission(perm);

  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};

const PermissionGate: React.FC<PermissionGateProps> = ({ perm, mode = 'all', fallback = null, children }) => {
  const { hasPermission } = useAuthStore((s) => ({ hasPermission: s.hasPermission }));
  return (
    <PermissionGateBase hasPermission={hasPermission} perm={perm} mode={mode} fallback={fallback}>
      {children}
    </PermissionGateBase>
  );
};

export default PermissionGate;
