// src/services/errorService.ts
/**
 * errorService: centraliza la captura y envío de errores.
 * - Mantiene una cola local.
 * - Provee adapter para Sentry o cualquier backend.
 * - Exporta helpers: logError, captureBreadcrumb, setUser, flushQueue.
 */

type NormalizedError = {
  status?: number | null;
  code?: string | null;
  message: string;
  details?: any;
  timestamp: string;
  context?: Record<string, any>;
};

const QUEUE_KEY = 'app:errorQueue_v1';

class ErrorService {
  private queue: NormalizedError[] = [];
  private adapterInitialized = false;
  private adapter: {
    captureException: (err: any, meta?: any) => Promise<void> | void;
    captureMessage?: (msg: string, meta?: any) => Promise<void> | void;
    setUser?: (user: any) => void;
    flush?: () => Promise<void>;
  } | null = null;

  constructor() {
    this.loadQueue();
  }

  private persistQueue() {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      // no bloquear si storage falla
      console.warn('ErrorService: no se pudo persistir cola', e);
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

  public setAdapter(adapter: any) {
    this.adapter = adapter;
    this.adapterInitialized = true;
    // al inicializar adapter intentamos flush
    this.flushQueue();
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
      } catch (err) {
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
      } catch {}
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
        // no bloquear
      }
    } else {
      // fallback: console
      console.error('Logged error (queued):', e);
    }
  }

  public captureBreadcrumb(b: {
    message: string;
    category?: string;
    data?: any;
  }) {
    // guardar en memory context; si adapter soporta breadcrumbs, enviarlo
    if (this.adapter && (this.adapter as any).addBreadcrumb) {
      try {
        (this.adapter as any).addBreadcrumb(b);
      } catch {}
    }
    // also console for dev
    console.debug('Breadcrumb:', b);
  }

  public setUser(
    user: { id?: number | string; email?: string; role?: any } | null
  ) {
    if (this.adapter && this.adapter.setUser) {
      try {
        this.adapter.setUser(user);
      } catch {}
    }
  }
}

const errorService = new ErrorService();
export default errorService;

/** Helpers para normalizar errores de axios u otros */
export function normalizeError(err: any, context?: any): NormalizedError {
  const timestamp = new Date().toISOString();
  if (!err) return { message: 'Error desconocido', timestamp, context };
  // Axios error detection
  const isAxios = err.isAxiosError || !!(err.response || err.request);
  if (isAxios) {
    const status = err.response?.status ?? null;
    const data = err.response?.data;
    const message = data?.message || err.message || `HTTP ${status}`;
    return {
      status,
      code: data?.code || null,
      message,
      details: data || err.toString(),
      timestamp,
      context,
    };
  }
  // Generic error
  return {
    message: err.message || String(err),
    details: err,
    timestamp,
    context,
  };
}
