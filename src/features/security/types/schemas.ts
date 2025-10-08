import { z } from 'zod';

export const UserSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  first_name: z.string().min(1, 'El nombre es requerido'),
  second_name: z.string().optional(),
  last_name_p: z.string().min(1, 'El apellido paterno es requerido'),
  last_name_m: z.string().optional(),
  email: z.string().email('El correo electrónico no es válido'),
  is_active: z.union([z.literal(0), z.literal(1)]).default(1),
  mfa_enabled: z.union([z.literal(0), z.literal(1)]).default(0),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
});
