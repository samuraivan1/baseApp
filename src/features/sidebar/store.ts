import { create } from 'zustand';

type SidebarState = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  reset: () => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false }),
}));

export default useSidebarStore;

