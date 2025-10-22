import apiClient from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';
import type { Board } from '@/features/kanban/types';

export const fetchBoard = async (): Promise<Board> => {
  try {
    const { data } = await apiClient.get('/board');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBoard = async (newState: Board): Promise<Board> => {
  try {
    const { data } = await apiClient.put('/board', newState);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};
