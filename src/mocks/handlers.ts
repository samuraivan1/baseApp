import { http, HttpResponse } from 'msw';

// Nota: Cuando usas `npx json-server`, estos mocks no se utilizan,
// pero es buena práctica mantenerlos sincronizados para las pruebas unitarias.
const API_BASE_URL = 'http://localhost:3001';

export const handlers = [
  // --- Endpoints de Seguridad ---
  http.get(`${API_BASE_URL}/roles`, () => {}),
  http.get(`${API_BASE_URL}/usuarios`, () => {}),
  http.get(`${API_BASE_URL}/permisos`, () => {}),

  // --- Endpoints de Menús ---
  http.get(`${API_BASE_URL}/menu`, () => {}),
  http.get(`${API_BASE_URL}/menuPerfil`, () => {}),

  // --- Endpoint del Tablero ---
  http.get(`${API_BASE_URL}/tablero`, () => {}),
  http.put(`${API_BASE_URL}/tablero`, () => {}),
];
