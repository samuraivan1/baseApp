/** Respuesta genérica de API con datos tipados. */
export type ApiResponse<T> = {
  /** Datos resultantes de la operación. */
  data: T;
  /** Mensaje informativo u operativo. */
  message?: string;
  /** Código de error o estado opcional. */
  code?: string;
};

/** Respuesta paginada estandarizada. */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

