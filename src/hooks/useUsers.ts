// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/api';

export const useUsers = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return { users, isLoading, isError, error };
};
