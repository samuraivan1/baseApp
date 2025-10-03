import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// Simple log to confirm MSW startup in dev console
export async function startWorker() {
  const instance = await worker.start({ onUnhandledRequest: 'bypass' });
  // eslint-disable-next-line no-console
  console.log('[MSW] worker started');
  return instance;
}
