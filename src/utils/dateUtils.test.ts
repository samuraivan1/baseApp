// src/utils/dateUtils.test.ts

import { describe, it, expect } from 'vitest';
import { formatDate, getDateStatus } from './dateUtils';

// Agrupamos las pruebas para la función formatDate
describe('formatDate', () => {
  // Definimos un caso de prueba (test case)
  it('debería formatear una fecha ISO a "mes/día"', () => {
    const isoDate = '2025-09-12T00:00:00.000Z';
    // Esperamos que el resultado de la función sea igual a '9/12'
    expect(formatDate(isoDate)).toBe('9/12');
  });
});

// Agrupamos las pruebas para la función getDateStatus
describe('getDateStatus', () => {
  it('debería devolver "on-time" para una fecha futura', () => {
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    expect(getDateStatus(futureDate)).toBe('on-time');
  });

  it('debería devolver "off-time" para una fecha pasada', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(getDateStatus(pastDate)).toBe('off-time');
  });

  it('debería devolver una cadena vacía si no se proporciona fecha', () => {
    expect(getDateStatus('')).toBe('');
  });
});
