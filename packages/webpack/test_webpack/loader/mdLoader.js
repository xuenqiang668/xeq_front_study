const { marked } = require('marked')

module.exports = (moduleId) => {
  console.log('moduleid', moduleId)

  const html = marked(moduleId)
  return html
}

// 必须实现 getOptions 方法
module.exports.getOptions = function (parser) {
  // parser 是一个 Schema 生成器，用于解析选项
  // 你可以使用它来定义选项的结构和验证
  return parser({
    // 你可以在这里定义你的选项结构
    someOption: 'string',
    anotherOption: 'boolean',
  })
}

// module.exports.pitch = function (remainingRequest, previousRequest, data) {
//   console.log('arg', remainingRequest, previousRequest, data)
// }
