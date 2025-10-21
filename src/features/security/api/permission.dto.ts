import type { CreatePermissionRequestDTO, UpdatePermissionRequestDTO } from '@/features/security/types';
// TODO: refine type - agregar validación Zod y eliminar casts directos

export const toCreatePermissionDto = (payload: Record<string, unknown>): CreatePermissionRequestDTO => ({
  permission_string: String(payload.permission_string || ''),
  resource: (payload.resource ?? null) as string | null,
  action: (payload.action ?? null) as string | null,
  scope: (payload.scope ?? null) as string | null,
  description: (payload.description ?? null) as string | null,
});

export const toUpdatePermissionDto = (payload: Record<string, unknown>): UpdatePermissionRequestDTO => ({
  permission_string: String(payload.permission_string || ''),
  resource: (payload.resource ?? null) as string | null,
  action: (payload.action ?? null) as string | null,
  scope: (payload.scope ?? null) as string | null,
  description: (payload.description ?? null) as string | null,
});
