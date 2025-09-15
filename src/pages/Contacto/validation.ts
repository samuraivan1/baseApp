// src/pages/Contacto/validation.ts
import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Correo inválido'),
  mensaje: z.string().optional().nullable(),
  fecha_contacto: z.string().optional().nullable(),
});

export type ContactSchema = z.infer<typeof contactSchema>;
