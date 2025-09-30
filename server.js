// server.js - Dev mock API bridging Spanish db.json to English API
const path = require('path');

(async () => {
  const { Low } = await import('lowdb');
  const { JSONFile } = await import('lowdb/node');
  const { App } = await import('@tinyhttp/app');
  const { cors } = await import('@tinyhttp/cors');
  const { json } = await import('milliparsec');

  const dbFile = path.join(__dirname, 'db.json');
  const adapter = new JSONFile(dbFile);
  const db = new Low(adapter, {});
  await db.read();
  if (!db.data) db.data = {};

  const app = new App();
  // CORS con autorización y preflight dinámico
  app
    .use((req, res, next) => {
      const requested = req.headers['access-control-request-headers'];
      const allowed = (() => {
        if (!requested) return ['Content-Type', 'Authorization'];
        if (Array.isArray(requested)) return requested.map((h) => String(h).trim());
        return String(requested)
          .split(',')
          .map((h) => h.trim());
      })();
      return cors({
        origin: true,
        credentials: true,
        allowedHeaders: allowed,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      })(req, res, next);
    })
    .options('*', cors());
  // @ts-expect-error expected by tinyhttp
  app.use(json());

  // Soporte de prefijo '/api' por si el proxy no reescribe
  app.use((req, _res, next) => {
    if (typeof req.url === 'string' && req.url.startsWith('/api/')) {
      req.url = req.url.slice(4); // quita '/api'
    }
    next?.();
  });

  // Healthcheck para depurar
  app.get('/health', (_req, res) => {
    res.json({ ok: true, dataKeys: Object.keys(db.data || {}) });
  });

  // Helpers
  const ACCESS_TTL_MS = 60 * 1000; // 1 minuto para probar refresh fácilmente
  const save = async () => {
    await db.write();
  };
  const rand = () => Math.random().toString(16).slice(2, 8);
  const issueAccessToken = (userId, ttlMs = ACCESS_TTL_MS) => `mock.access.${userId}.${Date.now() + ttlMs}`;
  const issueRefreshToken = (userId) => `mock.refresh.${userId}.${rand()}`;
  const parseAccess = (token = '') => {
    const parts = String(token).split('.');
    // mock.access.{userId}.{exp}
    if (parts.length >= 4 && parts[0] === 'mock' && parts[1] === 'access') {
      const userId = Number(parts[2]);
      const exp = Number(parts[3]);
      return { ok: !Number.isNaN(userId) && !Number.isNaN(exp), userId, exp };
    }
    return { ok: false, userId: null, exp: null };
  };
  const parseRefresh = (token = '') => {
    const parts = String(token).split('.');
    // mock.refresh.{userId}.{rand}
    if (parts.length >= 4 && parts[0] === 'mock' && parts[1] === 'refresh') {
      const userId = Number(parts[2]);
      return { ok: !Number.isNaN(userId), userId };
    }
    return { ok: false, userId: null };
  };
  // Lookups
  const findRoleById = (apiId) =>
    (db.data.roles || []).find((r) => Number(r.role_id) === Number(apiId));

  // Auth (no requiere token)
  app.post('/auth/login', (req, res) => {
    const { username } = req.body || {};
    const users = db.data.users || [];
    const roles = db.data.roles || [];
    const perms = db.data.permissions || [];
    const user = users.find((u) => u.username === username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // Roles asignados mediante tabla user_roles
    const userRoles = (db.data.user_roles || [])
      .filter((ur) => Number(ur.user_id) === Number(user.user_id))
      .map((ur) => findRoleById(ur.role_id))
      .filter(Boolean);

    // Permisos por role via role_permissions
    const rolePermIds = new Set(
      (db.data.role_permissions || [])
        .filter((rp) => userRoles.some((r) => r.role_id === (typeof rp.role_id === 'number' ? rp.role_id : hashId(rp.role_id))))
        .map((rp) => Number(rp.permission_id))
    );
    const userPerms = (db.data.permissions || [])
      .filter((p) => rolePermIds.has(Number(p.permission_id)));

    const full_name = [user.first_name, user.last_name_p, user.last_name_m]
      .filter(Boolean)
      .join(' ');

    return res.json({
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name_p: user.last_name_p,
        last_name_m: user.last_name_m ?? null,
        initials: user.initials ?? null,
        is_active:
          typeof user.is_active === 'boolean'
            ? user.is_active
            : Number(user.is_active) === 1,
        mfa_enabled:
          typeof user.mfa_enabled === 'boolean'
            ? user.mfa_enabled
            : Number(user.mfa_enabled) === 1,
        roles: userRoles,
        permissions: userPerms,
        full_name,
      },
      accessToken: issueAccessToken(user.user_id),
      refreshToken: issueRefreshToken(user.user_id),
    });
  });

  app.post('/auth/refresh', (req, res) => {
    const { refreshToken } = req.body || {};
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
    const parsed = parseRefresh(refreshToken);
    if (!parsed.ok) return res.status(401).json({ error: 'Invalid refresh token' });
    return res.json({ accessToken: issueAccessToken(parsed.userId) });
  });

  // Middleware de protección para el resto de rutas
  app.use((req, res, next) => {
    if (req.path?.startsWith('/auth/')) return next?.();
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    if (!auth || !String(auth).startsWith('Bearer ')) return res.sendStatus(401);
    const token = String(auth).slice('Bearer '.length);
    const { ok, exp } = parseAccess(token);
    if (!ok) return res.sendStatus(401);
    if (Date.now() > Number(exp)) return res.status(401).json({ error: 'Token expired' });
    return next?.();
  });

  // Menús (protegidos)
  app.get('/menu', (_req, res) => {
    res.json(db.data.menu || []);
  });
  app.get('/menuPerfil', (_req, res) => {
    res.json(db.data.menuPerfil || []);
  });

  // Endpoints legacy en español (solo los necesarios)
  app.get('/tablero', (_req, res) => {
    res.json(db.data.tablero || {});
  });

  // Users
  app.get('/users', (_req, res) => {
    res.json(db.data.users || []);
  });
  app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const u = (db.data.users || []).find((x) => Number(x.user_id) === id);
    if (!u) return res.sendStatus(404);
    res.json(u);
  });
  app.post('/users', (req, res) => {
    const input = req.body || {};
    const nextId = (() => {
      const nums = (db.data.users || []).map((u) => Number(u.user_id) || 0);
      return (Math.max(0, ...nums) || 0) + 1;
    })();
    const nuevo = {
      user_id: nextId,
      username: input.username,
      password_hash: input.password_hash ?? '',
      first_name: input.first_name,
      last_name_p: input.last_name_p,
      last_name_m: input.last_name_m ?? null,
      initials: input.initials ?? null,
      email: input.email,
      auth_provider: input.auth_provider ?? null,
      email_verified_at: input.email_verified_at ?? null,
      avatar_url: input.avatar_url ?? null,
      bio: input.bio ?? null,
      phone_number: input.phone_number ?? null,
      azure_ad_object_id: input.azure_ad_object_id ?? null,
      upn: input.upn ?? null,
      is_active:
        typeof input.is_active === 'boolean'
          ? input.is_active ? 1 : 0
          : input.is_active === 1
            ? 1
            : 0,
      mfa_enabled:
        typeof input.mfa_enabled === 'boolean'
          ? input.mfa_enabled ? 1 : 0
          : input.mfa_enabled === 1 ? 1 : 0,
      last_login_at: input.last_login_at ?? null,
      created_at: input.created_at ?? new Date().toISOString(),
      updated_at: input.updated_at ?? new Date().toISOString(),
    };
    db.data.users = [...(db.data.users || []), nuevo];
    save().then(() => res.status(201).json(nuevo));
  });
  app.patch('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const u = (db.data.users || []).find((x) => Number(x.user_id) === id);
    if (!u) return res.sendStatus(404);
    const {
      is_active,
      mfa_enabled,
      username,
      password_hash,
      first_name,
      last_name_p,
      last_name_m,
      initials,
      email,
      auth_provider,
      email_verified_at,
      avatar_url,
      bio,
      phone_number,
      azure_ad_object_id,
      upn,
      last_login_at,
      created_at,
      updated_at,
    } = req.body || {};
    if (typeof is_active === 'number') u.is_active = is_active ? 1 : 0;
    if (typeof is_active === 'boolean') u.is_active = is_active ? 1 : 0;
    if (typeof mfa_enabled === 'number') u.mfa_enabled = mfa_enabled ? 1 : 0;
    if (typeof mfa_enabled === 'boolean') u.mfa_enabled = mfa_enabled ? 1 : 0;
    if (typeof username === 'string') u.username = username;
    if (typeof password_hash === 'string') u.password_hash = password_hash;
    if (typeof first_name === 'string') u.first_name = first_name;
    if (typeof last_name_p === 'string') u.last_name_p = last_name_p;
    if (last_name_m !== undefined) u.last_name_m = last_name_m;
    if (initials !== undefined) u.initials = initials;
    if (typeof email === 'string') u.email = email;
    if (auth_provider !== undefined) u.auth_provider = auth_provider;
    if (email_verified_at !== undefined) u.email_verified_at = email_verified_at;
    if (avatar_url !== undefined) u.avatar_url = avatar_url;
    if (bio !== undefined) u.bio = bio;
    if (phone_number !== undefined) u.phone_number = phone_number;
    if (azure_ad_object_id !== undefined) u.azure_ad_object_id = azure_ad_object_id;
    if (upn !== undefined) u.upn = upn;
    if (last_login_at !== undefined) u.last_login_at = last_login_at;
    if (created_at !== undefined) u.created_at = created_at;
    u.updated_at = updated_at ?? new Date().toISOString();
    save().then(() => res.json(u));
  });
  app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    db.data.users = (db.data.users || []).filter((x) => Number(x.user_id) !== id);
    // remove user_roles rows for this user
    db.data.user_roles = (db.data.user_roles || []).filter((ur) => Number(ur.user_id) !== id);
    save().then(() => res.sendStatus(204));
  });

  // Roles
  app.get('/roles', (_req, res) => {
    res.json(db.data.roles || []);
  });
  app.post('/roles', (req, res) => {
    const input = req.body || {};
    const nextId = (() => {
      const nums = (db.data.roles || []).map((r) => (typeof r.role_id === 'number' ? r.role_id : 0));
      return (Math.max(0, ...nums) || 0) + 1;
    })();
    const role = {
      role_id: nextId,
      name: input.name,
      description: input.description ?? null,
    };
    db.data.roles = [...(db.data.roles || []), role];
    save().then(() => res.status(201).json(role));
  });
  app.patch('/roles/:id', (req, res) => {
    const id = Number(req.params.id);
    const r = findRoleById(id);
    if (!r) return res.sendStatus(404);
    const { name, description } = req.body || {};
    if (typeof name === 'string') r.name = name;
    if (description !== undefined) r.description = description;
    save().then(() => res.json(r));
  });
  app.delete('/roles/:id', (req, res) => {
    const id = Number(req.params.id);
    db.data.roles = (db.data.roles || []).filter((r) => {
      return Number(r.role_id) !== id;
    });
    // remove role relations
    db.data.role_permissions = (db.data.role_permissions || []).filter((rp) => Number(rp.role_id) !== id);
    db.data.user_roles = (db.data.user_roles || []).filter((ur) => Number(ur.role_id) !== id);
    save().then(() => res.sendStatus(204));
  });

  // Permissions
  app.get('/permissions', (_req, res) => {
    res.json(db.data.permissions || []);
  });
  app.post('/permissions', (req, res) => {
    const input = req.body || {};
    const nextId = (() => {
      const nums = (db.data.permissions || []).map((p) => Number(p.permission_id) || 0);
      return (Math.max(0, ...nums) || 0) + 1;
    })();
    const perm = {
      permission_id: nextId,
      permission_string: input.permission_string,
      resource: input.resource ?? null,
      scope: input.scope ?? null,
      action: input.action ?? null,
      description: input.description ?? null,
    };
    db.data.permissions = [...(db.data.permissions || []), perm];
    save().then(() => res.status(201).json(perm));
  });
  app.patch('/permissions/:id', (req, res) => {
    const id = Number(req.params.id);
    const p = (db.data.permissions || []).find((x) => Number(x.permission_id) === id);
    if (!p) return res.sendStatus(404);
    const { permission_string, resource, description, scope, action } = req.body || {};
    if (typeof permission_string === 'string') p.permission_string = permission_string;
    if (resource !== undefined) p.resource = resource;
    if (scope !== undefined) p.scope = scope;
    if (action !== undefined) p.action = action;
    if (description !== undefined) p.description = description;
    save().then(() => res.json(p));
  });
  app.delete('/permissions/:id', (req, res) => {
    const id = Number(req.params.id);
    db.data.permissions = (db.data.permissions || []).filter((x) => Number(x.permission_id) !== id);
    // Remove relations
    db.data.role_permissions = (db.data.role_permissions || []).filter((rp) => Number(rp.permission_id) !== id);
    save().then(() => res.sendStatus(204));
  });

  // Role-Permissions (virtual)
  app.get('/role_permissions', (_req, res) => {
    res.json(db.data.role_permissions || []);
  });
  app.post('/role_permissions', (req, res) => {
    const { role_id, permission_id } = req.body || {};
    const r = findRoleById(Number(role_id));
    if (!r) return res.status(400).json({ error: 'role not found' });
    const nextId = (() => {
      const nums = (db.data.role_permissions || []).map((rp) => Number(rp.id) || 0);
      return (Math.max(0, ...nums) || 0) + 1;
    })();
    const row = { id: nextId, role_id: Number(role_id), permission_id: Number(permission_id) };
    db.data.role_permissions = [...(db.data.role_permissions || []), row];
    save().then(() => res.status(201).json(row));
  });
  app.delete('/role_permissions/:id', (req, res) => {
    const id = Number(req.params.id);
    const before = db.data.role_permissions || [];
    const after = before.filter((rp) => Number(rp.id) !== id);
    if (before.length === after.length) return res.sendStatus(404);
    db.data.role_permissions = after;
    save().then(() => res.sendStatus(204));
  });

  // User-Roles (virtual, single role)
  app.get('/user_roles', (_req, res) => {
    res.json(db.data.user_roles || []);
  });
  app.post('/user_roles', (req, res) => {
    const { user_id, role_id } = req.body || {};
    const u = (db.data.users || []).find((x) => Number(x.user_id) === Number(user_id));
    if (!u) return res.status(400).json({ error: 'user not found' });
    const nextId = (() => {
      const nums = (db.data.user_roles || []).map((ur) => Number(ur.id) || 0);
      return (Math.max(0, ...nums) || 0) + 1;
    })();
    const row = { id: nextId, user_id: Number(user_id), role_id: Number(role_id) };
    db.data.user_roles = [...(db.data.user_roles || []), row];
    save().then(() => res.status(201).json(row));
  });
  app.delete('/user_roles/:id', (req, res) => {
    const id = Number(req.params.id);
    const before = db.data.user_roles || [];
    const after = before.filter((ur) => Number(ur.id) !== id);
    if (before.length === after.length) return res.sendStatus(404);
    db.data.user_roles = after;
    save().then(() => res.sendStatus(204));
  });

  const port = 3001;
  app.listen(port, () => {
    console.log(`Mock API running on http://localhost:${port}`);
  });
})();
