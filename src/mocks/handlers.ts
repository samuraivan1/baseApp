import { usersHandlers } from './handlers/users';
import { rolesHandlers } from './handlers/roles';
import { permissionsHandlers } from './handlers/permissions';
import { relationsHandlers } from './handlers/relations';
import { menuHandlers } from './handlers/menu';
import { tableroHandlers as boardHandlers } from './handlers/tablero';
import { authHandlers } from './handlers/auth';
import { devHandlers } from './handlers/dev';
import { genericHandlers } from './handlers/generic';
import { configHandlers } from './handlers/config';
import { http } from 'msw';

export const handlers = [
  ...configHandlers,
  ...authHandlers,
  ...devHandlers,
  ...usersHandlers,
  ...rolesHandlers,
  ...permissionsHandlers,
  ...relationsHandlers,
  ...menuHandlers,
  ...boardHandlers,
  // Generic fallback: expone CRUD para cualquier colección de db.json via /api/:collection
  ...genericHandlers,
  // Dev-only catch-all logger: forward to network (no interception)
  http.all('*', ({ request }) => {
    try {
      if (typeof window !== 'undefined' && import.meta && import.meta.env && import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.debug('[MSW][passthrough]', request.method, new URL(request.url).pathname);
      }
} catch {
  // ignore
}
    // Use the special symbol to bypass mocking in MSW v2
    return undefined as unknown as never; // returning undefined lets MSW fall through to network
  }),
];
