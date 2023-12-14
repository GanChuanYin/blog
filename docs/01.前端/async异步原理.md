---
title: async异步原理
date: 2022-12-05 23:12:23
permalink: /pages/6d0c24/
categories:
  - 前端
tags:
  - 
---
为了了解 Async / Await 的原理, 需要了解一些前置知识

## 一、Generator 与 yield

### 1.1 基本使用方法

Generator（生成器）是 ES6 中的关键词，通俗来讲 Generator 是一个带星号的函数（它并不是真正的函数），可以配合 yield 关键字来 `暂停` 或者 `执行函数`。先来看一个例子：

```javascript
function* gen() {
  console.log('enter')
  let a = yield 1
  let b = yield (function () {
    return 2
  })()
  return 3
}
var g = gen() // 阻塞，不会执行任何语句
console.log(typeof g) // 返回 object 这里不是 "function"
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
```

```shell
object
enter
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: true }
{ value: undefined, done: true }
```

Generator 中配合使用 yield 关键词可以控制函数执行的顺序，每当执行一次 next 方法，Generator 函数会执行到下一个存在 yield 关键词的位置。
总结，Generator 的执行的关键点如下：

- 调用 gen() 后，程序会阻塞，不会执行任何语句；
- 调用 g.next() 后，程序继续执行，直到遇到 yield 关键词时执行暂停；
- 一直执行 next 方法，最后返回一个对象，其存在两个属性：value  和  done。

### 1.2 原理

其实，在生成器内部，如果遇到 `yield` 关键字，那么 V8 引擎将返回关键字后面的内容给外部，并暂停该生成器函数的执行。生成器暂停执行后，外部的代码便开始执行，外部代码如果想要恢复生成器的执行，可以使用 `result.next` 方法。

谷歌 V8 为了实现生成器函数的暂停执行和恢复执行的, 它用到了`协程`，协程是—种比线程更加轻量级的存在。可以把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程。比如，当前执行的是 A 协程，要启动 B 协程，那么 A 协程就需要将主线程的控制权交给 B 协程，这就体现在 A 协程暂停执行，B 协程恢复执行; 同样，也可以从 B 协程中启动 A 协程。通常，如果从 A 协程启动 B 协程，我们就把 A 协程称为 B 协程的父协程。

正如一个进程可以拥有多个线程一样，一个线程也可以拥有多个协程。每一时刻，该线程只能执行其中某一个协程。最重要的是，协程不是被操作系统内核所管理，而完全是由程序所控制（也就是在用户态执行）。这样带来的好处就是性能得到了很大的提升，不会像线程切换那样消耗资源。

## 二、 Async / Await

ES7 新增了两个关键字： async 和 await, 是 `Generator 的语法糖`.

使用 await 关键字可以暂停异步代码的执行，等待 Promise 解决。

<font color=#dd0000 size=4>async 关键字可以让函数具有异步特征，但总体上代码仍然是同步求值的。</font>

它们的用法很简单，首先用 async 关键字声明一个异步函数：

```javascript
async function httpRequest() {}
```

然后就可以在这个函数内部使用 await 关键字了：

```javascript
async function httpRequest() {
  let res1 = await httpPromise(url1)
  console.log(res1)
}
```

上述例子, await 关键字并不会导致程序阻塞，代码仍然是异步的，而 await 只是掩盖了这个事实，这就意味着任何使用 await 的代码本身都是异步的。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221205235940.png)

可以看出，<font color=#dd0000 size=4>async 函数返回的是 Promise 对象</font> 。如果异步函数使用 return 关键字返回了值（如果没有 return 则会返回 undefined），这个值则会被 Promise.resolve() 包装成 Promise 对象。 <font color=#dd0000 size=4>异步函数始终返回 Promise 对象</font> 。

### await 可以用于 非 Promise 对象吗?

可以

```javascript
function getSomething() {
  return 'something'
}
async function testAsync() {
  return Promise.resolve('hello async')
}
async function test() {
  const v1 = await getSomething()
  const v2 = await testAsync()
  console.log(v1, v2)
}
test()

// something
// hello async
```

- 如果 await 的不是一个 Promise 对象，那 await 表达式的运算结果就是 await 的内容；
- 如果 await 的是一个 Promise 对象，await 就就会阻塞后面的代码，等着 Promise 对象 resolve，然后将得到的值作为 await 表达式的运算结果。

## 错误处理

看以下代码 控制台执行输出什么?

```javascript
function httpPromise(url) {
  return new Promise((resolve, reject) => {
    reject(new Error('发生错误'))
  })
}

const caller = async function () {
  let res = await httpPromise()
  if (res) {
    console.log(222, res)
  } else {
    console.log(333, res)
  }
}

caller()
```

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221206104129.png)

直接报错了, 因为代码执行到

```javascript
let res = await httpPromise()
```

之后接收到一个 Error 就退出了, 后面的代码也不执行了

所以更好的处理方式是

```javascript
function httpPromise(url) {
  return new Promise((resolve, reject) => {
    reject(new Error('发生错误'))
  })
}

const caller = async function () {
  let res = await httpPromise().catch((err) => {
    console.log(111, err)
  })
  if (res) {
    // 这里写异步任务成功
    console.log(222, res)
  } else {
    // 这里写异步任务失败的逻辑
    console.log(333, res)
  }
}

caller()
```

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221206104526.png)

可以看出

```javascript
let res = await httpPromise().catch((err) => {
  console.log(111, err)
})
```

错误在这一步被 catch 住之后, 后面的业务逻辑可以运行, 控制台也不报红了, 更 `优雅`
