import React from 'react';
import { useAuthStore } from '@/features/shell/state/authStore';

export type PermissionGateProps = {
  perm: string; // código o string de permiso
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Wrapper de autorización simple para ocultar/mostrar contenido según permisos.
 * Mantiene la UI actual: no altera estilos ni props de hijos.
 */
export default function PermissionGate({ perm, fallback = null, children }: PermissionGateProps) {
  const { hasPermission, authReady } = useAuthStore((s) => ({ hasPermission: s.hasPermission, authReady: s.authReady }));
  if (!authReady) return null;
  const allowed = hasPermission(perm);
  return <>{allowed ? children : fallback}</>;
}
