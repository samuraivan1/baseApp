import type { CreateRoleDTO, UpdateRoleDTO } from '@/features/security/types/dto';

// Transformadores entre valores del formulario y DTOs de API para Roles

export const toCreateRoleDto = (payload: Record<string, unknown>): CreateRoleDTO => ({
  name: String(payload.name || ''),
  description: (payload.description ?? null) as string | null,
});

export const toUpdateRoleDto = (payload: Record<string, unknown>): UpdateRoleDTO => ({
  name: String(payload.name || ''),
  description: (payload.description ?? null) as string | null,
});

