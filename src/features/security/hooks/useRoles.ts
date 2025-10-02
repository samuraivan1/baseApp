// src/hooks/useRoles.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, deleteRole, getRoles, updateRole } from '@/features/security/api/roleService';
import { CreateRoleDTO, UpdateRoleDTO } from '@/shared/types/security';

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: getRoles });
}

export function useRoleMutations() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (input: CreateRoleDTO) => createRole(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateRoleDTO;
    }) => updateRole(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });

  return { create, update, remove };
}
