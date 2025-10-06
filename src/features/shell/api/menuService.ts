import apiClient from '@/shared/api/apiClient';
import type { NavMenuItem } from '@/features/shell/types';

export const fetchMenu = async (): Promise<NavMenuItem[]> => {
  const { data } = await apiClient.get('/menu');
  return data;
};

export const fetchProfileMenu = async (): Promise<NavMenuItem[]> => {
  const { data } = await apiClient.get('/menuPerfil');
  return data;
};

