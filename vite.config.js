import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5300',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux']
  },

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // 🔧 Añadimos TS/TSX para evitar que Vitest intente correr stories
    exclude: [
      "node_modules/**",
      "**/*.stories.js",
      "**/*.stories.jsx",
      "**/*.stories.ts",
      "**/*.stories.tsx",
    ],
  },
});
