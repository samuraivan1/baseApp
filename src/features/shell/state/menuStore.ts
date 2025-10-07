// src/store/menuStore.ts
import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// ✅ Por ahora no hay estado/acciones de menú definidos.
// Dejamos el store vacío hasta que se necesite.
// ⚠️ Pending review: Si quieres persistir preferencias de UI como
// 'sidebarCollapsed', puedes habilitar persist con localStorage.
// Ejemplo:
// export const useMenuStore = create(
//   persist(
//     () => ({ sidebarCollapsed: false }),
//     { name: 'ui:sidebar' }
//   )
// );

export const useMenuStore = create(() => ({}));
