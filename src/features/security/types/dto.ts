import type { Role, User } from './models';

// Role DTOs
export type CreateRoleDTO = Omit<Role, 'role_id'>;
export type UpdateRoleDTO = Partial<Omit<Role, 'role_id'>>;

// Users
export type CreateUserDTO = Omit<User, 'user_id'>;
export type UpdateUserFlagsDTO = {
  is_active?: boolean;
  mfa_enabled?: boolean;
};
export type UpdateUserDTO = Partial<
  Omit<CreateUserDTO, 'is_active' | 'mfa_enabled'>
> & { is_active?: boolean | 0 | 1; mfa_enabled?: boolean | 0 | 1 };
