const _ = require('lodash')
const test = require('./test')
const { default: testmd } = require('./test.md')
const { tempArr } = require('./es6.js')
import './style/index.css'

console.log('hello webpack')
const res = _.sum([1, 2, 3, 3])

console.log(res)

console.log('test', test.obj)

let testMdDom = document.querySelector('.testMd')
testMdDom.innerHTML = testmd
console.log(testmd)

console.log(tempArr)
