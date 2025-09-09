import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

describe('App', () => {
  it('debería renderizar la página de inicio de sesión con su título principal', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // ✅ CAMBIO: Buscamos un elemento con el rol 'heading' y el nombre 'Iniciar Sesión'
    // Esto es mucho más específico que buscar solo el texto.
    const loginTitle = await screen.findByRole('heading', {
      name: /Iniciar Sesión/i,
    });

    expect(loginTitle).toBeInTheDocument();
  });
});
