// Utilidad para sanear HTML antes de usar dangerouslySetInnerHTML.
// Requiere instalar dompurify si decides usarla: `npm i dompurify`.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  try {
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  } catch {
    // Si DOMPurify no está disponible, devuelve el original (no recomendado en prod)
    return html;
  }
}

