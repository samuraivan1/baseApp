import React from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { Task } from '../Task';
//import { useAuthStore } from '@/store/authStore';
import { usePermission } from '@/hooks/usePermission'; // ✅ 1. Importa el nuevo hook
// ✅ 1. Importa los tipos necesarios
import { ColumnType } from '@/services/api.types';
import { TaskType } from '../../types';
import { columnMessages } from './Column.messages';

// ✅ 2. Define las props para el componente
interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });
  //const hasPermission = useAuthStore((state) => state.hasPermission);
  // ✅ 2. Usa el hook de una forma mucho más limpia y declarativa
  const canCreateTask = usePermission('create:task');

  const handleAddTask = () => {
    alert(columnMessages.newTaskAlert(column.title));
  };

  return (
    // ✅ Bloque BEM
    <div ref={setNodeRef} className="column">
      {/* ✅ Elementos BEM */}
      <div className="column__title">{column.title}</div>

      {/* ✅ 3. La condición ahora es más legible */}
      {canCreateTask && (
        <div className="column__add-task-button" onClick={handleAddTask}>
          <span>+</span> {columnMessages.addTask}
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
