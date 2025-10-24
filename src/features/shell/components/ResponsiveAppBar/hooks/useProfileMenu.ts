// src/hooks/useProfileMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
// Avoid apiCall contract ambiguity here; call service directly and validate
import { appBarLogContexts } from '@/features/shell/components/ResponsiveAppBar/ResponsiveAppBar.messages';
import { fetchProfileMenu } from '@/features/shell';
import type { NavMenuItem } from '@/features/shell/types';
import logger from '@/shared/api/logger';
import { useAuthStore } from '@/features/shell/state/authStore';

export const useProfileMenu = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<NavMenuItem[]>({
    queryKey: ['profileMenu'],
    queryFn: async () => {
      const items = await fetchProfileMenu();
      if (!Array.isArray(items)) throw new Error('Menú perfil inválido');
      return items as NavMenuItem[];
    },
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (isError) {
      logger.error(error as Error, { context: appBarLogContexts.profileMenu });
    }
  }, [isError, error]);

  return { profileMenuItems: data, isLoadingProfile: isLoading };
};
