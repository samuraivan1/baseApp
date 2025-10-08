## Checklist de Estado

- [ ] Este cambio clasifica el estado en: Servidor / Global / Efímero
- [ ] Datos de servidor usan TanStack Query (`useQuery`/`useMutation`) con `isLoading`, `isError`, `error`, `data`
- [ ] No se duplica en Redux lo que ya provee Query
- [ ] Estado global crítico usa Redux Toolkit (`createSlice`, `createAsyncThunk` si aplica)
- [ ] Estado efímero de UI usa Zustand dentro de su feature
- [ ] Query keys semánticas (p. ej. `usersKeys.all`, `usersKeys.detail(id)`)
- [ ] Respetados barrels públicos de features (sin imports internos cruzados)
- [ ] Hooks/stores documentados con JSDoc
 - [ ] Reglas seguidas según `docs/DEVELOPER_GUIDE.md`

## Descripción

## Notas de migración
