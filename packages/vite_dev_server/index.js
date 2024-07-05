const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const koaStatic = require('koa-static')

const app = new Koa()

const root = path.resolve(__dirname, './index.html')
const main = path.resolve(__dirname, './main.js')
const appVue = path.resolve(__dirname, './app.vue')

app.use(async (ctx) => {
  console.log(ctx.url)
  if (ctx.url === '/') {
    const conentText = fs.readFileSync(root, 'utf-8')
    ctx.body = conentText
  }

  if (ctx.url === '/main.js') {
    const conentText = fs.readFileSync(main, 'utf-8')
    ctx.response.type = 'application/javascript'
    ctx.body = conentText
  }

  if (ctx.url === '/app.vue') {
    const conentText = fs.readFileSync(appVue, 'utf-8')
    ctx.response.type = 'application/javascript'
    ctx.body = conentText
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
