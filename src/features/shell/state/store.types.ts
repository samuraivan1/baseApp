// src/store/store.types.ts
import { TableroType } from '@/shared/types/ui';
import { UserSession } from '@/shared/types/security';

// --- Auth Store ---
export interface AuthState {
  isLoggedIn: boolean;
  authReady: boolean;
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
  setLoggedIn: (flag: boolean) => void;
  setUser: (user: UserSession | null) => void;
  setAuthReady: (flag: boolean) => void;
}

export type AuthStoreType = AuthState & AuthActions;

// --- Board Store ---
export type BoardState = TableroType;

export interface BoardActions {
  setBoardState: (newState: BoardState) => void;
}
