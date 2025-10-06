/**
 * Deduplicate roles in db.json by ensuring every role has a unique role_id.
 * Strategy:
 *  - Keep first occurrence of a role_id as-is.
 *  - For subsequent duplicates, assign a new incremental id starting at max(role_id)+1.
 *  - Preserve name and description fields.
 */
const fs = require('fs');
const path = require('path');

// Updated to use the centralized seed under src/mocks/db.json
const dbPath = path.resolve(__dirname, '..', 'src', 'mocks', 'db.json');
const backupPath = path.resolve(__dirname, '..', `db.backup.${Date.now()}.json`);

function main() {
  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.roles)) {
    throw new Error('db.json does not contain a roles array');
  }

  // Collect existing ids and compute next id to assign
  const ids = new Set();
  let maxId = 0;
  for (const r of data.roles) {
    if (typeof r.role_id === 'number') {
      ids.add(r.role_id);
      if (r.role_id > maxId) maxId = r.role_id;
    }
  }

  const seen = new Set();
  let nextId = maxId + 1;

  const newRoles = data.roles.map((r) => {
    if (!seen.has(r.role_id)) {
      seen.add(r.role_id);
      return r; // first occurrence stays
    }
    // duplicate id: assign a new one that is not used
    while (ids.has(nextId)) nextId += 1;
    ids.add(nextId);
    return { ...r, role_id: nextId };
  });

  // Write backup then overwrite db.json
  fs.writeFileSync(backupPath, raw, 'utf8');
  data.roles = newRoles;
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated roles with unique ids. Backup created at ${path.basename(backupPath)}`);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
