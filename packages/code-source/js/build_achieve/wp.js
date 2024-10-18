const fs = require('fs')
const path = require('path')

const str = fs.readFileSync(path.resolve(__dirname, './index.js'), 'utf-8')


console.log(str);
/*
let text = require('./text.js').text
let aa = require('./a.js').aa

let str = `${text} I'm ${aa} years old.`
console.log(str)

*/

// wp.js
function getDependencies(str) { // 这个 str 就是刚才那个入口文件读出来的字符串
    let rs = str.match(/require\('(.+)'\)/g) // [ "require('./text.js')", "require('./a.js')" ]
    rs = rs ? rs.map(r => r.slice(9, -2)) : [] // [ "./text.js", "./a.js" ]
    return rs
}


const res = getDependencies(str)
console.log(res); // [ './text.js', './a.js' ]



// wp.js
let ID = 0; // 自增 ID
function createAsset(filename) { // filename 大概长这个样子：'./src/index.js'
    let fileStr = fs.readFileSync(filename, 'utf8') // js 文件读出来就是个字符串
    return { // 以对象的方式来描述一个文件
        id: ID++,
        filename, // './src/index.js'
        dependencies: getDependencies(fileStr), // [ "./text.js", "./a.js" ]
        code: `function(require, exports) {
      ${fileStr}
    }`
    }
}

// const obj = createAsset(path.resolve(__dirname, './index.js'))
// console.log(obj);
/*
{
  id: 0,
  filename: '/home/xun8szh/Documents/meWork/xeq_front_study/packages/js/build_achieve/index.js',
  dependencies: [ './text.js', './a.js' ],
  code: 'function(require, exports) {\n' +
    "      let text = require('./text.js').text\n" +
    "let aa = require('./a.js').aa\n" +
    '\n' +
    "let str = `${text} I'm ${aa} years old.`\n" +
    'console.log(str)\n' +
    '    }'
}
*/


function createAssetArr(filename) {
    let entryModule = createAsset(filename)
    let moduleArr = [entryModule] // 这里用来存放所有模块，也就是所有文件

    for (let m of moduleArr) { // 目前 moduleArr 只有一个入口模块，但是下面解析依赖的时候会往 moduleArr 里面继续追加模块，所以会继续向后循环，而不是只循环一次
        let dirname = path.dirname(m.filename)
        m.mapping = {} // 这个就是放依赖的映射
        m.dependencies.forEach(relativePath => {
            let absolutePath = path.join(dirname, relativePath)
            let childAsset = createAsset(absolutePath) // 这里要用绝对路径，用相对路径的话容易找不到，这个我们在开发的时候应该都有体会过
            m.mapping[relativePath] = childAsset.id // 存依赖的映射
            moduleArr.push(childAsset) // 往 moduleArr 里面继续追加模块，使循环继续
        })
    }

    return moduleArr // 返回所有模块数组
}


const moduleArr = createAssetArr(path.resolve(__dirname, './index.js'))

// console.log(moduleArr);


function createBundleJs(moduleArr) {
    let moduleStr = ''
    moduleArr.forEach((m, i) => { // 拼接 modules 里面的内容，主要就是这步
        moduleStr += `${m.id}: [${m.code}, ${JSON.stringify(m.mapping)} ],`
    })
    let output = `let modules = { ${moduleStr} }
    function handle(id) {
      let [fn, mapping] = modules[id]
      let exports = {}
      function require(path) {
        return handle(mapping[path])
      }
      fn(require, exports)
      return exports
    }
    handle(0)`
    fs.writeFileSync(path.resolve(__dirname, './bundle.js'), output) // 写到当前路径下的 bundle.js 文件
}

createBundleJs(moduleArr)