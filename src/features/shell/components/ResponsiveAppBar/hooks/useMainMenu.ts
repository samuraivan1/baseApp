// src/hooks/useMainMenu.ts
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { appBarLogContexts, appBarMessages } from '@/features/shell/components/ResponsiveAppBar/ResponsiveAppBar.messages';
import { fetchMenu } from '@/features/shell';
import type { NavMenuItem } from '@/features/shell/types';
import logger from '@/shared/api/logger';
import { useAuthStore } from '@/features/shell/state/authStore';

type MenuItemWithPerm = NavMenuItem & {
  permission_string?: string;
  permission?: string;
  permiso?: string;
  items?: NavMenuItem[];
};

function isMenuGroup(item: NavMenuItem): item is MenuItemWithPerm & { items: NavMenuItem[] } {
  return Boolean((item as { items?: unknown }).items) && Array.isArray((item as { items?: unknown }).items);
}

function getItemPermission(item: MenuItemWithPerm): string | undefined {
  return item.permission_string || item.permission || item.permiso || undefined;
}

function hasItemPermission(hasPermission: (p: string) => boolean, item: NavMenuItem): boolean {
  // Permiso por ruta o por campo específico (si existiera en el shape)
  // Convención: si el item no define permiso, se permite por defecto y se evalúan sus hijos.
  const perm = getItemPermission(item as MenuItemWithPerm);
  if (perm && typeof perm === 'string') {
    return hasPermission(perm);
  }
  return true;
}

export const useMainMenu = () => {
  const { isLoggedIn, phase, hasPermission } = useAuthStore((s) => ({ isLoggedIn: s.isLoggedIn, phase: s.phase ?? (s.authReady ? 'ready' : 'idle'), hasPermission: s.hasPermission }));
  const {
    data = [], // Proporciona un valor por defecto para evitar 'undefined'
    isLoading,
    isError,
    error,
  } = useQuery<NavMenuItem[]>({
    queryKey: ['mainMenu'],
    queryFn: fetchMenu,
    enabled: isLoggedIn && phase === 'ready',
  });

  useEffect(() => {
    if (isError) {
      const message = (error instanceof Error && error.message) || appBarMessages.navigationLoadError;
      toast.error(message);
      logger.error(error as Error, { context: appBarLogContexts.mainMenu });
    }
  }, [isError, error]);

  const menuItems = useMemo<NavMenuItem[]>(() => {
    if (phase !== 'ready' || !Array.isArray(data)) return [];
    const filterTree = (items: NavMenuItem[]): NavMenuItem[] => {
      return items
        .map((it) => {
          const next: MenuItemWithPerm = { ...(it as MenuItemWithPerm) };
          if (isMenuGroup(next)) {
            next.items = filterTree(next.items);
          }
          return next as NavMenuItem;
        })
        .filter((it) => {
          const allowedSelf = hasItemPermission(hasPermission, it);
          const hasChildren = isMenuGroup(it) && it.items.length > 0;
          // Mantener el item si está permitido o si contiene hijos permitidos
          return allowedSelf || hasChildren;
        });
    };
    return filterTree(data);
  }, [data, phase, hasPermission]);

  // Devuelve un objeto con nombres claros y solo los datos que el componente necesita
  return { menuItems, isLoadingMenu: isLoading };
};
