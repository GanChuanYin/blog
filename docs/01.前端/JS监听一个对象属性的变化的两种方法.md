---
title: JS监听一个对象属性的变化的两种方法
date: 2023-09-08 16:46:17
permalink: /pages/9795c1/
categories:
  - 前端
tags:
  - 
---
### 方法一: `defineProperty`

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

> vue2 采用的 defineProperty 监听数据

### 方法二： `Proxy`

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

### 两种方式的优缺点

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

### 为什么 Proxy 的性能通常会比 Object.defineProperty()差 ?

这是因为 Proxy 在底层实现上需要进行更多的操作和逻辑判断。

Proxy 在**每次操作时都会触发相应的拦截器函数，这些拦截器函数会对操作进行处理和判断，然后再执行相应的操作。这个过程会引入一定的性能开销**。

> 这也是 Vue3 中响应式数据需要显式声明的原因之一

而 **Object.defineProperty()只需要在属性的 getter 和 setter 方法中添加逻辑处理，不需要额外的拦截器函数，因此性能上相对较好。**
