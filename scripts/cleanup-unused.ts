import fs from 'fs';
import path from 'path';

type Entry = { path: string; reason?: string; validated?: boolean };
type Report = {
  unusedComponents?: Entry[];
  unusedHooks?: Entry[];
  unusedUtils?: Entry[];
  unusedStyles?: Entry[];
};

function readReport(file: string): Report {
  if (!fs.existsSync(file)) throw new Error(`Report not found: ${file}`);
  const raw = fs.readFileSync(file, 'utf-8');
  return JSON.parse(raw);
}

function collectValidated(report: Report): string[] {
  const buckets = ['unusedComponents', 'unusedHooks', 'unusedUtils', 'unusedStyles'] as const;
  const out: string[] = [];
  for (const b of buckets) {
    const arr = (report as any)[b] as Entry[] | undefined;
    if (!arr) continue;
    for (const e of arr) {
      if (e && e.validated) out.push(e.path);
    }
  }
  return out;
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function main() {
  const reportPath = process.env.REPORT || 'audit-unused.json';
  const dryRun = process.env.DRY_RUN !== '0';
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10);
  const logsDir = path.join('audit', 'logs');
  ensureDir(logsDir);
  const logPath = path.join(logsDir, `cleanup-${stamp}.log`);
  const log = (msg: string) => {
    process.stdout.write(msg + '\n');
    fs.appendFileSync(logPath, msg + '\n');
  };

  const report = readReport(reportPath);
  const targets = collectValidated(report);
  if (targets.length === 0) {
    log('No validated unused files to remove.');
    process.exit(0);
  }
  log(`Found ${targets.length} validated files:`);
  for (const t of targets) log(` - ${t}`);
  if (dryRun) {
    log('DRY RUN. Set DRY_RUN=0 to actually delete.');
    return;
  }
  let removed = 0;
  for (const t of targets) {
    if (fs.existsSync(t)) {
      try {
        fs.unlinkSync(t);
        removed++;
        log(`Deleted ${t}`);
      } catch (e) {
        log(`Failed to delete ${t}: ${(e as Error).message}`);
      }
    } else {
      log(`Missing (already moved/removed): ${t}`);
    }
  }
  log(`Done. Removed ${removed}/${targets.length} files.`);
}

main();

