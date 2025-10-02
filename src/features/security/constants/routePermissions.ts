export const RoutePermissions = {
  HOME_VIEW: 'page:home:view',
  KANBAN_VIEW: 'page:kanban:view',
  SEGU_VIEW: 'page:seguridad:view',
  SEGU_USERS_VIEW: 'page:seguridad_usuarios:view',
  SEGU_USERS_CREATE: 'page:seguridad_usuarios:create',
  SEGU_USERS_EDIT: 'page:seguridad_usuarios:edit',
  SEGU_USERS_DELETE: 'page:seguridad_usuarios:delete',
  SEGU_ROLES_VIEW: 'page:seguridad_roles:view',
  SEGU_ROLES_CREATE: 'page:seguridad_roles:create',
  SEGU_ROLES_EDIT: 'page:seguridad_roles:edit',
  SEGU_ROLES_DELETE: 'page:seguridad_roles:delete',
  SEGU_PERMISSIONS_VIEW: 'page:seguridad_permisos:view',
  SEGU_PERMISSIONS_CREATE: 'page:seguridad_permisos:create',
  SEGU_PERMISSIONS_EDIT: 'page:seguridad_permisos:edit',
  SEGU_PERMISSIONS_DELETE: 'page:seguridad_permisos:delete',
} as const;

export type RoutePermissionValue =
  (typeof RoutePermissions)[keyof typeof RoutePermissions];
