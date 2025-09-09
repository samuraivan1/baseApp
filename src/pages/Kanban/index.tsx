// src/pages/Kanban/index.tsx

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
import { ColumnType } from '@/services/api.types';
import { TaskType } from './types';
import { kanbanMessages } from './Kanban.messages';
// ✅ 1. Importa el nuevo hook personalizado
import { useKanbanBoard } from './hooks/useKanbanBoard';

const Kanban: React.FC = () => {
  // ✅ 2. Llama al hook para obtener el estado y la función de actualización.
  //    Toda la lógica de fetching, mutaciones y errores ahora vive aquí.
  const { isLoading, isError, updateBoard } = useKanbanBoard();

  // El estado de la UI (lo que se ve en pantalla) viene directamente del store de Zustand.
  const { tasks, columns, columnOrder, setBoardState } = useBoardStore();

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // --- Lógica de Drag and Drop (Esta se queda en el componente) ---

  const findColumnOfTask = (taskId: string): ColumnType | undefined => {
    const state = useBoardStore.getState();
    const columnName = Object.keys(state.columns).find((colName) =>
      state.columns[colName].taskIds.includes(taskId)
    );
    return columnName ? state.columns[columnName] : undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id as string;
    setActiveTask(tasks[taskId]);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const isActiveTask = active.data.current?.type !== 'Column';
    if (!isActiveTask) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeColumn = findColumnOfTask(activeId);
    const overColumn =
      over.data.current?.type === 'Column'
        ? columns[overId]
        : findColumnOfTask(overId);
    if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
      setBoardState({
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
    const overColumn = findColumnOfTask(overId);
    if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
      const activeIndex = activeColumn.taskIds.indexOf(activeId);
      const overIndex = overColumn.taskIds.indexOf(overId);
      if (activeIndex !== overIndex) {
        const newTaskIds = arrayMove(
          activeColumn.taskIds,
          activeIndex,
          overIndex
        );
        setBoardState({
          ...useBoardStore.getState(),
          columns: {
            ...columns,
            [activeColumn.id]: { ...activeColumn, taskIds: newTaskIds },
          },
        });
      }
    }

    // ✅ 3. Llama a la función 'updateBoard' devuelta por nuestro hook para guardar.
    const finalState = useBoardStore.getState();
    updateBoard({
      tasks: finalState.tasks,
      columns: finalState.columns,
      columnOrder: finalState.columnOrder,
    });

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
            .filter(Boolean);
          return <Column key={column.id} column={column} tasks={columnTasks} />;
        })}
      </div>
      <DragOverlay>
        {activeTask ? <Task task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
