import { z } from 'zod';

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, { message: 'El campo de email es requerido.' }),

  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

// ✅ 1. Infiere el tipo de TypeScript a partir del esquema de Zod.
//    Esto crea un tipo 'LoginFormData' que podemos usar en nuestro componente
//    sin tener que definirlo manualmente. Es una de las grandes ventajas de Zod.
export type LoginFormData = z.infer<typeof loginSchema>;
