// src/services/roleService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import { Role, CreateRoleRequestDTO, UpdateRoleRequestDTO } from '@/shared/types/security';
import { type RoleResponseDTO, mapRoleFromDto } from '@/features/security/types/dto';

export async function getRoles(): Promise<Role[]> {
  try {
    const { data } = await api.get<RoleResponseDTO[]>('/roles');
    return data.map(mapRoleFromDto);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function createRole(input: CreateRoleRequestDTO): Promise<Role> {
  try {
    const { data } = await api.post<RoleResponseDTO>('/roles', input);
    return mapRoleFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function updateRole(
  id: number,
  input: UpdateRoleRequestDTO
): Promise<Role> {
  try {
    const { data } = await api.put<RoleResponseDTO>(`/roles/${id}`, input);
    return mapRoleFromDto(data);
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
