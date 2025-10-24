// src/services/errorService.ts
/**
 * errorService: centraliza la captura y envío de errores.
 * - Mantiene una cola local.
 * - Provee adapter para Sentry o cualquier backend.
 * - Exporta helpers: logError, captureBreadcrumb, setUser, flushQueue.
 */

export type NormalizedError = {
  status?: number | null;
  code?: string | null;
  message: string;
  details?: unknown;
  timestamp: string;
  context?: Record<string, unknown>;
};

const QUEUE_KEY = 'app:errorQueue_v1';

type Breadcrumb = {
  message: string;
  category?: string;
  data?: unknown;
};

type ErrorAdapter = {
  captureException: (err: unknown, meta?: unknown) => Promise<void> | void;
  captureMessage?: (msg: string, meta?: unknown) => Promise<void> | void;
  setUser?: (user: { id?: number | string; email?: string; role?: unknown } | null) => void;
  flush?: () => Promise<void>;
  addBreadcrumb?: (crumb: Breadcrumb) => void;
} | null;

class ErrorService {
  private queue: NormalizedError[] = [];
  private adapterInitialized = false;
  private adapter: ErrorAdapter = null;

  constructor() {
    this.loadQueue();
  }

  private persistQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch {
      // no bloquear si storage falla
      console.warn('ErrorService: no se pudo persistir cola');
    }
  }

  private loadQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      if (raw) this.queue = JSON.parse(raw);
    } catch {
      this.queue = [];
    }
  }

  public setAdapter(adapter: NonNullable<ErrorAdapter>) {
    this.adapter = adapter;
    this.adapterInitialized = true;
    // al inicializar adapter intentamos flush
    this.flushQueue();
  }

  public clearAdapter() {
    this.adapter = null;
    this.adapterInitialized = false;
  }

  public async flushQueue() {
    if (
      !this.adapterInitialized ||
      !this.adapter ||
      !this.adapter.captureException
    )
      return;
    while (this.queue.length > 0) {
      const e = this.queue.shift()!;
      try {
        await this.adapter!.captureException(e, { extra: { queued: true } });
      } catch {
        // si falla volvemos a push al inicio y salimos
        this.queue.unshift(e);
        break;
      }
    }
    this.persistQueue();
    // opcional: call adapter.flush()
    if (this.adapter && this.adapter.flush) {
      try {
        await this.adapter.flush();
      } catch {
        // noop: si flush falla, dejamos en cola para siguiente intento
      }
    }
  }

  public logError(e: NormalizedError) {
    // Normal: push to queue + try to send if adapter present
    this.queue.push(e);
    this.persistQueue();

    if (
      this.adapterInitialized &&
      this.adapter &&
      this.adapter.captureException
    ) {
      try {
        // fire-and-forget; si falla quedará en queue
        this.adapter.captureException(e);
      } catch {
        // noop: no bloquear si el adapter falla
      }
    } else {
      // fallback: console
      console.error('Logged error (queued):', e);
    }
  }

  public captureBreadcrumb(b: Breadcrumb) {
    // guardar en memory context; si adapter soporta breadcrumbs, enviarlo
    this.adapter?.addBreadcrumb?.(b);
    // also console for dev
    console.debug('Breadcrumb:', b);
  }

  public setUser(
    user: { id?: number | string; email?: string; role?: unknown } | null
  ) {
    if (this.adapter && this.adapter.setUser) {
      try {
        this.adapter.setUser(user);
      } catch {
        // noop
      }
    }
  }
}

const errorService = new ErrorService();
export default errorService;

/** Helpers para normalizar errores de axios u otros */
export function normalizeError(
  err: unknown,
  context?: Record<string, unknown>
): NormalizedError {
  const timestamp = new Date().toISOString();
  // Try to attach current traceId if present (sync import to avoid await)
  let contextWithTrace = context;
  try {
    // dynamic import avoided; use inline optional access via globalThis
    const mod = (globalThis as unknown as { __oaTrace?: { getCurrentTraceId?: () => string | null } }).__oaTrace;
    const traceId = mod?.getCurrentTraceId ? mod.getCurrentTraceId() : null;
    if (traceId) contextWithTrace = { traceId, ...(context || {}) };
  } catch { /* noop */ }
  if (!err) return { message: 'Error desconocido', timestamp, context: contextWithTrace };
  // Axios-like error detection (shape-based)
  const anyErr = err as Record<string, unknown>;
  const response = anyErr && typeof anyErr === 'object' ? (anyErr['response'] as Record<string, unknown> | undefined) : undefined;
  const request = anyErr && typeof anyErr === 'object' ? anyErr['request'] : undefined;
  const isAxiosLike = Boolean((anyErr && (anyErr['isAxiosError'] as boolean)) || response || request);
  if (isAxiosLike) {
    const status = (response?.['status'] as number | undefined) ?? null;
    const data = response?.['data'] as { message?: string; code?: string } | unknown;
    let message = (anyErr['message'] as string | undefined) || (status ? `HTTP ${status}` : 'HTTP error');
    const hasStringMessage = (v: unknown): v is { message: string } => {
      if (typeof v !== 'object' || v === null) return false;
      const m = (v as Record<string, unknown>).message;
      return typeof m === 'string';
    };
    if (hasStringMessage(data)) message = data.message;
    return {
      status,
      code:
        data && typeof data === 'object' && 'code' in data
          ? (data as { code?: string }).code ?? null
          : null,
      message,
      details: data ?? String(err),
      timestamp,
      context: contextWithTrace,
    };
  }
  // Generic error
  return {
    message:
      (anyErr && typeof anyErr === 'object' && typeof anyErr['message'] === 'string'
        ? (anyErr['message'] as string)
        : String(err)),
    details: err,
    timestamp,
    context: contextWithTrace,
  };
}

// AppError y manejador delgado para servicios
export interface AppError {
  message: string;
  code?: string | number;
  context?: string;
  timestamp: string;
}

export function handleApiError(error: unknown): AppError {
  const timestamp = new Date().toISOString();
  if (typeof error === 'object' && error && 'message' in (error as Record<string, unknown>)) {
    const maybeAxios = error as { response?: { data?: unknown; status?: number } };
    const status = maybeAxios?.response?.status as number | undefined;
    const msg = (maybeAxios?.response?.data as { message?: string } | undefined)?.message || (maybeAxios as unknown as { message?: string })?.message || 'Error de comunicación con el servidor.';
    return { message: msg, code: status, timestamp };
  }
  return { message: 'Error desconocido.', timestamp };
}
