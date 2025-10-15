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

const Kanban: React.FC = () => {
  const { isLoading, isError, updateTablero } = useKanbanBoard();
  const { tasks, columns, columnOrder, setBoardState } = useBoardStore();
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const findColumnOfTask = (taskId: string): ColumnType | undefined => {
    const state = useBoardStore.getState();
    const colId = Object.keys(state.columns).find((id) =>
      Boolean(state.columns[id]?.taskIds?.includes(taskId))
    );
    return colId ? state.columns[colId] : undefined;
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
    const activeColumn = findColumnOfTask(activeId);
    const overColumn =
      over.data.current?.type === 'Column'
        ? columns[overId]
        : findColumnOfTask(overId);

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
    const activeColumn = findColumnOfTask(activeId);

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
    updateTablero(finalState);
    setActiveTask(null);
  };

  if (isLoading)
    return <div className="loading-container">{kanbanMessages.loading}</div>;
  if (isError)
    return <div className="loading-container">{kanbanMessages.loadError}</div>;

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
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
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
