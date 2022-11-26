---
title: Vue3基础
date: 2022-04-25 22:09:19
permalink: /pages/883af6/
categories:
  - Vue
tags:
  - Vue
---

### vue3 中 reactive 和 ref 对比区别

定于数据角度对比：

ref 用来定义：基本类型数据
reactive 用来定义：对象、或数组类型的数据

> 注意：ref 也可以用来定义对象或数组类型数据，它内部会自动通过 reactive 转为代理对象

原理角度对比：

ref 通过 Object.defineProperty() 的 get 与 set 来实现响应式的（数据劫持）
reactive 通过使用 Proxy 来实现响应式（数据劫持），并通过 Reflect 操作源对象内部的数据。

使用角度对比：

ref 定义的数据：操作数据需要 .value,读取数据时模版中直接读取不需要 .value
reactive 定义的数据：操作数据与读取数据，均不需要 .value

例子：

```html
<template>
  <div class="barrage-stream" ref="barrageStream"></div>
</template>
```

```javascript
import { reactive, onMounted, ref, watch, Ref } from 'vue'

const barrageStream: Ref = ref(null) // 获取 dom object 中 ref为 barrageStream 元素
const fakeList: Stream[] = reactive([{ id: '1', msg: '111' }])

onMounted(() => {
  console.log(barrageStreamRect) // ref初始化的 通过.value获取
  console.log(fakeList) //  直接获取
})
```

ref

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220426141009.png)
