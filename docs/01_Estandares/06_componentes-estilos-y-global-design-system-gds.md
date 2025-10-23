title: "Componentes, Estilos y Global Design System (GDS)"
version: 1.0
status: active
last_sync: 2025-10-23
🎨 6. Componentes, Estilos y Global Design System (GDS)
El Global Design System (GDS) define la base visual de baseApp:
colores, espaciado, tipografía, tamaños y comportamiento interactivo.

6.1 Principios
SCSS modular (un archivo por componente).

Convención BEM (bloque\_\_elemento--modificador).

Tokens CSS globales en :root.

Sin estilos globales invasivos.

Variables y mixins en src/styles/\_variables.scss y \_mixins.scss.

6.2 Estructura típica
css

/Button
├── Button.tsx
├── Button.scss
└── index.ts
scss

@use '@/styles/variables' as vars;

.button {
background: var(--color-primary);
border-radius: var(--radius-md);
height: 36px;
color: #fff;

&--secondary {
background: var(--color-neutral-200);
color: #333;
}
}
6.3 Tokens globales
Definidos en src/styles/\_variables.scss y expuestos al DOM:

scss

:root {
--color-primary: #f26822;
--color-bg: #ffffff;
--radius-md: 6px;
--spacing-sm: 8px;
--spacing-md: 16px;
--font-size-base: 14px;
}
Cada componente debe consumir estas variables, nunca valores hex o px directos.

6.4 Ejemplo real: UserProfileMenu
tsx

import "./UserProfileMenu.scss";
export const UserProfileMenu = () => (

  <div className="user-menu">
    <div className="user-menu__header">
      <span className="user-menu__name">Juan Pérez</span>
      <span className="user-menu__email">juan@empresa.com</span>
    </div>
  </div>
);
scss

.user-menu {
position: absolute;
background-color: var(--surface-white);
border-radius: var(--radius-md);
box-shadow: 0 4px 12px rgba(0,0,0,0.15);

&**header { padding: var(--spacing-sm); }
&**name { font-weight: 600; }
}
6.5 Uso de mixins
Los mixins en \_mixins.scss centralizan patrones comunes:

scss

@mixin flex-center {
display: flex;
align-items: center;
justify-content: center;
}
Uso:

scss

.app-bar\_\_toolbar {
@include flex-center;
}
6.6 Storybook
Todo componente del GDS (Button, Modal, Pagination) debe tener historia (\*.stories.tsx) en Storybook para documentación y pruebas visuales.
