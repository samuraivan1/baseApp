/**
 * Claves de TanStack Query para el feature de seguridad
 * Uso recomendado: importar y reutilizar en queries y componentes.
 */
export const usersKeys = {
  all: ['users'] as const,
  detail: (id: number) => ['users', id] as const,
};

export const rolesKeys = {
  all: ['roles'] as const,
  detail: (id: number) => ['roles', id] as const,
};

export const permissionsKeys = {
  all: ['permissions'] as const,
};

export const userRolesKeys = {
  all: ['user_roles'] as const,
  detail: (id: number) => ['user_roles', id] as const,
};

// rolePermissionsKeys eliminado por no tener usos referenciados
