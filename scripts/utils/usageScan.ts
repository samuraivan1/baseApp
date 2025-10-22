import fs from 'node:fs';
import path from 'node:path';

const CLASS_PATTERNS = [
  /className\s*=\s*"([^"]+)"/g,
  /className\s*=\s*'([^']+)'/g,
  /className\s*=\s*\{\s*cn\(([^\)]*)\)\s*\}/g,
  /className\s*=\s*\{\s*cx\(([^\)]*)\)\s*\}/g,
  /className\s*=\s*\{\s*\[([^\]]*)\]\s*\.join\(/g,
  /className\s*=\s*\{\s*`([^`]+)`\s*\}/g,
];

export type UsageIndex = Map<string, string[]>; // class -> files

export function scanUsage(files: string[]): UsageIndex {
  const idx: UsageIndex = new Map();
  const add = (cls: string, file: string) => {
    const key = cls.trim();
    if (!key) return;
    if (!idx.has(key)) idx.set(key, []);
    const arr = idx.get(key)!;
    if (!arr.includes(file)) arr.push(file);
  };

  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const src = fs.readFileSync(f, 'utf8');
    for (const re of CLASS_PATTERNS) {
      let m: RegExpExecArray | null;
      const copy = new RegExp(re.source, re.flags);
      while ((m = copy.exec(src))) {
        const payload = m[1];
        // separa por espacios, comas y operadores ternarios simples
        const candidates = payload
          .split(/[\s,`'"\+\?:{}()]+/)
          .filter(Boolean)
          .map((s) => s.replace(/[^A-Za-z0-9_-]/g, ''));
        for (const c of candidates) {
          if (/^[A-Za-z0-9_-]+$/.test(c)) add(c, f);
        }
      }
    }

    // CSS Modules: import styles from './X.module.scss'; uso styles.foo o styles['foo']
    // Detecta alias de import y mapea usos
    const modImport = /import\s+([A-Za-z0-9_]+)\s+from\s+['"][^'"]+\.module\.scss['"]/g;
    let mm: RegExpExecArray | null;
    const moduleAliases: string[] = [];
    while ((mm = modImport.exec(src))) moduleAliases.push(mm[1]);
    if (moduleAliases.length) {
      for (const alias of moduleAliases) {
        // styles.foo
        const dotUse = new RegExp(`${alias}\\.([A-Za-z0-9_-]+)`, 'g');
        let mu: RegExpExecArray | null;
        while ((mu = dotUse.exec(src))) add(mu[1], f);
        // styles['foo']
        const idxUse = new RegExp(`${alias}\\[['\"]([A-Za-z0-9_-]+)['\"]\\]`, 'g');
        while ((mu = idxUse.exec(src))) add(mu[1], f);
      }
    }

    // cn({ foo: cond, 'bar-baz': test }) y cx({...})
    const objClass = /\b[cm]x?n?\s*\(\s*\{([\s\S]*?)\}\s*\)/g;
    let mo: RegExpExecArray | null;
    while ((mo = objClass.exec(src))) {
      const inside = mo[1];
      const keyRe = /(['"])?.*?([A-Za-z0-9_-]+)\1?\s*:/g;
      let mk: RegExpExecArray | null;
      while ((mk = keyRe.exec(inside))) add(mk[2], f);
    }
  }
  return idx;
}
