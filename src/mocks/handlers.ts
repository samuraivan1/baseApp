// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { NavMenuItem } from '@/services/api.types';

// La URL base debe coincidir con la de tu apiClient
const API_BASE_URL = 'http://localhost:3001';

// ✅ 2. Define los datos de mock usando nuestros tipos para garantizar que son correctos
const mockMenu: NavMenuItem[] = [{ id: 1, title: 'Home Falso', to: '/home' }];

const mockProfileMenu: NavMenuItem[] = [
  { id: 1, title: 'Perfil Falso', to: '/profile' },
  { id: 4, title: 'Cerrar Sesión' },
];

export const handlers = [
  // Intercepta la petición GET a /menu
  http.get(`${API_BASE_URL}/menu`, () => {
    // Responde con un JSON de ejemplo
    return HttpResponse.json(mockMenu);
  }),

  // Intercepta la petición GET a /menuprofile
  http.get(`${API_BASE_URL}/menuprofile`, () => {
    return HttpResponse.json(mockProfileMenu);
  }),
];
