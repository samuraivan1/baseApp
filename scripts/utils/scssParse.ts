// Parser ligero orientado a auditoría: extrae selectores, variables, mixins y placeholders.
export type SelectorDef = { selector: string; line: number };
export type VariableDef = { name: string; value: string; line: number };
export type MixinDef = { name: string; line: number };
export type PlaceholderDef = { name: string; line: number };

export type ScssExtract = {
  selectors: SelectorDef[];
  variables: VariableDef[];
  mixins: MixinDef[];
  placeholders: PlaceholderDef[];
};

// Coincide solo definiciones reales de variables al tope de declaración, evitando parámetros nombrados en funciones.
// Heurística: principio de línea (ignora espacios), no precedido por '(' en la misma línea.
const VAR_DEF_RE = /^(?!.*\()\s*\$([A-Za-z0-9_-]+)\s*:\s*([^;]+);/gm;
const MIXIN_RE = /@mixin\s+([A-Za-z0-9_-]+)/g;
const PLACEHOLDER_SEL_RE = /%([A-Za-z0-9_-]+)/g;

// Heurística para expandir nesting con '&'
function expandNestedSelectors(lines: string[]): SelectorDef[] {
  const stack: { prefix: string; indent: number }[] = [];
  const out: SelectorDef[] = [];
  const OPEN_BRACE = /\{/g;
  const CLOSE_BRACE = /\}/g;

  function currentPrefix() {
    return stack.map((s) => s.prefix).join(' ');
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNo = i + 1;
    const line = raw.replace(/\/\*.*?\*\//g, '').trim();
    if (!line) continue;

    // Cuenta llaves para salir de bloques
    const closes = (raw.match(CLOSE_BRACE) || []).length;
    for (let c = 0; c < closes; c++) stack.pop();

    // Si parece un encabezado de selector
    if (/[.#\[]|%[A-Za-z0-9_-]+|^[A-Za-z]/.test(line) && line.includes('{')) {
      const sel = line.split('{')[0].trim();
      const parts = sel.split(',').map((s) => s.trim());
      for (const p of parts) {
        let full = p;
        if (p.includes('&')) {
          const pref = currentPrefix();
          const base = pref || '';
          full = p.replace(/&/g, base);
        } else if (currentPrefix()) {
          full = `${currentPrefix()} ${p}`.trim();
        }
        out.push({ selector: full, line: lineNo });
      }
    }

    // Si abre un bloque, apilamos prefijo aproximado
    const opens = (raw.match(OPEN_BRACE) || []).length;
    if (opens > 0) {
      // prefijo: último selector detectado en esta línea
      const sel = raw.split('{')[0]?.trim() || '';
      let prefix = sel;
      if (prefix.includes(',')) prefix = prefix.split(',')[0].trim();
      if (prefix.includes('&') && stack.length) {
        const base = currentPrefix();
        prefix = prefix.replace(/&/g, base);
      }
      if (prefix) stack.push({ prefix, indent: 0 });
    }
  }
  return out;
}

export function extractScss(src: string): ScssExtract {
  const lines = src.split(/\r?\n/);
  const selectors = expandNestedSelectors(lines);

  const variables: VariableDef[] = [];
  let m: RegExpExecArray | null;
  while ((m = VAR_DEF_RE.exec(src))) {
    const [full, name, value] = m;
    const upTo = src.slice(0, m.index);
    const line = upTo.split(/\r?\n/).length;
    variables.push({ name, value: value.trim(), line });
  }

  const mixins: MixinDef[] = [];
  while ((m = MIXIN_RE.exec(src))) {
    const name = m[1];
    const upTo = src.slice(0, m.index);
    const line = upTo.split(/\r?\n/).length;
    mixins.push({ name, line });
  }

  const placeholders: PlaceholderDef[] = [];
  while ((m = PLACEHOLDER_SEL_RE.exec(src))) {
    const name = m[1];
    const upTo = src.slice(0, m.index);
    const line = upTo.split(/\r?\n/).length;
    placeholders.push({ name, line });
  }

  return { selectors, variables, mixins, placeholders };
}
