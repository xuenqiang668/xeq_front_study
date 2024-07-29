export default function vitePluginCycle() {
  return {
    name: 'vite-plugin-cycle',
    config(options) {},
    configureServer(server) {},
    transformIndexHtml(html) {},
    configResolved(config) {
      // 整个配置文件解析流程完全走完后的钩子
      // vite内部有一个配置文件
      // console.log(config)
    },
    // rollup插件钩子
    options(rollupOptions) {
      // rollupOptions {
      //   output: {
      //     chunkFileNames: 'static/js/[name]-[hash].js',
      //     entryFileNames: 'static/js/[name]-[hash].js',
      //     assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
      //     manualChunks: { ramda: [Array] }
      //   }
      // }
      console.log('rollupOptions', rollupOptions)
    },
  }
}
