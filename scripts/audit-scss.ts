#!/usr/bin/env node
// Ejecutable con Node ESM sin transpilar: usa extensiones .ts mediante import con extensión.
import fs from 'node:fs';
import path from 'node:path';
import { buildGraph, topo } from './utils/scssGraph.ts';
import { extractScss } from './utils/scssParse.ts';
import { scanUsage } from './utils/usageScan.ts';

type SelectorInfo = {
  selector: string;
  file: string;
  line: number;
};

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function main() {
  const files = walk(SRC_DIR);
  const scssEntries = files.filter((f) => /index\.scss$/i.test(f) || /features\/.+\.scss$/i.test(f));
  const graph = buildGraph(scssEntries);
  const order = topo(graph);

  const allSelectors: SelectorInfo[] = [];
  const variables = new Map<string, { file: string; line: number; value: string }[]>();
  const mixins = new Map<string, { file: string; line: number }[]>();
  const placeholders = new Map<string, { file: string; line: number }[]>();

  for (const rel of order) {
    const abs = path.resolve(PROJECT_ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const src = fs.readFileSync(abs, 'utf8');
    const ext = extractScss(src);
    for (const s of ext.selectors) {
      allSelectors.push({ selector: s.selector, file: rel, line: s.line });
    }
    for (const v of ext.variables) {
      if (!variables.has(v.name)) variables.set(v.name, []);
      variables.get(v.name)!.push({ file: rel, line: v.line, value: v.value });
    }
    for (const m of ext.mixins) {
      if (!mixins.has(m.name)) mixins.set(m.name, []);
      mixins.get(m.name)!.push({ file: rel, line: m.line });
    }
    for (const p of ext.placeholders) {
      if (!placeholders.has(p.name)) placeholders.set(p.name, []);
      placeholders.get(p.name)!.push({ file: rel, line: p.line });
    }
  }

  // Escanear uso real
  const codeFiles = files.filter((f) => /\.(tsx|jsx|ts|js|html)$/i.test(f));
  const usage = scanUsage(codeFiles);

  // Índices de clases usadas
  const used = new Set<string>(Array.from(usage.keys()));

  // Seletores por clase (solo clases .foo)
  // Considera selectores completos; no colapsar por prefijo de forma agresiva
  const classSelectors = allSelectors.filter((s) => /^\s*\./.test(s.selector.trim()));

  const unusedSelectors = classSelectors
    .filter((s) => {
      // extrae la clase inmediata tras el punto para validar uso base
      const m = s.selector.match(/\.(?<name>[A-Za-z0-9_-]+)/);
      const base = m?.groups?.name || '';
      return base && !used.has(base);
    })
    .map((s) => ({ selector: s.selector, definedIn: `${s.file}:${s.line}`, unused: true, risk: 'low' }));

  // Duplicados de selectores por nombre normalizado (toma primer .clase como key)
  const selectorMap = new Map<string, SelectorInfo[]>();
  const baseClass = (sel: string) => {
    const m = sel.match(/\.[A-Za-z0-9_-]+/);
    return m ? m[0] : sel.trim();
  };
  for (const s of classSelectors) {
    const key = baseClass(s.selector);
    if (!selectorMap.has(key)) selectorMap.set(key, []);
    selectorMap.get(key)!.push(s);
  }
  const duplicatedSelectors = Array.from(selectorMap.entries())
    .filter(([sel, arr]) => sel.startsWith('.') && arr.length > 1)
    .map(([sel, arr]) => ({ selector: sel, duplicates: arr.map((a) => `${a.file}:${a.line}`) }));

  // Variables sin uso: presentes en SCSS pero no referenciadas en ningún archivo SCSS
  const scssContent = order
    .map((rel) => (fs.existsSync(path.resolve(PROJECT_ROOT, rel)) ? fs.readFileSync(path.resolve(PROJECT_ROOT, rel), 'utf8') : ''))
    .join('\n');
  // Variables sin uso: definidas pero no referenciadas en SCSS, ignorando parámetros nombrados en funciones (e.g., color.adjust(..., $lightness: ...))
  const unusedVariables = Array.from(variables.entries())
    .filter(([name]) => {
      const defPattern = new RegExp(`\\$${name}\\s*:`, 'g');
      const contentNoDefs = scssContent.replace(defPattern, '');
      // referencia como variable: $name seguido de un delimitador, no dentro de '(... $name:' (parámetro nombrado)
      const refVar = new RegExp(`\\$${name}(?!\s*:)`);
      return !refVar.test(contentNoDefs);
    })
    .map(([name, defs]) => ({ name, definedIn: defs.map((d) => `${d.file}:${d.line}`) }));

  // Archivos completamente no usados (si todos sus selectores están en unused)
  const unusedFiles: { path: string; status: string; validated: boolean }[] = [];
  const byFile = new Map<string, SelectorInfo[]>();
  for (const s of classSelectors) {
    if (!byFile.has(s.file)) byFile.set(s.file, []);
    byFile.get(s.file)!.push(s);
  }
  for (const [file, sels] of byFile.entries()) {
    const allUnused = sels.every((s) => {
      const cls = s.selector.replace(/^\./, '').split(/[:\s\.#\[>+~]/)[0];
      return !used.has(cls);
    });
    const isGlobalSafe = /src\/styles\/_?(variables|mixins|global-form)\.scss$/.test(file) === false;
    if (allUnused && isGlobalSafe) unusedFiles.push({ path: file, status: 'unused', validated: true });
  }

  const summary = {
    totalSelectors: classSelectors.length,
    unusedSelectors: unusedSelectors.length,
    duplicated: duplicatedSelectors.length,
    unusedVariables: unusedVariables.length,
    cleanableFiles: unusedFiles.length,
  };

  const report = {
    unusedSelectors,
    duplicatedSelectors,
    unusedVariables,
    conflictingDeclarations: [], // reservado: requeriría análisis profundo de propiedades
    unusedFiles,
    summary,
  };

  const outPath = path.join(PROJECT_ROOT, 'audit-report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`Reporte escrito en ${outPath}`);
}

main();
