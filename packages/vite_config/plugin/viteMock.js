import * as fs from 'fs'
import * as path from 'path'
import { normalizePath } from 'vite'
import url from 'node:url'

export default function viteMock() {
  let mockData = []
  return {
    name: 'vite-plugin-mock',
    enforce: 'pre',
    async configResolved(config) {
      // 在这个钩子里面其他读取到数据 然后合并到mockData中
      // 默认是mock文件夹，可以通过配置文件修改
      const mockPath = path.resolve(config.root, 'mock/')

      const files = fs.readdirSync(mockPath)

      let testData = []
      for (const file of files) {
        // 转换为file://文件路径 让import好读取文件内容
        const filePath = url.pathToFileURL(path.resolve(mockPath, file))
        const data = await import(filePath)
        testData.push(...data.default)
      }
      mockData = testData
    },
    // vite 生命周期钩子
    configureServer({ middlewares }) {
      middlewares.use((req, res, next) => {
        mockData.forEach((item) => {
          if (req.url.includes(item.url)) {
            const data = JSON.stringify(item.response())
            // 设置response header 不然会乱码
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            res.end(data)
            // 这儿需要retrun，不然会报错，原因是event Loop
            return
          }
          // 需要调用next()   这个中间件执行完成 流转到下一个中间件
          next()
        })
      })
    },
  }
}
