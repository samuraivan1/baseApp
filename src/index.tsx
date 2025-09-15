import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import reportWebVitals from '@/reportWebVitals';
import '@/styles/index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { loadConfig } from '@/services/configService';
import ErrorBoundary from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

// ✅ 2. Define una función asíncrona para iniciar la app
const initializeApp = async () => {
  await loadConfig(); // Espera a que la configuración se cargue

  // Solo después, renderiza la aplicación
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

// ✅ 3. Llama a la función de inicialización
initializeApp();

reportWebVitals();
