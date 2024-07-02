import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: [],
  },
  envPrefix: 'XEQ_',
})
