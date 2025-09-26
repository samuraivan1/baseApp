// src/constants/queryKeys.ts
export const QUERY_KEYS = {
  users: () => ['users'] as const,
  user: (id: number | string) => ['users', id] as const,

  roles: () => ['roles'] as const,
  role: (id: number | string) => ['roles', id] as const,

  permissions: () => ['permissions'] as const,
  permission: (id: number | string) => ['permissions', id] as const,

  boards: () => ['boards'] as const,
  board: (id: number | string) => ['boards', id] as const,
} as const;
