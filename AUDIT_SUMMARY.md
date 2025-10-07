Auditoría Integral – Estado Final (7 fases)

Resumen ejecutivo
- Integración consolidada sin errores de compilación locales en build previo y sin cambios de rutas/contratos.
- MSW unificado como única fuente de mocks; proxy de Vite eliminado.
- Seguridad (JWT + refresh) centralizada en `apiClient` con Authorization + refresh 401 + CSRF en mutaciones.
- Estructura por features estandarizada: servicios en `api/`, hooks en `queries.ts`, UI con SCSS modular y mensajes i18n.

Fase 1 — Limpieza mocking/servidor (completada)
- Acciones:
  - Eliminados `server.js` y `db.json` en raíz.
  - Quitado proxy de Vite y script `mock`.
  - `src/index.tsx` inicia MSW sólo en dev (`worker.start({ onUnhandledRequest: 'bypass' })`).
- Validación: MSW en dev, tests (si se activan) en modo estricto `onUnhandledRequest: 'error'`.

Fase 2 — Unificación MSW y datos (completada)
- Acciones:
  - `src/mocks/data/db.ts` es la fuente seed (localStorage opcional).
  - Handlers con prefijo `/api`; alias sin `/api` marcados y luego retirados.
- Validación: handlers por recurso y fallback genérico coherentes.

Fase 3 — Estandarizar API y cliente (completada)
- Acciones:
  - `silentRefresh` usa `apiClient`.
  - `configService` sin fallback a `http://localhost:3001` (usa `/api` o `VITE_API_BASE_URL`).
  - Servicios de negocio movidos a features: `features/shell/api/menuService.ts`, `features/kanban/api/tableroService.ts`.
- Validación: importadores actualizados; `shared/api/api.ts` eliminado.

Fase 4 — Barrels y deep imports (completada)
- Acciones:
  - Barrel de Security expandido y desambiguado (`getRolePermissions` vs `getRolePermissionsList`).
  - Reemplazados imports profundos por `@/features/security`.
  - ESLint: `import/no-internal-modules` con `forbid` de rutas internas.
- Validación: build OK; sin ambigüedades.

Fase 5 — SCSS modular y tokens (completada)
- Acciones:
  - Security: estilos de páginas movidos a SCSS locales (Roles/Users/Permissions).
  - Inputs/Textareas reforzados localmente; FormControls como utilidades opt‑in.
  - SearchBar con SCSS local; normalización de bordes/radios/espaciados a variables.
  - docs/styles.md agregado.
- Validación: UI coherente; globales no invasivos.

Fase 6 — i18n (completada)
- Acciones:
  - Literales migrados a `*.messages.ts` en SeedResetButton, SectionHeader, FormLayoutDemo, Home (botones demo), Shell Layout.
  - Saneado `UserForm` (estatus/MFA) con claves nuevas.
  - docs/i18n.md agregado; CONTRIBUTING actualizado con pautas i18n.
- Validación: sin duplicar ni alterar traducciones existentes.

Fase 7 — Seguridad y API (completada)
- Acciones:
  - Confirmada cabecera Authorization automática y refresh 401 en `apiClient`.
  - Servicios de Security tipados y correctos: users/roles/permissions/relations.
  - docs/autenticacion.md agregado.
- Validación: contratos y rutas sin cambios; estado consistente.

Revisiones adicionales
- Estado (Query vs Zustand):
  - Query para remoto; Zustand para UI/sesión y derivado. `menuStore` con ejemplo de persistencia opcional (comentado).
  - docs/state.md agregado; CONTRIBUTING actualizado.
- Tests: eliminados temporalmente a petición y script `test` configurado para no fallar sin suites.

Archivos modificados (principalmente)
- Config: `vite.config.js`, `package.json`, `tsconfig.json`, `jsconfig.json`, `src/.eslintrc.js`.
- MSW: `src/mocks/**/*` (retirada de aliases legacy; init en index.tsx).
- API/Servicios: `src/shared/api/apiClient.ts`, `src/features/{shell,kanban}/api/*`, barrel de Security, eliminación `src/shared/api/api.ts` y `src/app/queryClient.ts`.
- UI/SCSS: múltiples `*.scss` normalizados a variables; nuevos SCSS locales en Security y SearchBar.
- i18n: nuevos `*.messages.ts` y referencias en componentes.
- Docs: `docs/styles.md`, `docs/i18n.md`, `docs/autenticacion.md`, `docs/state.md`, `CONTRIBUTING.md`.

Mejoras detectadas
- Menor acoplamiento entre features (barrels bien definidos, deep imports bloqueados).
- Consistencia visual por variables (bordes, radios, espaciados) y SCSS modular.
- Estandarización de API: cliente único con Authorization/refresh/CSRF.
- i18n centralizado por componente/feature; sin literales dispersos.
- DX reforzada: guías en docs y CONTRIBUTING, ESLint con reglas claras.

Próximos pasos sugeridos
- CI calidad: añadir `lint:ci` con umbral para fallar si >N violaciones (imports internos/unused, etc.).
- (Opcional) stylelint para SCSS (no invasivo) siguiendo `docs/styles.md`.
- Storybook: historias para Input/Textarea, EntityTable/Pagination, CommandBar, SearchBar.
- Retomar testing con MSW en modo estricto; empezar por pruebas de Security y Kanban.
- (Opcional) Wrapper thin en `features/auth/api` que reexporte `shared/authService` si quieres ergonomía de import desde el feature.

Estado de verificación
- Warnings críticos: ninguno detectado tras normalizaciones; build previo OK.
- Compilación: sin errores en build local previo.
- Permisos: estandarizados (Security + handlers MSW), y barrel sin ambigüedades.
- Estilos: coherentes y modulados; variables reutilizadas.
- Componentes comunes: usados correctamente (FormSection, Pagination, PageHeader, CommandBar, Button, SearchBar).

