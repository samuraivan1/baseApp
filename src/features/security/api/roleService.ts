// src/services/roleService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import { Role, CreateRoleRequestDTO, UpdateRoleRequestDTO, RolePermission } from '@/shared/types/security';
import { type RoleResponseDTO, mapRoleFromDto } from '@/features/security/types/dto';

export async function getRoles(): Promise<Role[]> {
  try {
    const res = await api.get<RoleResponseDTO[] | { data: RoleResponseDTO[] }>('/roles');
    const rows = Array.isArray(res.data) ? res.data : (res.data as { data: RoleResponseDTO[] }).data;
    const safe: Role[] = [];
    (rows ?? []).forEach((item, idx) => {
      try {
        const mapped = mapRoleFromDto(item);
        safe.push(mapped);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[getRoles] map error at index', idx, e, item);
        }
        // Fallback mínimo tolerante
        const roleId = (item as unknown as { roleId?: number; role_id?: number }).roleId ?? (item as unknown as { role_id?: number }).role_id ?? idx + 1;
        const name = (item as unknown as { name?: string }).name ?? `Role ${roleId}`;
        const description = (item as unknown as { description?: string | null }).description ?? null;
        safe.push({ roleId, name, description });
      }
    });
    return safe;
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
