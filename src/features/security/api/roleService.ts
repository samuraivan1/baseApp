// src/services/roleService.ts
import api from '@/shared/api/apiClient';
import { Role, CreateRoleDTO, UpdateRoleDTO, RolePermission } from '@/shared/types/security';

export async function getRoles(): Promise<Role[]> {
  const { data } = await api.get<Role[]>('/roles');
  return data;
}
export async function createRole(input: CreateRoleDTO): Promise<Role> {
  const { data } = await api.post<Role>('/roles', input);
  return data;
}
export async function updateRole(
  id: number,
  input: UpdateRoleDTO
): Promise<Role> {
  const { data } = await api.put<Role>(`/roles/${id}`, input);
  return data;
}
export async function deleteRole(id: number): Promise<void> {
  await api.delete(`/roles/${id}`);
}

// Permissions helpers for roles
export async function getRolePermissions(roleId: number): Promise<RolePermission[]> {
  const { data } = await api.get<RolePermission[]>(`/roles/${roleId}/permissions`);
  return data;
}

export async function assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
  await api.post(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
}
