import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { queryClient } from '@/lib/queryClient';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createContext, useContext } from 'react';

// Minimal ThemeProvider (OrangeAlex) placeholder
type Theme = {
  primary: string;
};
const defaultTheme: Theme = { primary: 'var(--color-primary)' };
const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

import type { EnhancedStore } from '@reduxjs/toolkit';
type CoreStore = EnhancedStore;

type CoreProvidersProps = {
  store: CoreStore;
  children: React.ReactNode;
};

export function CoreProviders({ store, children }: CoreProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ErrorBoundary fallback={<div role="alert" style={{ padding: 16 }}>Ha ocurrido un error. Intenta recargar.</div>}>
            {children}
          </ErrorBoundary>
          <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnFocusLoss={false} />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
