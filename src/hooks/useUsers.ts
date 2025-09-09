// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsuarios } from '@/services/api';

export const useUsers = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsuarios,
  });

  return { users, isLoading, isError, error };
};
