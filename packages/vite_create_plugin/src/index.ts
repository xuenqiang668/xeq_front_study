import { Plugin } from 'vite'
import * as fs from 'node:fs'
import * as path from 'node:path'
import MarkDownIt from 'markdown-it'
import { style } from './assets/juejin.style'

const md = new MarkDownIt()
export function transformMarkdown(mdText: string): string {
  return `
  <section class='article-content'>
    ${md.render(mdText)}
  </section>
`
}

const mdRelationMap = new Map<string, string>()

export default function markDownPlugin(): Plugin {
  const vueRE = /\.vue$/
  const markdownRE = /\<g-markdown.*\/\>/g

  const filePathRE = /(?<=file=("|')).*(?=('|"))/

  return {
    // 插件名称
    name: 'vite-plugin-markdown',
    // 插件执行顺序
    enforce: 'pre',

    handleHotUpdate(ctx) {
      const { file, modules, server } = ctx

      // 过滤非md文件
      if (path.extname(file) !== '.md') return
      // 找到引入md文件的vue文件
      const relationId = mdRelationMap.get(file) as string

      console.log('relationId: ', relationId, file, [...mdRelationMap.keys()])
      console.log(server.moduleGraph.getModulesByFile(relationId))

      // 找到该 vue 文件的 moduleNode
      const relationModule = [
        ...server.moduleGraph.getModulesByFile(relationId)!,
      ][0]

      // 通知客户端更新该 vue 文件
      server.ws.send({
        type: 'update',
        updates: [
          {
            type: 'js-update',
            path: relationModule.file!,
            acceptedPath: relationModule.file!,
            timestamp: new Date().getTime(),
          },
        ],
      })

      // 指定需要重新编译的模块
      return [...modules, relationModule]
    },

    // 处理.md 文件
    transform(code, id) {
      if (!vueRE.test(id) || !markdownRE.test(code)) return code

      const mdList = code.match(markdownRE) as string[]
      console.log(mdList)
      let transformCode = code
      mdList.forEach((md) => {
        // 匹配 markdown 文件目录
        const fileRelativePaths = md.match(filePathRE) as string[]
        if (fileRelativePaths.length === 0) return

        // markdown 文件路径
        const filePath = fileRelativePaths[0]
        // 找到当前vue文件所在目录
        const fileDir = path.dirname(id)

        // 根据当前 vue 文件的目录和引入的 markdown 文件相对路径，拼接出 md 文件的绝对路径
        const mdFilePath = path.resolve(fileDir, filePath)
        // 读取 md 文件内容
        const mdText = fs.readFileSync(mdFilePath, 'utf-8')
        // 转换 md 内容
        // 将 g-markdown 标签替换成转换后的 html 文本
        transformCode = transformCode.replace(md, transformMarkdown(mdText))

        // 记录引入当前 md 文件的 vue 文件 id
        mdRelationMap.set(mdFilePath.replace(/\\/g, '/'), id)
      })

      transformCode = `
        ${transformCode}
        <style scoped>
          ${style}
        </style>
      `

      // 将转换后的代码返回
      return transformCode
    },
  }
}
