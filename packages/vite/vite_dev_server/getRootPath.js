const path = require('path')
const { normalizeId } = require('./utils/normalize')

const index = normalizeId(__dirname).lastIndexOf('/')
const _path = normalizeId(__dirname)

console.log(_path)
// 获取项目根目录
module.exports = {
  path: _path,
}
