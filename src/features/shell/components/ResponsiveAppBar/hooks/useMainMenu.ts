// src/hooks/useMainMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { appBarLogContexts, appBarMessages } from '@/features/shell/components/ResponsiveAppBar/ResponsiveAppBar.messages';
import { fetchMenu } from '@/features/shell';
import type { NavMenuItem } from '@/features/shell/types';
import logger from '@/shared/api/logger';
import { useAuthStore } from '@/features/shell/state/authStore';

export const useMainMenu = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const {
    data = [], // Proporciona un valor por defecto para evitar 'undefined'
    isLoading,
    isError,
    error,
  } = useQuery<NavMenuItem[]>({
    queryKey: ['mainMenu'],
    queryFn: fetchMenu,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (isError) {
      const message = (error instanceof Error && error.message) || appBarMessages.navigationLoadError;
      toast.error(message);
      logger.error(error as Error, { context: appBarLogContexts.mainMenu });
    }
  }, [isError, error]);

  // Devuelve un objeto con nombres claros y solo los datos que el componente necesita
  return { menuItems: data, isLoadingMenu: isLoading };
};
