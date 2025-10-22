#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const REPORT = path.join(process.cwd(), 'audit-report.json');

type Report = {
  unusedFiles: { path: string; status: string; validated: boolean }[];
};

function main() {
  if (!fs.existsSync(REPORT)) {
    console.error('No se encontró audit-report.json. Ejecuta: node scripts/audit-scss.ts');
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(REPORT, 'utf8')) as Report;
  const candidates = (data.unusedFiles || []).filter((f) => f.validated);

  console.log('Fase 1 — Preview: Archivos SCSS 100% sin uso\n');
  if (!candidates.length) {
    console.log('No hay archivos marcados como limpiables.');
    return;
  }
  for (const c of candidates) {
    console.log(`- ${c.path}`);
  }
  console.log(`\nTotal: ${candidates.length} archivo(s)`);
}

main();

