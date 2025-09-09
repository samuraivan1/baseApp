import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, getDateStatus } from '@/utils/dateUtils';
import { TareaType } from '@/services/api.types';
import { taskMessages } from './Task.messages';

interface TaskProps {
  task: TareaType;
}

const renderAvatars = (users?: string[]) => {
  if (!users?.length) return null;
  const containerClass = `task__avatars ${users.length > 2 ? 'task__avatars--stacked' : ''}`;
  return (
    <div className={containerClass}>
      {users.slice(0, 3).map((user, index) => (
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
  } = useSortable({ id: task.idTarea });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const dateStatusClass = getDateStatus(task.fechaVencimiento);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task"
    >
      <p className="task__content">{task.contenido}</p>
      {task.diasActivo !== undefined && (
        <div className="task__days">
          {task.diasActivo} {taskMessages.days}
        </div>
      )}
      <div className="task__footer">
        {task.fechaVencimiento && (
          <div className={`task__date task__date--${dateStatusClass}`}>
            <span>📅</span>
            <span>{formatDate(task.fechaVencimiento)}</span>
          </div>
        )}
        {renderAvatars(task.usuariosAsignados)}
      </div>
    </div>
  );
};
