import { TableroType } from '@/services/api.types';

// --- Tipos para AuthStore ---
export interface UserSession {
  id: number;
  nombreCompleto: string;
  iniciales: string;
  email: string;
  rol: string;
  permisos: string[]; // Guardaremos la lista de strings de permisos
  bearerToken: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: UserSession | null;
  loading: boolean;
}

export interface AuthActions {
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredPermission: string) => boolean;
}

// --- Tipos para BoardStore ---
export type BoardState = TableroType;

export interface BoardActions {
  setBoardState: (newState: BoardState) => void;
}

// --- Tipos para MenuStore (a futuro) ---
export interface MenuState {}
export interface MenuActions {}
