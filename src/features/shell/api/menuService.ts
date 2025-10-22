import apiClient from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { NavMenuItem } from '@/features/shell/types';

export const fetchMenu = async (): Promise<NavMenuItem[]> => {
  try {
    const { data } = await apiClient.get('/menu');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchProfileMenu = async (): Promise<NavMenuItem[]> => {
  try {
    const { data } = await apiClient.get('/menuPerfil');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};
