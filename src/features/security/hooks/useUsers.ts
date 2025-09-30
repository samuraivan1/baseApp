// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUsers, updateUserFlags } from '@/features/security/api/userService';

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: getUsers });
}

export function useUserFlagMutations() {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      id,
      is_active,
      mfa_enabled,
    }: {
      id: number;
      is_active?: boolean;
      mfa_enabled?: boolean;
    }) => updateUserFlags(id, { is_active, mfa_enabled }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
  return mutation;
}
