// src/services/permissionService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { Permission } from '@/shared/types/security';
import {
  type PermissionResponseDTO,
  type CreatePermissionRequestDTO,
  type UpdatePermissionRequestDTO,
  mapPermissionFromDto,
} from '@/features/security/types/dto';

export async function getPermissions(): Promise<Permission[]> {
  try {
    const res = await api.get<PermissionResponseDTO[] | { data: PermissionResponseDTO[] }>('/permissions');
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[getPermissions] raw response', res.data);
    }
    const rows = Array.isArray(res.data) ? res.data : (res.data as { data: PermissionResponseDTO[] }).data;
    const safe: Permission[] = [] as unknown as Permission[];
    (rows ?? []).forEach((item, idx) => {
      try {
        const mapped = mapPermissionFromDto(item);
        safe.push(mapped as unknown as Permission);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[getPermissions] map error at index', idx, e, item);
        }
        // Fallback mínimo
        const permissionId = (item as any).permissionId ?? (item as any).permission_id ?? idx + 1;
        const permissionKey = (item as any).permissionKey ?? (item as any).permission_string ?? `perm.${permissionId}`;
        const resource = (item as any).resource ?? null;
        const action = (item as any).action ?? null;
        const scope = (item as any).scope ?? null;
        const description = (item as any).description ?? null;
        safe.push({ permissionId, permissionKey, resource, action, scope, description } as unknown as Permission);
      }
    });
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[getPermissions] mapped size', safe.length);
    }
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
