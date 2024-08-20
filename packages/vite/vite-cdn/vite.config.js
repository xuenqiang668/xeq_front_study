import { defineConfig } from 'vite'
import viteCdnPlugin from 'vite-plugin-cdn-import'

export default defineConfig({
  plugins: [
    viteCdnPlugin({
      modules: [
        {
          name: 'lodash-es',
          var: '_',
          path: 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/debounce.min.js',
        },
      ],
    }),
  ],
})
