// src/hooks/usePermissions.ts
import { useQuery } from '@tanstack/react-query';
import { fetchPermisos } from '@/services/api';

export const usePermissions = () => {
  const {
    data: permissions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['permissions'], // Clave única para el caché de TanStack
    queryFn: fetchPermisos,
  });

  return { permissions, isLoading, isError, error };
};
