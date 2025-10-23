title: "Testing, QA y Auditoría"
version: 1.0
status: active
last_sync: 2025-10-23
🧪 11. Testing, QA y Auditoría
El sistema de calidad de baseApp se apoya en Vitest, React Testing Library y MSW.
Las pruebas se dividen por tipo y profundidad.

11.1 Pruebas unitarias
Para funciones puras y utilidades (utils, mappers).

Se ubican junto al código (*.test.ts).

Deben probar entradas y salidas, no implementaciones internas.

11.2 Pruebas de integración
Para hooks (useUsers, useRoles).

Se testean con MSW activado (mockServiceWorker.start()).

11.3 Pruebas de componentes
Usar React Testing Library (render, fireEvent, screen).

Evitar snapshots extensos.

Validar comportamiento, no estilos.

11.4 Auditorías automáticas
Scripts en CI validan:

npm run lint:ci

npm run test -- --coverage

npm run type-check

Los reportes se guardan en /docs/02_Auditorias/.

11.5 QA manual
Revisar accesibilidad (roles, labels, foco).

Validar flujo completo con mocks MSW.

Documentar incidentes en /docs/04_Logs/.
