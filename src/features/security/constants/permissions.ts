/**
 * @file Contiene la lista centralizada de permisos del sistema.
 * @description Este archivo es la única fuente de verdad para todos los permisos.
 * Sigue el estándar: `dominio.recurso.accion`
 *
 * - dominio: El área funcional (ej: 'security', 'kanban').
 * - recurso: La entidad sobre la que se actúa (ej: 'users', 'roles', 'tasks').
 * - accion: Verbo estandarizado ('view', 'create', 'update', 'delete', o acciones personalizadas).
 */
export const PERMISSIONS = {
  // --- Home ---
  HOME_DASHBOARD_VIEW: 'home.dashboard.view',

  // --- Kanban ---
  KANBAN_BOARD_VIEW: 'kanban.board.view',
  KANBAN_TASKS_CREATE: 'kanban.tasks.create',
  KANBAN_TASKS_UPDATE: 'kanban.tasks.update',
  KANBAN_TASKS_DELETE: 'kanban.tasks.delete',
  KANBAN_TASKS_MOVE: 'kanban.tasks.move',
  KANBAN_TASKS_ASSIGN: 'kanban.tasks.assign',

  // --- Security ---
  SECURITY_OVERVIEW_VIEW: 'security.overview.view',

  // Security > Users
  SECURITY_USERS_VIEW: 'security.users.view',
  SECURITY_USERS_CREATE: 'security.users.create',
  SECURITY_USERS_UPDATE: 'security.users.update',
  SECURITY_USERS_DELETE: 'security.users.delete',

  // Security > Roles
  SECURITY_ROLES_VIEW: 'security.roles.view',
  SECURITY_ROLES_CREATE: 'security.roles.create',
  SECURITY_ROLES_UPDATE: 'security.roles.update',
  SECURITY_ROLES_DELETE: 'security.roles.delete',

  // Security > Permissions
  SECURITY_PERMISSIONS_VIEW: 'security.permissions.view',
  SECURITY_PERMISSIONS_CREATE: 'security.permissions.create',
  SECURITY_PERMISSIONS_UPDATE: 'security.permissions.update',
  SECURITY_PERMISSIONS_DELETE: 'security.permissions.delete',

  // --- Contact (reservado/futuro) ---
  // CONTACT_FORM_SUBMIT: 'contact.form.submit',
} as const;

// Helper type para obtener los valores de los permisos
export type PermissionString = typeof PERMISSIONS[keyof typeof PERMISSIONS];
