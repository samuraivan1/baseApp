import { z } from 'zod';

// Assuming basic fields for a menu item. Adjust as needed based on actual requirements.
// For example, if menus can have nested items, the schema would need to be recursive.

export const menuSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  iconKey: z.string().min(1, 'La clave del ícono es requerida'),
  route: z.string().min(1, 'La ruta es requerida'),
  permissionString: z.string().optional(), // Optional permission string
  // If nested items are supported, you'd need a recursive schema here.
  // For simplicity, we'll assume flat structure or handle nesting in the form logic.
});

export type MenuFormValues = z.infer<typeof menuSchema>;