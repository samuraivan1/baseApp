// src/hooks/useProfileMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';
import { appBarLogContexts, appBarMessages } from '@/features/shell/components/ResponsiveAppBar/ResponsiveAppBar.messages';
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
    queryFn: fetchProfileMenu,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (isError) {
      const mapped = mapAppErrorMessage(error);
      const message = mapped || appBarMessages.profileLoadError;
      toast.error(message);
      logger.error(error as Error, { context: appBarLogContexts.profileMenu });
    }
  }, [isError, error]);

  return { profileMenuItems: data, isLoadingProfile: isLoading };
};
