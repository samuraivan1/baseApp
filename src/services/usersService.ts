import apiClient from './apiClient';
export const getUsers = async () => {
  const { data } = await apiClient.get('/usuarios');
  return data;
};

export const createUser = async (payload) => {
  const { data } = await apiClient.post('/usuarios', payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await apiClient.put(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  await apiClient.delete(`/usuarios/${id}`);
};
