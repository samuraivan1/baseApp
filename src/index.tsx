import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import reportWebVitals from '@/reportWebVitals';
import '@/styles/index.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { loadConfig } from '@/shared/api/configService';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { queryClient } from '@/lib/queryClient';
import { store } from '@/app/store';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// ✅ Inicializa MSW en desarrollo, luego configuración y monta la App
const initializeApp = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
    // Exponer helpers de auth en modo desarrollo
    const { exposeAuth } = await import('@/dev/exposeAuth');
    exposeAuth();
  }
  await loadConfig();
  // Silent refresh antes de renderizar, para restaurar sesión sin exponer tokens
  try {
    const { silentRefresh } = await import('@/shared/auth/silentRefresh');
    await silentRefresh();
  } catch {
    // no-op: si falla, la app renderiza no autenticada
  }
  // Marcamos authReady en caso de que silentRefresh no lo haya hecho (errores previos)
  try {
    const { getAuthStore } = await import('@/features/shell/state/authStore');
    getAuthStore().setAuthReady(true);
  } catch {}

  root.render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ReduxProvider>
    </React.StrictMode>
  );
};

initializeApp();
reportWebVitals();
