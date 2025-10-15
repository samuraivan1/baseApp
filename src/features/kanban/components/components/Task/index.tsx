import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, getDateStatus } from '@/shared/utils/dateUtils';
import type { Task as TaskType } from '@/features/kanban/types';
import { taskMessages } from './Task.messages';

interface TaskProps {
  task: TaskType;
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
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const dateStatusClass = getDateStatus(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task"
    >
      <p className="task__content">{task.content}</p>
      {task.activeDays !== undefined && (
        <div className="task__days">
          {task.activeDays} {taskMessages.days}
        </div>
      )}
      <div className="task__footer">
        {task.dueDate && (
          <div className={`task__date task__date--${dateStatusClass}`}>
            <span>📅</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
        {renderAvatars(task.assignees)}
      </div>
    </div>
  );
};
