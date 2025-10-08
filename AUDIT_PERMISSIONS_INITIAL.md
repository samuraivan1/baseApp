# Auditoría Inicial de Permisos - baseApp

**Fecha de Auditoría:** 07 de octubre de 2025
**Auditor:** GitHub Copilot (bajo estándar profesional)

## Conclusiones de la Fase 1: Análisis y Mapeo

Este documento resume el estado de los permisos en el proyecto `baseApp` antes de la refactorización. El objetivo es migrar todos los permisos al estándar profesional `dominio.recurso.acción`.

### Hallazgos Principales

1.  **Inconsistencia Grave**: Se identificaron al menos 4 formatos de permisos diferentes compitiendo entre sí, lo que dificulta el mantenimiento y la comprensión del sistema de seguridad.
2.  **Duplicidad de Permisos**: Múltiples permisos definen la misma regla de negocio con nombres distintos (p. ej., `page:seguridad_roles:view` y `role:system:view` ambos controlan la visualización de roles).
3.  **Permisos CRUD Ocultos**: Las constantes en el código fuente (`permissions.ts`, `routePermissions.ts`) solo definen permisos de visualización. Las operaciones de Crear, Actualizar y Eliminar (CRUD) están definidas únicamente en el mock `db.json` con un formato inconsistente.
4.  **Permisos Huérfanos**: Se encontró al menos un permiso (`form:contact:create`) que no parece estar conectado a ninguna funcionalidad principal del sistema.
5.  **Separación Artificial**: La distinción entre permisos de "página" (`page:*`) y de "entidad" (`entity:*` o similar) es innecesaria y confusa. El nuevo estándar unificará este concepto.

## Tabla de Mapeo de Permisos

La siguiente tabla detalla cada permiso identificado, su estado y su mapeo propuesto al nuevo estándar `dominio.recurso.acción`.

| Permiso Original | Ubicación(es) | Estatus | Mapeo a `dominio.recurso.acción` |
| :--- | :--- | :--- | :--- |
| `security.users.view` | `permissions.ts` | ✅ **Correcto** | `security.users.view` |
| `security.roles.view` | `permissions.ts` | ✅ **Correcto** | `security.roles.view` |
| `security.permissions.view` | `permissions.ts` | ✅ **Correcto** | `security.permissions.view` |
| `page:kanban:view` | `permissions.ts`, `routePermissions.ts` | ⚠️ Inconsistente | `kanban.board.view` |
| `page:home:view` | `routePermissions.ts`, `db.json` | ⚠️ Inconsistente | `home.dashboard.view` |
| `page:seguridad:view` | `routePermissions.ts`, `db.json` | ⚠️ Inconsistente | `security.overview.view` |
| `page:seguridad_usuarios:view` | `routePermissions.ts`, `db.json` | ⚠️ Inconsistente | `security.users.view` (duplicado) |
| `page:seguridad_roles:view` | `routePermissions.ts`, `db.json` | ⚠️ Inconsistente | `security.roles.view` (duplicado) |
| `page:seguridad_permisos:view` | `routePermissions.ts`, `db.json` | ⚠️ Inconsistente | `security.permissions.view` (duplicado) |
| `task:kanban:create` | `db.json` | ⚠️ Inconsistente | `kanban.tasks.create` |
| `task:kanban:edit` | `db.json` | ⚠️ Inconsistente | `kanban.tasks.update` |
| `task:kanban:delete` | `db.json` | ⚠️ Inconsistente | `kanban.tasks.delete` |
| `task:kanban:move` | `db.json` | ⚠️ Inconsistente | `kanban.tasks.move` |
| `task:kanban:assign` | `db.json` | ⚠️ Inconsistente | `kanban.tasks.assign` |
| `role:system:view` | `db.json` | ⚠️ Inconsistente | `security.roles.view` (duplicado) |
| `role:system:create` | `db.json` | ⚠️ Inconsistente | `security.roles.create` |
| `role:system:edit` | `db.json` | ⚠️ Inconsistente | `security.roles.update` |
| `role:system:delete` | `db.json` | ⚠️ Inconsistente | `security.roles.delete` |
| `user:system:view` | `db.json` | ⚠️ Inconsistente | `security.users.view` (duplicado) |
| `user:system:create` | `db.json` | ⚠️ Inconsistente | `security.users.create` |
| `user:system:edit` | `db.json` | ⚠️ Inconsistente | `security.users.update` |
| `user:system:delete` | `db.json` | ⚠️ Inconsistente | `security.users.delete` |
| `permission:system:view` | `db.json` | ⚠️ Inconsistente | `security.permissions.view` (duplicado) |
| `permission:system:create` | `db.json` | ⚠️ Inconsistente | `security.permissions.create` |
| `permission:system:edit` | `db.json` | ⚠️ Inconsistente | `security.permissions.edit` |
| `permission:system:delete` | `db.json` | ⚠️ Inconsistente | `security.permissions.delete` |
| `form:contact:create` | `db.json` | ❌ **Huérfano** | `contact.form.submit` (marcado para revisión) |

---

**Próximo Paso:** Iniciar la **Fase 2: Refactorización y Estandarización**, comenzando por la consolidación y corrección de las constantes de permisos en `src/features/security/constants/permissions.ts`.
