# Auditoría de Manejo de Errores — Fase 1 (OrangeAlex)

Alcance: src/services, src/features, src/hooks, src/pages, src/components/ErrorBoundary

Leyenda:
- ✅ Correcto
- ⚠️ Advertencia
- ❌ Crítico

## Hallazgos

### Interceptores y servicios
- ✅ src/shared/api/apiClient.ts
  - Interceptores request/response presentes.
  - Manejo de refresh 401 y X-CSRF-Token.
  - Mejora futura: integrar handleApiError en rechazo global.

- ⚠️ src/shared/api/configService.ts:16
  - console.error directo. Recomendado enrutar por errorService + i18n.

- ✅ src/shared/api/errorService.ts
  - Servicio de cola y normalización.

- ⚠️ src/shared/api/logger.ts: consola en producción.
  - Estándar: silenciar en prod o enrutar a adapter.

### Hooks TanStack Query
- ⚠️ src/features/security/api/hooks/useEntityCrud.ts:19,21,26,31
  - useQuery/useMutation sin onError. Agregar toast + errorService.

- ⚠️ src/features/kanban/components/hooks/useKanbanBoard.ts:18,23
  - Falta onError en useQuery y useMutation (solo toast en mutate). Añadir.

- ⚠️ src/features/shell/components/iniciales/responsiveAppBar/hooks/useMainMenu.ts:16
  - useQuery sin onError (hay toast en catch). Estandarizar con onError.

- ⚠️ src/features/shell/components/iniciales/responsiveAppBar/hooks/useProfileMenu.ts:15
  - useQuery sin onError.

### Try/catch y alerts
- ❌ src/shared/components/ErrorBoundary/index.tsx:41
  - alert() en producción. Reemplazar por toast y errorService.

- ❌ src/shared/components/dev/SeedResetButton.tsx:10, Column/index.tsx:29
  - alert() en UI. Reemplazar por toast.

- ⚠️ src/index.tsx (bootstrap): try/catch con console.
  - Ajustar a errorService en prod.

### Formularios y toasts
- ⚠️ src/features/auth/components/index.tsx:49-70
  - Manejo de errores con mensaje crudo. Usar handleApiError + i18n.

- ⚠️ src/features/security/components/Users/UserForm.tsx:139-145
  - Catch genérico con toast fijo. Usar handleApiError para detalle.

### Otros
- ⚠️ src/shared/auth/useIdleLogout.ts:21
  - Usa toast; confirmar i18n y condición de uso.

## Resumen por severidad
- ❌ Críticos: 3
- ⚠️ Advertencias: 10
- ✅ Correctos: 3

## Recomendaciones inmediatas
- Crear src/services/errorService.ts con handleApiError y usarlo en servicios.
- Añadir onError estándar a useEntityCrud y hooks de queries.
- Reemplazar alert() por toast + registro en errorService.
- Centralizar mensajes en i18n (*.messages.ts) o errorMessages.

