import type { Column } from '@/features/kanban/types';
import type { Board } from '@/features/kanban/types';

export function findColumnOfTask(board: Board, taskId: string): Column | undefined {
  const colId = Object.keys(board.columns).find((id) =>
    Boolean(board.columns[id]?.taskIds?.includes(taskId))
  );
  return colId ? board.columns[colId] : undefined;
}

