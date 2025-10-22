import { configMessages, configLogContexts } from '@/shared/api/configService.messages';
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';

export interface AppConfig {
  API_BASE_URL: string;
  // Extensible: agregar flags/cadenas según necesidades
  [key: string]: unknown;
}

let config: AppConfig | undefined;

export const loadConfig = async (): Promise<void> => {
  // 1) Intentar endpoint de API unificado
  try {
    const { data } = await api.get<AppConfig>('/config');
    config = normalizeConfig(data);
    return;
  } catch (error: unknown) {
    // Si es 404/501, hacer fallback; otros errores se registran y continúan a fallback
    try { handleApiError(error); } catch { /* swallow for fallback */ }
  }

  // 2) Fallback a asset público
  try {
    const res = await fetch('/config.json');
    if (!res.ok) throw new Error(configMessages.loadError);
    const json = (await res.json()) as AppConfig;
    config = normalizeConfig(json);
  } catch (error) {
    console.error(configLogContexts.loadError, error);
    // 3) Fallback final a variables de entorno/build
    config = normalizeConfig({
      API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
    });
  }
};

export const getConfig = (): AppConfig => {
  if (!config) throw new Error(configMessages.notLoadedError);
  return config;
};

function normalizeConfig(input: Partial<AppConfig>): AppConfig {
  const out: AppConfig = {
    API_BASE_URL: typeof input.API_BASE_URL === 'string' && input.API_BASE_URL.trim() !== ''
      ? input.API_BASE_URL
      : (import.meta.env.VITE_API_BASE_URL || '/api'),
  };
  // Merge extras sin pisar campos obligatorios
  Object.keys(input).forEach((k) => {
    if (k in out) return;
    (out as unknown as Record<string, unknown>)[k] = (input as Record<string, unknown>)[k];
  });
  return out;
}
