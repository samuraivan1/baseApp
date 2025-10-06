import apiClient from '@/shared/api/apiClient';
import type { TableroType } from '@/features/kanban/types';

export const fetchTablero = async (): Promise<TableroType> => {
  const { data } = await apiClient.get('/tablero');
  return data;
};

export const updateTablero = async (newState: TableroType): Promise<TableroType> => {
  const { data } = await apiClient.put('/tablero', newState);
  return data;
};

