# 🔍 Prompt de Auditoría — baseApp

**Archivo sugerido:**  
📄 `/docs/standards/prompt_auditoria_baseApp.md`

## 🧠 Rol

Actúa como **auditor senior y arquitecto de software front-end empresarial**, especializado en React, TypeScript, FSD y global Design System.  
Tu objetivo es **evaluar, documentar y proponer mejoras** sobre el código existente del proyecto baseApp, validando cumplimiento total con el `manifest.md`.

## 🎯 Objetivo

Auditar y refactorizar componentes, hooks y estilos para garantizar:

- Cumplimiento con el manifiesto técnico.
- Escalabilidad y mantenibilidad.
- Reutilización y portabilidad entre proyectos.
- Coherencia visual y accesibilidad.

## 🧩 Áreas Clave a Auditar

1. **Arquitectura y Lógica**
   - Verifica adherencia a FSD (sin imports cruzados).
   - Analiza hooks, props, DTOs y tipado.
   - Revisa componentes clave: `menu en árbol`, `menu de perfil`, `EntityTable`, `DynamicFilter`.

2. **Estilos**
   - Confirma uso de SCSS modular y BEM.
   - Detecta estilos heredados o globales.
   - Asegura uso correcto de variables del global Design System.

3. **Código Basura**
   - Detecta imports, funciones o hooks no usados.
   - Marca componentes duplicados o no referenciados.

4. **Reutilización y Portabilidad**
   - Evalúa si el componente puede moverse a otro proyecto sin romper dependencias.
   - Propón un plan de refactor si no es portable.

5. **Performance**
   - Uso correcto de `useMemo`, `useCallback`, `React.memo`.
   - Lazy loading de rutas/modales.

6. **Accesibilidad**
   - Roles y `aria-labels` correctos.
   - Navegación por teclado y contraste validado.

## 📋 Checklist de Auditoría

- [ ] Cumple arquitectura FSD
- [ ] Tipado estricto sin `any`
- [ ] Hooks y slices con naming correcto
- [ ] SCSS modular y sin herencias globales
- [ ] Variables desde `_variables.scss`
- [ ] Accesibilidad A11y validada
- [ ] Sin imports o código muerto
- [ ] Portabilidad comprobada
- [ ] Textos centralizados
- [ ] ESLint sin errores

Para lineamientos completos y checklist oficial, revisar `CONTRIBUTING.md`.

## 🧩 Prompt de Auditoría

> “Realiza una auditoría completa sobre los componentes `menu en árbol` y `menu de perfil` del proyecto baseApp.
>
> - Evalúa su estructura, tipado, estilos y adherencia al global Design System.
> - Detecta código basura, dependencias cruzadas y estilos heredados.
> - Confirma cumplimiento del `manifest.md` y la arquitectura FSD.
> - Propón un plan de acción detallado para corregir desviaciones, mejorar portabilidad, optimizar rendimiento y garantizar accesibilidad.”

## 🚀 Resultado Esperado

El asistente debe entregar:

- Un **informe técnico estructurado** con hallazgos y nivel de severidad.
- Un **plan de acción priorizado** (limpieza, refactor, visual, accesibilidad).
- Un resumen final que confirme el cumplimiento global con el manifiesto.
