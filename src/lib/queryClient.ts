// src/lib/queryClient.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import errorService, { normalizeError } from '@/shared/api/errorService';
import { fromUnknown, report } from '@/shared/errors/errorHandler';

// ✅ 1. Define la lógica de error para las queries (consultas)
const queryErrorHandler = (err: unknown) => {
  const norm = normalizeError(err, { source: 'react-query' });
  errorService.logError(norm);
  try { void report(fromUnknown(err), { where: 'react-query.query' }); } catch {}
};

// ✅ 2. Define la lógica de error para las mutations (modificaciones)
const mutationErrorHandler = (err: unknown) => {
  const norm = normalizeError(err, { source: 'react-query-mutation' });
  errorService.logError(norm);
  try { void report(fromUnknown(err), { where: 'react-query.mutation' }); } catch {}
};

export const queryClient = new QueryClient({
  // ✅ 3. Pasa los manejadores de errores a los caches correspondientes
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: mutationErrorHandler,
  }),

  // ✅ 4. Las opciones por defecto ahora solo contienen configuraciones de comportamiento
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      // Se elimina 'onError' de aquí
    },
    mutations: {
      // Se elimina 'onError' de aquí
    },
  },
});
