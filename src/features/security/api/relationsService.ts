import api from '@/services/apiClient';

export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
}
export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
}

export async function getRolePermissions(): Promise<RolePermission[]> {
  const { data } = await api.get<RolePermission[]>('/role_permissions');
  return data;
}
export async function addRolePermission(
  role_id: number,
  permission_id: number
) {
  const { data } = await api.post<RolePermission>('/role_permissions', {
    role_id,
    permission_id,
  });
  return data;
}
export async function removeRolePermission(id: number) {
  await api.delete(`/role_permissions/${id}`);
}

export async function getUserRoles(): Promise<UserRole[]> {
  const { data } = await api.get<UserRole[]>('/user_roles');
  return data;
}
export async function addUserRole(user_id: number, role_id: number) {
  const { data } = await api.post<UserRole>('/user_roles', {
    user_id,
    role_id,
  });
  return data;
}
export async function removeUserRole(id: number) {
  await api.delete(`/user_roles/${id}`);
}
