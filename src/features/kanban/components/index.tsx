import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '@/features/shell/state/boardStore';
import Column from './components/Column';
import { Task } from './components/Task';
import './Kanban.scss';
import type { Column as ColumnType, Task as TaskType, Board } from '@/features/kanban/types';
import { kanbanMessages } from './Kanban.messages';
import { useKanbanBoard } from './hooks/useKanbanBoard';
import { usePermissionsCrud } from '@/features/security';
import { findColumnOfTask } from '@/features/kanban/utils/findColumnOfTask';

const Kanban: React.FC = () => {
  const { isLoading, isError, updateBoard } = useKanbanBoard();
  const { tasks, columns, columnOrder, setBoardState } = useBoardStore();
  const { list } = usePermissionsCrud();
  const { data: permissions = [] } = list;
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getColumnOfTask = (taskId: string): ColumnType | undefined => {
    return findColumnOfTask(useBoardStore.getState(), taskId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    {
      const t = tasks[event.active.id as string];
      setActiveTask(t ?? null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColumn = getColumnOfTask(activeId);
    const overColumn =
      over.data.current?.type === 'Column'
        ? columns[overId]
        : getColumnOfTask(overId);

    if (
      activeColumn &&
      overColumn &&
      activeColumn.id !== overColumn.id
    ) {
      const next: Board = {
        ...useBoardStore.getState(),
        columns: {
          ...columns,
          [activeColumn.id]: {
            ...activeColumn,
            taskIds: activeColumn.taskIds.filter((id) => id !== activeId),
          },
          [overColumn.id]: {
            ...overColumn,
            taskIds: [...overColumn.taskIds, activeId],
          },
        },
      };
      setBoardState(next);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColumn = getColumnOfTask(activeId);

    if (activeColumn && activeId !== overId) {
      const activeIndex = activeColumn.taskIds.indexOf(activeId);
      const overIndex = activeColumn.taskIds.indexOf(overId);
      if (activeIndex !== overIndex) {
        const next: Board = {
          ...useBoardStore.getState(),
          columns: {
            ...columns,
            [activeColumn.id]: {
              ...activeColumn,
              taskIds: arrayMove(activeColumn.taskIds, activeIndex, overIndex),
            },
          },
        };
        setBoardState(next);
      }
    }

    const finalState = useBoardStore.getState();
    updateBoard(finalState);
    setActiveTask(null);
  };

  if (isLoading)
    return <div className="loading-container">{kanbanMessages.loading}</div>;
  if (isError)
    return <div className="loading-container">{kanbanMessages.loadError}</div>;

  // Diagnóstico: estado vacío
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[Kanban][dev] columns', Object.keys(columns).length, 'order', columnOrder.length);
  }
  if (!columnOrder || columnOrder.length === 0) {
    return (
      <div className="loading-container" style={{ color: '#666' }}>
        {kanbanMessages.emptyBoard}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban">
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          if (!column) return null;
          const columnTasks = column.taskIds
            .map((taskId) => tasks[taskId])
            .filter((t): t is TaskType => Boolean(t));
          const canCreateTask = Array.isArray(permissions) && (permissions as Array<{ key?: string; permission_key?: string; name?: string }>).some((p) => p?.key === 'task:kanban:create' || p?.permission_key === 'task:kanban:create' || p?.name === 'task:kanban:create');
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              canCreateTask={canCreateTask}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? <Task task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
export default Kanban;
