import { useEntityCrud } from './useEntityCrud';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/shared/types/security';
import { getUsers, createUser, updateUser, deleteUser } from '../userService';

type UserInput = CreateUserDTO | UpdateUserDTO | Partial<User>;

export function useUsersCrud() {
  const service = {
    list: getUsers,
    create: (input: UserInput) => createUser(input as CreateUserDTO),
    update: (id: number, input: UserInput) => updateUser(id, input as UpdateUserDTO),
    remove: (id: number) => deleteUser(id),
  };
  return useEntityCrud<User, UserInput>('users', service);
}

