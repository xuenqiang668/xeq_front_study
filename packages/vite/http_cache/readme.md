## 掘金：https://juejin.cn/post/7392104848974233640#heading-12

## http 简介

浏览器和服务器之间的通信是通过 http 协议，http 协议永远是客户端发起亲求，服务器会送响应，模型如下：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4d01ca8b2879412fa78d876ffd0f6f7e~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=jxopFjywoyS5nqJyVeluDpVzyCQ%3D)
http 报文就是浏览器和服务器通信时发送以及响应的数据块，浏览器向服务器请求数据，发送请求(req)报文，服务器向浏览器返回数据，返回响应(res)报文，报文信息主要分为两部分：

1. 报文头部：一些附加信息(cookie, 缓存信息)，与缓存相关的规则信息，均包含在头部
2. 数据主体部分，http 请求真正想要传输的数据内容

| 字段名称         | 字段属性 |
| ---------------- | -------- |
| Pragma           | 通用头   |
| Expires          | 响应头   |
| Cache-Control    | 通用头   |
| Last-Modified    | 响应头   |
| If-Modified-Sice | 请求头   |
| ETag             | 响应头   |
| if-None-Match    | 请求头   |

### http 缓存的分类

- http 缓存可以分为 2 大类，强制缓存（强缓存）和协商缓存，两类缓存规则不同，强缓存存在数据未失效情况下，不需要再和服务器发生交互，而协商缓存，需要进行判断是否可以使用缓存。
- 两类缓存规则可以同时存在，强制缓存优先级高于协商缓存，也就是说，当执行强制缓存的规则时，如果缓存生效，直接使用缓存，不再执行协商缓存。

### 原始模型

搭建一个简单的 express 服务，不加任何缓存信息头

```js
const express = require('express')
const app = express()
const port = 8080
const fs = require('fs')
const path = require('path')

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Document</title>
    </head>
    <body>
        Http Cache Demo
        <script src="/demo.js"></script>
    </body>
    </html>`)
})

app.get('/demo.js', (req, res) => {
  let jsPath = path.resolve(__dirname, './static/js/demo.js')
  let cont = fs.readFileSync(jsPath)
  res.end(cont)
})

app.listen(port, () => {
  console.log(`listen on ${port}`)
})
```

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/2e0f92b045db4666909d823e7f530bde~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=OcFCl7OaqvcCbxoVlQWHn3uI9jY%3D)
请求过程如下：

- 浏览器请求静态资源 demo.js
- 服务器读取磁盘文件 demo.js，返给浏览器
- 浏览器再次请求，服务器又重新读取磁盘文件 a.js，返给浏览器。
- 循环请求。。
- `看得出来这种请求方式的流量与请求次数有关，同时，缺点也很明显：`
- 浪费用户流量
- 浪费服务资源，服务器要读磁盘文件，然后发送文件到浏览器
- 浏览器要等待 js 下载并且执行后才能渲染页面，影响用户体验
- 接下来我们开始在头信息中添加缓存信息。

### 一、强制缓存

强制缓存分为两种请汇款，expires 和 cache-control

#### Expires

> Expires 的值是服务器告诉浏览器的缓存过期时间(GMT 时间，格林尼治时间)，即下一次请求时，如果浏览器的当前时间还没到达过期时间，即直接使用缓存数据，一下是 express 设置 Expires 响应头信息

```js
const dayjs = require('dayjs')
app.get('/demo.js', (req, res) => {
  let jsPath = path.resolve(__dirname, './static/js/demo.js')
  let cont = fs.readFileSync(jsPath)
  res.setHeader('Expires', getGLNZ())
  res.end(cont)
})

app.listen(port, () => {
  console.log(`listen on ${port}`)
})

function getGLNZ() {
  return (
    dayjs().add(2, 'm').format('ddd, DD MMM YYYY HH:mm:ss') +
    ' GMT+0800 (China Standard Time)'
  )
}
```

我们在 demo.js 中添加了一个 Expires 响应头，不过由于是格林尼治时间，所以通过 dayjs 转换一下。第一次请求的时候还是会向服务器发起请求，同时会把过期时间和文件一起返回给我们；但是当我们刷新的时候，才是见证奇迹的时刻：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/8e3ad6ab28694482aa8c59c3e2264be7~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=S6uB%2Bo8nwLC63bdKV0Qp%2Bv%2FDUQs%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/d763daeb396f4b4796728cb413cc61e4~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=Ds6UKWWi0lZCHGM6x7M4FOdQ8RU%3D)
可以看出文件是直接从缓存（memory cache）中读取的，并没有发起请求，我们再设置了过去时间为 2 分钟，2 分钟过后再次发起请求，

> 虽然这样添加缓存控制，节省流量，还是有几个问题

- 由于浏览器时间和服务器时间不同步，如果浏览器设置了一个很后的时间，过期时间一直没有用。
- 缓存过期后，不管文件有没有变化，服务器都会再次读取文件返回给浏览器
- 不过 Exoires 是 http1.0 的，现代浏览器默认是 1.1

#### Cache-Control

> 针对浏览器和服务器时间不同步，加入了新的缓存方案，这次服务器部署直接告诉浏览器过期时间，而是告诉一个相对时间 Cache-Control=10s 意思 10s 内，直接使用浏览器缓存

```js
app.get('/demo.js', (req, res) => {
  let jsPath = path.resolve(__dirname, './static/js/demo.js')
  let cont = fs.readFileSync(jsPath)
  // res.setHeader('Expires', getGLNZ()) // 设置过期时间
  res.setHeader('Cache-Control', 'public, max-age=120') // 设置缓存控制，相对时间
  res.end(cont)
})
```

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/53771e77a155473a9fed25b44feed52b~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=XeXTVovqx422X0uCi%2BEdmNqdsrk%3D)

### 协商缓存

> 强制缓存的弊端很明显，即每次都是根据时间来判断缓存是否过期，但是达到过期时间后，如果文件没有改动，再次获取文件就浪费资源了，协商缓存有两组报文结合使用

- Last-Modified 和 if-Modified-Since
- ETag 和 if-None-Match
  ![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/31e479e4a27a4f77bb32e108bc006c12~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=zTWG8142agH4%2FNnMnutF6gY%2FmAE%3D)

#### Last-Modified

> 为了节省服务器的资源，方案改进，浏览器和服务器协商，服务器每次返回文件的同时，告诉浏览器文件再服务器最近的修改时间

- 浏览器请求静态资源 demo.js
- 服务器读取自盘文件 demo.js,返回给浏览器，同时带上文件上一次修改时间 Last-Modified(GMT 标准格式)
- 当浏览器上的缓存文件过期时，浏览器带上请求头 If-Modified-Since（等于上一次请求的 Last-Modified）请求服务器
- 服务器比较请求头的 If-Modified-Since 的文件上次修改时间，如果一致就继续使用本地缓存（304），如果不一致就再次返回文件内容和 Last-Modified
- 循环。。。。
  code：

```js
// 协商缓存
let lastModified = status.mtime.toUTCString()
if (lastModified === req.headers['If-Modified-Since']) {
  res.writeHead(304, 'Not Modified')
  res.end()
} else {
  res.setHeader('Cache-Control', 'public, max-age=120')
  res.setHeader('Last-Modified', lastModified)
  res.writeHead(200, 'OK')
  res.end()
}
```

我们多次刷新页面，可以看到请求结果如下：

![last-modified-cache](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/f763eebce1274c1eaef36f2d3d319852~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=TEBJAFvrKZkC6MNLCSAG4JnPqZE%3D)

虽然这个方案比前面三个方案有了进一步的优化，浏览器检测文件是否有修改，如果没有变化就不再发送文件；但是还是有以下缺点：

- 由于 Last-Modified 修改时间是 GMT 时间，只能精确到秒，如果文件在 1 秒内有多次改动，服务器并不知道文件有改动，浏览器拿不到最新的文件
- 如果服务器上文件被多次修改了但是内容却没有发生改变，服务器需要再次重新返回文件。

#### ETag

为了解决文件修改时间带来的不精确问题，服务器和浏览器再次协商，这次不返回时间，返回文件的唯一标识 ETag，只有文件内容发生变化，ETag 才会改变。

- 浏览器请求静态资源 demo.js
- 服务器读取磁盘文件 demo.js, 返回给浏览器，同时带上文件唯一标识 ETag
- 当浏览器上的缓存文件过期，浏览器带上请求头 If-None-Match(等于上一次请求的 ETag)，请求服务器
- 服务器比较请求头里的 If-None-Match 和文件的 ETag，如果一致就继续使用本地缓存，304，如果不一致就再次返回文件内容和 ETag
- 循环，。。。。

```JS
// 添加ETag
  if (req.headers['If-None-Match'] === etag) {
    res.writeHead(304, 'Not Modified')
    res.end()
  } else {
    res.setHeader('ETag', etag)
    res.setHeader('Last-Modified', status.mtime.toUTCString())
    res.writeHead(200, 'OK')
    res.end(cont)
  }
```

请求结果如下：

![etag-cache](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6eec63fa6b2b4d1aa62ac3cbb2f42636~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMjY2NDg3MTkxNzgxOTE0MyJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722435059&x-orig-sign=5IKnma2eCZZvF%2FYk565JCup%2Fmho%3D)

# 一些额外的东西

在“遥远的”http1.0 时代，给客户端设定缓存方式可通过两个字段--Pragma 和 Expires。虽然这两个字段早可抛弃，但为了做 http 协议的向下兼容，你还是可以看到很多网站依旧会带上这两个字段。

## 关于 Pragma

当该字段值为`no-cache`的时候，会告诉浏览器不要对该资源缓存，即每次都得向服务器发一次请求才行。

```
 代码解读
res.setHeader('Pragma', 'no-cache') //禁止缓存
res.setHeader('Cache-Control', 'public,max-age=120') //2分钟
```

通过 Pragma 来禁止缓存，通过 Cache-Control 设置两分钟缓存，但是重新访问我们会发现浏览器会再次发起一次请求，说明了`Pragma的优先级高于Cache-Control`

## 关于 Cache-Control

我们看到 Cache-Control 中有一个属性是 public，那么这代表了什么意思呢？其实 Cache-Control 不光有 max-age，它常见的取值 private、public、no-cache、max-age，no-store，默认值为 private，各个取值的含义如下：

- private: 客户端可以缓存
- public: 客户端和代理服务器都可缓存
- max-age=xxx: 缓存的内容将在 xxx 秒后失效
- no-cache: 需要使用对比缓存来验证缓存数据
- no-store: 所有内容都不会缓存，强制缓存，对比缓存都不会触发

所以我们在刷新页面的时候，如果只按 F5 只是单纯的发送请求，按 Ctrl+F5 会发现请求头上多了两个字段 Pragma: no-cache 和 Cache-Control: no-cache。

## 缓存的优先级

上面我们说过强制缓存的优先级高于协商缓存，Pragma 的优先级高于 Cache-Control，那么其他缓存的优先级顺序怎么样呢？网上查阅了资料得出以下顺序（PS：有兴趣的童鞋可以验证一下正确性告诉我）：

> Pragma > Cache-Control > Expires > ETag > Last-Modified

> source code
>
> [code](https://juejin.cn/post/6844903655619969038#heading-0)
>
> [Memory Cache & Disk Cache](https://juejin.cn/post/7381663975916716043#heading-22)
