export type CatalogEntry = {
  code: string;
  defaultMessage: string;
  retryable: boolean;
  severity?: 'info' | 'warn' | 'error' | 'fatal';
};

export const errorCatalog: Record<string, CatalogEntry> = {
  AUTH_401: { code: 'AUTH_401', defaultMessage: 'Sesión expirada o no autorizada.', retryable: false, severity: 'warn' },
  SEC_403: { code: 'SEC_403', defaultMessage: 'Acceso denegado.', retryable: false, severity: 'error' },
  NOT_FOUND_404: { code: 'NOT_404', defaultMessage: 'Recurso no encontrado.', retryable: false, severity: 'warn' },
  VAL_422: { code: 'VAL_422', defaultMessage: 'Datos inválidos.', retryable: false, severity: 'warn' },
  NET_0: { code: 'NET_0', defaultMessage: 'Fallo de red.', retryable: true, severity: 'error' },
  NET_TIMEOUT: { code: 'NET_TIMEOUT', defaultMessage: 'Tiempo de espera agotado.', retryable: true, severity: 'error' },
  API_5XX: { code: 'API_5XX', defaultMessage: 'Error del servidor.', retryable: true, severity: 'fatal' },
  SAP_001: { code: 'SAP_001', defaultMessage: 'Error SAP genérico.', retryable: false, severity: 'error' },
  UNKNOWN: { code: 'UNKNOWN', defaultMessage: 'Error desconocido.', retryable: false, severity: 'fatal' },
};

export function resolveCatalog(code: string): CatalogEntry {
  const found = (errorCatalog as Record<string, CatalogEntry | undefined>)[code];
  return (found ?? errorCatalog.UNKNOWN) as CatalogEntry;
}