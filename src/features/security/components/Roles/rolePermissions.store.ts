import { create } from 'zustand';

type PermissionId = number;

type State = {
  availableIds: PermissionId[];
  assignedIds: PermissionId[];
};

type Actions = {
  reset: (available: PermissionId[], assigned: PermissionId[]) => void;
  assign: (id: PermissionId) => void;
  unassign: (id: PermissionId) => void;
  reorderAssigned: (from: number, to: number) => void;
  assignMany: (ids: PermissionId[]) => void;
  unassignMany: (ids: PermissionId[]) => void;
};

export const useRolePermsStore = create<State & Actions>((set) => ({
  availableIds: [],
  assignedIds: [],
  reset: (available, assigned) => set({ availableIds: [...available], assignedIds: [...assigned] }),
  assign: (id) =>
    set((s) =>
      s.assignedIds.includes(id)
        ? s
        : { assignedIds: [...s.assignedIds, id], availableIds: s.availableIds.filter((x) => x !== id) }
    ),
  unassign: (id) =>
    set((s) => ({ assignedIds: s.assignedIds.filter((x) => x !== id), availableIds: s.availableIds.includes(id) ? s.availableIds : [...s.availableIds, id] })),
  reorderAssigned: (from, to) =>
    set((s) => {
      const arr = [...s.assignedIds];
      const [m] = arr.splice(from, 1);
      if (typeof m === 'undefined') return { assignedIds: s.assignedIds } as unknown as State & Actions;
      const toNum: number = Number.isFinite(to) ? Math.max(0, to) : 0;
      arr.splice(toNum, 0, m);
      return { assignedIds: arr } as Partial<State> as State & Actions;
    }),
  assignMany: (ids) => set((s) => ({ assignedIds: [...s.assignedIds, ...ids.filter((i) => !s.assignedIds.includes(i))], availableIds: s.availableIds.filter((id) => !ids.includes(id)) })),
  unassignMany: (ids) => set((s) => ({ assignedIds: s.assignedIds.filter((id) => !ids.includes(id)), availableIds: [...s.availableIds, ...ids.filter((i) => !s.availableIds.includes(i))] })),
}));
