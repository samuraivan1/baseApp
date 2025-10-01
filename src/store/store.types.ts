// src/store/store.types.ts
import { TableroType } from '@/types/ui';
import { UserSession } from '@/types/security';

// --- Auth Store ---
export interface AuthState {
  isLoggedIn: boolean;
  user: UserSession | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthActions {
  // Acepta ambas firmas por conveniencia del UI
  login: (
    username: string,
    password: string
  ) => Promise<UserSession>;
  logout: () => void;
  setToken: (accessToken: string, refreshToken?: string | null) => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  hasPermission: (permissionString: string) => boolean;
}

export type AuthStoreType = AuthState & AuthActions;

// --- Board Store ---
export type BoardState = TableroType;

export interface BoardActions {
  setBoardState: (newState: BoardState) => void;
}
