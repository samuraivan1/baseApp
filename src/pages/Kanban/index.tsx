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
import { useBoardStore } from '@/store/boardStore';
import Column from './components/Column';
import { Task } from './components/Task';
import './Kanban.scss';
import { ColumnaType, TareaType } from '@/types/ui';
import { kanbanMessages } from './Kanban.messages';
import { useKanbanBoard } from './hooks/useKanbanBoard';

const Kanban: React.FC = () => {
  const { isLoading, isError, updateTablero } = useKanbanBoard();
  const { tareas, columnas, ordenColumnas, setBoardState } = useBoardStore();
  const [activeTask, setActiveTask] = useState<TareaType | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const findColumnOfTask = (taskId: string): ColumnaType | undefined => {
    const state = useBoardStore.getState();
    const colId = Object.keys(state.columnas).find((id) =>
      state.columnas[id].tareasIds.includes(taskId)
    );
    return colId ? state.columnas[colId] : undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tareas[event.active.id as string]);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColumn = findColumnOfTask(activeId);
    const overColumn =
      over.data.current?.type === 'Column'
        ? columnas[overId]
        : findColumnOfTask(overId);

    if (
      activeColumn &&
      overColumn &&
      activeColumn.idColumna !== overColumn.idColumna
    ) {
      setBoardState({
        ...useBoardStore.getState(),
        columnas: {
          ...columnas,
          [activeColumn.idColumna]: {
            ...activeColumn,
            tareasIds: activeColumn.tareasIds.filter((id) => id !== activeId),
          },
          [overColumn.idColumna]: {
            ...overColumn,
            tareasIds: [...overColumn.tareasIds, activeId],
          },
        },
      });
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
      const activeIndex = activeColumn.tareasIds.indexOf(activeId);
      const overIndex = activeColumn.tareasIds.indexOf(overId);
      if (activeIndex !== overIndex) {
        setBoardState({
          ...useBoardStore.getState(),
          columnas: {
            ...columnas,
            [activeColumn.idColumna]: {
              ...activeColumn,
              tareasIds: arrayMove(
                activeColumn.tareasIds,
                activeIndex,
                overIndex
              ),
            },
          },
        });
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
        {ordenColumnas.map((columnId) => {
          const column = columnas[columnId];
          if (!column) return null;
          const columnTasks = column.tareasIds
            .map((taskId) => tareas[taskId])
            .filter(Boolean);
          return (
            <Column
              key={column.idColumna}
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
