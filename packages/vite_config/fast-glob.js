import fg from 'fast-glob'
/**
 * Return all folders from the project directory
 * @param options
 */

async function getDirectories(config) {
  const { dir = 'src', root = process.cwd(), deep = true, depth = 1 } = config

  const directories = await fg.sync(deep ? `${dir}/**/*` : `${dir}/*`, {
    ignore: ['node_modules'], // 忽略
    onlyDirectories: false, // 只读出文件夹
    cwd: root, // 需要检测的路径
    deep: depth, // 嵌套层级
    absolute: true, // 相对、绝对路径
  })

  if (!directories.length) {
    // 给出警告，我简化成console.log
    console.log('No Directories could be found!')
  }
  return directories
}

const config = {
  dir: 'src',
  root: process.cwd(),
  deep: true,
  depth: 2,
}
getDirectories(config).then((list) => {
  console.log(list)
})
