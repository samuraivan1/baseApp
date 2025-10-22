import { http, HttpResponse } from 'msw';

export const configHandlers = [
  http.get('/api/config', () => {
    return HttpResponse.json({ API_BASE_URL: '/api' }, { status: 200 });
  }),
];

