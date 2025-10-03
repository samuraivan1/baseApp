import React, { useEffect } from 'react';

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
        const res = await fetch(window.location.origin + '/', { method: 'GET', credentials: 'include' });
        expected.forEach((h) => {
          const v = res.headers.get(h);
          if (!v) {
            // eslint-disable-next-line no-console
            console.warn(`[SECURITY][headers] Falta cabecera: ${h}`);
          }
        });
      } catch {
        // noop
      }
    })();
  }, []);
  return null;
};

export default SecurityHeadersCheck;

