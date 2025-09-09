import apiClient from '@/services/apiClient';
import { Usuario, Rol, Permiso } from '@/pages/Administracion/types';

export const getUsuarios = async (): Promise<Usuario[]> => {
  const { data } = await apiClient.get('/usuarios');
  return data;
};

export const createUsuario = async (
  payload: Partial<Usuario>
): Promise<Usuario> => {
  const { data } = await apiClient.post('/usuarios', payload);
  return data;
};

export const updateUsuario = async (
  id: number,
  payload: Partial<Usuario>
): Promise<Usuario> => {
  const { data } = await apiClient.put(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await apiClient.delete(`/usuarios/${id}`);
};

/* Roles */
export const getRoles = async (): Promise<Rol[]> => {
  const { data } = await apiClient.get('/roles');
  return data;
};
export const createRol = async (payload: Partial<Rol>) => {
  const { data } = await apiClient.post('/roles', payload);
  return data;
};
export const updateRol = async (id: number, payload: Partial<Rol>) => {
  const { data } = await apiClient.put(`/roles/${id}`, payload);
  return data;
};
export const deleteRol = async (id: number) => {
  await apiClient.delete(`/roles/${id}`);
};

/* Permisos */
export const getPermisos = async (): Promise<Permiso[]> => {
  const { data } = await apiClient.get('/permisos');
  return data;
};
export const createPermiso = async (payload: Partial<Permiso>) => {
  const { data } = await apiClient.post('/permisos', payload);
  return data;
};
export const updatePermiso = async (id: number, payload: Partial<Permiso>) => {
  const { data } = await apiClient.put(`/permisos/${id}`, payload);
  return data;
};
export const deletePermiso = async (id: number) => {
  await apiClient.delete(`/permisos/${id}`);
};
