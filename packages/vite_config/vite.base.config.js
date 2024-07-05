import { defineConfig } from 'vite'
import path from 'path'

const globalModulePath = path.resolve(__dirname, './vite_css/B.module.css')

export default defineConfig({
  optimizeDeps: {
    exclude: [],
  },
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
  },
})
