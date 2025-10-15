export interface Task {
  id: string;
  content: string;
  assignees?: string[];
  dueDate?: string;
  activeDays?: number;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

// Backward-compat re-exports for phased migration inside Kanban feature
export type TareaType = Task;
export type ColumnaType = Column;
export type TableroType = Board;

