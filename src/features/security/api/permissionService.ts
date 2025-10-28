// src/services/permissionService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { IPermission as Permission } from '@/features/security/types/models';
import {
  type PermissionResponseDTO,
  type CreatePermissionRequestDTO,
  type UpdatePermissionRequestDTO,
  mapPermissionFromDto,
} from '@/features/security/types/dto';

export async function getPermissions(): Promise<Permission[]> {
  try {
    const res = await api.get<PermissionResponseDTO[] | { data: PermissionResponseDTO[] }>('/permissions');
    const rows = Array.isArray(res.data) ? res.data : (res.data as { data: PermissionResponseDTO[] }).data;
    const safe: Permission[] = [];
    (rows ?? []).forEach((item: PermissionResponseDTO, idx) => { // Explicitly type item
      try {
        const mapped = mapPermissionFromDto(item);
        safe.push(mapped);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[getPermissions] map error at index', idx, e, item);
        }
        // Fallback mínimo
        const permissionId = item.permission_id ?? idx + 1;
        const permissionKey = item.permission_string ?? `perm.${permissionId}`;
        const resource = item.resource ?? null;
        const action = item.action ?? null;
        const scope = item.scope ?? null;
        const description = item.description ?? null;
        safe.push({ permissionId, permissionKey, resource, action, scope, description } as Permission);
      }
    });
    return safe;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function createPermission(
  input: CreatePermissionRequestDTO
): Promise<Permission> {
  try {
    const { data } = await api.post<PermissionResponseDTO>('/permissions', input);
    return mapPermissionFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function updatePermission(
  id: number,
  input: UpdatePermissionRequestDTO
): Promise<Permission> {
  try {
    const { data } = await api.put<PermissionResponseDTO>(`/permissions/${id}`, input);
    return mapPermissionFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function deletePermission(id: number): Promise<void> {
  try {
    await api.delete(`/permissions/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}
