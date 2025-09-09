// src/services/api.types.ts

// Tipo para los elementos de los menús de navegación
export interface NavMenuItem {
  id: number;
  title: string;
  to?: string;
  permission?: string;
  items?: NavMenuItem[];
}

// Tipos para el tablero Kanban
export interface TaskType {
  id: string;
  content: string;
  users?: string[];
  dueDate?: string;
  daysActive?: number;
}

export interface ColumnType {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardType {
  tasks: { [key: string]: TaskType };
  columns: { [key: string]: ColumnType };
  columnOrder: string[];
}

// --- Tipos del Módulo de Seguridad (Alineados con db.json) ---

export interface Permission {
  accion: string;
  descripcion: string;
}

export interface RoleType {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: Permission[];
}

export interface UserType {
  id_usuario: number;
  nombre_usuario: string;
  nombre: string;
  apellido_paterno: string;
  correo_electronico: string;
  iniciales: string;
  hash_contrasena: string;
  rolId: number;
}
