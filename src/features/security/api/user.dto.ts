/**
 * Transformadores entre UI (UserFormValues/UserView) y DTO de API.
 */
import type { User } from '@/shared/types/security';

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const toStringOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;

const toStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

const toNumberFlag = (value: unknown, defaultValue: 0 | 1 = 0): 0 | 1 => {
  if (value === 1 || value === true || value === 'activo') return 1;
  if (value === 0 || value === false || value === 'inactivo') return 0;
  return defaultValue;
};

export type CreateUserDto = Omit<User,
  'user_id' | 'created_by' | 'updated_by' | 'deleted_at' | 'password_hash'> & { password_hash?: string | null };

export type UpdateUserDto = Partial<CreateUserDto>;

export const toCreateUserDto = (payload: Record<string, unknown>): CreateUserDto => {
  const dto: CreateUserDto = {
    username: toString(payload.nombreUsuario),
    email: toString(payload.correoElectronico),
    first_name: toString(payload.nombre),
    last_name_p: toString(payload.apellidoPaterno),
    second_name: toStringOrNull(payload.segundoNombre),
    last_name_m: toStringOrNull(payload.apellidoMaterno),
    initials: toStringOrNull(payload.initials),
    is_active: toNumberFlag(payload.status, 1),
    mfa_enabled: toNumberFlag(payload.mfa_enabled),
    auth_provider: toStringOrNull(payload.auth_provider),
    phone_number: toStringOrNull(payload.phone_number),
    avatar_url: toStringOrNull(payload.avatar_url),
    bio: toStringOrNull(payload.bio),
    azure_ad_object_id: toStringOrNull(payload.azure_ad_object_id),
    upn: toStringOrNull(payload.upn),
    email_verified_at: toStringOrNull(payload.email_verified_at),
    last_login_at: toStringOrNull(payload.last_login_at),
  };
  const password = toStringOrNull((payload as Record<string, unknown> | undefined)?.password_hash);
  if (password !== null && password !== undefined) {
    dto.password_hash = password;
  }
  return dto;
};

export const toUpdateUserDto = (payload: Record<string, unknown>): UpdateUserDto => ({
  username: toString(payload.nombreUsuario),
  email: toString(payload.correoElectronico),
  first_name: toString(payload.nombre),
  last_name_p: toString(payload.apellidoPaterno),
  second_name: toStringOrNull(payload.segundoNombre),
  last_name_m: toStringOrNull(payload.apellidoMaterno),
  initials: toStringOrNull(payload.initials),
  password_hash: null,
  is_active: toNumberFlag(payload.status, 1),
  mfa_enabled: toNumberFlag(payload.mfa_enabled),
  auth_provider: toStringOrNull(payload.auth_provider),
  phone_number: toStringOrNull(payload.phone_number),
  avatar_url: toStringOrNull(payload.avatar_url),
  bio: toStringOrNull(payload.bio),
  azure_ad_object_id: toStringOrNull(payload.azure_ad_object_id),
  upn: toStringOrNull(payload.upn),
});
