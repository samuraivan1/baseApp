import path from 'node:path';

export const SRC_ALIAS = '@/';

export function resolveScssImport(fromFile: string, spec: string): string {
  // Soporta alias '@/', rutas relativas y parciales _*.scss
  let p = spec.trim().replace(/['"]/g, '');
  if (p.startsWith(SRC_ALIAS)) {
    p = path.join(process.cwd(), 'src', p.slice(SRC_ALIAS.length));
  } else if (p.startsWith('.')) {
    p = path.resolve(path.dirname(fromFile), p);
  } else {
    // Trata imports locales sin prefijo como relativos al mismo dir
    p = path.resolve(path.dirname(fromFile), p);
  }
  // Intenta resolver variaciones: exacto, .scss, _partial.scss dentro del mismo dir
  const candidates = [
    p,
    `${p}.scss`,
    path.join(path.dirname(p), `_${path.basename(p)}.scss`),
  ];
  for (const c of candidates) return c;
  return p;
}

export function isScss(file: string) {
  return /\.scss$/i.test(file);
}

export function norm(p: string) {
  return path.relative(process.cwd(), p);
}

