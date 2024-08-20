## 总结

### vite-plugin-checker

- 这个插件可以帮助更好是利用 typescript 写出更高质量的代码。
- 它可以帮助我们检查代码中的类型错误、语法错误、变量声明、函数调用等。
- 它可以帮助我们自动修复一些错误，提高代码的可读性和可维护性。

### 三斜杠指令

- vite-env.d.ts

```ts
/// <reference types="vite/client" />
// 三斜线指令， 默认就是 import 'vite/client'
// 这里的意思是，告诉 TypeScript 编译器，我们需要使用 Vite 提供的客户端类型定义。

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}
```
