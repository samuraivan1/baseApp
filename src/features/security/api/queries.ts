import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersKeys } from './queryKeys';
import { getUsers, createUser, updateUser, deleteUser } from './userService';
import { getRoles, createRole, updateRole, deleteRole } from './roleService';
import { getPermissions, createPermission, updatePermission, deletePermission } from './permissionService';
import { getUserRoles } from './relationsService';

// Users
// Permite pasar opciones (e.g., select) para transformar datos en el consumidor
export const useUsersQuery = (options?: Record<string, unknown>) =>
  useQuery({ queryKey: usersKeys.all, queryFn: getUsers, ...(options ?? {}) });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
};

// User-Roles relations
export const useUserRolesQuery = () =>
  useQuery({ queryKey: ['user_roles'], queryFn: getUserRoles });

// Roles
export const useRolesQuery = () =>
  useQuery({ queryKey: ['roles'], queryFn: getRoles });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });
};

// Permissions
export const usePermissionsQuery = () =>
  useQuery({ queryKey: ['permissions'], queryFn: getPermissions });

export const useCreatePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });
};

export const useUpdatePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePermission,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });
};

export const useDeletePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePermission,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });
};
