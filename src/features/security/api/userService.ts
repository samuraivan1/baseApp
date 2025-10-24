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
    const safe: User[] = [] as unknown as User[];
    (rows ?? []).forEach((item, idx) => {
      try {
        const mapped = mapUserFromDto(item);
        safe.push(mapped as unknown as User);
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[getUsers] map error at index', idx, e, item);
        }
        // Fallback mínimo para permitir render
        const userId = (item as any).userId ?? (item as any).user_id ?? idx + 1;
        const username = (item as any).username ?? `user${userId}`;
        const email = (item as any).email ?? `${username}@example.com`;
        const firstName = (item as any).firstName ?? (item as any).first_name ?? '';
        const lastNameP = (item as any).lastNameP ?? (item as any).last_name_p ?? '';
        const lastNameM = (item as any).lastNameM ?? (item as any).last_name_m ?? null;
        const isActive = Boolean((item as any).isActive ?? (item as any).is_active ?? true);
        const mfaEnabled = Boolean((item as any).mfaEnabled ?? (item as any).mfa_enabled ?? false);
        const passwordHash = (item as any).passwordHash ?? '';
        safe.push({
          userId,
          username,
          passwordHash,
          firstName,
          lastNameP,
          lastNameM,
          email,
          isActive,
          mfaEnabled,
        } as unknown as User);
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
