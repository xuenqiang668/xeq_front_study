import { count } from './counter.js'
// import _ from 'lodash-es'

import '@/vite_css/A.js'
import '@/vite_css/B.js'

// console.log('count: ', count)
// console.log('lodash: ', _)

// console.log('import.meta.env:', import.meta.env)

import * as R from 'ramda'
const max = R.max(1, 2)
console.log('R: ', max)

import './src/assets/svgLoader.js'

fetch('/api/user', { method: 'post' }).then((res) => console.log(res))

// test hmr
// import './hmr/self_module.js'
// import './hmr/other_module.js'
// import './hmr/import.meta.hot.dispose.js'
import './hmr/import.meta.hot.invalidate.js'
