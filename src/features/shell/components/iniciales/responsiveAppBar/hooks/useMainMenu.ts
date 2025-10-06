// src/hooks/useMainMenu.ts
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchMenu } from '@/features/shell';
import logger from '@/shared/api/logger';
import { useAuthStore } from '@/features/shell/state/authStore';

export const useMainMenu = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const {
    data = [], // Proporciona un valor por defecto para evitar 'undefined'
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['mainMenu'],
    queryFn: fetchMenu,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (isError) {
      logger.error(error as Error, {
        context: 'Error al cargar el menú principal',
      });
      toast.error('No se pudo cargar la navegación.');
    }
  }, [isError, error]);

  // Devuelve un objeto con nombres claros y solo los datos que el componente necesita
  return { menuItems: data, isLoadingMenu: isLoading };
};
