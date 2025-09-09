// src/pages/Kanban/components/Task.stories.jsx

import { Task } from './Task';

// Configuración principal de la historia
export default {
  title: 'Kanban/Task', // Cómo se mostrará en la barra lateral de Storybook
  component: Task,
  tags: ['autodocs'], // Genera documentación automática
};

// Historia para una tarea a tiempo
export const OnTime = {
  args: {
    task: {
      id: 'task-1',
      content: 'Tarea que está a tiempo',
      users: ['AR'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días en el futuro
      daysActive: 5,
    },
  },
};

// Historia para una tarea vencida
export const Overdue = {
  args: {
    task: {
      id: 'task-2',
      content: 'Tarea que ya está vencida',
      users: ['GV', 'AL'],
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días en el pasado
      daysActive: 15,
    },
  },
};

// Historia para una tarea sin fecha
export const NoDueDate = {
  args: {
    task: {
      id: 'task-3',
      content: 'Tarea sin fecha de entrega',
      users: ['RO'],
      daysActive: 2,
    },
  },
};
