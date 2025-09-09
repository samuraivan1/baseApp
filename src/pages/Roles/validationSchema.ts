import { z } from 'zod';
import { rolesValidationMessages } from './Roles.messages';

const permissionSchema = z.object({
  accion: z.string(), // Lo hacemos más simple para el array
  descripcion: z.string(),
});

export const roleSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: rolesValidationMessages.roleNameRequired })
    .min(3, { message: rolesValidationMessages.roleNameMinLength }),

  // ✅ Lo definimos como opcional. React Hook Form se encargará del valor por defecto.
  descripcion: z.string().optional(),

  // ✅ El array también es opcional.
  permisos: z.array(permissionSchema).optional(),
});

export type RoleFormData = z.infer<typeof roleSchema>;
