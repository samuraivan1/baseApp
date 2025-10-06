// src/hooks/useProfileMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProfileMenu } from '@/features/shell';
import logger from '@/shared/api/logger';
import { useAuthStore } from '@/features/shell/state/authStore';

export const useProfileMenu = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profileMenu'],
    queryFn: fetchProfileMenu,
    enabled: isLoggedIn,
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
