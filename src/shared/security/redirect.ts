export function ensureSafeInternalPath(input: unknown, fallback: string = '/'): string {
  const path = typeof input === 'string' ? input : '';
  if (!path) return fallback;
  // Solo rutas internas absolutas, sin esquema ni doble slash inicial
  if (!path.startsWith('/') || path.startsWith('//')) return fallback;
  // No permitir segmentos peligrosos
  if (path.includes('://')) return fallback;
  return path;
}

