import { http, HttpResponse } from 'msw';

export const devHandlers = [
  // Simula un error de validación 422
  http.post('/api/dev/force-422', async () => {
    return HttpResponse.json(
      { message: 'Payload inválido (mock 422)' },
      { status: 422 }
    );
  }),
  // Simula 401 Unauthorized
  http.get('/api/dev/force-401', async () => {
    return HttpResponse.json(
      { message: 'No autorizado (mock 401)' },
      { status: 401 }
    );
  }),
  // Simula 403 Forbidden
  http.get('/api/dev/force-403', async () => {
    return HttpResponse.json(
      { message: 'Prohibido (mock 403)' },
      { status: 403 }
    );
  }),
  // Simula 404 Not Found
  http.get('/api/dev/force-404', async () => {
    return HttpResponse.json(
      { message: 'No encontrado (mock 404)' },
      { status: 404 }
    );
  }),
];

// ---- Mock Products CRUD ----
let PRODUCTS_DB: Array<{ product_id: number; name: string; price: number; description?: string | null }> = [
  { product_id: 1, name: 'Orange Widget', price: 49.99, description: 'Primer producto de ejemplo' },
  { product_id: 2, name: 'Alex Gadget', price: 79.5, description: 'Segundo producto de ejemplo' },
];
let NEXT_PRODUCT_ID = 3;

function resetProducts(seed?: typeof PRODUCTS_DB) {
  PRODUCTS_DB = seed
    ? [...seed]
    : [
        { product_id: 1, name: 'Orange Widget', price: 49.99, description: 'Primer producto de ejemplo' },
        { product_id: 2, name: 'Alex Gadget', price: 79.5, description: 'Segundo producto de ejemplo' },
      ];
  NEXT_PRODUCT_ID = (PRODUCTS_DB.at(-1)?.product_id ?? 0) + 1;
}

devHandlers.push(
  http.get('/api/products', async () => HttpResponse.json(PRODUCTS_DB, { status: 200 })),
  http.post('/api/products', async ({ request }) => {
    const body = await request.json().catch(() => ({} as any));
    if (!body || typeof (body as any).name !== 'string' || typeof (body as any).price !== 'number') {
      return HttpResponse.json({ message: 'Nombre y precio son obligatorios' }, { status: 422 });
    }
    const newProd = {
      product_id: NEXT_PRODUCT_ID++,
      name: (body as any).name,
      price: (body as any).price,
      description: (body as any).description ?? null,
    };
    PRODUCTS_DB.push(newProd);
    return HttpResponse.json(newProd, { status: 201 });
  }),
  http.put('/api/products/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json().catch(() => ({} as any));
    const idx = PRODUCTS_DB.findIndex((p) => p.product_id === id);
    if (idx === -1) return HttpResponse.json({ message: 'No encontrado' }, { status: 404 });
    if (body && typeof (body as any).name === 'string') PRODUCTS_DB[idx].name = (body as any).name;
    if (body && typeof (body as any).price === 'number') PRODUCTS_DB[idx].price = (body as any).price;
    if (body && 'description' in (body as any)) PRODUCTS_DB[idx].description = (body as any).description ?? null;
    return HttpResponse.json(PRODUCTS_DB[idx], { status: 200 });
  }),
  http.delete('/api/products/:id', async ({ params }) => {
    const id = Number(params.id);
    const before = PRODUCTS_DB.length;
    PRODUCTS_DB = PRODUCTS_DB.filter((p) => p.product_id !== id);
    if (PRODUCTS_DB.length === before) return HttpResponse.json({ message: 'No encontrado' }, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),
  http.post('/api/dev/products/reset', async () => {
    resetProducts();
    return new HttpResponse(null, { status: 204 });
  }),
  http.post('/api/dev/products/seed', async ({ request }) => {
    const body = await request.json().catch(() => null);
    if (!Array.isArray(body)) {
      return HttpResponse.json({ message: 'Formato inválido: se espera un arreglo' }, { status: 422 });
    }
    const normalized = (body as any[]).map((p, i) => ({
      product_id: typeof (p as any).product_id === 'number' ? (p as any).product_id : i + 1,
      name: String((p as any).name ?? ''),
      price: Number((p as any).price ?? 0),
      description: (p as any).description ?? null,
    }));
    resetProducts(normalized as any);
    return new HttpResponse(null, { status: 204 });
  })
);
