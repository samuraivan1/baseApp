// src/pages/Kanban/types.ts
export interface TaskType {
  id: string;
  content: string;
  users?: string[];
  dueDate?: string;
  daysActive?: number;
}
