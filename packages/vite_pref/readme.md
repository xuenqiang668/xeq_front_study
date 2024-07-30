## vite 新能指标饭分析

### 页面性能指标:和我们怎么去写代码有关

- 首屏渲染时:fcp(first content paint)，(first content paint -> 页面中第一个元素的渲染时长)
  - 懒加载:需要我们去写代码实现的
  - http 优化:协商缓存 和强缓存
  - 强缓存:服务端给响应头追加一些字段(expires)，客户端会记住这些字段，在 expires(截止失效时间)没有到达之前，无论你怎么刷新页面，浏览器都不会重新请求页面，而是从缓存里取
  - 协商缓存:是否使用缓存要跟后端商量一下，当服务端给我们打上协商缓存的标记以后，客户端在下次刷新页面需要重新请求资源时会发送一个协商请求给到服务端，服务端如果说需要变化 则会响应具体的内容，如果服务端觉得没变化则会响应 304 页面中最大元素的一个时长:lcp(largestcontentpaint)
- js 逻辑:

  - 我们要注意副作用的清除 组件是会频繁的挂载和卸载:如果我们在某一个组件中有计时器(setTimeout)，如果我们在卸载的时候不去清除这个计时器，下次再次挂载的时候计时器等于开了两个线程

  ```js
  const [timer,setTimer]=usestate(null);
  useEffect(()=>{
  setTimer(setTimeout(()=>{}));
  return()=>clearTimeout(timer);
  ```

  - 我们在写法上一个注意事项:requestAnimationFrame，requestIdleCallback 卡浏览器帧率 对浏览器渲染原理要有一定的认识 然后再这方面做优化
  - requestIdleCallback:传一个函数进去
  - 浏览器的帧率:16.6ms 去更新一次(执行 js 逻辑 以及重排重绘...)，假设我的 js 执行逻辑超过了 16.6 掉帧了
  - 我们要注意节流和防抖:防抖和节流是用来优化我们的代码的，防抖是指当我们触发事件后，在 n 秒内不再触发事件，节流是指在 n 秒内只触发一次事件
  - 我们要注意事件的绑定:addEventListener 绑定事件的时候，记得解绑事件，防止内存泄漏
  - 我们要注意图片懒加载:图片懒加载的原理是只加载当前可视区域的图片，这样可以提高页面的加载速度，但是也会带来一些问题，比如图片的闪烁，图片的加载顺序，图片的加载占用了浏览器的资源，图片的加载会影响页面的渲染速度
  - 我们要注意图片的压缩:图片的压缩可以减少网络传输的大小，提高页面的加载速度，但是也会带来一些问题，比如图片的质量下降，图片的压缩会影响图片的显示效果，图片的压缩会影响图片的加载速度
  - concurrent mode -> concurrency 可中断渲染 react 源码内容, 异步渲染的优化方案, 异步渲染的原理, 异步渲染的优缺点, 异步渲染的实现方案, 异步渲染的应用场景

- css
  - 关注继承属性
  - 不要过于深的 css 嵌套
- 构建优化
  - 减少打包体积:压缩代码，去除无用代码，tree shaking，按需加载
  - 减少请求数量:合并请求，减少请求数量，压缩代码，缓存
  - 减少请求时间:使用 CDN，使用缓存，压缩代码，减少请求数量
  - 减少渲染时间:使用虚拟 dom，使用骨架屏，使用懒加载，减少渲染时间
  - 减少内存占用:使用压缩算法，减少内存占用，使用缓存，使用 web worker，使用服务端渲染，使用预渲染，使用懒加载
  - 优化网络连接:使用压缩算法，减少请求数量，使用缓存，使用 CDN，使用预渲染，使用懒加载
  - 优化浏览器渲染:使用压缩算法，减少请求数量，使用缓存，使用 web worker，使用预渲染，使用懒加载
  - 优化数据库查询:使用缓存，使用预渲染，使用懒加载
  - 优化服务器资源:使用压缩算法，减少请求数量，使用缓存，使用 CDN，使用预渲染，使用懒加载

### 分包策略

- 对于第三方包，没有必要每次都将其打包到一个文件中，可以根据实际情况进行分包，比如按业务模块划分，或者按功能划分。
- 涉及到浏览器的协商缓存，第三方包打包之后一般情况不会发生变化，所有进行分包，利用浏览器的缓存策略，减少 http 请求，提高加载速度。
- vite 打包之所有会生成 hash 值，可以利用这个 hash 值来缓存文件，避免重复下载。
  - 注意：分包策略需要结合实际情况进行，不能盲目分包。
  - 在使用多入口的情况下，分包策略也需要注意。（but vite 做了很多处理，可以自动进行分包）

### 打包压缩 gzip

- 压缩 gzip 压缩可以减少网络传输的大小，提高页面的加载速度，但是也会带来一些问题，比如图片的质量下降，图片的压缩会影响图片的显示效果，图片的压缩会影响图片的加载速度。
- 压缩 gzip 压缩可以减少浏览器的内存占用，提高浏览器的渲染速度。
- 体积不大，不推荐 gzip 压缩，不然适得其反
- chunk -> 块
  - 从入口文件到他的一系列依赖最终打包成的 is 文件叫做块
  - 块最终会映射成 js 文件，但是块不是 js 文件

浏览器做的事

> 服务端读取 gzip 文件(.g2 后缀)设置一个响应头儿 content-encoding -->gzip(代表告诉浏览器该文件是使用 gzip 压缩过的)浏览器收到响应结果 发现响应头里有 gzip 对应字段，赶紧解压

### 动态导入

- 动态导入可以实现按需加载，可以减少 bundle 体积，提高页面的加载速度。

#### 原生 es6 的动态导入

```js
// 始终返回一个 promise 对象
import('./pages/home').then((module) => {
  const Home = module.default
  ReactDOM.render(<Home />, document.getElementById('root'))
})
```

```js
function import(path) {
  return return new Promise((resolve)=> {
  // vite用的es原生的动态导入 let const c++
  //不让他进入fullfilled状态
  //进入到对应路由时将webpack_require.e这个promise的状态设置为fullfilled 调用resolve
  //如果我从来没进入过home页面，我就让这个webpack_reguire.e永远在悬停(pending)状态
  //创造了一个promise.all 创建一个script标签 src指向home这个编译过后的js文件 webpack一早就把jsx代码编译过了只不过没有给浏览器
  //推到body里去就好了
  webpack_require.e().then(async ()=> {
  const result = await webpack_require(path)
  resolve(result.default)
  //当没有进入过某个页面或者组件的时候，我们让这个组件的代码放入一个script标签里 但是这个script标签不塞入到body里去//当进入这个页面时，我们将script标签塞入到整个body里去
  })
})
}
// 动态导入。
// 注意：动态导入的路径必须是编译后的路径，不能是源码路径。
// 并没有把文件加载进来，而是path匹配上了之后，执行函数，才加载文件，把编译过后的js文件加载进去
const route = [
  {
    path:'/home',
    component:()=>import('./pages/home')
  }
]
```

### 配置 cdn

```js
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
```

vite-plugin-cdn-import

> config, transformIndexHtml 生命周期来处理

- config: 获取到配置项：

  ```js
  ;[
    {
      name: 'lodash-es',
      var: '_',
      path: 'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/debounce.min.js',
      version: '4.17.21',
      pathList: [
        'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/debounce.min.js',
      ],
      cssList: [],
    },
  ]
  ```

  - （在 build 的时候 修改了 rollup 的配置项）

  ```js
  if (isBuild) {
    userConfig.build.rollupOptions.plugins = [externalGlobals(externalMap)]

     externalGlobals(externalMap) =  {
    name: 'rollup-plugin-external-globals',
    transform: [AsyncFunction: transform]
    }
    }
  ```

- transformIndexHtml: 处理 index.html 文件
  > 就是给 body 加 script 标签，把 cdn 的 js 文件加进去
