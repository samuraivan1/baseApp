import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Task } from '../Task';
import { usePermissionsCrud } from '@/features/security';
import type { Column as ColumnType, Task as TaskType } from '@/features/kanban/types';
import { toast } from 'react-toastify';
import { columnMessages } from './Column.messages';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { list } = usePermissionsCrud();
  const { data: permissions = [] } = list;
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
  });
  type Perm = { key?: string; permission_key?: string; name?: string };
  const canCreateTask = Array.isArray(permissions) && (permissions as Perm[]).some((p) => p.key === 'task:kanban:create' || p.permission_key === 'task:kanban:create' || p.name === 'task:kanban:create');

  return (
    <div ref={setNodeRef} className="column">
      <div className="column__title">{column.title}</div>
      {canCreateTask && (
        <div
          className="column__add-task-button"
          onClick={() => toast.info(columnMessages.addTask)}
        >
          <span aria-hidden>+</span> {columnMessages.addTask}
        </div>
      )}
      <SortableContext items={tasks.map((task) => task.id)}>
        <div className="column__task-list">
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
export default Column;
