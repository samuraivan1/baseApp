export type CatalogEntry = {
  code: string;
  defaultMessage: string;
  retryable: boolean;
  severity?: 'info' | 'warn' | 'error' | 'fatal';
};

export const errorCatalog: Record<string, CatalogEntry> = {
  AUTH_401: { code: 'AUTH_401', defaultMessage: 'Sesión expirada o no autorizada.', retryable: false },
  SEC_403: { code: 'SEC_403', defaultMessage: 'Acceso denegado.', retryable: false },
  NOT_FOUND_404: { code: 'NOT_FOUND_404', defaultMessage: 'Recurso no encontrado.', retryable: false },
  VAL_422: { code: 'VAL_422', defaultMessage: 'Datos inválidos.', retryable: false },
  NET_0: { code: 'NET_0', defaultMessage: 'Fallo de red.', retryable: true },
  NET_TIMEOUT: { code: 'NET_TIMEOUT', defaultMessage: 'Tiempo de espera agotado.', retryable: true },
  API_5XX: { code: 'API_5XX', defaultMessage: 'Error del servidor.', retryable: true },
  SAP_001: { code: 'SAP_001', defaultMessage: 'Error SAP genérico.', retryable: false },
  UNKNOWN: { code: 'UNKNOWN', defaultMessage: 'Error desconocido.', retryable: false },
};

export function resolveCatalog(code: string): CatalogEntry {
  const found = (errorCatalog as Record<string, CatalogEntry | undefined>)[code];
  return found ?? errorCatalog.UNKNOWN;
}
