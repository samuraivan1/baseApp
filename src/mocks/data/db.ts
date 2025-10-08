// Centralized seed lives here to avoid root-level db.json
import seed from '../db.json';
import type { Permission, Role, RolePermission, User, UserRole } from '@/features/security/types';

type SeedShape = typeof seed;
type DbShape = Omit<
  SeedShape,
  'permissions' | 'roles' | 'users' | 'role_permissions' | 'user_roles'
> & {
  permissions: Permission[];
  roles: Role[];
  users: User[];
  role_permissions: RolePermission[];
  user_roles: UserRole[];
};

export type TableName = keyof DbShape;

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

export const db = (() => {
  // Forzar recarga del seed si hay cambios estructurales: versionado simple del almacenamiento
  const VERSION_KEY = STORAGE_KEY + ':v';
  const CURRENT_VERSION = '3';
  try {
    const v = loadFromStorage<string>(VERSION_KEY);
    if (v !== CURRENT_VERSION) {
      // invalidar cache anterior
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.setItem(VERSION_KEY, JSON.stringify(CURRENT_VERSION));
      }
    }
  } catch {}

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
  return initial as DbShape;
})();

// Post-seed: Garantizar asignaciones solicitadas
// - Asignar todos los permisos a rol 1
// - Asegurar que el usuario 'iamendezm' tenga rol 1
(function ensureAdminBaseline() {
  try {
    // Asegurar existencia del rol 1 (Admin)
    const roles: Array<{ role_id: number; name?: string; description?: string }> = Array.isArray(db.roles) ? (db.roles as any) : [];
    let admin = roles.find((r) => Number(r.role_id) === 1);
    if (!admin) {
      admin = { role_id: 1, name: 'Admin', description: 'Rol administrador con todos los permisos' } as any;
      roles.push(admin as any);
    } else {
      if (!admin.name) admin.name = 'Admin';
      if (admin.description == null) admin.description = 'Rol administrador con todos los permisos';
    }

    // Asegurar existencia de rol 2 (Editor) y rol 3 (Viewer)
    let editor = roles.find((r) => Number(r.role_id) === 2);
    if (!editor) {
      editor = { role_id: 2, name: 'Editor', description: 'Permisos de ver y actualizar' } as any;
      roles.push(editor as any);
    } else {
      if (!editor.name) editor.name = 'Editor';
      if (editor.description == null) editor.description = 'Permisos de ver y actualizar';
    }
    let viewer = roles.find((r) => Number(r.role_id) === 3);
    if (!viewer) {
      viewer = { role_id: 3, name: 'Viewer', description: 'Permisos de solo visualización' } as any;
      roles.push(viewer as any);
    } else {
      if (!viewer.name) viewer.name = 'Viewer';
      if (viewer.description == null) viewer.description = 'Permisos de solo visualización';
    }

    // Ya no se necesita `ensurePerm` porque los permisos ahora están estandarizados en db.json

    // Asignar todos los permisos existentes al rol de Admin (ID 1)
    const rp: Array<{ role_id: number; permission_id: number }> = Array.isArray(db.role_permissions) ? (db.role_permissions as any) : [];
    for (const p of (db.permissions as any)) {
      const exists = rp.some((r) => Number(r.role_id) === 1 && Number(r.permission_id) === Number(p.permission_id));
      if (!exists) rp.push({ role_id: 1, permission_id: Number(p.permission_id) });
    }

    // Construir mapa de permisos por ID para asignaciones
    const permMap = new Map<string, number>();
    for (const p of (db.permissions as any)) {
      if (p.permission_string) {
        permMap.set(p.permission_string, Number(p.permission_id));
      }
    }

    // Asignaciones para rol 2 (Editor): todos los 'view' y 'update'
    const editorPermIds = Array.from(permMap.keys())
      .filter(p => p.endsWith('.view') || p.endsWith('.update'))
      .map(p => permMap.get(p)!);

    for (const pid of editorPermIds) {
      const exists = rp.some((r) => Number(r.role_id) === 2 && Number(r.permission_id) === Number(pid));
      if (!exists) rp.push({ role_id: 2, permission_id: Number(pid) });
    }

    // Asignaciones para rol 3 (Viewer): solo los 'view'
    const viewerPermIds = Array.from(permMap.keys())
      .filter(p => p.endsWith('.view'))
      .map(p => permMap.get(p)!);

    for (const pid of viewerPermIds) {
      const exists = rp.some((r) => Number(r.role_id) === 3 && Number(r.permission_id) === Number(pid));
      if (!exists) rp.push({ role_id: 3, permission_id: Number(pid) });
    }
    
    // No forzar asignación de roles a usuarios específicos por defecto
    // para evitar que la app "vuelva" a un usuario concreto al rehidratar mocks.
    persistDb();
  } catch {
    // no-op en caso de estructura inesperada
  }
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
