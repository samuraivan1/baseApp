import crypto from 'crypto';

import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';

type TraceRequest = Request & { traceContext?: { id: string } };

function uuidv7Fallback(): string {
  // use RFC4122 v4 fallback; in production prefer a uuidv7 lib
  return crypto.randomUUID();
}

// traceMiddleware: ensures a trace id per request and propagates it
export function traceMiddleware(req: TraceRequest, res: Response, next: NextFunction) {
  const incoming = (req.headers['x-trace-id'] as string) || '';
  const traceId = incoming && typeof incoming === 'string' ? incoming : uuidv7Fallback();
  req.traceContext = { id: traceId };
  res.setHeader('x-trace-id', traceId);
  // decorate res.json to include traceId field for easier debugging
  const originalJson = res.json.bind(res);
  res.json = (body?: unknown) => {
    try {
      if (body && typeof body === 'object' && body !== null && !('traceId' in (body as Record<string, unknown>))) {
        body = { ...(body as Record<string, unknown>), traceId };
      }
    } catch { /* noop */ }
    return originalJson(body as Record<string, unknown>);
  };
  next();
}

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(traceMiddleware);

// Health
app.get('/api/health', (_req: TraceRequest, res: Response) => {
  res.json({ ok: true });
});

// FE telemetry collector
app.post('/api/client-logs', (req: TraceRequest, res: Response) => {
  const traceId = req.traceContext?.id;
  const payload = (req.body ?? {}) as unknown;
  // In real deployment, forward to Loki/OpenTelemetry collector here
  // For now, log to stdout with trace correlation
  // eslint-disable-next-line no-console
  console.error('[client-logs]', { traceId, payload });
  res.status(202).json({ accepted: true });
});

// Minimal in-memory audit logs as placeholder
interface AuditRecord {
  userId: string | number;
  action: string;
  resource: string;
  resourceId?: string | number;
  status?: string;
  traceId?: string;
  timestamp: string;
}

const auditStore: AuditRecord[] = [];

app.get('/api/audit-logs', (_req: Request, res: Response) => {
  res.json({ items: auditStore as AuditRecord[] });
});

app.post('/api/audit-logs', (req: TraceRequest, res: Response) => {
  const traceId = req.traceContext?.id;
  const now = new Date().toISOString();
  const { userId, action, resource, resourceId, status } = (req.body || {}) as Partial<AuditRecord> & Record<string, unknown>;
  if (userId == null || !action || !resource) {
    res.status(400).json({ message: 'Missing required fields', traceId });
    return;
  }
  const rec: AuditRecord = {
    userId: userId as string | number,
    action: action as string,
    resource: resource as string,
    resourceId,
    status,
    traceId,
    timestamp: now,
  };
  auditStore.push(rec);
  res.status(201).json({ ok: true, record: rec });
});

// Error handler to ensure trace propagation
type KnownError = { statusCode?: number; status?: number; message?: string; code?: string; stack?: string };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: TraceRequest, res: Response, _next: NextFunction) => {
  const traceId = req.traceContext?.id;
  const e = (err || {}) as KnownError;
  const status = e.statusCode || e.status || 500;
  const message = e.message || 'Internal Server Error';
  // eslint-disable-next-line no-console
  console.error('[server-error]', { traceId, status, message, details: (e.stack || e) });
  res.status(status).json({ message, code: e.code || null, traceId });
});

const port = process.env.PORT ? Number(process.env.PORT) : 5300;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
