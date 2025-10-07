# Auditoría OrangeAlex — Manejo de Errores (FINAL)

Estado: Compliant v1.0 (pendientes menores)

## Cambios aplicados
- Núcleo de errores
  - src/shared/api/errorService.ts: agrega AppError + handleApiError.
  - Servicios envueltos con try/catch y throw handleApiError:
    - src/features/security/api/userService.ts
    - src/features/security/api/roleService.ts
    - src/features/security/api/permissionService.ts
    - src/features/security/api/relationsService.ts
- Hooks y onError
  - src/features/security/api/hooks/useEntityCrud.ts: onError en list/create/update/remove.
  - src/features/kanban/components/hooks/useKanbanBoard.ts: onError en query/mutation + registro.
  - src/features/shell/components/iniciales/responsiveAppBar/hooks/useMainMenu.ts: onError en query.
  - src/features/shell/components/iniciales/responsiveAppBar/hooks/useProfileMenu.ts: onError en query.
- i18n de errores
  - src/constants/errorMessages.ts
  - src/shared/utils/errorI18n.ts (mapAppErrorMessage)
  - Formularios:
    - src/features/auth/components/index.tsx (login): toasts con mapAppErrorMessage + info en SSO simulado.
    - src/features/security/components/Users/UserForm.tsx: toast de error con mapAppErrorMessage en submit.
    - src/features/security/components/Roles/RoleForm.tsx: onSubmit con try/catch y toast mapeado.
    - src/features/security/components/Permissions/PermissionForm.tsx: onSubmit con try/catch y toast mapeado.
- Eliminación de alert()
  - src/shared/components/ErrorBoundary/index.tsx: alert → toast.error + registro; añade botón Reintentar.
  - src/shared/components/dev/SeedResetButton.tsx: alert → toast.info.
  - src/features/kanban/components/components/Column/index.tsx: alert → toast.info.

## Validación esperada
- Errores de API muestran toasts coherentes (401, 403, 404, 422, red, unknown).
- No hay alertas nativas.
- ErrorBoundary captura, registra y permite reintentar.

## Pendientes / Mejora futura
- Helper opcional `useSafeMutation` y `showToastError` para evitar repetición.
- Internacionalización completa en mensajes de componentes donde aún se usan textos comunes (opcional).
- Ajustar colores de Toast al tema OrangeAlex via CSS si se requiere un look más preciso.

## Verificación (local)
- Ejecutar: `tsc --noEmit` (compilación TypeScript).
- Forzar fallos de red o 401/403/404/422 en endpoints para ver toasts.

