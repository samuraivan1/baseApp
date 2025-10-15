import apiClient from '@/shared/api/apiClient';
import type { Board } from '@/features/kanban/types';

export const fetchBoard = async (): Promise<Board> => {
  const { data } = await apiClient.get('/board');
  return data;
};

export const updateBoard = async (newState: Board): Promise<Board> => {
  const { data } = await apiClient.put('/board', newState);
  return data;
};

