import React from 'react';
import { usePermission } from '@/features/security/hooks/usePermission';

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
  const allowed = usePermission(perm);
  return <>{allowed ? children : fallback}</>;
}

