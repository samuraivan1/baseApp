// src/services/userService.ts
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import { User, CreateUserRequestDTO, UpdateUserRequestDTO, UpdateUserFlagsDTO } from '@/shared/types/security';
import { type UserResponseDTO, mapUserFromDto } from '@/features/security/types/dto';
// TODO: refine type: service should use DTOs for transport and map to domain via mappers

export async function getUsers(): Promise<User[]> {
  try {
    const res = await api.get<UserResponseDTO[] | { data: UserResponseDTO[] }>('/users');
    const rows = Array.isArray(res.data) ? res.data : (res.data as { data: UserResponseDTO[] }).data;
    const safe: User[] = [];
    (rows ?? []).forEach((item: UserResponseDTO, idx) => { // Explicitly type item
      try {
        const mapped = mapUserFromDto(item);
        safe.push(mapped);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[getUsers] map error at index', idx, e, item);
        }
        // Fallback mínimo para permitir render
        const userId = item.user_id ?? idx + 1;
        const username = item.username ?? `user${userId}`;
        const email = item.email ?? `${username}@example.com`;
        const firstName = item.first_name ?? '';
        const lastNameP = item.last_name_p ?? '';
        const lastNameM = item.last_name_m ?? null;
        const isActive = Boolean(item.is_active ?? true);
        const mfaEnabled = Boolean(item.mfa_enabled ?? false);
        const passwordHash = item.password_hash ?? '';
        safe.push({
          userId,
          username,
          passwordHash,
          firstName,
          secondName: null, // Added missing property
          lastNameP,
          lastNameM,
          initials: null, // Added missing property
          email,
          authProvider: null, // Added missing property
          emailVerifiedAt: null, // Added missing property
          avatarUrl: null, // Added missing property
          bio: null, // Added missing property
          phoneNumber: null, // Added missing property
          azureAdObjectId: null, // Added missing property
          upn: null, // Added missing property
          lastLoginAt: null, // Added missing property
          createdAt: undefined, // Added missing property
          updatedAt: undefined, // Added missing property
          isActive,
          mfaEnabled,
        });
      }
    });
    return safe;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getUser(id: number): Promise<User> {
  try {
    const { data } = await api.get<UserResponseDTO>(`/users/${id}`);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function createUser(input: CreateUserRequestDTO): Promise<User> {
  try {
    const { data } = await api.post<UserResponseDTO>('/users', input);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateUserFlags(
  id: number,
  input: UpdateUserFlagsDTO
): Promise<User> {
  const patch: { is_active?: 0 | 1; mfa_enabled?: 0 | 1 } = {};
  if (typeof input.is_active === 'boolean') patch.is_active = input.is_active ? 1 : 0;
  if (typeof input.mfa_enabled === 'boolean') patch.mfa_enabled = input.mfa_enabled ? 1 : 0;

  try {
    const { data } = await api.put<UserResponseDTO>(`/users/${id}`, patch);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function updateUser(
  id: number,
  input: UpdateUserRequestDTO
): Promise<User> {
  try {
    const { data } = await api.put<UserResponseDTO>(`/users/${id}`, input);
    return mapUserFromDto(data);
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
}