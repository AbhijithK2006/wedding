import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Increase warning limit (prevents unnecessary warnings)
    chunkSizeWarningLimit: 1000,

    // Enable minification (default, but explicitly set)
    minify: "esbuild",

    // Split code for better loading performance
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
    // Faster local dev reload
    open: true,
    port: 5173
  },

  preview: {
    port: 4173
  }
})
