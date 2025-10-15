import { create } from 'zustand';
import { BoardState, BoardActions } from './store.types';

export const useBoardStore = create<BoardState & BoardActions>()((set) => ({
  tasks: {},
  columns: {},
  columnOrder: [],
  setBoardState: (newState) => set(newState),
}));
