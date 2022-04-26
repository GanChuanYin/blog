---
title: CommonJS与ES6 Modules
date: 2022-04-26 15:42:47
permalink: /pages/c25a8c/
categories:
  - 前端
tags:
  -
---

### CommonJS 和 ES6 Modules 的作用

CommonJS 与 ES6 Modules 都是为了解决 JavaScript 语言缺少模块系统而诞生的：

为了实现模块化，需要解决以下几个问题

- 如何给模块一个唯一标识？
- 如何在模块中使用依赖的外部模块？
- 如何安全地（不污染模块外代码）包装一个模块？
- 如何优雅地（不增加全局变量）把模块暴漏出去？

### CommonJS

#### 起源

**CommonJS 并非 JavaScript 官方**， 它是由 CommonJS 社区发起的一套 JS 模块化解决方案。 在官方发布 ES6/ES2015 之前，它是主流的 JS 模块方案

#### 使用方式

模块 1

```javascript
let name = 'hello kitty'
module.exports = function sayName() {
  return name
}
```

模块 2 导入模块 1

```javascript
const sayName = require('./hello.js')
module.exports = function say() {
  return {
    name: sayName(),
    author: '模块2'
  }
}
```

#### CommonJS 实现原理

首先从上述得知每个模块文件上存在 module，exports，require 三个变量，然而这三个变量是没有被定义的，但是我们可以在 Commonjs 规范下每一个 js 模块上直接使用它们。在 nodejs 中还存在 **filename 和 **dirname 变量。：

- module 记录当前模块信息。
- require 引入模块的方法。
- exports 当前模块导出的属性

利用每个 JS 文件中的这些顶层对象, 对 JS 代码进行包装

类似：

```javascript
;(function(exports, require, module, __filename, __dirname) {
  const sayName = require('./hello.js')
  module.exports = function say() {
    return {
      name: sayName(),
      author: '模块2'
    }
  }
})
```

那么包装函数本质上是什么样子的呢？

```javascript
function wrapper(script) {
  return (
    '(function (exports, require, module, __filename, __dirname) {' +
    script +
    '\n})'
  )
}
```

包装函数执行。

```javascript
const modulefunction = wrapper(
  `const sayName = require('./hello.js') module.exports = function say(){ return { name:sayName(), author:'我不是外星人' } }`
)
```

如上模拟了一个包装函数功能， script 为我们在 js 模块中写的内容，最后返回的就是如上包装之后的函数。当然这个函数暂且是一个字符串。

```javascript
runInThisContext(modulefunction)(
  module.exports,
  require,
  module,
  __filename,
  __dirname
)
```

在模块加载的时候，会通过 runInThisContext (可以理解成 eval ) 执行 modulefunction ，**传入 require ，exports ，module 等参数**。 这样就可以访问引入的模块的内容了。

通过上面的分析我们可以总结 CommonJS 几个特点

- CommonJS 规范的核心变量: exports、module.exports、require；
- exports 和 module.exports 可以负责对模块中的内容进行导出；
- require 函数可以帮助我们导入其他模块（自定义模块、系统模块、第三方库模块）中的内容；
- 导入动作发生在代码运行时

### ES6 Modules

随着 ECMAScript 6.0 终于正式发布，成为了国际标准。在这一标准中，首次引入了 import 和 export 两个 JavaScript 关键字，并提供了被称为 ES Module 的模块化方案。

之后 chrome、 Node.js、Webpack 都及时跟进支持。 预计在今后很长的一段时间里，ES6 Modules 和 CommonJS 模块化方案都会在前端开发中共存。**但是很明显 ES6 Modules 将成为主流**

#### 使用方式

导出

```javascript
const name = 'hello kitty'
export { name }
export const say = function() {
  console.log('hello , world')
}

// 默认导出
export default {
  name,
  say
}
```

导入

```javascript
// name  , say 对应 a.js 中的  name , say
import { name, say } from './a.js'
```

#### 原理

ES6 模块提前加载并执行模块文件，ES6 模块在预处理阶段分析模块依赖，在执行阶段执行模块，两个阶段都采用深度优先遍历，执行顺序是子 -> 父。

为了验证这一点，看一下如下 demo。

main.js

```javascript
console.log('main.js开始执行')
import say from './a'
import say1 from './b'
console.log('main.js执行完毕')
```

a.js

```javascript
import b from './b'
console.log('a模块加载')
export default function say() {
  console.log('hello , world')
}
```

b.js

```javascript
console.log('b 模块加载')
export default function sayhello() {
  console.log('hello,world')
}
```

main.js 和 a.js 都引用了 b.js 模块，但是 b 模块也只加载了一次。
执行顺序是子 -> 父

效果如下：

![](https://qiniu.espe.work/blog/20220426162157.png)

由上可以总结ES6 Modules的几个特点

- ES6 Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
- ES6 Module 静态的，代码发生在编译时。
- ES6 模块提前加载并执行模块文件，
- ES6 Module 的特性可以很容易实现 Tree Shaking 和 Code Splitting。(只保留被引用到的内容)

