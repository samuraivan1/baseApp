import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as ReduxProvider } from 'react-redux';
import { queryClient } from '@/lib/queryClient';
import ErrorBoundary from '@/shared/components/common/ErrorBoundary';
import { commonDefaultMessages } from '@/i18n/commonMessages';
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
  React.useEffect(() => {
    const onWindowError = (event: ErrorEvent) => {
      try {
        const { normalizeError } = require('@/shared/api/errorService');
        const svc = require('@/shared/api/errorService').default;
        const norm = normalizeError(event.error || event.message || event);
        svc.logError(norm);
      } catch { /* noop */ }
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      try {
        const { normalizeError } = require('@/shared/api/errorService');
        const svc = require('@/shared/api/errorService').default;
        const norm = normalizeError(event.reason);
        svc.logError(norm);
      } catch { /* noop */ }
    };
    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => {
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnFocusLoss={false} />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
