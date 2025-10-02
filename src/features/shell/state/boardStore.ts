import { create } from 'zustand';
import { BoardState, BoardActions } from './store.types';

export const useBoardStore = create<BoardState & BoardActions>()((set) => ({
  tareas: {},
  columnas: {},
  ordenColumnas: [],
  setBoardState: (newState) => set(newState),
}));
