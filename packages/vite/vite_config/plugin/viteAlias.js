import * as path from 'node:path'
import * as fs from 'node:fs'
import { normalizePath } from 'vite'

function getResolve({ keyName = '@' } = {}) {
  const aliasPath = path.resolve(__dirname, '../src')
  // const dir = path.resolve(fileOrDir)
  const entries = fs.readdirSync(aliasPath)

  const resultDir = {}
  for (const entry of entries) {
    const entryPath = path.resolve(aliasPath, entry)
    if (fs.statSync(entryPath).isDirectory()) {
      resultDir[`${keyName}/${entry}`] = normalizePath(entryPath)
    }
  }
  return resultDir
}

export default () => {
  return {
    config(config, { command }) {
      // 读取文件目录
      return {
        resolve: {
          alias: getResolve(),
        },
      }
    },
  }
}
