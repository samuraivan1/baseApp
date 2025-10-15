// src/hooks/useMainMenu.ts
import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiCall } from '@/shared/api/apiCall';
import { appBarLogContexts, appBarMessages } from '@/features/shell/components/ResponsiveAppBar/ResponsiveAppBar.messages';
import { fetchMenu } from '@/features/shell';
import type { NavMenuItem } from '@/features/shell/types';
import logger from '@/shared/api/logger';
import { useAuthStore } from '@/features/shell/state/authStore';
import { z } from 'zod';
import { MenuItemSchema } from '@/features/shell/types/schemas.menu';

type MenuItemWithPerm = NavMenuItem & {
  permission_string?: string;
  permission?: string;
  permiso?: string;
  items?: NavMenuItem[];
};

function isMenuGroup(item: NavMenuItem): item is MenuItemWithPerm & { items: NavMenuItem[] } {
  const maybe: Partial<MenuItemWithPerm> = item as Partial<MenuItemWithPerm>;
  return Boolean(maybe.items) && Array.isArray(maybe.items);
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

export function useMainMenuBase(
  options: {
    enabled: boolean;
    hasPermission: (perm: string) => boolean;
  }
) {
  const { enabled, hasPermission } = options;
  const { data = [], isLoading, isError, error } = useQuery<NavMenuItem[]>({
    queryKey: ['mainMenu'],
    queryFn: async () => {
      const res = await apiCall(() => fetchMenu(), { where: 'shell.menu.main', toastOnError: true });
      if (!res.ok) throw res.error as unknown as Error;
      return res.value;
    },
    enabled,
  });

  useEffect(() => {
    if (isError) {
      logger.error(error as Error, { context: appBarLogContexts.mainMenu });
    }
  }, [isError, error]);

  const menuItems = useMemo<NavMenuItem[]>(() => {
    if (!enabled || !Array.isArray(data)) return [];
    // Normalize/validate menu to canonical UI shape (best-effort)
    const parse = z.array(MenuItemSchema).safeParse(data);
    const base: NavMenuItem[] = parse.success ? (parse.data as unknown as NavMenuItem[]) : data;
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
    return filterTree(base);
  }, [data, enabled, hasPermission]);

  // Devuelve un objeto con nombres claros y solo los datos que el componente necesita
  return { menuItems, isLoadingMenu: isLoading };
}

export const useMainMenu = () => {
  const { isLoggedIn, authReady, hasPermission } = useAuthStore((s) => ({
    isLoggedIn: s.isLoggedIn,
    authReady: s.authReady,
    hasPermission: s.hasPermission,
  }));
  return useMainMenuBase({ enabled: isLoggedIn && authReady, hasPermission });
};
