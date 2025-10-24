import React, { useEffect } from 'react';
import api from '@/shared/api/apiClient';
import { handleApiError } from '@/shared/api/errorService';

const expected = [
  'content-security-policy',
  'strict-transport-security',
  'x-content-type-options',
  'x-frame-options',
];

const SecurityHeadersCheck: React.FC = () => {
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(window.location.origin + '/', { withCredentials: true });
        expected.forEach((h) => {
          // Axios normaliza headers en minúsculas
          const headers = (res.headers || {}) as Record<string, string>;
          const v = headers[h] ?? null;
          if (!v) {
            if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_SECURITY === '1') {
              // eslint-disable-next-line no-console
              console.warn(`[SECURITY][headers] Falta cabecera: ${h}`);
            }
          }
        });
      } catch (error) {
        handleApiError(error);
      }
    })();
  }, []);
  return null;
};

export default SecurityHeadersCheck;
