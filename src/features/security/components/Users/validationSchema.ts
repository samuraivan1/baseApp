import { z } from 'zod';
export const userSchema = z.object({
  idUsuario: z.number().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  segundoNombre: z
    .string()
    .max(50, 'Máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  apellidoPaterno: z.string().optional(),
  apellidoMaterno: z.string().optional(),
  correoElectronico: z.string().email('Correo inválido'),
  nombreUsuario: z.string().min(3, 'Mínimo 3 caracteres'),
  rolId: z.number().optional(),
  status: z.enum(['activo', 'inactivo']),
  initials: z.string().optional(),
  auth_provider: z.string().optional(),
  phone_number: z.string().optional(),
  mfa_enabled: z.boolean().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(255).optional().or(z.literal('')),
  azure_ad_object_id: z.string().optional(),
  upn: z.string().optional(),
  email_verified_at: z.string().optional().or(z.literal('')),
  last_login_at: z.string().optional().or(z.literal('')),
  created_at: z.string().optional().or(z.literal('')),
  updated_at: z.string().optional().or(z.literal('')),
});
export type UserFormValues = z.infer<typeof userSchema>;
