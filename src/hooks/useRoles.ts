// src/hooks/useRoles.ts
import { useQuery } from '@tanstack/react-query';
import { fetchRoles } from '@/services/api';

export const useRoles = () => {
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  return { roles, isLoading, isError, error };
};
