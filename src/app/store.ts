import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth';

// Add slices here as they are introduced. Keep global-critical only.
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
