import { z } from 'zod';

export const RoleSchema = z.object({
  role_id: z.number(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

export const PermissionSchema = z.object({
  permission_id: z.number(),
  permission_string: z.string().min(1),
  resource: z.string().nullable().optional(),
  scope: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const RolePermissionSchema = z.object({
  role_id: z.number(),
  permission_id: z.number(),
});

export const UserRoleSchema = z.object({
  user_id: z.number(),
  role_id: z.number(),
});

export const PaginatedMetaSchema = z.object({
  total: z.number().nonnegative(),
  page: z.number().nonnegative(),
  pageSize: z.number().positive(),
});

export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    meta: PaginatedMetaSchema,
  });

export type RoleDto = z.infer<typeof RoleSchema>;
export type PermissionDto = z.infer<typeof PermissionSchema>;
export type RolePermissionDto = z.infer<typeof RolePermissionSchema>;
export type UserRoleDto = z.infer<typeof UserRoleSchema>;

// Convenience helpers
export const PaginatedRolesSchema = PaginatedSchema(RoleSchema);
export const PaginatedPermissionsSchema = PaginatedSchema(PermissionSchema);
