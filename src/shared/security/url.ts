export type SafeUrlOptions = {
  allowHttpSameOrigin?: boolean;
  allowRelative?: boolean;
};

function parse(input: string): URL | null {
  try {
    // Soporta rutas relativas usando origen actual
    return new URL(input, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
  } catch {
    return null;
  }
}

const FORBIDDEN_PROTOCOLS = new Set(['javascript:', 'data:', 'vbscript:']);

export function isSafeUrl(input: string, opts: SafeUrlOptions = {}): boolean {
  if (!input) return false;
  // Permitir rutas relativas si se pide (e.g., /home)
  if (opts.allowRelative && input.startsWith('/')) return true;
  const u = parse(input);
  if (!u) return false;
  if (FORBIDDEN_PROTOCOLS.has(u.protocol)) return false;
  // Solo https por defecto; http solo si es mismo origen y se permite explícitamente
  if (u.protocol === 'https:') return true;
  if (u.protocol === 'http:' && opts.allowHttpSameOrigin) {
    try {
      return typeof window !== 'undefined' && u.host === window.location.host;
    } catch {
      return false;
    }
  }
  return false;
}

export function ensureSafeUrl(input: string, opts: SafeUrlOptions = {}): string {
  if (!input) return '';
  // Prioriza rutas relativas permitidas
  if (opts.allowRelative && input.startsWith('/')) return input;
  return isSafeUrl(input, opts) ? input : '';
}

