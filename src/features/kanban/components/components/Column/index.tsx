import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Task } from '../Task';
import type { Column as ColumnType, Task as TaskType } from '@/features/kanban/types';
import { toast } from 'react-toastify';
import { columnMessages } from './Column.messages';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  canCreateTask?: boolean;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, canCreateTask }) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
  });
  const allowCreate = Boolean(canCreateTask);

  return (
    <div ref={setNodeRef} className="column">
      <div className="column__title">{column.title}</div>
      {allowCreate && (
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
