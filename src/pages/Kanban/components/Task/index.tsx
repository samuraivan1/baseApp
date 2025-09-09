import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, getDateStatus } from '@/utils/dateUtils';
import { TaskType } from '../../types';
import { taskMessages } from './Task.messages';

// ✅ 2. Creamos un tipo para las props del componente
interface TaskProps {
  task: TaskType;
}

const renderAvatars = (users: string[] | undefined) => {
  if (!users || users.length === 0) return null;
  // Usaremos BEM aquí también para los avatares
  const containerClass =
    users.length > 2 ? 'task__avatars task__avatars--stacked' : 'task__avatars';
  const usersToShow = users.length > 2 ? users.slice(0, 2) : users;
  return (
    <div className={containerClass}>
      {usersToShow.map((user, index) => (
        <span key={index} className="task__avatar">
          {user}
        </span>
      ))}
    </div>
  );
};

export const Task: React.FC<TaskProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id }); // Mantenemos tu useSortable original

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dateStatusClass = getDateStatus(task.dueDate);

  // ✅ Usamos BEM: un bloque 'task'
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task" // ✅ className actualizado a 'task'
    >
      <p className="task__content">{task.content}</p> {/* ✅ Elemento BEM */}
      {task.daysActive !== undefined && (
        <div className="task__days">
          {task.daysActive} {taskMessages.days}
        </div> // ✅ Elemento BEM
      )}
      <div className="task__footer">
        {' '}
        {/* ✅ Elemento BEM */}
        {task.dueDate && (
          // ✅ Elemento BEM con un Modificador BEM dinámico
          <div className={`task__date task__date--${dateStatusClass}`}>
            <span>📅</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        {renderAvatars(task.users)}
      </div>
    </div>
  );
};
