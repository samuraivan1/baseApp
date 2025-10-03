#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const src = path.join(process.cwd(), "src/shared/components");
const dst = path.join(process.cwd(), "src/shared/components");

if (!fs.existsSync(src)) process.exit(0);

for (const name of fs.readdirSync(src)) {
  const from = path.join(src, name);
  const to = path.join(dst, name);
  if (fs.statSync(from).isDirectory()) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    for (const file of fs.readdirSync(from)) {
      const f = path.join(from, file);
      const t = path.join(to, file);
      if (!fs.existsSync(t)) fs.renameSync(f, t);
    }
  }
}

// Try remove source subfolders if empty
for (const name of fs.readdirSync(src)) {
  const dir = path.join(src, name);
  try {
    fs.rmdirSync(dir);
  } catch {}
}
try {
  fs.rmdirSync(src);
} catch {}

console.log("Move completed");
