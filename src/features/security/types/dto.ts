import type { IRole, IUser, IPermission } from './models';

// API-aligned DTOs (snake_case) + mappers

export interface RoleResponseDTO {
  role_id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateRoleRequestDTO = Omit<RoleResponseDTO, 'role_id' | 'created_at' | 'updated_at'>;
export type UpdateRoleRequestDTO = Partial<CreateRoleRequestDTO>;

// Users
export interface UserResponseDTO {
  user_id: number;
  username: string;
  password_hash?: string | null;
  first_name: string;
  second_name?: string | null;
  last_name_p: string;
  last_name_m?: string | null;
  initials?: string | null;
  email: string;
  auth_provider?: string | null;
  email_verified_at?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone_number?: string | null;
  azure_ad_object_id?: string | null;
  upn?: string | null;
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active: 0 | 1;
  mfa_enabled: 0 | 1;
}

export type CreateUserRequestDTO = Omit<UserResponseDTO, 'user_id' | 'created_at' | 'updated_at'>;
export type UpdateUserRequestDTO = Partial<CreateUserRequestDTO>;

// Eliminados alias redundantes; usar CreateUserRequestDTO/UpdateUserRequestDTO directamente
export type UpdateUserFlagsDTO = { is_active?: boolean | 0 | 1; mfa_enabled?: boolean | 0 | 1 };

// Permissions
export interface PermissionResponseDTO {
  permission_id: number;
  permission_string: string;
  resource?: string | null;
  scope?: string | null;
  action?: string | null;
  description?: string | null;
}
export type CreatePermissionRequestDTO = Omit<PermissionResponseDTO, 'permission_id'>;
export type UpdatePermissionRequestDTO = Partial<CreatePermissionRequestDTO>;
// Eliminados alias redundantes; usar CreatePermissionRequestDTO/UpdatePermissionRequestDTO directamente

// Mappers UI ↔ API (parciales; completar según uso real)
export const mapRoleFromDto = (dto: RoleResponseDTO): IRole => ({
  roleId: dto.role_id,
  name: dto.name,
  description: dto.description ?? null,
});

export const mapPermissionFromDto = (dto: PermissionResponseDTO): IPermission => ({
  permissionId: dto.permission_id,
  permissionKey: dto.permission_string,
  resource: dto.resource ?? null,
  scope: dto.scope ?? null,
  action: dto.action ?? null,
  description: dto.description ?? null,
});

export const mapUserFromDto = (dto: UserResponseDTO): IUser => ({
  userId: dto.user_id,
  username: dto.username,
  passwordHash: dto.password_hash ?? '', // TODO: refine type
  firstName: dto.first_name,
  secondName: dto.second_name ?? null,
  lastNameP: dto.last_name_p,
  lastNameM: dto.last_name_m ?? null,
  initials: dto.initials ?? null,
  email: dto.email,
  authProvider: dto.auth_provider ?? null,
  emailVerifiedAt: dto.email_verified_at ? new Date(dto.email_verified_at) : null,
  avatarUrl: dto.avatar_url ?? null,
  bio: dto.bio ?? null,
  phoneNumber: dto.phone_number ?? null,
  azureAdObjectId: dto.azure_ad_object_id ?? null,
  upn: dto.upn ?? null,
  lastLoginAt: dto.last_login_at ? new Date(dto.last_login_at) : null,
  createdAt: dto.created_at ? new Date(dto.created_at) : undefined,
  updatedAt: dto.updated_at ? new Date(dto.updated_at) : undefined,
  isActive: dto.is_active === 1,
  mfaEnabled: dto.mfa_enabled === 1,
});
