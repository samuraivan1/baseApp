---
title: "Prompts de Implementación y Validación por Fases — BaseApp Enterprise OSS v1.1"
author: "Iván Alejandro Méndez – Arquitectura EWM/TMS"
date: "2025-10-23"
version: "1.1"
status: "Documento Operativo de Ejecución"
scope: "Frontend + Backend + QA + Documentación"
purpose: "Implementar y validar paso a paso el plan Enterprise OSS asegurando cumplimiento con los estándares técnicos 2.7 (UI), 2.8 (API) y 2.9 (QA)."
---

# 📘 Prompts de Implementación — BaseApp Enterprise OSS v1.1

## 🧱 FASE P0 — ENDURECIMIENTO CRÍTICO

### 🔹 P0.1 — sys_monitor y trazabilidad end-to-end
Eres un Arquitecto de Software Senior especializado en observabilidad OSS.  
Tu objetivo es implementar en BaseApp un módulo interno `sys_monitor` que capture y correlacione errores FE/BE mediante `traceId` (uuidv7).

1️⃣ Crea el middleware backend `traceMiddleware` que:
   - Genere un `traceId` por request.
   - Lo adjunte a `req.traceContext` y lo propague en el header `x-trace-id`.
   - Inyecte el campo en logs y respuestas JSON.

2️⃣ Crea el interceptor Axios frontend `traceInterceptor` que:
   - Genere un `traceId` local si no existe.
   - Lo adjunte a todas las peticiones salientes.
   - Almacene temporalmente el trace en localStorage.

3️⃣ Implementa un cliente OSS de telemetría (`telemetry.captureException`) que:
   - Envíe los errores capturados a `/api/client-logs`.
   - Use OpenTelemetry o Axios estándar si no hay collector activo.

4️⃣ Valida:
   - Que cada request FE→BE incluya `x-trace-id`.
   - Que cada error registrado contenga el mismo traceId tanto en backend como en los logs FE.
   - Que no haya interferencia con MSW o TanStack Query.

---

### 🔹 P0.2 — Error Handling Unificado
Eres un especialista en manejo de errores empresariales en TypeScript.  
Refactoriza el sistema de errores de BaseApp para que todo error sea uniforme, rastreable y tipado.

1️⃣ Crea la clase `AppError` extendiendo `Error`, con los campos:
   - code (string)
   - message (string)
   - statusCode (number)
   - retryable (boolean)
   - traceId (string opcional)

2️⃣ Crea `errorCatalog.ts` con 10 códigos base (AUTH, SEC, VAL, NET, SAP, UNKNOWN).

3️⃣ Implementa `errorHandler.ts` que:
   - Reciba un `unknown` error.
   - Lo mapee usando `errorCatalog`.
   - Envíe log a `sys_monitor`.

4️⃣ Valida:
   - Simula un error 403 (Forbidden) y verifica que se genere AppError con código `SEC_403`.
   - Simula un timeout y verifica retry automático en 2 intentos.
   - Usa MSW para mockear y probar que el traceId se propaga correctamente.

---

### 🔹 P0.3 — Auditoría Centralizada
Eres un Ingeniero de Seguridad y Auditoría.  
Tu tarea es implementar un registro de auditoría completo en BaseApp, sincronizado con el `traceId` del sys_monitor.

1️⃣ Crea `auditService.ts` con métodos:
   - `log(audit, traceContext)` → POST `/api/audit-logs`
   - `list()` → GET `/api/audit-logs`

2️⃣ Implementa en backend la ruta `/api/audit-logs`:
   - Inserta registros con campos (userId, action, resource, resourceId, status, traceId, timestamp).
   - Usa BD `sys_db.audit_logs` o `tracking_events`.

3️⃣ Añade un hook React que:
   - Intercepte todas las mutaciones CRUD de TanStack Query.
   - En cada `onSuccess` llame `auditService.log()`.

4️⃣ Valida:
   - Crear, editar y borrar usuarios genera registros con traceId.
   - Las acciones aparecen listadas en `AuditLogViewer`.
   - El mismo traceId aparece en los logs de `sys_monitor`.

---

### 🔹 P0.4 — Design System 2.0 Base
Eres un Diseñador Front-End Senior con experiencia en Design Systems.  
Tu misión es crear el núcleo del OrangeAlex Design System v2.0 en BaseApp.

1️⃣ Crea carpeta `src/design-system/` con subcarpetas:
   - `/tokens` → colors, spacing, typography, shadows
   - `/archetypes` → List, Form, Card, Dialog, Wizard, Chart
   - `/playbook` → reglas UX (EWM_UX_RULES.md)

2️⃣ Extiende `tailwind.config.js` con los tokens.
3️⃣ Implementa un componente `ListArchetype` que use:
   - inputs 36px (h-9)
   - botones outline y ghost
   - tabla con hover + sort + paginación

4️⃣ Valida:
   - Que todos los tokens se apliquen sin sobrescribir estilos previos.
   - Que las clases Tailwind se generen correctamente (`npm run build:css`).
   - Renderiza el arquetipo en Storybook y ejecuta snapshot visual.

---

### 🔹 P0.5 — Tech Charter y Gobernanza
Eres un Arquitecto de Software y Documentación Técnica.  
Redacta el archivo `TECH_CHARTER.md` siguiendo el formato corporativo:

1️⃣ Secciones:
   - Visión Técnica
   - Árbol de decisiones arquitectónicas
   - Convenciones de nombrado
   - Política de ramas y commits
   - Definición de "DONE"
   - Matriz de responsabilidades

2️⃣ Integra las reglas de FSD y RBAC del proyecto BaseApp.
3️⃣ Incluye referencia a los estándares internos (2.7 UI, 2.8 API, 2.9 QA).
4️⃣ Valida:
   - Que todos los PR incluyan checklists derivados del Charter.
   - Que Husky bloquee commits fuera de convención.

---

### 🔹 P0.6 — Validación Integral QA
Eres QA Lead en un proyecto OSS.  
Valida que toda la fase P0 funcione correctamente.

1️⃣ Prueba de trazabilidad:
   - Ejecuta una acción CRUD (crear usuario).
   - Verifica que:
     - El errorHandler adjunte traceId.
     - sys_monitor reciba el evento.
     - audit_logs registre la acción con el mismo traceId.

2️⃣ Prueba visual:
   - Renderiza `ListArchetype` en Storybook.
   - Captura snapshot.
   - Verifica consistencia visual con tokens.

3️⃣ Prueba de pipeline:
   - Ejecuta `npm run test -- --coverage`.
   - Verifica cobertura ≥ 80%.
   - Revisa que Husky y commitlint bloqueen commits inválidos.

---

## 🌐 FASE P1 — ESCALAMIENTO UX Y CALIDAD CONTINUA

### 🔹 P1.1 — Componentes Empresariales
Eres un Ingeniero Front-End especializado en React Empresarial.  
Crea tres componentes basados en el Design System 2.0:

1️⃣ `DataTable` → soporta sort, paginación, filtros, export CSV.  
2️⃣ `AdvancedFilter` → filtros dinámicos persistidos por usuario.  
3️⃣ `PermissionsMatrix` → edición visual de permisos (click o drag).

Valida:
- Performance estable en 10k registros (usa react-window).  
- Cada componente cumple con reglas de UX del Playbook.  
- Todos los cambios visuales generan snapshot Storybook.

---

### 🔹 P1.2 — Internacionalización (i18n)
Eres especialista en internacionalización.  
Implementa i18next en BaseApp.

1️⃣ Configura `i18n/config.ts` con `es` y `en` como idiomas disponibles.  
2️⃣ Migra los textos de las pantallas `Security` y `Users`.  
3️⃣ Crea un `LanguageSwitcher` persistente en UI.

Valida:
- Que los textos cambien dinámicamente.  
- Que el idioma se conserve tras recargar (usa localStorage).  
- Que los mensajes de error también usen el sistema i18n.

---

### 🔹 P1.3 — Feature Flags (Unleash OSS)
Eres un Arquitecto de Integraciones.  
Integra feature flags usando Unleash OSS.

1️⃣ Despliega Unleash con Docker Compose.  
2️⃣ Implementa en backend middleware `featureFlagMiddleware`.  
3️⃣ Crea en frontend hook `useFeatureFlag(flagName)`.

Valida:
- Habilita/deshabilita `FEATURE_AUDIT_LOGS` y `FEATURE_I18N`.  
- Observa que el comportamiento cambie sin redeploy.  
- Registra cada cambio de flag en auditoría.

---

### 🔹 P1.4 — Testing BDD y Snapshots
Eres QA Automation Lead.  
Implementa BDD y snapshot testing para BaseApp.

1️⃣ Instala cucumber + vitest-cucumber + @vitest/ui.  
2️⃣ Crea archivo `features/auth.feature` con escenarios de login exitoso y fallido.  
3️⃣ Implementa los steps correspondientes con @testing-library/react.  
4️⃣ Añade snapshots de componentes críticos (Button, DataTable, LoginPage).

Valida:
- Que los escenarios Gherkin se ejecuten sin errores.  
- Que los snapshots sean coherentes con el Design System.  
- Que al modificar un componente, el snapshot alerte del cambio.

---

### 🔹 P1.5 — Validación Final de Escalamiento
Eres Arquitecto de QA y Performance.  
Verifica que la fase P1 cumpla las metas de escalabilidad y UX.

1️⃣ Mide el tiempo de renderizado inicial (LCP) y asegúrate de que no aumente con los nuevos componentes.  
2️⃣ Prueba la conmutación de idiomas (es/en) en tiempo real.  
3️⃣ Ejecuta los tests BDD completos (`npx vitest --ui`).  
4️⃣ Documenta la cobertura final en README (100% flujos críticos cubiertos).

Resultado esperado:
- UX consistente con DS 2.0.  
- i18n funcional.  
- Feature Flags operativos.  
- BDD + Snapshot validando estabilidad visual y lógica.

---

## ✅ FASE FINAL — AUDITORÍA DE ENTREGA
Eres Auditor Técnico de Arquitectura.  
Evalúa si la fase implementada cumple con los criterios definidos.

1️⃣ Verifica cumplimiento del estándar 2.7 (UI), 2.8 (API), 2.9 (QA).  
2️⃣ Comprueba consistencia entre Tech Charter, CI/CD y documentación.  
3️⃣ Ejecuta smoke tests en auth, permisos, auditoría y errores.  
4️⃣ Emite un informe de conformidad con score 0–100 en estabilidad, trazabilidad y UX.

Si el score <85, devuelve lista de remediaciones.  
Si el score ≥85, aprueba avance a la siguiente fase.

---

## 📈 RESULTADO ESPERADO
Con la ejecución de estos prompts, BaseApp alcanzará trazabilidad total, calidad controlada y estandarización visual, cumpliendo con las prácticas Enterprise OSS.
