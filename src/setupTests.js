// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Inicia el servidor antes de que comiencen todas las pruebas
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Cierra el servidor después de que terminen todas las pruebas
afterAll(() => server.close());

// Resetea los handlers entre cada prueba para asegurar el aislamiento
afterEach(() => server.resetHandlers());
