import { http, HttpResponse } from 'msw';
import { db, inferIdField, nextId, persistDb } from '../data/db';
import { requireAuth } from '../utils/auth';
import type { TableName } from '../data/db';

type DbRow = Record<string, unknown>;
type DbCollection = DbRow[];

function getTable(name: string): DbCollection | null {
  const tableName = name as TableName;
  const table = db[tableName as TableName];
  if (Array.isArray(table)) {
    return table as DbCollection;
  }
  return null;
}

// NOTE: use '/api' prefix from the client; do not add non-prefixed aliases.
export const genericHandlers = [
  // GET /api/:collection
  http.get('/api/:collection', ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const table = getTable(String(params.collection));
    if (!table) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(table, { status: 200 });
  }),

  // GET /api/:collection/:id
  http.get('/api/:collection/:id', ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const col = String(params.collection);
    const table = getTable(col);
    if (!table) return new HttpResponse(null, { status: 404 });
    const idField = inferIdField(col as TableName);
    const id = Number(params.id);
    const row = table.find(
      (r) => Number(r[idField] as number | string | undefined) === id
    );
    if (!row) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(row, { status: 200 });
  }),

  // POST /api/:collection
  http.post('/api/:collection', async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const col = String(params.collection);
    const table = getTable(col);
    if (!table) return new HttpResponse(null, { status: 404 });
    const idField = inferIdField(col as TableName);
    const body = (await request.json()) as object;
    const idVal = nextId(col as TableName);
    const row: DbRow = { ...body, [idField]: idVal };
    table.push(row);
    persistDb();
    return HttpResponse.json(row, { status: 201 });
  }),

  // PUT /api/:collection/:id
  http.put('/api/:collection/:id', async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const col = String(params.collection);
    const table = getTable(col);
    if (!table) return new HttpResponse(null, { status: 404 });
    const idField = inferIdField(col as TableName);
    const id = Number(params.id);
    const body = (await request.json()) as object;
    const idx = table.findIndex(
      (r) => Number(r[idField] as number | string | undefined) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    table[idx] = {
      ...table[idx],
      ...body,
      [idField]: id,
    };
    persistDb();
    return HttpResponse.json(table[idx], { status: 200 });
  }),

  // PATCH /api/:collection/:id
  http.patch('/api/:collection/:id', async ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const col = String(params.collection);
    const table = getTable(col);
    if (!table) return new HttpResponse(null, { status: 404 });
    const idField = inferIdField(col as TableName);
    const id = Number(params.id);
    const body = (await request.json()) as object;
    const idx = table.findIndex(
      (r) => Number(r[idField] as number | string | undefined) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    table[idx] = {
      ...table[idx],
      ...body,
      [idField]: id,
    };
    persistDb();
    return HttpResponse.json(table[idx], { status: 200 });
  }),

  // DELETE /api/:collection/:id
  http.delete('/api/:collection/:id', ({ params, request }) => {
    const auth = requireAuth(request);
    if (auth instanceof HttpResponse) return auth;
    const col = String(params.collection);
    const table = getTable(col);
    if (!table) return new HttpResponse(null, { status: 404 });
    const idField = inferIdField(col as TableName);
    const id = Number(params.id);
    const idx = table.findIndex(
      (r) => Number(r[idField] as number | string | undefined) === id
    );
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    table.splice(idx, 1);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
