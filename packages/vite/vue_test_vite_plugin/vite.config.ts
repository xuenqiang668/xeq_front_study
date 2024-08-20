import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import markDownPlugin from '@xeq/vite_create_plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), markDownPlugin()],
})
