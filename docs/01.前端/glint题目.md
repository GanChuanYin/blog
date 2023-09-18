---
title: glint题目
date: 2022-10-28 18:20:21
permalink: /pages/318349/
categories:
  - 前端
tags:
  -
---

## 网络

### 请介绍一下 TCP 与 UDP 的区别, 说说它们的主要应用场景是什么?

UDP 是一种无连接协议，而 TCP 是一种面向连接的协议。TCP 比 UDP 要慢，这是两种协议的主要区别之一。

总的来说，UDP 是一种更快、更简单、更高效的协议。但是只有 TCP 允许对丢失的数据包进行重新传输。

TCP 和 UDP 的另一个区别是 TCP 可以确保数据从用户到服务器的有序传输（反之亦然）。UDP 不是为端到端通信而设计的，并不会检查接收方的准备情况，因此它需要相对更少的开销并占用更少的空间。

应用场景
TCP: http 协议 文件传输
UDP: 语音通话 视频会议

### 什么是 mac 地址和 ip 地址, 有了 mac 地址为什么还需要 ip 地址

> **mac 地址** 也叫物理地址、硬件地址，由网络设备制造商生产时写死在网卡上的。以 48 位的二进制表示 。通常表示为 12 个 16 进制数，如：00-16-EA-AE-3C-40 就是一个 MAC 地址，其中前 3 个字节，16 进制数 00-16-EA 代表网络硬件制造商的编号，它由 IEEE(电气与电子工程师协会)分配，而后 3 个字节，16 进制数 AE-3C-40 代表该制造商所制造的某个网络产品(如网卡)的系列号。只要不更改自己的 MAC 地址，MAC 地址在世界是唯一的。形象地说，MAC 地址就如同身份证上的身份证号码，具有唯一性 。\*

> **IP 地址**是 IP 协议提供的一种统一的地址格式，它为互联网上的每一个网络和每一台主机分配一个逻辑地址，IP 地址是一个 32 位(ipv4)的二进制数，通常被分割为 4 个“8 位二进制数”， 如 222.212.94.105 就是一个 IP 地址\*

假设只用 mac 地址通信, 1 万台电脑想要互相通信就需要存下 9999 个除自己的 mac 地址,世界上有多少电子设备就需要几下多少 mac 地址 这显然是不可能的

为了解决上述问题引入了 IP 地址

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20211114230246.png)

IP 地址的一个重要作用就是确定设备的子网位置，ip 地址表达的是在网络中的位置，类似于国家+城市名+道路号的概念 (提供 ip 地址就能定位请求来源于哪个城市) , mac 地址就好像个人的身份证号

**IP 地址+mac 地址 就可以准确找到某个设备， 类似(国家+城市名+道路) + (身份证号) 就可以唯一定位到一个人**

### 解释浏览器的同源策略

跨域判定规则如下：

1. `协议`不同：如果两个 URL 的协议不同（例如 http 和 https），则被视为跨域。
2. `域名`不同：如果两个 URL 的域名不同（例如 example.com 和 api.example.com），则被视为跨域。
3. `端口`不同：如果两个 URL 的端口不同（例如 example.com:8080 和 example.com:3000），则被视为跨域。

绕过同源策略的方式:

1. 服务器配置 `CORS` Cross-Origin Resource Sharing （跨域资源共享）
2. 正向代理 (vue-cli vite 配置 dev server proxy)
3. 服务器反向代理：将请求转发到同一域的服务器上，然后再与目标服务器建立连接

### option 请求的作用

Option 请求的作用是用于获取服务器支持的 HTTP 方法列表和其他相关信息。当客户端发送一个 Option 请求时，服务器会返回一个包含允许的 HTTP 方法、请求头字段和其他可选信息的响应。这个响应可以帮助客户端了解服务器的功能和限制，以便在发送实际请求之前做出适当的决策。

Option 请求通常用于以下几个方面：

1. CORS（跨域资源共享）：在进行跨域请求时，浏览器会首先发送一个 Option 请求，以确定服务器是否允许跨域请求。服务器会在 Option 响应中返回允许的 HTTP 方法和请求头字段，浏览器根据这些信息决定是否继续发送实际请求。

2. 服务器功能检测：Option 请求可以用于检测服务器支持的功能和限制。客户端可以发送一个 Option 请求，然后根据服务器返回的响应来决定是否使用特定的 HTTP 方法或请求头字段。

### 描述一下 Https 传输数据的过程 越详细越好

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20211123181028.png)

## Css

### opacity: 0、visibility: hidden、display: none 的区别？

display:none: 浏览器不渲染，不占据空间, 动态改变时会引起回流, 性能影响较大, 无法监听 DOM 事件
visibility: hidden: 会被渲染，占据空间, 动态改变时会引起重绘, 性能影响较小, 无法监听 DOM 事件。
opacity: 0: 透明度为 100%，元素隐藏，占据空间, 动态改变时会引起重绘, 性能影响较小, 可以监听 DOM 事件。

### 浏览器是怎样匹配 CSS 选择器

CSS 选择器的解析是 `从右向左` 解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。

若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。

两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。

## Javascript && Typescript

### 如何判断数据类型?

1. 说出尽可能多的方式
2. 说出需要注意的细节
3. 哪种方式的结果最准确

`typeof`

null, [], {} 都返回 "object" ,所以 typeof 无法判断数组、null、对象, typeof null 为 'object'

> 根据 C 语言的传统，null 被设计成可以自动转为 0。js 里也是一样, JavaScript 中的数据在底层是以二进制存储，比如 null 所有存储值都是 0，但是底层的判断机制，只要前三位为 0，就会判定为 object，所以才会有 typeof null === 'object'这个 bug。

`instanceof`

只能用来判断对象和函数，不能用来判断字符串和数字等基础类型

`Object.prototype.toString.call()`

```js
function mytypeof(obj) {
  var s = Object.prototype.toString.call(obj)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}
mytypeof([12, 3, 343]) // "array"
mytypeof({ name: 'zxc', age: 18 }) //"object"
```

Object.prototype.toString.call() 方法范围最广最准确

### 解释 JavaScript 中 this 是如何工作的

在 JavaScript 中，关键字`this`用于引用当前执行代码的对象。它的值取决于函数的调用方式。

以下是四种典型场景的 this 指向

1. 全局作用域中的`this`：在全局作用域中，`this`指向全局对象（浏览器环境中是`window`对象）。

2. 函数中的`this`：在函数中，`this`的值取决于函数的调用方式。

   - 函数作为普通函数调用时，`this`指向全局对象（非严格模式下）或`undefined`（严格模式下）。
   - 函数作为对象的方法调用时，`this`指向调用该方法的对象。
   - 使用`call()`、`apply()`或`bind()`方法调用函数时，可以显式地指定`this`的值。
   - 使用箭头函数时，`this`的值继承自外部作用域，与函数的调用方式无关。

3. 构造函数中的`this`：在构造函数中，`this`指向通过该构造函数创建的实例对象。

4. 事件处理函数中的`this`：在事件处理函数中，`this`指向触发事件的元素。

### 如何遍历一个对象

```javascript
// for in
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(`obj.${key} = ${obj[key]}`)
  }
}
let obj = { name: 'ned', like: 'man' }
Object.keys(obj) //  ['name', 'like']
Object.values(obj) //  ['ned', 'man']
Object.entries(obj) // [["name","ned"],["like","man"]]
```

### 解释一下浏览器中 JS 的事件循环 Event Loop

事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。

常见 macro-task： setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。  
常见 micro-task: process.nextTick、Promise、MutationObserver 等。

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230911145148.png)

### 以下代码将输出什么? 背后原理是什么?

```javascript
console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

Promise.resolve()
  .then(function () {
    console.log('promise1')
  })
  .then(function () {
    console.log('promise2')
  })

console.log('script end')
```

### JS 监听一个对象属性变化的两种方式, 它们的优缺点

方法一: `defineProperty`

使用 Object.defineProperty()

```javascript
let obj = {}
let value = 0

Object.defineProperty(obj, 'property', {
  get() {
    return value
  },
  set(newValue) {
    value = newValue
    console.log('property的值已经改变为：', newValue)
  }
})

obj.property = 1 // 输出：property的值已经改变为： 1
```

> vue2 采用 defineProperty 监听数据

方法二： `Proxy`

使用 Proxy 对象

```javascript
let obj = {}
let value = 0

let handler = {
  set(target, key, newValue) {
    target[key] = newValue
    console.log(`${key}的值已经改变为：${newValue}`)
    return true
  }
}

let proxy = new Proxy(obj, handler)

proxy.property = 1 // 输出：property的值已经改变为：1
```

> vue3 采用的 defineProperty 监听数据

以上两种方式都可以监听对象属性的变化，当属性值发生变化时，会触发相应的回调函数或操作。方式一使用 Object.defineProperty()方法定义属性的 getter 和 setter 方法，通过设置 setter 方法来监听属性的变化。方式二使用 Proxy 对象，通过设置 set 方法来监听属性的变化。两种方式的使用场景略有不同，具体选择哪种方式取决于实际需求。

两种方式的优缺点

方式一：使用 Object.defineProperty()

优点：

1. 可以精确控制属性的读取和赋值操作，可以在赋值时进行一些额外的逻辑处理。
2. 可以监听属性的变化，一旦属性发生变化，就会触发相应的回调函数。

缺点：

1. **只能监听已经存在的属性，无法监听动态添加的属性**。
2. 需要为每个属性都手动定义 getter 和 setter 方法，对于大量属性的对象来说，工作量较大。

> vue2 中无法监听 obj.newKey = 111 这种属性, 必须显式的 vm.$set(this.userInfo, 'age', 23) 设置

方式二：使用 Proxy

优点：

1. 可以监听对象的所有操作，包括属性的读取、赋值、删除等，更加灵活。
2. 可以监听动态添加的属性。
3. 可以通过 Proxy 的 handler 对象设置一些拦截操作，实现更复杂的逻辑。

缺点：

1. 兼容性较差，不支持低版本的浏览器。
2. 相比方式一，**Proxy 的性能较差，对于大量操作的对象来说，可能会影响性能**。

> Vue3 不再兼容 IE 浏览器, 因为 IE 不支持 Proxy 对象

为什么 Proxy 的性能通常会比 Object.defineProperty()差 ?

这是因为 Proxy 在底层实现上需要进行更多的操作和逻辑判断。

Proxy 在**每次操作时都会触发相应的拦截器函数，这些拦截器函数会对操作进行处理和判断，然后再执行相应的操作。这个过程会引入一定的性能开销**。

> 这也是 Vue3 中响应式数据需要显式声明的原因之一

而 **Object.defineProperty()只需要在属性的 getter 和 setter 方法中添加逻辑处理，不需要额外的拦截器函数，因此性能上相对较好。**

### TS 中什么场景用 type, 什么场景用 interface ?

> 用 interface 描述**数据结构**，用 type 描述**类型关系**

如果不清楚什么时候用 interface/type，能用 interface 实现，就用 interface , 如果不能就用 type

### 在 TS 项目中引入一个 JS 包时, 怎么添加类型定义?

在 TypeScript 中引入一个 JavaScript 包时，你可以通过两种方式来添加类型定义：

1. 下载 `@types`包：许多 JavaScript 包都有对应的类型定义包，这些包通常以`@types/package-name`的形式命名

```
yarn add @types/package-name
```

2. 自定义类型定义文件：如果没有可用的`@types`包，可以手动创建一个类型定义文件。类型定义文件的后缀通常为`.d.ts`。在这个文件中，你可以使用`declare`关键字来定义包的类型。例如，假设你要引入一个名为`my-package`的 JavaScript 包，你可以创建一个名为`my-package.d.ts`的文件，并在其中添加以下内容：

```typescript
declare module 'my-package' {
  // 在这里添加包的类型定义
}
```

## 工程化

### webpack loader 和 plugin 的作用是什么, 举几个例子

模块代码转换的工作由 loader 来处理，除此之外的其他任何工作都可以交由 plugin 来完成。

通过添加我们需要的 plugin，可以满足更多构建中特殊的需求

loader

- babel-loader
- sass-loader
- vue-loader
- eslint-loader
- html-minify-loader

plugin

- uglifyjs-webpack-plugin (JS 压缩)
- webpack-bundle-analyzer (打包文件体积分析)

## Vue

### 介绍一下 v-model, 如何自定义一个 v-model

v-bind 与 v-on 的语法糖

<!-- 下面两种写法完全相同  -->

```html
<input v-model="value" />
<input v-bind:value="value" v-on:input="value= $event.target.value" />
```

自定义

```javascript
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

### 说一下你工作中使用到的 父子组件通信 方法 ?

- 通过 \$refs 获取动态组件 `<component/>` 和普通组件有什么区别? (动态组件是数组形式)
- 你会用 this.\$parent.fatherMethod()调用父组件的方法吗? 为什么?

### Vue.nextTick(callback) 有什么用? 原理是什么

作用
`nextTick` 可以让我们在下次 DOM 更新循环结束之后执行延迟回调，用于获得更新后的 DOM。

原理:

异步更新

当我们使用 Vue 提供的接口去更新数据时，这个更新并不会立即生效，而是会被推入到一个队列里。待到适当的时机，队列中的更新任务会被 <font color=#3498db size=4>`批量触发`</font>。这就是异步更新。

异步更新可以帮助我们`避免过度渲染`，是“让 JS 为 DOM 分压”的典范之一。

在 Vue 异步更新 中一般是使用的 `微任务`，但是 `微任务` 的优先级过高，在某些情况下可能会出现比事件冒泡更快的情况，但如果都使用 `宏任务` 又可能会出现渲染的性能问题。所以在新版本中，会默认使用 `微任务`，但在特殊情况下会使用 `宏任务`，比如 v-on。

## 设计模式

### 简要说明如何实现一个发布订阅模式?

```javascript
class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(eventName, fn) {
    if (this.events[eventName]) {
      this.events[eventName].push(fn)
    } else {
      this.events[eventName] = [fn]
    }
  }

  once(eventName, fn) {
    let that = this
    let func = function (args) {
      fn.call(this, args)
      that.off(eventName, func)
    }
    this.on(eventName, func)
  }

  emit(eventName, ...args) {
    if (this.events[eventName] && this.events[eventName].length > 0) {
      this.events[eventName].forEach((fn) => {
        fn.call(this, ...args)
      })
    }
  }

  off(eventName, fn) {
    if (this.events[eventName]) {
      let index = this.events[eventName].findIndex((func) => {
        return fn === func
      })
      if (index >= 0) {
        this.events[eventName].splice(index, 1)
      }
    }
  }
}
```

## 算法与数据结构

### 给定一个有序数组和目标数字, 返回目标数字在数组中的下标, 如果找不到就返回 -1

### 合并两个有序数组, 得到新的有序数组

### 去掉一个字符串中的所有 ‘a’ 字符

```javascript
/**
 * @param {String} str
 * @return {String}
 */

var replaceA = function (str) {}

replaceA('AAAaaa123f41fa')
```

- 进阶: 要求空间复杂度越低越好
