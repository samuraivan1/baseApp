import { z } from 'zod';
export const userSchema = z.object({
  idUsuario: z.number().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  correoElectronico: z.string().email('Correo inválido').optional(),
  nombreUsuario: z.string().optional(),
  rolId: z.number().optional(),
  status: z.string().optional()
});
export type UserFormValues = z.infer<typeof userSchema>;
