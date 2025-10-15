import { z } from 'zod';

// Canonical UI MenuItem shape for the app shell
type MenuItem = {
  id: string;
  title: string;
  path?: string;
  permission?: string;
  items?: MenuItem[];
};

export const MenuItemSchema: z.ZodType<MenuItem> = z.lazy(() =>
  z.object({
    id: z.union([z.string(), z.number()]).transform(String),
    title: z.string().min(1),
    path: z.string().optional(),
    permission: z.string().optional(),
    items: z.array(MenuItemSchema).optional().default([]),
  })
);

export type { MenuItem };
