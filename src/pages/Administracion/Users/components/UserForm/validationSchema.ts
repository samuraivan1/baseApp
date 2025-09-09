import { z } from 'zod';

export const userFormSchema = z.object({
  id_usuario: z.number().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correo_electronico: z.string().email('Correo inválido'),
  rolId: z.string().min(1, 'Debe seleccionar un rol'),
  estado: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof userFormSchema>;
