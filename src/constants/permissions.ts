// src/constants/permissions.ts
/**
 * Centraliza y tipa los permisos (nivel página y nivel acción).
 * Convención: recurso:ámbito:acción
 */

// Nivel 1: acceso a páginas (IDs en BD desde 10000)
export const PagePermissions = {
  ADMIN_USERS_VIEW: 'page:administracion_usuarios:view',
  ADMIN_ROLES_VIEW: 'page:administracion_roles:view',
  ADMIN_PERMISSIONS_VIEW: 'page:administracion_permisos:view',
  KANBAN_VIEW: 'page:kanban:view',
} as const;

// Nivel 2: acciones específicas (granulares)
export const ActionPermissions = {
  USER_CREATE: 'user:system:create',
  USER_UPDATE: 'user:system:update',
  USER_DELETE: 'user:system:delete',

  ROLE_CREATE: 'role:system:create',
  ROLE_UPDATE: 'role:system:update',
  ROLE_DELETE: 'role:system:delete',

  PERMISSION_ASSIGN: 'permission:system:assign',
} as const;

export type PermissionValue =
  | (typeof PagePermissions)[keyof typeof PagePermissions]
  | (typeof ActionPermissions)[keyof typeof ActionPermissions];

// Helpers utilitarios
export function hasAny(userPerms: string[] | undefined, perms: PermissionValue[]) {
  if (!userPerms?.length) return false;
  return perms.some((p) => userPerms.includes(p));
}

export function hasAll(userPerms: string[] | undefined, perms: PermissionValue[]) {
  if (!userPerms?.length) return false;
  return perms.every((p) => userPerms.includes(p));
}
