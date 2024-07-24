const express = require('express')
const app = express()
const port = 8080
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const md5 = require('md5')

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
  let status = fs.statSync(jsPath) // 获取文件状态: 文件大小、创建时间、修改时间
  let etag = md5(cont) // 生成etag

  // res.setHeader('Expires', getGLNZ()) // 设置过期时间
  // res.setHeader('Cache-Control', 'public, max-age=120') // 设置缓存控制，相对时间

  // 协商缓存
  // let lastModified = status.mtime.toUTCString()
  // console.log(req.headers)
  // if (lastModified === req.headers['If-Modified-Since']) {
  //   res.writeHead(304, 'Not Modified')
  //   res.end()
  // } else {
  //   // res.setHeader('Cache-Control', 'public, max-age=120')
  //   res.setHeader('Last-Modified', lastModified)
  //   res.writeHead(200, 'OK')
  //   res.end()
  // }

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
