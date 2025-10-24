// Lightweight trace context utilities (uuidv7-based)
// Generates and stores a session-level trace id and propagates via Axios.

const TRACE_STORAGE_KEY = 'oa:trace:current_v1';

export function generateUuidV7(): string {
  // Pure TS UUID v4 fallback (not uuidv7) to avoid WebCrypto dependency.
  // Good enough for trace correlation; can be swapped later.
  let d = new Date().getTime();
  let d2 = (performance && performance.now && performance.now() * 1000) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getCurrentTraceId(): string | null {
  try {
    return localStorage.getItem(TRACE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function ensureTraceId(): string {
  let id = getCurrentTraceId();
  if (!id) {
    id = generateUuidV7();
    try {
      localStorage.setItem(TRACE_STORAGE_KEY, id);
    } catch {
      // ignore storage errors
    }
  }
  return id;
}

export function setTraceId(id: string) {
  try {
    localStorage.setItem(TRACE_STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

// Expose minimal accessor for errorService without import cycles
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// deno-lint-ignore no-explicit-any
interface OATraceExpose { getCurrentTraceId: () => string | null }
const g = globalThis as unknown as { __oaTrace?: OATraceExpose };
g.__oaTrace = { getCurrentTraceId };
