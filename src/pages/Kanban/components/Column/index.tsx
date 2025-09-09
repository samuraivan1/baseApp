import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Task } from '../Task';
import { usePermission } from '@/hooks/usePermission';
import { ColumnaType, TareaType } from '@/services/api.types';
import { columnMessages } from './Column.messages';

interface ColumnProps {
  column: ColumnaType;
  tasks: TareaType[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { setNodeRef } = useSortable({
    id: column.idColumna,
    data: { type: 'Column', column },
  });
  const canCreateTask = usePermission('task:kanban:create');

  return (
    <div ref={setNodeRef} className="column">
      <div className="column__title">{column.titulo}</div>
      {canCreateTask && (
        <div
          className="column__add-task-button"
          onClick={() => alert('Crear tarea')}
        >
          <span>+</span> {columnMessages.addTask}
        </div>
      )}
      <SortableContext items={tasks.map((task) => task.idTarea)}>
        <div className="column__task-list">
          {tasks.map((task) => (
            <Task key={task.idTarea} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
export default Column;
