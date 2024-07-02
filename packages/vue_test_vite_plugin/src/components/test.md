# Rollup：打造 NPM 包提高开发效率！

## 起步

### 1. rollup 与 webpack 区别

Rollup 更适合构建库和组件，追求更高的代码优化和性能；

Webpack 更适合构建复杂的应用，提供了更多的功能和灵活性。

### 2. 安装 Rollup

- 初始化 package.json
  - **yarn init -y**
- 安装 rollup
  - yarn add rollup -D
- 新建 src/foo.js

```js
export default 'hello world!'
```

- 新建 src/index.js

```js
import foo from './foo.js'
export default function () {
  console.log(foo)
}
```

- 修改 package.json

```json
"main": "dist/index.cjs.js",
"module": "dist/index.es.js",
"browser": "dist/index.umd.js",
"scripts": {
  "build": "rollup -c",
  "serve": "rollup -c -w"
},
```

-c：代表读取配置去打包，默认读取根目录下的 rollup.config.mjs

-w：代表了 watch 监听，调试的时候可以用

- 新建 rollup.config.mjs

```js
import { defineConfig } from 'rollup'
import pkg from './package.json' assert { type: 'json' } //断言导出json模块

export default defineConfig([
  {
    input: 'src/index.js', //入口文件
    output: [
      {
        file: pkg.main, //出口文件
        format: 'cjs', //打包成CommonJS模块
      },
      {
        file: pkg.module, //出口文件
        format: 'es', //打包成es module模块
      },
      {
        name: 'myUtils', //打包成UMD模式，需提供name
        file: pkg.browser, //出口文件
        format: 'umd', //打包成UMD模块
      },
    ],
  },
])
```

- 运行 yarn run build 进行打包，项目根目录会生成一个 dist 文件夹。
- 根目录新建 index.html 引入打包后的文件，进行测试

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 测试es module模块 -->
    <script type="module">
      import main from "./dist/index.es.js";
      main();
    </script>
    <!-- 测试umd模块 -->
    <script src="./dist/index.umd.js"></script>
    <script>
      window.myUtils();
    </script>
  </body>
</html>
```

提示：使用 esm 模块时，直接访问，浏览器会报跨域错误。

解决方式：安装 vscode 扩展 Live Server，然后使用 open with Live Server 打开。可以看到浏览器打印出两个 hello world!，至此使用 rollup 已打包成功。

## 插件

插件列表：[github.com/rollup/awes…](https://github.com/rollup/awesome)

rollup 有丰富的插件，可以让我们做更多的处理，这里列举常用的插件使用方式。

### 1. @rollup/plugin-json（处理 JSON 文件）

1. 安装
   `yarn add @rollup/plugin-json -D`
2. 修改 src/index.js 文件

```js
import { version } from '../package.json'

export default function () {
  console.log('version ' + version)
}
```

3. 在 rollup.config.mjs 文件中加入 JSON plugin

```js
import json from '@rollup/plugin-json'

export default defineConfig([
  {
    //...
    plugins: [json()],
  },
])
```

4. 用 yarn run build 运行 Rollup。dist/index.cjs.js 文件内容应该如下所示

```js
'use strict'

var version = '1.0.0'

function index() {
  console.log('version ' + version)
}

module.exports = index
```

结果中 JSON 文件已成功被处理，并且只导入了我们实际需要的数据 version，其他内容例如 name、devDependencies 都被忽略了。这就是 tree shaking 的作用

### 2. @rollup/plugin-terser（压缩文件）

1. 安装
   `yarn add @rollup/plugin-terser -D`

2. 修改 rollup.config.mjs

```js
import terser from '@rollup/plugin-terser'

export default defineConfig([
  {
    //...
    plugins: [terser()],
  },
])
```

3. 使用 yarn run build 进行打包，生成的打包文件将全部被压缩

### 3. @rollup/plugin-node-resolve（处理外部依赖）

1. 安装
   `yarn add @rollup/plugin-node-resolve -D`
2. 修改 rollup.config.mjs

```js
import resolve from '@rollup/plugin-node-resolve'

export default defineConfig([
  {
    //...
    plugins: [resolve()],
  },
])
```

3. 运行 yarn add lodash-es，安装 lodash-es 包进行测试
4. 修改 src/index.js

```js
import { add } from 'lodash-es' //引入第三方包

export default function () {
  console.log('sum ' + add(2 + 4))
}
```

5. 使用 yarn run build 打包。这里如果不使用@rollup/plugin-node-resolve，会报错：Uncaught TypeError: Cannot read properties of undefined (reading 'add')

### 4. @rollup/plugin-commonjs（将第三方包 CommonJS 转 ES）

1. 安装
   `yarn add @rollup/plugin-commonjs -D`
2. 修改 rollup.config.mjs

```js
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig([
  {
    //...
    plugins: [commonjs()],
  },
])
```

3. 运行 yarn add ms，安装 ms 包进行测试
4. 修改 src/index.js

```js
import ms from 'ms' //引入CommonJS类型包

export default function () {
  console.log(ms('2 days'))
}
```

5. 使用 yarn run build 进行打包

### 5. @rollup/plugin-alias（路径别名）

1. 安装
   `yarn add @rollup/plugin-alias -D`
2. 修改 rollup.config.mjs

```js
import alias from '@rollup/plugin-alias'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig([
  {
    //...
    plugins: [
      //之前的插件保留，在plugins数组末尾添加alias
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
      }),
    ],
  },
])
```

3. 新建 src/utils/index.js

```js
export function Add(a, b) {
  return a + b
}
```

4. 修改 src/index.js

```js
import { Add } from '@/utils'

export default () => {
  console.log(Add(1, 2))
}
```

5. 使用 yarn run build 进行打包

## 代码分割

### 1. 自动拆分代码块

rollup 对于使用 import()方式引入的文件，会自动将代码拆分成块，并以 chunk-[hash].js 的格式命名文件，其中[hash]是基于内容的哈希字符串。

由于 umd 模块不支持代码分割，并且打包后从一个文件变为一个文件夹，因此需要做一些调整

1. 修改 package.json

```json
"main": "dist/cjs",
"module": "dist/es",
```

2. 修改 rollup.config.mjs

```js
export default defineConfig([
  {
    //...
    output: [
      {
        dir: pkg.main, //出口文件夹
        format: 'cjs', //打包成CommonJS模块
      },
      {
        dir: pkg.module, //出口文件夹
        format: 'es', //打包成es module模块
      },
    ],
  },
])
```

3. 修改 src/index.js

```js
export default function () {
  import('./foo.js').then(({ default: foo }) => console.log(foo))
}
```

4. 运行 yarn run build
5. 修改 index.html，进行测试

```js
<!-- 测试es module模块 -->
<script type="module">
  import main from "./dist/es/index.js";
  main();
</script>
```

### 2. 显式拆分代码块

通过配置 output.manualChunks 显式地将模块拆分成单独的块。常用于拆分第三方包。

1. 修改 rollup.config.mjs

```js
export default defineConfig([
  {
    //...
    output: [
      {
        dir: pkg.main, //出口文件
        format: 'cjs', //打包成CommonJS模块
        manualChunks: {
          lodash: ['lodash-es'],
        },
      },
      {
        dir: pkg.module, //出口文件
        format: 'es', //打包成es module模块
        manualChunks: {
          lodash: ['lodash-es'],
        },
      },
    ],
  },
])
```

2. 修改 src/index.js

```js
import { add } from 'lodash-es'

export default function () {
  console.log('sum ' + add(2 + 4))
}
```

3. 使用 yarn run build 运行 Rollup，可以看到 lodash 已被拆分出来，形成一个单独的文件

## 使用 babel

将 es6 代码转 es5，以兼容旧版浏览器、特定的移动设备等

1. 安装

- @rollup/plugin-babel：在 Rollup 打包过程中使用 Babel 进行代码转换
- @babel/core：babel 核心库
- @babel/preset-env：将 ES6 转换为向后兼容的 JavaScript
- @babel/plugin-transform-runtime：处理 async，await、import()等语法关键字的帮助函数

```js
yarn add @rollup/plugin-babel -D
yarn add @babel/core -D
yarn add @babel/preset-env -D
yarn add @babel/plugin-transform-runtime -D
```

2. 修改 rollup.config.mjs

```js
import { babel } from '@rollup/plugin-babel'

export default defineConfig([
  {
    //...
    plugins: [
      babel({
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]],
      }),
    ],
  },
])
```

注意：如果使用了@rollup/plugin-commonjs，@rollup/plugin-commonjs 一定要在@rollup/plugin-babel 之前调用

```js
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

const config = {
  ...
  plugins: [
    commonjs(),
    babel(...)
  ],
};
```

3. 修改 src/index.js

```js
import foo from './foo'

export default () => {
  console.log(foo)
}
```

4. 使用 yarn run build 运行 Rollup，在 dist/es/index.js 文件已将 es6 转 es5

## 处理 Sass

### 1. 打包支持 sass 文件

rollup-plugin-postcss 默认集成了对 scss、less、stylus 的支持

1. 安装

```js
yarn add sass -D
yarn add postcss rollup-plugin-postcss -D
```

2. 修改 rollup.config.mjs

```js
import postcss from 'rollup-plugin-postcss'

export default defineConfig([
  {
    //...
    plugins: [postcss()],
  },
])
```

3. 新建 src/foo.scss

```js
$color: red;

body {
  background-color: $color;
  display: flex;
}
```

5. 使用 yarn run build 运行 Rollup，在 dist/es/index.js 中可以看到样式被打包了进去

### 2. css 加前缀

1. 安装
   `yarn add autoprefixer -D`
2. 更新 packages.json

```json
"browserslist": [
    "defaults",
    "not ie < 8",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ]
```

### 3. css 压缩

1. 安装
   ` yarn add cssnano -D`
2. 修改 rollup.config.mjs

```js
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default defineConfig([
  {
    //...
    plugins: [
      postcss({
        plugins: [autoprefixer(), cssnano()],
      }),
    ],
  },
])
```

### 4. 抽离单独的 css 文件

修改 rollup.config.mjs

```js
export default defineConfig([
  {
    //...
    plugins: [
      postcss({
        plugins: [autoprefixer(), cssnano()],
        extract: 'css/index.css',
      }),
    ],
  },
])
```

使用 yarn run build 运行 Rollup，在 dist/es 中可以看到样式已被拆分出去，单独在 css 文件夹下

## 处理 Typescript

### 1. typescript 插件

1. 安装
   `yarn add rollup-plugin-typescript2 typescript tslib -D`
2. 新建 src/bar.ts

```js
const str = 'hello ts!'

export default str
```

3. 修改 src/index.js

```js
import bar from './bar.ts'
import './foo.scss'

export default function () {
  console.log(bar)
}
```

4. 修改 rollup.config.mjs

```js
import typescript from 'rollup-plugin-typescript2'

export default defineConfig([
  {
    //...
    plugins: [typescript()],
  },
])
```

注意点：

1. 如果使用了@rollup/plugin-node-resolve，@rollup/plugin-node-resolve 要在 rollup-plugin-typescript2 之前调用

```js
const config = {
    ...
    plugins: [
      resolve(),
      typescript(...)
    ],
  };
```

2. 如果使用了@rollup/plugin-babel，需配置 babel 扩展

```js
import { DEFAULT_EXTENSIONS } from '@babel/core'

export default defineConfig([
  {
    //...
    plugins: [
      babel({
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]],
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'], //增加配置
      }),
    ],
  },
])
```

### 2. 导出类型声明文件

新建 tsconfig.json

```js
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ESNext",
    "declaration": true, //生成声明文件
    "outDir": "dist",
    "rootDir": "src"
  },
  "exclude": ["node_modules", "dist"]
}
```

tsconfig.json 配置会与 typescript()配置合并，并覆盖其默认配置

使用 yarn run build 运行 Rollup，在 dist/cjs 与 dist/es 下会分别生成一份 ts 声明文件

## 优化

### 1. 打包前清空原打包目录

1. 安装 rimraf 和 rollup-plugin-delete

```js
yarn add rimraf -D //删除打包目录
yarn add rollup-plugin-delete -D //设置要删除的文件或目录
```

2. 修改 rollup.config.mjs

```js
import { rimrafSync } from 'rimraf'
import del from 'rollup-plugin-delete'

rimrafSync('dist') // 删除打包目录

export default defineConfig([
  {
    //...
    plugins: [del({ targets: 'dist/*' })],
  },
])
```

### 2. 打包产物清除调试代码

1. 安装
   `yarn add @rollup/plugin-strip -D`
2. 修改 rollup.config.mjs

```js
import strip from '@rollup/plugin-strip'

export default defineConfig([
  {
    //...
    plugins: [strip()],
  },
])
```

3. 修改 src/index.js

```js
import bar from './bar.ts'
import './foo.scss'

export default function () {
  console.log(bar)
  document.querySelector('body').innerHTML = bar
}
```

使用 yarn run build 运行 Rollup，可以看到 console.log 部分的代码，在打包的时候已被删除

### original text

[original](https://juejin.cn/post/7267167108609310783#heading-6)
