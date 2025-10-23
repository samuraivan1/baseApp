title: "Buenas Prácticas y Estilo de Código"
version: 1.0
status: active
last_sync: 2025-10-23
🧠 13. Buenas Prácticas y Estilo de Código
baseApp adopta un conjunto estricto de reglas para mantener un código limpio y coherente.

13.1 Reglas esenciales
Sin any, @ts-ignore o bloques vacíos.

Hooks siempre en orden.

Imports sin uso prohibidos.

Condicionales en JSX, no en lógica de hooks.

apiClient único y centralizado.

fetch y axios directos prohibidos.

No repetir lógica de error o toasts.

Textos en .messages.ts, no hardcodeados.

13.2 Ejemplo de patrón correcto
tsx

const handleCreate = async () => {
  const res = await apiCall(() => roleService.create(dto), {
    where: "security.roles.create",
    toastOnError: true,
  });
  if (res.ok) showToastSuccess("Rol creado");
};
13.3 Estilo SCSS
Un archivo por componente.

Variables globales (@use '@/styles/variables').

BEM para nombres.

No valores mágicos.

13.4 ESLint y Prettier
Reglas obligatorias: import/order, react-hooks/exhaustive-deps, no-unused-vars.

Ejecutar npm run lint antes de cualquier commit.

Formateo automático al guardar.
