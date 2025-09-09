import { z } from 'zod';
import { usersValidationMessages } from './Users.messages';

export const userSchema = z.object({
  nombre_usuario: z
    .string()
    .min(1, { message: usersValidationMessages.usernameRequired }),
  nombre: z
    .string()
    .min(1, { message: usersValidationMessages.firstNameRequired }),
  apellido_paterno: z
    .string()
    .min(1, { message: usersValidationMessages.lastNameRequired }),
  correo_electronico: z
    .string()
    .min(1, { message: usersValidationMessages.emailRequired })
    .email({ message: usersValidationMessages.emailInvalid }),
  iniciales: z
    .string()
    .min(1, { message: usersValidationMessages.initialsRequired }),

  // ✅ --- CAMBIO CLAVE 1 --- ✅
  // Ya no usamos `z.coerce`. Ahora el esquema espera un NÚMERO directamente.
  // Esto estabiliza la inferencia de tipos, resolviendo el error `unknown`.
  rolId: z.number().min(1, { message: usersValidationMessages.roleRequired }),
});

export type UserFormData = z.infer<typeof userSchema>;
