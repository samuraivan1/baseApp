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
import { queryClient } from '@/app/queryClient';
import { store } from '@/app/store';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// ✅ Inicializa configuración y luego monta la App
const initializeApp = async () => {
  await loadConfig();

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
