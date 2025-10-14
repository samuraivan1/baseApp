// eslint-disable-next-line import/no-internal-modules
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
