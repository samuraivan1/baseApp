import { z } from 'zod';

export const rolePermissionsFormSchema = z.object({
  assignedPermissionIds: z.array(z.number()).default([]),
});

export type RolePermissionsFormValues = z.infer<typeof rolePermissionsFormSchema>;
