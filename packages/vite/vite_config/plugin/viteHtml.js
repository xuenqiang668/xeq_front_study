export default () => {
  let config
  return {
    name: 'vite-html-plugin',
    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },
    transformIndexHtml(html) {
      let titleKey = config.env.XEQ_TITLE

      return html.replace(/<title>(.*?)<\/title>/, `<title>${titleKey}</title>`)
    },
  }
}
