import AmoduleCss from './A.module.css'
import AmoduleLess from './A.module.less'

console.log('AmoduleCss:', AmoduleCss, 'AmoduleLess:', AmoduleLess)

const div = document.createElement('div')
div.className = AmoduleCss.footer
div.classList.add(AmoduleLess.header)
div.textContent = 'Hello World'
document.body.appendChild(div)

// 被vite  module css规范处理的代码，会在浏览器中生成一个style标签，并将css内容写入其中。
/*
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/vite_css/A.module.css");import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"
const __vite__id = "C:/Users/dk2/Desktop/file/xeq_front_study/packages/vite_config/vite_css/A.module.css"
const __vite__css = "._footer_783cu_1{\r\n  width: 100px;\r\n  height: 100px;\r\n  background-color: red;\r\n}"
__vite__updateStyle(__vite__id, __vite__css)
export const footer = "_footer_783cu_1";
export default {
	footer: footer
};

import.meta.hot.prune(() => __vite__removeStyle(__vite__id))
*/

// 被vite  less 规范处理的代码，会在浏览器中生成一个style标签，并将css内容写入其中。
/*
import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/vite_css/A.less");
import {updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle} from "/@vite/client"
const __vite__id = "C:/Users/dk2/Desktop/file/xeq_front_study/packages/vite_config/vite_css/A.less"
const __vite__css = ".container .header {\n  background-color: aqua;\n}\n"
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune(()=>__vite__removeStyle(__vite__id))



*/
