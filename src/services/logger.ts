// En un futuro, aquí podrías inicializar un servicio externo como Sentry, Datadog, etc.
// import * as Sentry from "@sentry/react";
// Sentry.init({ dsn: "TU_DSN_DE_SENTRY" });

const logger = {
  /**
   * Registra un mensaje de información.
   * @param {string} message - El mensaje a registrar.
   * @param {object} [data] - Datos adicionales para incluir en el registro.
   */
  info: (message: string, data?: unknown): void => {
    console.info(`[INFO] ${message}`, data || '');
  },

  /**
   * Registra una advertencia.
   * @param {string} message - El mensaje de advertencia.
   * @param {object} [data] - Datos adicionales.
   */
  warn: (message: string, data?: unknown): void => {
    console.warn(`[WARN] ${message}`, data || '');
  },

  /**
   * Registra un error. En un futuro, esto enviaría el error a un servicio externo.
   * @param {Error} error - El objeto de error.
   * @param {object} [errorInfo] - Información adicional sobre el contexto del error.
   */
  error: (error: Error, errorInfo?: unknown): void => {
    console.error('[ERROR] Ha ocurrido un error:', {
      message: error.message,
      stack: error.stack,
      extraInfo: errorInfo || 'Sin información adicional',
    });
    // Futura integración con Sentry:
    // Sentry.withScope((scope) => {
    //   scope.setExtras(errorInfo);
    //   Sentry.captureException(error);
    // });
  },
};

export default logger;
