import { z } from 'zod';
export const roleSchema = z.object({
  idRol: z.number().optional(),
  nombre: z.string().min(2, 'Nombre requerido'),
  descripcion: z.string().optional(),
  permisosIds: z.any().optional()
});
export type RoleFormValues = z.infer<typeof roleSchema>;
