import { http, HttpResponse, HttpHandler } from 'msw';
import { ZodType, ZodObject, ZodRawShape } from 'zod';
import { db, nextId, persistDb, TableName, inferIdField } from '../data/db';
import { requireAuth, ensurePermission } from '../utils/auth';
import { requireCsrfOnMutation } from '../utils/csrf';

// Definición de la configuración para el CRUD factory
interface CrudFactoryConfig<T extends ZodType> {
  tableName: TableName;
  idField?: string;
  baseUrl?: string;
  permissions: {
    view: string;
    create: string;
    update: string;
    delete: string;
  };
  schema: T;
}

// Función para crear manejadores CRUD genéricos
export function createCrudHandlers<T extends ZodType>(
  config: CrudFactoryConfig<T>
): HttpHandler[] {
  const { tableName, permissions, schema } = config;
  const idField = config.idField ?? inferIdField(tableName);
  const baseUrl = config.baseUrl ?? `/api/${tableName}`;

  const getTable = <R extends Record<string, unknown>>() => db[tableName] as unknown as R[];

  return [
    // GET all
    http.get(baseUrl, ({ request }) => {
      const auth = requireAuth(request);
      if (auth instanceof HttpResponse) return auth;
      const denied = auth.user ? ensurePermission(auth.user.user_id, permissions.view) : new HttpResponse(null, { status: 401 });
      if (denied) return denied;
      return HttpResponse.json(getTable());
    }),

    // GET one
    http.get(`${baseUrl}/:id`, ({ request, params }) => {
      const auth = requireAuth(request);
      if (auth instanceof HttpResponse) return auth;
      const denied = auth.user ? ensurePermission(auth.user.user_id, permissions.view) : new HttpResponse(null, { status: 401 });
      if (denied) return denied;

      const id = Number(params.id);
      const item = getTable().find((i) => i[idField] === id);

      if (!item) {
        return new HttpResponse(null, { status: 404 });
      }
      return HttpResponse.json(item);
    }),

    // POST
    http.post(baseUrl, async ({ request }) => {
      const csrf = requireCsrfOnMutation(request);
      if (csrf) return csrf;
      const auth = requireAuth(request);
      if (auth instanceof HttpResponse) return auth;
      const denied = auth.user ? ensurePermission(auth.user.user_id, permissions.create) : new HttpResponse(null, { status: 401 });
      if (denied) return denied;

      const body = await request.json();
      const validation = schema.safeParse(body);

      if (!validation.success) {
        return HttpResponse.json({ error: validation.error.flatten() }, { status: 400 });
      }

      const newItem = {
        ...(validation.data as object),
        [idField]: nextId(tableName),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      getTable().push(newItem);
      persistDb();
      return HttpResponse.json(newItem, { status: 201 });
    }),

    // PUT
    http.put(`${baseUrl}/:id`, async ({ request, params }) => {
      const csrf = requireCsrfOnMutation(request);
      if (csrf) return csrf;
      const auth = requireAuth(request);
      if (auth instanceof HttpResponse) return auth;
      const denied = auth.user ? ensurePermission(auth.user.user_id, permissions.update) : new HttpResponse(null, { status: 401 });
      if (denied) return denied;

      const id = Number(params.id);
      const table = getTable();
      const itemIndex = table.findIndex((i) => i[idField] === id);

      if (itemIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      const body = await request.json();
      const partialSchema = (schema instanceof (ZodObject as unknown as new (shape: ZodRawShape) => ZodObject<ZodRawShape>)
        ? (schema as unknown as ZodObject<ZodRawShape>).partial()
        : schema);
      const validation = partialSchema.safeParse(body);

      if (!validation.success) {
        return HttpResponse.json({ error: validation.error.flatten() }, { status: 400 });
      }

      const updatedItem = {
        ...table[itemIndex],
        ...(validation.data as object),
        updated_at: new Date().toISOString(),
      };

      table[itemIndex] = updatedItem;
      persistDb();
      return HttpResponse.json(updatedItem);
    }),

    // DELETE
    http.delete(`${baseUrl}/:id`, ({ request, params }) => {
      const csrf = requireCsrfOnMutation(request);
      if (csrf) return csrf;
      const auth = requireAuth(request);
      if (auth instanceof HttpResponse) return auth;
      const denied = auth.user ? ensurePermission(auth.user.user_id, permissions.delete) : new HttpResponse(null, { status: 401 });
      if (denied) return denied;

      const id = Number(params.id);
      const table = getTable();
      const itemIndex = table.findIndex((i) => i[idField] === id);

      if (itemIndex === -1) {
        return new HttpResponse(null, { status: 404 });
      }

      table.splice(itemIndex, 1);
      persistDb();
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
