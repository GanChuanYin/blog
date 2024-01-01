---
title: 组件复用-Hooks
date: 2023-07-20 10:18:59
permalink: /pages/1f5e58/
categories:
  - Vue
tags:
  - 
---
为了跨组件复用逻辑, 在 Hooks 之前，首先会想到的解决方案一定是 `mixin`

### 1. mixin 存在的问题

#### 1.1. 方法和属性难以监听

```javascript
export default {
  mixins: [a, b, c, d, e, f, g], // 当然，这只是表示它混入了很多能力
  mounted() {
    console.log(this.name)
    // mmp!这个 this.name 来自于谁？我难道要一个个混入看实现？
  }
}
```

#### 1.2. 属性、方法会覆盖

当我同时想混入 mixin-a.js 和 mixin-b.js 以同时获得它们的属性或者方法的时候，比较尴尬的事情发生了：由于这两个 mixin 功能的开发者心有灵犀，**它们都定义了 this.name 作为属性**。这种时候，这个时候的你就会傻傻分不清。

基于这些问题, React 官方弃用 mixin, 转向了 Hooks

### 2. Hooks 是什么

"Hooks" 直译是 “钩子”，它并不仅是 react，甚至不仅是前端界的专用术语，而是整个行业所熟知的用语。通常指：**系统运行到某一时期时，会调用被注册到该时机的回调函数**。

### 3. 为啥要用 Hooks

跨组件复用 stateful logic 十分困难. 使用 Hooks，你可以在将含有 state 的逻辑从组件中抽象出来，这将可以让这些逻辑容易被测试。同时，Hooks 可以帮助你在**不重写组件结构的情况下复用这些逻辑**。

复杂的组件难以理解, Hooks 允许您根据相关部分(例如设置订阅或获取数据)将一个组件分割成更小的函数，而不是强制基于生命周期方法进行分割。

### 4. react Hooks demo

```js
import React, { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}

export default Counter
```

这个组件使用了 `useState` 钩子来保存并更新一个计数器的状态。当用户点击按钮时，计数器会增加，并且在 UI 中显示出来。该 Hooks 接受初始状态作为参数，并返回当前状态和一个更新状态的函数。

### 5. Vue3 Hooks Demo

Vue 3.x 开始引入了 Hookss API，用于在函数式组件中实现状态和生命周期的管理, Vue 的 Hookss API 包括 setup() 和一些预置的 Hookss 函数，如 ref()、watch()、onMounted() 等等，可以让我们更方便地编写函数式组件，并且具有更好的性能表现

```html
<template>
  <div>
    <h2>Count: {{ count }}</h2>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    setup() {
      const count = ref(0)

      function increment() {
        count.value++
      }

      return {
        count,
        increment
      }
    }
  }
</script>
```
