 // vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/restaurante-frontend/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  publicDir: 'public',  // Esto permite archvos estacticos
  server: {
    port: 5173
  }
})