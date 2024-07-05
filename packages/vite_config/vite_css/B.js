import BmoduleCss from './B.module.css'

console.log(BmoduleCss)

const div = document.createElement('div')
div.className = BmoduleCss.footer
div.textContent = 'Hello World'
document.body.appendChild(div)
