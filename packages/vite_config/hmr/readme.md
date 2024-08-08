# 前端构建工具 vite 进阶系列(五) -- vite 的热更新(HMR)机制的实践与原理

## 前言

热更新(HMR)机制无疑是开发者的福音，它能够在项目模块发生更改的时候，自动刷新页面，免去了手动刷新页面的操作，大大提高了开发效率，嗯？自动刷新页面，这里好像是有点说法不妥!自动对页面上的更改模块进行替换，以达到刷新页面数据的效果，这个效果是无感的。那么我们来一起研究一下它吧

## HMR API

框架通过集成插件`@vitejs-plugin-\*`来实现 HMR，我们暂且不说，这里我们主要来讲解一下关于纯 `JavaScript` 的 `HMR`，这里提供了 `HMR API`。还记得前面我们说过` import.meta` 这个对象上面有挂载很多方法，其中`.hot` 就是一个，那么 `HMR API` 就是通过`.hot` 来实现的。

## import.meta.hot.accept

这个方法在于监听自身模块或者其他模块的变更，从而启动 HMR

- 自身模块

```javascript
// 新建hmrTest.js
export const count = 0 // 改变为1，触发HMR
if (import.meta.hot) {
  import.meta.hot.accept((moduleId) => {
    console.log('热更新/////', moduleId.count)
  })
}
```

- 其他模块

```javascript
// 新建testHmrOther.js
export const kk = 0 // 更改为1，触发HMR

// 在index.js中导入，并监听
import './testHmrOther.js'
import.meta.hot.accept('./testHmrOther.js', (moduleId) => {
  console.log('其他模块的HMR/////', moduleId.kk)
})
```

## import.meta.hot.dispose

此模块用于清除自身或者其他模块因为更新 HMR 产生的副作用，比如 a 模块中写了一个定时器，每一秒打印数字，我们期望的是，此模块 HMR 之后，应当保持最初值启动程序。

```js
export let ll = 0

let info = {
  count: 0,
}

if (import.meta.hot) {
  import.meta.hot.accept()
}

setInterval(() => {
  info.count++
  console.log(info.count)
}, 1000)
```

> - 注意：`import.meta.hot.dispose` 必须在 `import.meta.hot.accept` 之后调用，否则不会生效。
> - 这样的副作用函数必须使用.dispose 进行清除，否则会造成内存泄漏。
> - 也就是此次 HMR 之后，虽然模块进行了替换，但是上一次定时器产生的闭包并没有释放掉，也就是说副作用没有清除掉，所以我们需要.dispose 来帮助我们。

```js
let timer = setInterval(() => {
  info.count++
  console.log(info.count)
}, 1000)

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // 清理副作用
    clearInterval(timer)
  })
}
```

但是，这样会导致，定时器状态直接重置为原始状态了，没有对现行的一个保存，所以我们需要借助于 data 参数来进行数据保存。

```js
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // 清理副作用
    clearInterval(timer)
  })

  info = import.meta.hot.data.info = {
    count: import.meta.hot.data.info ? import.meta.hot.data.info.count : 0,
  }
}
```

所以我们发现，在进行 HMR 之后，当前定时器的状态还得以保存，然后根据上一次的状态技术执行。

## import.meta.hot.invalidate

这个 api 用于让 HMR 失效，实现浏览器本地刷新。

```js
if (import.meta.hot) {
  import.meta.hot.accept((moduleId) => {
    console.log('测试dispose////', moduleId.ll)
    if (moduleId.ll > 10) {
      import.meta.hot.invalidate()
    }
  })
}
// 我们用ll的值去模拟，当ll的值大于10的话，再次保存就不会触发HMR了。
```

## 热更新的原理

1. 创建一个 websocket 服务端。 vite 执行 createWebSocketServer 函数，创建 webSocket 服务端，并监听 change 等事件。

```js
const { createServer } = await import('./server');
const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        optimizeDeps: { force: options.force },
        server: cleanOptions(options),
})
...
const ws = createWebSocketServer(httpServer, config, httpsOptions)
...
const watcher = chokidar.watch(
    // config file dependencies might be outside of root
    [path.resolve(root), ...config.configFileDependencies],
    resolvedWatchOptions,
)

watcher.on('change', async (file) => {
    file = normalizePath(file)
    ...
    // 热更新调用
    await onHMRUpdate(file, false)
})

watcher.on('add', onFileAddUnlink)
watcher.on('unlink', onFileAddUnlink)
...
```

2. 创建一个 client 来接收 webSocket 服务端的信息。

```js
const clientConfig = defineConfig({
  ...
  output: {
    file: path.resolve(__dirname, 'dist/client', 'client.mjs'),
    sourcemap: true,
    sourcemapPathTransform(relativeSourcePath) {
      return path.basename(relativeSourcePath)
    },
    sourcemapIgnoreList() {
      return true
    },
  },
})

```

`vite`会创建一个`client.mjs`文件，合并`UserConfig`配置，通过 `transformIndexHtml` 钩子函数，在转换 `index.html` 的时候，把生成 `client` 的代码注入到 `index.html` 中，这样在浏览器端访问 index.html 就会加载 `client` 生成代码，创建 `client` 客户端与 `webSocket` 服务端建立 `connect` 链接，以便于接受 `webScoket` 服务器信息。
。

3. 服务端监听文件变化，给 client 发送 message，通知客户端。同时服务端调用 onHMRUpdate 函数，该函数会根据此次修改文件的类型，通知客户端是要刷新还是重新加载文件。

```js
const onHMRUpdate = async (file: string, configOnly: boolean) => {
  if (serverConfig.hmr !== false) {
    try {
      // 执行热更新
      await handleHMRUpdate(file, server, configOnly)
    } catch (err) {
      ws.send({
        type: 'error',
        err: prepareError(err),
      })
    }
  }
}

 // 创建hmr上下文
 const hmrContext: HmrContext = {
    file,
    timestamp,
    modules: mods ? [...mods] : [],
    read: () => readModifiedFile(file), // 异步读取文件
    server,
  }
  // 根据文件类型来选择本地更新还是hmr，把消息send到client
 if (!hmrContext.modules.length) {
    if (file.endsWith('.html')) { // html文件不能被hmr
      config.logger.info(colors.green(`page reload `) + colors.dim(shortFile), {
        clear: true,
        timestamp: true,
      })
      ws.send({
        type: 'full-reload',  // 全量加载
        path: config.server.middlewareMode
          ? '*'
          : '/' + normalizePath(path.relative(config.root, file)),
      })
    } else {
     ...
    }
    return
  }

  // function updateModules
  if (needFullReload) { // 需要全量加载
    config.logger.info(colors.green(`page reload `) + colors.dim(file), {
      clear: !afterInvalidation,
      timestamp: true,
    })
    ws.send({
      type: 'full-reload', // 发给客户端
    })
    return
  }

  // 不需要全量加载就是hmr
  config.logger.info(
    colors.green(`hmr update `) +
      colors.dim([...new Set(updates.map((u) => u.path))].join(', ')),
    { clear: !afterInvalidation, timestamp: true },
  )
  ws.send({
    type: 'update',
    updates,
  })

```

所以这段代码阐述的意思就是：

- html 文件不参与热更新，只能全量加载。
- 浏览器客户端接收'full-reload'，表示启动本地刷新，直接刷新通过 http 请求，加载全部资源，这里做了协商缓存。
- 浏览器客户端接收'update'，表示启动 hmr，浏览器只需要去按需加载对应的模块就可以了。
