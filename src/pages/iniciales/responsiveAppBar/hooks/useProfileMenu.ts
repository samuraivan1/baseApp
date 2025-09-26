// src/hooks/useProfileMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProfileMenu } from '@/services/api';
import logger from '@/services/logger';

export const useProfileMenu = () => {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profileMenu'],
    queryFn: fetchProfileMenu,
  });

  useEffect(() => {
    if (isError) {
      logger.error(error as Error, {
        context: 'Error al cargar el menú de perfil',
      });
    }
  }, [isError, error]);

  return { profileMenuItems: data, isLoadingProfile: isLoading };
};
