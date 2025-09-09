import apiClient from './apiClient';
export const getRoles = async () => {
  const { data } = await apiClient.get('/roles');
  return data;
};
export const createRole = async (payload) => {
  const { data } = await apiClient.post('/roles', payload);
  return data;
};
export const updateRole = async (id, payload) => {
  const { data } = await apiClient.put(`/roles/${id}`, payload);
  return data;
};
export const deleteRole = async (id) => {
  await apiClient.delete(`/roles/${id}`);
};
export const getPermissions = async () => {
  const { data } = await apiClient.get('/permisos');
  return data;
};
