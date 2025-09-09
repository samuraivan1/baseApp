import { create } from 'zustand';
import { BoardState, BoardActions } from './store.types';

export const useBoardStore = create<BoardState & BoardActions>()((set) => ({
  // ✅ El store ahora solo guarda el estado TEMPORAL de la UI
  tasks: {},
  columns: {},
  columnOrder: [],

  // Esta acción solo actualiza el estado local para un drag-and-drop fluido
  setBoardState: (newState) => {
    set(newState);
  },
}));
