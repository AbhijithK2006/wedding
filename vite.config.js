import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ✅ Required for GitHub Pages
  base: "/wedding/",

  build: {
    chunkSizeWarningLimit: 1000,
    minify: "esbuild",

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },

  server: {
    open: true,
    port: 5173
  },

  preview: {
    port: 4173
  }
})