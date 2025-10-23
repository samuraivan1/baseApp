title: "CI/CD, Control de Calidad y Auditorías"
version: 1.0
status: active
last_sync: 2025-10-23
🧮 15. CI/CD, Control de Calidad y Auditorías
Los pipelines aseguran que todo cambio cumpla los estándares técnicos.

15.1 Lint y tests automáticos
GitHub Actions ejecuta:

yaml

- run: npm ci
- run: npm run lint:ci
- run: npm run test -- --coverage
- run: npm run type-check
15.2 Auditorías automáticas
Resultados en docs/02_Auditorias/:

audit_frontend.md

audit_scss.md

audit_aliases_barriles_estilos.md

15.3 Reglas de aprobación
Cobertura mínima: 80%.

Linter sin errores.

Build exitoso.

Documentación actualizada (status: active).

15.4 Pipeline de release
main → build de producción.

Versionado SemVer (1.2.3).

Deploy automático a entorno interno.
