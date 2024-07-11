// ;(function (exports, require, module, __filename, __dirname) {})()

/**
 * common js 规范
 * console.log(__filename,__dirname) 其实就是放在立即执行函数里面的变量，可以直接使用
 * __filename 就是当前文件的绝对路径
 * __dirname 就是当前文件所在的目录的绝对路径
 * process.cwd() 就是当前进程的工作目录
 */
const path = require('path')
const fs = require('fs')
console.log(path.resolve(__dirname, 'test.css')) // c:\Users\dk2\Desktop\file\xeq_front_study\packages\test_path\test.txt
const new_path = path.join(__dirname, 'test.css')

const res = fs.readFileSync(new_path, 'utf-8')
console.log(res) // 这里打印出来的就是文件的内容
