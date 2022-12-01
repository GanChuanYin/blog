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

### 请说出与网络请求 `缓存` 相关的请求头参数, 并简单说明一下它们的作用

强缓存

- expires
- cache-control (新 优先级更高)

协商缓存

- Last-Modified (一个时间戳)
- If-Modified-Since (上一次 response 返回给它的 last-modified 值)
- ETag (由服务器为每个资源生成的唯一的**标识字符串**)
- If-None-Match

服务器接收到这个时间戳后，会比对该时间戳和资源在服务器上的最后修改时间是否一致，从而判断资源是否发生了变化。如果发生了变化，就会返回一个完整的响应内容，并在 Response Headers 中添加新的 Last-Modified 值；否则，返回如上图的 304 响应，Response Headers 不会再添加 Last-Modified 字段。

Etag 的生成过程需要服务器额外付出开销，会影响服务端的性能，这是它的弊端。因此启用 Etag 需要我们审时度势。正如我们刚刚所提到的——Etag 并不能替代 Last-Modified，它只能作为 Last-Modified 的补充和强化存在。 **Etag 在感知文件变化上比 Last-Modified 更加准确，优先级也更高。当 Etag 和 Last-Modified 同时存在时，以 Etag 为准。**

## HTML

### png、jpg、svg 这些图片格式了解吗，各自有什么特点, 它们的使用场景是什么？

### jpg

关键字：**有损压缩、体积小、加载快、不支持透明**

使用场景: JPG 适用于呈现色彩丰富的图片，在我们日常开发中，JPG 图片经常作为大的背景图、轮播图或 Banner 图出现。两大电商网站对大图的处理，是 JPG 图片应用场景的最佳写照：打开淘宝首页，我们可以发现页面中最醒目、最庞大的图片，一定是以 .jpg 为后缀的：

### png

关键字：**无损压缩、质量高、体积大、支持透明**

应用场景: 考虑到 PNG 在处理线条和颜色对比度方面的优势，主要用它来呈现小的 Logo、颜色简单且对比强烈的图片或背景等。再次把目光转向性能方面堪称业界楷模的淘宝首页，会发现它页面上的 Logo，无论大小，都是 PNG 格式：

### svg

关键字: 可缩放矢量图形、 文本文件、体积小、不失真、兼容性好

应用场景: 各种 icon logo 等

### script 标签中 defer 和 async 的区别 ?

1. defer 的执行时机 (所有元素解析完成之后, DOMContentLoaded 事件触发之前)
2. 多个 async script 是乱序的, 所以如果对加载顺序有要求的 script 不适用

## Css

### opacity: 0、visibility: hidden、display: none 的区别？

display:none: 浏览器不渲染，不占据空间, 动态改变时会引起回流, 性能影响较大, 无法监听 DOM 事件
visibility: hidden: 会被渲染，占据空间, 动态改变时会引起重绘, 性能影响较小, 无法监听 DOM 事件。
opacity: 0: 透明度为 100%，元素隐藏，占据空间, 动态改变时会引起重绘, 性能影响较小, 可以监听 DOM 事件。

### 文本超出怎么不换行, 显示点点点...

```css
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
```

### 浏览器是怎样解析 CSS 选择器的？

CSS 选择器的解析是 `从右向左` 解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。

## Javascript && Typescript

### for in 和 for of

```javascript
// 不建议使用for in 遍历数组，因为输出的顺序是不固定的。
// for in 适合遍历对象, 但是注意它会遍历对象上的所有可枚举属性
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(`obj.${key} = ${obj[key]}`)
  }
}

// 遍历可迭代对象 包括String Array Map Set arguments
// 不可以遍历Object
for (const value of Iterator) {
}
```

### 如何判断数据类型?

1. 说出尽可能多的方式
2. 说出需要注意的细节
3. 哪种方式的结果最准确

### typeof

null, [], {} 都返回 "object"

所以 typeof 无法判断数组、null、对象

typeof null 为 'object'的 bug

> 根据 C 语言的传统，null 被设计成可以自动转为 0。js 里也是一样, JavaScript 中的数据在底层是以二进制存储，比如 null 所有存储值都是 0，但是底层的判断机制，只要前三位为 0，就会判定为 object，所以才会有 typeof null === 'object'这个 bug。

### instanceof

instanceof 只能用来判断对象和函数，不能用来判断字符串和数字等基础类型

### Object.prototype.toString.call()

```js
function mytypeof(obj) {
  var s = Object.prototype.toString.call(obj)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

mytypeof([12, 3, 343]) // "array"

mytypeof({ name: 'zxc', age: 18 }) //"object"
```

Object.prototype.toString.call() 方法范围最广最准确

### 如何遍历一个对象

```javascript
// for in
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(`obj.${key} = ${obj[key]}`)
  }
}

let obj = { name: 'ned', like: 'man' }
// Object.keys()方法可以遍历到所有对象本身的可枚举属性，但是其返回值为数组
Object.keys(obj) //  ['name', 'like']
// Object.values()与Object.keys()遍历对象的特性是相同的，但是其返回的结构是以遍历的属性值构成的数组
Object.values(obj) //  ['ned', 'man']
// Object.entries()的返回值为Object.values()与Object.keys()的结合
Object.entries(obj) // [["name","ned"],["like","man"]]
```

### 怎么拷贝一个数组?

1. slice 方法 (浅拷贝)
2. ... 展开语法 (浅拷贝)
3. Array.from (浅拷贝)
4. JSON.stringify && JSON.parse (深拷贝, 但是不安全(循环引用))

### splice 的函数签名, 会改变原数组吗, 它的返回值是什么?

### 这段代码有什么问题, 怎么优化它?

```javascript
for (var count = 0; count < 10000; count++) {
  document.getElementById('container').innerHTML += '<span>测试</span>'
}
```

JS 获取和操作 DOM 的开销很大, 我们应该尽量减少这种操作

优化版本

```javascript
// 只获取一次容器
let container = document.getElementById('container')

// 利用JS运行速度远大于DOM的特点, 将拼接操作全部转移到JS进行
let content = ''
for (let count = 0; count < 10000; count++) {
  // 先对内容进行操作
  content += '<span>测试</span>'
}
// 内容处理好了, 只触发一次DOM的更改
container.innerHTML = content
```

### 以下代码将输出什么? 背后原理是什么?

```javascript
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

Promise.resolve()
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

### TS 中什么场景用 type, 什么场景用 interface ?

> 用 interface 描述**数据结构**，用 type 描述**类型关系**

如果不清楚什么时候用 interface/type，能用 interface 实现，就用 interface , 如果不能就用 type

### JS 如何监听一个对象属性的变化

`Object.defineProperty`

```javascript
let person = {}
let n = 'gjf'
Object.defineProperty(person, 'name', {
  configurable: true,
  enumerable: true,
  get() {
    return n
  },
  set(val) {
    n = val
  }
})
console.log(person.name) //gjf
person.name = 'newGjf'
console.log(person.name) //newGif
```

缺点: 只能监听已有属性, obj.newKey = 111 这种形式监听不到

数组对象是特例，无法通过 Object.defineProperty 来监听到, 还需要去劫持数组对象 mutable 的原型方法

包括 push, pop, shift, unshift, splice, sort, reverse

`Proxy`

```javascript
const target = {
  message1: 'hello',
  message2: 'everyone'
}

const handler3 = {
  get(target, prop, receiver) {
    if (prop === 'message2') {
      return 'world'
    }
    return Reflect.get(...arguments) // 获取默认get 方法
  }
}

const proxy3 = new Proxy(target, handler3)
console.log(proxy3.message1) // hello
console.log(proxy3.message2) // world
```

相当于在对象属性读写前面加一个代理, 可以监听所有属性的变化

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
    let func = function(args) {
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

var replaceA = function(str) {}

replaceA('AAAaaa123f41fa')
```

- 进阶: 要求空间复杂度越低越好
