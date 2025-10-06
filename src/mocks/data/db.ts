// Centralized seed lives here to avoid root-level db.json
import seed from '../db.json';

type TableName = keyof typeof seed;

// Estado en memoria basado en db.json (no persistente entre reloads)
const STORAGE_KEY = 'msw:db';

function isDev() {
  // import.meta may not exist in tests; guard access
  try {
    // @ts-ignore
    return typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development';
  } catch {
    return false;
  }
}

function loadFromStorage<T>(key: string): T | null {
  if (!isDev()) return null;
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return null;
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (!isDev()) return;
  try {
    if (typeof window === 'undefined' || !('localStorage' in window)) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no-op
  }
}

export const db: typeof seed = (() => {
  const fromStorage = loadFromStorage<typeof seed>(STORAGE_KEY);
  const initial = fromStorage ?? JSON.parse(JSON.stringify(seed));
  // Seed mínimo de usuarios en dev si no hay
  if (isDev() && (!initial.users || initial.users.length === 0)) {
    initial.users = [
      { user_id: 1, first_name: 'Ana', second_name: '', last_name_p: 'Pérez', last_name_m: 'Lopez', email: 'ana@example.com', username: 'ana', is_active: 1, mfa_enabled: 0 },
      { user_id: 2, first_name: 'Bruno', second_name: '', last_name_p: 'García', last_name_m: '', email: 'bruno@example.com', username: 'bruno', is_active: 1, mfa_enabled: 0 },
      { user_id: 3, first_name: 'Carla', second_name: 'M.', last_name_p: 'Ruiz', last_name_m: 'Soto', email: 'carla@example.com', username: 'carla', is_active: 0, mfa_enabled: 0 },
      { user_id: 4, first_name: 'Diego', second_name: '', last_name_p: 'Núñez', last_name_m: '', email: 'diego@example.com', username: 'diego', is_active: 1, mfa_enabled: 0 },
      { user_id: 5, first_name: 'Eva', second_name: '', last_name_p: 'Ortiz', last_name_m: 'Vega', email: 'eva@example.com', username: 'eva', is_active: 1, mfa_enabled: 0 },
    ] as any;
  }
  return initial;
})();

export function persistDb() {
  saveToStorage(STORAGE_KEY, db);
}

export function nextId<K extends TableName>(table: K): number {
  const rows = db[table] as Array<{ [k: string]: any }>;
  const idField = inferIdField(table);
  const max = rows.reduce((m, r) => Math.max(m, Number(r[idField] ?? 0)), 0);
  return max + 1;
}

export function inferIdField(table: TableName): string {
  switch (table) {
    case 'users':
      return 'user_id';
    case 'roles':
      return 'role_id';
    case 'permissions':
      return 'permission_id';
    case 'user_roles':
      return 'user_id';
    case 'role_permissions':
      return 'role_id';
    default:
      return 'id';
  }
}
