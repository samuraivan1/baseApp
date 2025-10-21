import type { CreateRoleRequestDTO, UpdateRoleRequestDTO } from '@/features/security/types/dto';
// TODO: refine type - agregar validación Zod y eliminar casts directos

// Transformadores entre valores del formulario y DTOs de API para Roles

export const toCreateRoleDto = (payload: Record<string, unknown>): CreateRoleRequestDTO => ({
  name: String(payload.name || ''),
  description: (payload.description ?? null) as string | null,
});

export const toUpdateRoleDto = (payload: Record<string, unknown>): UpdateRoleRequestDTO => ({
  name: String(payload.name || ''),
  description: (payload.description ?? null) as string | null,
});
