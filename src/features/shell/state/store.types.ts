// src/store/store.types.ts
import type { Board } from '@/features/kanban/types';
import type { IUserSession } from '@/features/security/types/models';

// --- Auth Store ---
export interface AuthState {
  isLoggedIn: boolean;
  authReady: boolean;
  user: IUserSession | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthActions {
  // Acepta ambas firmas por conveniencia del UI
  login: (
    username: string,
    password: string
  ) => Promise<IUserSession>;
  logout: () => void;
  setToken: (accessToken: string, refreshToken?: string | null) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  hasPermission: (permissionString: string) => boolean;
  setLoggedIn: (flag: boolean) => void;
  setUser: (user: IUserSession | null) => void;
  setAuthReady: (flag: boolean) => void;
}

export type AuthStoreType = AuthState & AuthActions & { phase?: 'idle' | 'loading' | 'ready' | 'error' };

// --- Board Store ---
export type BoardState = Board;

export interface BoardActions {
  setBoardState: (newState: BoardState) => void;
}
