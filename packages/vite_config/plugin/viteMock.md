## 模拟简单版本的 vite-plugin-mock， 来应对在后端接口没有写好的情况下(一般大公司会用到)

### 创建插件

在创建 plugin 文件，创建 viteMock.js

```js
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
```

#### 创建 mock 文件夹

在创建 mockk 文件夹，创建 userList.js
[可以到官网查看写法 mock url](http://mockjs.com/)

```js
// 可以到官网查看写法
import mockjs from 'mockjs'

const data = mockjs.mock({
  'list|10': [
    {
      'id|+1': 1,
      name: '@cname',
      'age|1-100': 1,
      email: '@email',
      phone: /^1[34578]\d{9}$/,
      address: '@county(true)',
      createTime: '@datetime',
      updateTime: '@datetime',
    },
  ],
})

export default [
  {
    method: 'post',
    url: '/api/user',
    response: ({ body } = {}) => {
      return {
        code: 200,
        data: data.list,
        message: 'success',
      }
    },
  },
]
```

#### 最后在 vite.config.js 文件引入

```js
import viteMock from './plugin/viteMock'

export default defineConfig({
  plugins: [viteMock()],
})
```

#### 总结

- 代码很少，也很简单，需要了解一些 node 相关知识，but，现在 ai 很强大，配合 ai 可以很快看懂源码
