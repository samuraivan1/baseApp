import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Task } from '../Task';
import { usePermissionsQuery } from '@/features/security/api/queries';
import { ColumnaType, TareaType } from '@/shared/types/ui';
import { columnMessages } from './Column.messages';

interface ColumnProps {
  column: ColumnaType;
  tasks: TareaType[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { data: permisos = [] } = usePermissionsQuery();
  const { setNodeRef } = useSortable({
    id: column.idColumna,
    data: { type: 'Column', column },
  });
  type Perm = { key?: string; permission_key?: string; name?: string };
  const canCreateTask = Array.isArray(permisos) && (permisos as Perm[]).some((p) => p.key === 'task:kanban:create' || p.permission_key === 'task:kanban:create' || p.name === 'task:kanban:create');

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
