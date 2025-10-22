#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REPORT = path.join(process.cwd(), 'audit-report.json');

type Report = {
  unusedFiles: { path: string; status: string; validated: boolean }[];
};

function safeUnlink(p: string) {
  if (!fs.existsSync(p)) return false;
  // Protección extra: nunca tocar globals
  if (/src\/styles\/_?(variables|mixins|global-form)\.scss$/.test(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function main() {
  if (!fs.existsSync(REPORT)) {
    console.error('No se encontró audit-report.json. Ejecuta: node scripts/audit-scss.ts');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(REPORT, 'utf8')) as Report;
  const candidates = (data.unusedFiles || []).filter((f) => f.validated);
  if (!candidates.length) {
    console.log('No hay archivos marcados como limpiables.');
    return;
  }
  console.log('Fase 1 — Aplicando limpieza de archivos SCSS sin uso');
  let removed = 0;
  for (const c of candidates) {
    const p = path.resolve(process.cwd(), c.path);
    if (safeUnlink(p)) {
      console.log(`Eliminado: ${c.path}`);
      removed++;
    }
  }
  console.log(`\nTotal eliminados: ${removed}`);
}

main();

