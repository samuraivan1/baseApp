// Public barrel for Security feature
export { default as Seguridad } from './components';
export { default as UsuariosPage } from './components/Users';
export { default as RolesPage } from './components/Roles';
export { default as PermissionsPage } from './components/Permissions';
export { RoutePermissions } from './constants/routePermissions';
// Public API surface
// Legacy queries removed
export * from './api/queryKeys';
export * from './api/userService';
export {
  getRolePermissions as getRolePermissionsList,
  addRolePermission,
  removeRolePermission,
  getUserRoles,
  addUserRole,
  removeUserRole,
} from './api/relationsService';
export * from './api/permissionService';
export {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  assignPermissionsToRole,
} from './api/roleService';
export * from './api/user.dto';
export * from './hooks/useEnsureAllPermsForUserRole';
export * from './api/hooks/useEntityCrud';
export * from './api/hooks/useUsersCrud';
export * from './api/hooks/useRolesCrud';
export * from './api/hooks/usePermissionsCrud';
export * from './api/hooks/useUserRolesCrud';
