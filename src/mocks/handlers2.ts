import { rest } from 'msw';
const API = 'http://localhost:3001';

export const handlers = [
  rest.get(`${API}/roles`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { id: 1, nombre: 'Super Administrador', descripcion: 'Acceso total', permisos: ['page:home:view'] }
    ]));
  }),
  rest.get(`${API}/permisos`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([
      { id: 'page:home:view', description: 'Ver Home' }
    ]));
  }),
  rest.get(`${API}/usuarios`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
  rest.post(`${API}/roles`, (req, res, ctx) => {
    const body = req.body;
    return res(ctx.status(201), ctx.json({ id: 99, ...body }));
  }),
  rest.put(`${API}/roles/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const body = req.body;
    return res(ctx.status(200), ctx.json({ id: Number(id), ...body }));
  }),
  rest.delete(`${API}/roles/:id`, (req, res, ctx) => res(ctx.status(200))),
];
