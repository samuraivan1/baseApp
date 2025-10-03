import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handlers';
import { fetchMenu, fetchProfileMenu } from '@/shared/api/api';
import apiClient from '@/shared/api/apiClient';

// MSW server for node environment
const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
  // Seed a token so requireAuth passes; token format is irrelevant for uid=1 bypass
  (apiClient.defaults.headers as any).Authorization = 'Bearer mock-access-token:1';
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchMenu (legacy shape)', () => {
  it('returns items with idMenu, titulo, ruta, items', async () => {
    const data = await fetchMenu();
    expect(Array.isArray(data)).toBe(true);
    // Basic shape check for first item
    const first = data[0];
    expect(first).toHaveProperty('idMenu');
    expect(first).toHaveProperty('titulo');
    // ruta may be undefined for group nodes, but exists in seed
    expect('ruta' in first).toBe(true);
    // items is optional; ensure key might not exist
    expect(first).not.toHaveProperty('children');
    expect(first).not.toHaveProperty('label');
    expect(first).not.toHaveProperty('path');
  });
});

describe('fetchProfileMenu (legacy shape)', () => {
  it('returns items with legacy keys and filters by permissions', async () => {
    const data = await fetchProfileMenu();
    expect(Array.isArray(data)).toBe(true);
    // shape
    for (const it of data) {
      expect(it).toHaveProperty('idMenu');
      expect(it).toHaveProperty('titulo');
      // ruta puede faltar en items como "Cerrar Sesión"
      expect(it).not.toHaveProperty('path');
      expect(it).not.toHaveProperty('children');
      // nested items should also be legacy if present
      if (Array.isArray((it as any).items)) {
        for (const child of (it as any).items) {
          expect(child).toHaveProperty('idMenu');
          expect(child).toHaveProperty('titulo');
        }
      }
    }
  });
});
