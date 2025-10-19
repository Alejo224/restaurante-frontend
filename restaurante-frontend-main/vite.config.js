// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/restaurante-frontend/', // 👈 Nombre de tu repositorio
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173
  }
})