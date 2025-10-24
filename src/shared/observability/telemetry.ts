import errorService, { normalizeError } from '@/shared/api/errorService';
import api from '@/shared/api/apiClient';

export const telemetry = {
  async captureException(err: unknown, meta?: Record<string, unknown>) {
    try {
      const payload = { ...normalizeError(err, meta) };
      // Send to internal backend collector (can be routed to Loki/Otel later)
      // Use api instance baseURL; Vite proxy maps /api to backend
      await api.post('/client-logs', payload).catch(() => void 0);
    } catch {
      // fallback to local errorService queue/console
      errorService.logError(normalizeError(err, meta));
    }
  },
};

export default telemetry;
