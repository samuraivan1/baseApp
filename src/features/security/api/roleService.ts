// src/services/roleService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import { Role, CreateRoleDTO, UpdateRoleDTO, RolePermission } from '@/shared/types/security';

export async function getRoles(): Promise<Role[]> {
  try {
    const { data } = await api.get<Role[]>('/roles');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function createRole(input: CreateRoleDTO): Promise<Role> {
  try {
    const { data } = await api.post<Role>('/roles', input);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function updateRole(
  id: number,
  input: UpdateRoleDTO
): Promise<Role> {
  try {
    const { data } = await api.put<Role>(`/roles/${id}`, input);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function deleteRole(id: number): Promise<void> {
  try {
    await api.delete(`/roles/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}

// Permissions helpers for roles
export async function getRolePermissions(roleId: number): Promise<RolePermission[]> {
  try {
    const { data } = await api.get<RolePermission[]>(`/roles/${roleId}/permissions`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
  try {
    await api.post(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
  } catch (error) {
    throw handleApiError(error);
  }
}
