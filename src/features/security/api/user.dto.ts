/**
 * Transformadores entre UI (UserFormValues/UserView) y DTO de API.
 */
import type { User } from '@/shared/types/security';

export type CreateUserDto = Omit<User,
  'user_id' | 'created_by' | 'updated_by' | 'deleted_at'> & { password_hash?: string | null };

export type UpdateUserDto = Partial<CreateUserDto>;

export const toCreateUserDto = (payload: Record<string, unknown>): CreateUserDto => ({
  username: String(payload.nombreUsuario || ''),
  email: String(payload.correoElectronico || ''),
  first_name: String(payload.nombre || ''),
  last_name_p: String(payload.apellidoPaterno || ''),
  second_name: payload.segundoNombre ?? null,
  last_name_m: payload.apellidoMaterno ?? null,
  initials: payload.initials ?? null,
  password_hash: undefined,
  is_active: payload.status ? (payload.status === 'activo' ? 1 : 0) : 1,
  mfa_enabled: payload.mfa_enabled ? 1 : 0,
  auth_provider: payload.auth_provider ?? null,
  phone_number: payload.phone_number ?? null,
  avatar_url: payload.avatar_url ?? null,
  bio: payload.bio ?? null,
  azure_ad_object_id: payload.azure_ad_object_id ?? null,
  upn: payload.upn ?? null,
  email_verified_at: payload.email_verified_at || null,
  last_login_at: payload.last_login_at || null,
  created_at: payload.created_at || undefined,
  updated_at: payload.updated_at || undefined,
});

export const toUpdateUserDto = (payload: Record<string, unknown>): UpdateUserDto => ({
  username: String(payload.nombreUsuario || ''),
  email: String(payload.correoElectronico || ''),
  first_name: String(payload.nombre || ''),
  last_name_p: payload.apellidoPaterno ?? '',
  second_name: payload.segundoNombre ?? null,
  last_name_m: payload.apellidoMaterno ?? null,
  initials: payload.initials ?? null,
  password_hash: null,
  is_active: payload.status ? (payload.status === 'activo' ? 1 : 0) : 1,
  mfa_enabled: payload.mfa_enabled ? 1 : 0,
  auth_provider: payload.auth_provider ?? null,
  phone_number: payload.phone_number ?? null,
  avatar_url: payload.avatar_url ?? null,
  bio: payload.bio ?? null,
  azure_ad_object_id: payload.azure_ad_object_id ?? null,
  upn: payload.upn ?? null,
});
