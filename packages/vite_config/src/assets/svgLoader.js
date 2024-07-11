import ywz from './ywz.jpg'
import svfIconRaw from './vite.svg?raw'

// one
const img = document.createElement('img')
img.src = ywz
document.body.appendChild(img)

// two
const div = document.createElement('div')
div.innerHTML = svfIconRaw
document.body.appendChild(div)

const svgDom = div.querySelector('svg')
console.log(svgDom)

svgDom.onmousemove = function (e) {
  e.target.style.fill = 'red'
}

svgDom.onmouseout = function (e) {
  e.target.style.fill = ''
}
