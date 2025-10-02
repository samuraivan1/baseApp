import { configMessages, configLogContexts } from '@/shared/api/configService.messages';
interface AppConfig {
  API_BASE_URL: string;
}

let config: AppConfig;

export const loadConfig = async (): Promise<void> => {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(configMessages.loadError);
    }
    config = await response.json();
  } catch (error) {
    console.error(configLogContexts.loadError, error);
    // Opcional: Podrías tener una configuración por defecto como fallback
    config = {
      API_BASE_URL:
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
    };
  }
};

export const getConfig = (): AppConfig => {
  if (!config) {
    throw new Error(configMessages.notLoadedError);
  }
  return config;
};
