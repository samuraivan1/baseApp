import { useEntityCrud } from './useEntityCrud';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/shared/types/security';
import { getUsers, createUser, updateUser, deleteUser } from '../userService';
import { useSafeMutation } from '@/shared/hooks/useSafeMutation';
import { usersKeys } from '@/features/security/api/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

type UserInput = CreateUserDTO | UpdateUserDTO | Partial<User>;

export function useUsersCrud() {
  const service = {
    list: getUsers,
    create: (input: UserInput) => createUser(input as CreateUserDTO),
    update: (id: number, input: UserInput) => updateUser(id, input as UpdateUserDTO),
    remove: (id: number) => deleteUser(id),
  };
  const crud = useEntityCrud<User, UserInput>('users', service);
  const qc = useQueryClient();
  const create = useSafeMutation<User, UserInput>(
    (input) => createUser(input as CreateUserDTO),
    { onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }) }
  );
  const update = useSafeMutation<User, { id: number; input: UserInput }>(
    ({ id, input }) => updateUser(id, input as UpdateUserDTO),
    { onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }) }
  );
  const remove = useSafeMutation<void, number>(
    (id) => deleteUser(id),
    { onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }) }
  );
  return { ...crud, create, update, remove };
}
