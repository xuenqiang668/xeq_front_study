/// <reference types="vite/client" />
// 三斜线指令， 默认就是 import 'vite/client'
// 这里的意思是，告诉 TypeScript 编译器，我们需要使用 Vite 提供的客户端类型定义。

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}
