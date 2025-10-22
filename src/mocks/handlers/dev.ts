import { http, HttpResponse } from 'msw';

export const devHandlers = [
  // Simula un error de validación 422
  http.post('/api/dev/force-422', async () => {
    return HttpResponse.json(
      { message: 'Payload inválido (mock 422)' },
      { status: 422 }
    );
  }),
  // Simula 401 Unauthorized
  http.get('/api/dev/force-401', async () => {
    return HttpResponse.json(
      { message: 'No autorizado (mock 401)' },
      { status: 401 }
    );
  }),
  // Simula 403 Forbidden
  http.get('/api/dev/force-403', async () => {
    return HttpResponse.json(
      { message: 'Prohibido (mock 403)' },
      { status: 403 }
    );
  }),
  // Simula 404 Not Found
  http.get('/api/dev/force-404', async () => {
    return HttpResponse.json(
      { message: 'No encontrado (mock 404)' },
      { status: 404 }
    );
  }),
];
