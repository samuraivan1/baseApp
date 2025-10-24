export class AppError extends Error {
  code: string;
  statusCode: number | null;
  retryable: boolean;
  traceId?: string;
  details?: unknown;

  constructor(params: {
    message: string;
    code: string;
    statusCode?: number | null;
    retryable?: boolean;
    traceId?: string;
    details?: unknown;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.code = params.code;
    this.statusCode = params.statusCode ?? null;
    this.retryable = Boolean(params.retryable);
    this.traceId = params.traceId;
    this.details = params.details;
  }
}

export type ErrorContext = {
  where?: string;
  url?: string;
  [k: string]: unknown;
};

