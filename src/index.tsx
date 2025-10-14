import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import reportWebVitals from '@/reportWebVitals';
import '@/styles/index.scss';
import { CoreProviders } from '@/core';
import { loadConfig } from '@/shared/api/configService';
// Removed unused imports: ErrorBoundary, queryClient
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
  } catch {
    // ignore
  }

  root.render(
    <React.StrictMode>
      <CoreProviders store={store}>
        <App />
      </CoreProviders>
    </React.StrictMode>
  );
};

initializeApp();
reportWebVitals();
