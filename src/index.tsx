import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import reportWebVitals from '@/reportWebVitals';
import '@/styles/index.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { loadConfig } from '@/services/configService';
import ErrorBoundary from '@/components/ErrorBoundary';
import { queryClient } from '@/lib/queryClient';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// ✅ Inicializa configuración y luego monta la App
const initializeApp = async () => {
  await loadConfig();

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};

initializeApp();
reportWebVitals();
