// src/store/store.types.ts
import { TableroType } from '@/services/api.types';

// --- Tipos para AuthStore ---
export interface UserSession {
  id: number;
  nombreCompleto: string;
  iniciales: string;
  email: string;
  rol: string;
  permisos: string[];
  permisosIds: number[];
}

export interface AuthState {
  isLoggedIn: boolean;
  user: UserSession | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  // ✅ AÑADIMOS la acción 'hasPermission' para que el estado sepa de ella
  hasPermission: (requiredPermission: string) => boolean;
}

export interface AuthActions {
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
  setToken: (accessToken: string, refreshToken?: string) => void;
}

// --- Tipos para BoardStore ---
export type BoardState = TableroType;

export interface BoardActions {
  setBoardState: (newState: BoardState) => void;
}

// --- Tipos para MenuStore (a futuro) ---
export interface MenuState {}
export interface MenuActions {}
