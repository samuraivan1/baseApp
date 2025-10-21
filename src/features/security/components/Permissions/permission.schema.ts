import { z } from 'zod';
import { permissionsMessages } from '@/features/security/components/Permissions/Permissions.messages';

const v = permissionsMessages.validation;

export const permissionSchema = z.object({
  resource: z
    .string()
    .min(1, v.required)
    .regex(/^[a-z0-9_]+$/,{ message: v.onlyLowerNumUnderscore ?? 'Solo minúsculas, números y _' })
    .max(15, v.maxLen15 ?? 'Máx 15 caracteres'),
  action: z
    .string()
    .min(1, v.required)
    .regex(/^[a-z0-9_]+$/,{ message: v.onlyLowerNumUnderscore ?? 'Solo minúsculas, números y _' })
    .max(15, v.maxLen15 ?? 'Máx 15 caracteres'),
  scope: z
    .string()
    .min(1, v.required)
    .regex(/^[a-z0-9_]+$/,{ message: v.onlyLowerNumUnderscore ?? 'Solo minúsculas, números y _' })
    .max(15, v.maxLen15 ?? 'Máx 15 caracteres'),
  description: z
    .string()
    .min(1, v.required)
    .max(255, v.maxLen255 ?? 'Máx 255 caracteres'),
  permission_string: z
    .string()
    .min(1, v.required)
    .max(200, v.maxLen200 ?? 'Máx 200 caracteres'),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;
