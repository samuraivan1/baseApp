/**
 * Centralized query keys for TanStack Query.
 *
 * This object provides a hierarchical structure for query keys, organized by feature domain.
 * This approach ensures consistency, prevents key collisions, and simplifies query invalidation.
 *
 * @example
 * // To get all users:
 * useQuery({ queryKey: QUERY_KEYS.security.users.list(), ... });
 *
 * // To invalidate all user-related queries:
 * queryClient.invalidateQueries({ queryKey: QUERY_KEYS.security.users.all() });
 */
export const QUERY_KEYS = {
  security: {
    _base: () => ['security'] as const,

    users: {
      all: () => [...QUERY_KEYS.security._base(), 'users'] as const,
      list: () => [...QUERY_KEYS.security.users.all(), 'list'] as const,
      detail: (id: number | string) =>
        [...QUERY_KEYS.security.users.all(), 'detail', id] as const,
    },

    roles: {
      all: () => [...QUERY_KEYS.security._base(), 'roles'] as const,
      list: () => [...QUERY_KEYS.security.roles.all(), 'list'] as const,
      detail: (id: number | string) =>
        [...QUERY_KEYS.security.roles.all(), 'detail', id] as const,
    },

    permissions: {
      all: () => [...QUERY_KEYS.security._base(), 'permissions'] as const,
      list: () => [...QUERY_KEYS.security.permissions.all(), 'list'] as const,
      detail: (id: number | string) =>
        [...QUERY_KEYS.security.permissions.all(), 'detail', id] as const,
    },
  },
  // Example for another domain
  // boards: {
  //   all: () => ['boards'] as const,
  //   list: () => [...QUERY_KEYS.boards.all(), 'list'] as const,
  //   detail: (id: number | string) => [...QUERY_KEYS.boards.all(), 'detail', id] as const,
  // },
} as const;
