import type { Permission } from '@/shared/types/security';

export type CreatePermissionDTO = Omit<Permission, 'permission_id'>;
export type UpdatePermissionDTO = Omit<Permission, 'permission_id'>;

export const toCreatePermissionDto = (payload: Record<string, unknown>): CreatePermissionDTO => ({
  permission_string: String(payload.permission_string || ''),
  resource: (payload.resource ?? null) as string | null,
  action: (payload.action ?? null) as string | null,
  scope: (payload.scope ?? null) as string | null,
  description: (payload.description ?? null) as string | null,
});

export const toUpdatePermissionDto = (payload: Record<string, unknown>): UpdatePermissionDTO => ({
  permission_string: String(payload.permission_string || ''),
  resource: (payload.resource ?? null) as string | null,
  action: (payload.action ?? null) as string | null,
  scope: (payload.scope ?? null) as string | null,
  description: (payload.description ?? null) as string | null,
});

