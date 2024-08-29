class TestPlugin {
  constructor() {
    console.log('TestPlugin constructor()')
  }
  // 1. webpack读取配置时，new TestPlugin() ，会执行插件 constructor 方法
  // 2. webpack创建 compiler 对象
  // 3. 遍历所有插件，调用插件的 apply 方法
  apply(compiler) {
    console.log('TestPlugin apply()')

    // 从文档可知, compile hook 是 SyncHook, 也就是同步钩子, 只能用tap注册
    compiler.hooks.compile.tap('TestPlugin', (compilationParams) => {
      console.log('compiler.compile()')
    })

    debugger
    // 从文档可知, make 是 AsyncParallelHook, 也就是异步并行钩子, 特点就是异步任务同时执行
    // 可以使用 tap、tapAsync、tapPromise 注册。
    // 如果使用tap注册的话，进行异步操作是不会等待异步操作执行完成的。
    compiler.hooks.make.tap('TestPlugin', (compilation) => {
      setTimeout(() => {
        console.log('compiler.make() 111')
      }, 2000)
    })

    // 使用tapAsync、tapPromise注册，进行异步操作会等异步操作做完再继续往下执行
    compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('compiler.make() 222')
        // 必须调用
        callback()
      }, 1000)
    })

    compiler.hooks.make.tapPromise('TestPlugin', (compilation) => {
      console.log('compiler.make() 333')
      // 必须返回promise
      return new Promise((resolve) => {
        resolve()
      })
    })

    // 从文档可知, emit 是 AsyncSeriesHook, 也就是异步串行钩子，特点就是异步任务顺序执行
    compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('compiler.emit() 111')
        callback()
      }, 3000)
    })

    compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('compiler.emit() 222')
        callback()
      }, 2000)
    })

    compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('compiler.emit() 333')
        callback()
      }, 1000)
    })
  }
}

module.exports = TestPlugin
