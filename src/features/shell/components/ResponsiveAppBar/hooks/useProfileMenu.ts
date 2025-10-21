// src/hooks/useProfileMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/shared/api/apiCall';
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
      const res = await apiCall(() => fetchProfileMenu(), { where: 'shell.menu.profile', toastOnError: true });
      if (!res.ok) throw res.error as unknown as Error;
      return res.value;
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
