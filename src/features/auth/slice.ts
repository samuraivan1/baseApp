import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  user: { id: string; name: string; email?: string } | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;

// Public barrel for this feature
export default authSlice;

