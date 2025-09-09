// src/store/store.types.ts

import { BoardType } from '@/services/api.types';

// --- Tipos para AuthStore ---
export interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: string;
  permisos: string[];
  bearerToken: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
}

export interface AuthActions {
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredPermission: string) => boolean;
}

// --- Tipos para BoardStore ---
// El estado del board store es la estructura del tablero
export type BoardState = BoardType;

export interface BoardActions {
  setBoardState: (newState: BoardState) => void;
}

// --- Tipos para MenuStore (a futuro) ---
export interface MenuState {
  // Por ahora vacío, pero listo para crecer
}

export interface MenuActions {
  // Acciones futuras para el menú
}
