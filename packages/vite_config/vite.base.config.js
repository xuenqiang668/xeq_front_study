import { defineConfig } from 'vite'
import path from 'path'
import postcssPresetEnv from 'postcss-preset-env'
import viteAlias from './plugin/viteAlias'
import viteHtml from './plugin/viteHtml'

const globalModulePath = path.resolve(__dirname, './vite_css/B.module.css')
export default defineConfig({
  optimizeDeps: {
    exclude: [],
  },
  plugins: [viteAlias(), viteHtml()],
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },
  envPrefix: 'XEQ_',
  css: {
    modules: {
      // css.modules 官方文档
      // https://cn.vitejs.dev/config/shared-options.html#css-modules

      //footer-content ->   footerContent
      localsConvention: 'camelCaseOnly',
      scopeBehaviour: 'local', // 是模块化还是全局的，默认是全局的，有hash是开启的模块化
      generateScopedName: '[name]__[local]--[hash:base64:5]', // 命名规则
      // generateScopedName: (name, filename, css) => {
      //   return name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase())
      // },
      globalModulePaths: [globalModulePath.replace(/\\/g, '/')], // 不想被vite处理的全局css文件
    },
    preprocessorOptions: {
      less: {
        math: 'always', // 处理css计算，default 处理带括号的()
        globalVars: {
          // 全局变量
          mainBg: 'red',
        },
      },
    },
    postcss: {
      plugins: [postcssPresetEnv()],
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          ramda: ['ramda'],
        },
        // 输出入口文件名
      },
    },
    assetsInlineLimit: 4096000, // 内联的最大体积，默认4096，单位字节，超过这个大小就不会内联
  },
})
