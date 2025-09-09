import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    open: false,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Esta es la única configuración de 'test' que necesitamos
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // Excluimos los archivos de Storybook para que Vitest los ignore
    exclude: ["node_modules/**", "**/*.stories.jsx", "**/*.stories.js"],
  },
});
