#!/usr/bin/env node
/*
 Quick audit runner for baseApp rules.
 - Reads docs/rules_registry.json
 - Performs lightweight checks in src/
 - Outputs a summary and non-zero exit on criticals
*/
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const RULES = path.join(ROOT, 'docs', 'rules_registry.json');

function hasFile(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function rgOrGrep(pattern, dir) {
  try {
    const out = execSync(`rg -n "${pattern}" ${dir}`, { stdio: ['ignore','pipe','ignore']});
    return out.toString();
  } catch {
    try {
      const out = execSync(`grep -RIn "${pattern}" ${dir}`, { stdio: ['ignore','pipe','ignore']});
      return out.toString();
    } catch { return ''; }
  }
}

function main() {
  const findings = [];
  if (!hasFile(RULES)) {
    console.error('rules_registry.json not found at', RULES);
    process.exit(2);
  }
  const rules = JSON.parse(fs.readFileSync(RULES, 'utf8'));

  // Check: imports.alias.at
  {
    const hitTs = rgOrGrep("from '@/", SRC);
    const hitScss = rgOrGrep("@use '@/", SRC);
    if (!hitTs && !hitScss) findings.push({ id: 'imports.alias.at', level: 'warn', msg: 'No alias @/ detected in TS/SCSS imports' });
  }

  // Check: architecture.core.barrel.exports
  {
    const coreBarrel = path.join(SRC, 'core', 'index.ts');
    if (!hasFile(coreBarrel)) {
      findings.push({ id: 'architecture.core.barrel.exports', level: 'error', msg: 'Missing src/core/index.ts barrel' });
    } else {
      const body = fs.readFileSync(coreBarrel, 'utf8');
      const needs = ['ErrorBoundary', 'apiClient', 'queryClient'];
      needs.forEach((n) => {
        if (!body.includes(n)) findings.push({ id: 'architecture.core.barrel.exports', level: 'warn', msg: `Barrel may not export ${n}` });
      });
    }
  }

  // Check: styles.shared.fs-table
  {
    const fsTableUse = rgOrGrep("fs-table", SRC);
    const fsTableFile = hasFile(path.join(SRC, 'shared', 'styles', 'fs-table.scss'));
    if (!fsTableUse) findings.push({ id: 'styles.shared.fs-table', level: 'info', msg: 'No references to fs-table found' });
    if (!fsTableFile) findings.push({ id: 'styles.shared.fs-table', level: 'warn', msg: 'shared/styles/fs-table.scss not found' });
  }

  // Print summary
  if (findings.length === 0) {
    console.log('✓ Audit passed with no findings');
    return;
  }
  const grouped = findings.reduce((acc, f) => { (acc[f.level] ||= []).push(f); return acc; }, {});
  const order = ['error','warn','info'];
  order.forEach((lvl) => {
    if (!grouped[lvl]) return;
    console.log(`\n${lvl.toUpperCase()}:`);
    grouped[lvl].forEach((f) => console.log(`- [${f.id}] ${f.msg}`));
  });
  if (grouped.error && grouped.error.length) process.exit(1);
}

main();

