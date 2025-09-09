import { useQuery } from '@tanstack/react-query';
import * as service from '@/services/rolesService';

export const QUERY_KEYS = {
  roles: ['roles'],
  permisos: ['permisos'],
  usuarios: ['usuarios'],
};

export const useRoles = () => useQuery(QUERY_KEYS.roles, service.getRoles);
export const usePermissions = () => useQuery(QUERY_KEYS.permisos, service.getPermissions);
