import fs from 'node:fs';
import path from 'node:path';
import { resolveScssImport, isScss, norm } from './pathUtils.ts';

export type ScssNode = {
  file: string;
  imports: string[];
};

const IMPORT_RE = /@(?:use|forward|import)\s+([^;]+);/g;

function extractImportSpecs(src: string): string[] {
  const specs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = IMPORT_RE.exec(src))) {
    // separa por comas y limpia 'as'/'with'
    const raw = m[1]
      .split(',')
      .map((s) => s.trim())
      .map((s) => s.replace(/\s+as\s+.+$/i, ''))
      .map((s) => s.replace(/\s+with\s*\(.+\)$/i, ''))
      .map((s) => s.replace(/^url\(/i, ''))
      .map((s) => s.replace(/\)$/, ''));
    for (const r of raw) specs.push(r.replace(/['"]/g, ''));
  }
  return specs;
}

export function buildGraph(entryFiles: string[]): Map<string, ScssNode> {
  const graph = new Map<string, ScssNode>();
  const seen = new Set<string>();
  const stack = [...entryFiles];

  while (stack.length) {
    const f = path.resolve(stack.pop()!);
    if (!isScss(f) || seen.has(f) || !fs.existsSync(f)) continue;
    seen.add(f);
    const src = fs.readFileSync(f, 'utf8');
    const specs = extractImportSpecs(src);
    const imports: string[] = [];
    for (const spec of specs) {
      const resolved = resolveScssImport(f, spec);
      imports.push(resolved);
      stack.push(resolved);
    }
    graph.set(f, { file: f, imports });
  }
  return graph;
}

export function topo(graph: Map<string, ScssNode>): string[] {
  const out: string[] = [];
  const temp = new Set<string>();
  const perm = new Set<string>();

  function visit(n: string) {
    if (perm.has(n)) return;
    if (temp.has(n)) {
      out.push(n); // ciclo; lo añadimos igualmente
      return;
    }
    temp.add(n);
    const node = graph.get(n);
    if (node) for (const d of node.imports) visit(d);
    temp.delete(n);
    perm.add(n);
    out.push(n);
  }

  for (const k of graph.keys()) visit(k);
  return out.map(norm);
}
