// Domain permissions (page-level and action-level)
export const PagePermissions = {
  SEGU_USERS_VIEW: 'page:seguridad_usuarios:view',
  SEGU_ROLES_VIEW: 'page:seguridad_roles:view',
  SEGU_PERMISSIONS_VIEW: 'page:seguridad_permisos:view',
  KANBAN_VIEW: 'page:kanban:view',
} as const;

export const ActionPermissions = {
  // Usuarios (Nivel 2 - entidad)
  USER_CREATE: 'user:system:create',
  USER_EDIT: 'user:system:edit',
  USER_DELETE: 'user:system:delete',

  // Roles
  ROLE_CREATE: 'role:system:create',
  ROLE_EDIT: 'role:system:edit',
  ROLE_DELETE: 'role:system:delete',

  // Permisos
  PERMISSION_CREATE: 'permission:system:create',
  PERMISSION_EDIT: 'permission:system:edit',
  PERMISSION_DELETE: 'permission:system:delete',
} as const;

export type PermissionValue =
  | (typeof PagePermissions)[keyof typeof PagePermissions]
  | (typeof ActionPermissions)[keyof typeof ActionPermissions];

export function hasAny(userPerms: string[] | undefined, perms: PermissionValue[]) {
  if (!userPerms?.length) return false;
  return perms.some((p) => userPerms.includes(p));
}

export function hasAll(userPerms: string[] | undefined, perms: PermissionValue[]) {
  if (!userPerms?.length) return false;
  return perms.every((p) => userPerms.includes(p));
}
