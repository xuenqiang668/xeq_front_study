## vite 中对 css 以及 css 模块化的简单处理

1. 因为会有同名的 class，会造成样式覆盖的问题，随意 vite 对 css 做了简单的处理，就是加上 module 的前缀，会生成 hash，然后 vite 会做出相应的处理，使得样式不会被覆盖。由一个映射的关系

```js
{
    "footer": "_footer_o5b5b_1"
}
// 就是个映射关系，key 是原来的 class，value 是加上 module 前缀的 hash 值
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/vite_css/A.module.css");import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/@vite/client"
const __vite__id = "C:/Users/dk2/Desktop/file/xeq_front_study/packages/vite_config/vite_css/A.module.css"
const __vite__css = "._footer_783cu_1{\r\n  width: 100px;\r\n  height: 100px;\r\n  background-color: red;\r\n}"
__vite__updateStyle(__vite__id, __vite__css)
export const footer = "_footer_783cu_1";
export default {
	footer: footer
};

import.meta.hot.prune(() => __vite__removeStyle(__vite__id))
```

2. 对 less 的 css 预处理器也会有相应的处理，使用 less 包转成浏览器认识的 css 代码

```less
.container {
  .header {
    background-color: aqua;
  }
}
```

```js
import { createHotContext as __vite__createHotContext } from '/@vite/client'
import.meta.hot = __vite__createHotContext('/vite_css/A.less')
import {
  updateStyle as __vite__updateStyle,
  removeStyle as __vite__removeStyle,
} from '/@vite/client'
const __vite__id =
  'C:/Users/dk2/Desktop/file/xeq_front_study/packages/vite_config/vite_css/A.less'
const __vite__css = '.container .header {\n  background-color: aqua;\n}\n'
__vite__updateStyle(__vite__id, __vite__css)
import.meta.hot.accept()
import.meta.hot.prune(() => __vite__removeStyle(__vite__id))
```
