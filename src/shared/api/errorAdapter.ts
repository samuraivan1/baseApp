export type ErrorAdapter = {
  captureException: (err: unknown, meta?: unknown) => Promise<void> | void;
  captureMessage?: (msg: string, meta?: unknown) => Promise<void> | void;
  setUser?: (user: { id?: number | string; email?: string; role?: unknown } | null) => void;
  flush?: () => Promise<void>;
  addBreadcrumb?: (crumb: { message: string; category?: string; data?: unknown }) => void;
};

export const consoleAdapter: ErrorAdapter = {
  captureException: (err, meta) => {
    // eslint-disable-next-line no-console
    console.error('[errorAdapter] captureException', err, meta);
  },
  captureMessage: (msg, meta) => {
    // eslint-disable-next-line no-console
    console.warn('[errorAdapter] message', msg, meta);
  },
  setUser: (user) => {
    // eslint-disable-next-line no-console
    console.info('[errorAdapter] setUser', user);
  },
  flush: async () => {
    // noop
  },
  addBreadcrumb: (crumb) => {
    // eslint-disable-next-line no-console
    console.debug('[errorAdapter] breadcrumb', crumb);
  },
};

