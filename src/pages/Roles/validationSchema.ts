import { z } from 'zod';
import { rolesValidationMessages } from './Roles.messages';

export const roleSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: rolesValidationMessages.roleNameRequired })
    .min(3, { message: rolesValidationMessages.roleNameMinLength }),

  // ✅ Definimos los campos como opcionales. El formulario se encargará del valor por defecto.
  descripcion: z.string().optional(),
  permisosIds: z.array(z.number()).optional(),
});

export type RoleFormData = z.infer<typeof roleSchema>;
