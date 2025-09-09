import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Configura el servidor de mocks con nuestros handlers
export const server = setupServer(...handlers);
