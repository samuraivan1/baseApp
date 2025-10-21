/** Relación N:M entre roles y permisos. */
export interface IRolePermission {
  id: number;
  role_id: number;
  permission_id: number;
}

/** Relación N:M entre usuarios y roles. */
export interface IUserRole {
  id: number;
  user_id: number;
  role_id: number;
}
