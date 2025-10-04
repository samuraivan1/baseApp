import React from 'react';
import { usePermissionsQuery } from '@/features/security/api/queries';

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
  const { data: permissions = [], isLoading } = usePermissionsQuery();
  type Perm = { key?: string; name?: string; permission_key?: string };
  const allowed = Array.isArray(permissions) && (permissions as Perm[]).some((p) => p.key === perm || p.name === perm || p.permission_key === perm);
  if (isLoading) return null;
  return <>{allowed ? children : fallback}</>;
}
