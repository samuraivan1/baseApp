import { create } from 'zustand';
import { MenuState, MenuActions } from './store.types';

export const useMenuStore = create<MenuState & MenuActions>()((set) => ({
  // El store está vacío por ahora.
  // Podríamos usarlo en el futuro para guardar el estado de la UI del menú,
  // como qué submenú está abierto, etc.
}));
