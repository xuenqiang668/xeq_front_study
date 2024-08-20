const appRootPath = require('app-root-path')

const rootPaths = require('../getRootPath')
const { normalizeId } = require('./normalize')

module.exports = function (alisConfig, jsContent) {
  let resCntent
  for (const [item, path] of Object.entries(alisConfig)) {
    const pather = normalizeId(path)

    const rootPath = rootPaths.path
    const newPath = pather.replace(rootPath, '')

    resCntent = jsContent.replace(item, newPath)
  }
  return resCntent
}
