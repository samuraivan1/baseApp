// src/constants/routePermissions.ts
export const RoutePermissions = {
  HOME_VIEW: 'page:home:view',
  KANBAN_VIEW: 'page:kanban:view',
  PROJECT_VIEW: 'page:project:view',
  DASHPROJECT_VIEW: 'page:dashproject:view',
  CONTACTO_VIEW: 'page:contacto:view',
  SEGU_VIEW: 'page:seguridad:view',
  SEGU_USERS_VIEW: 'page:seguridad_usuarios:view',
  SEGU_ROLES_VIEW: 'page:seguridad_roles:view',
  SEGU_PERMISSIONS_VIEW: 'page:seguridad_permisos:view',
} as const;

export type RoutePermissionValue =
  (typeof RoutePermissions)[keyof typeof RoutePermissions];
