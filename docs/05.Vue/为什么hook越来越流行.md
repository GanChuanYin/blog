---
title: 为什么hook越来越流行
date: 2023-08-10 13:55:30
permalink: /pages/88f885/
categories:
  - Vue
tags:
  - 
---
### Hooks 的概念？

Hooks 就是 `钩子` 的意思，所以 Hook functions 也叫 钩子函数，我理解的 钩子函数的意思是：

**在特定的时机会执行的函数**

比如在开发中遇到的：

- Dom 事件： 如 button 点击时执行的函数
- 定时器函数： `setTimeout` `setInterval` 时间到了就会执行的函数
- 生命周期函数： 如 Vue 页面的生命周期函数 `created` `mounted` 在组件各个时间点执行的函数
- 拦截器事件： 请求和响应时执行的函数
- 某个值改变而执行的函数： 例如 React Hooks/Vue Hooks

### Vue2 存在的问题`

在 Vue2 时代，mixins 是一个为了提高代码复用性而推出的功能，但是官方不推荐使用，这是为啥呢？我们来看一个例子，你就知道使用 mixins 有多难受

```js

// mixin1
export default {
  created() {
      console.log('我是mmmmmmmixins一号')
  },
  method: {
      saymmm() {
          console.log('mmmmmmmixins 起飞🛫')
      }
  }
}

// mixin2
export default {
  method: {
      say() {
          this.saymmm();
      }
  }
}

// index.vue
export default {
  mixins: [mixin1, mixin2],
  created() {
      this.say()
      this.love()
  },
  method: {
      say() {
          console.log('index.vue mmmmmmmixins')
      },
      love() {
          this.lovemmm()
      }
  }
}

```

上面有两个 mixins 混入了 index.vue ，我来看看最终的输出结果是怎么样的~

```shell
我是 mmmmmmmixins 一号
index.vue mmmmmmmixins
mmmmmmmixins 起飞🛫
```

通过这三个输出，我们可以发现三个现象：

- mixin 的 created 和 index.vue 的 created 合并执行了
- index.vue 的 say 函数顶掉了 mixin 的 say 函数
- mixin2 居然能访问到 mixin1 的 saymmm 函数

上面三个现象都是 mixins 的正常现象，但是这样有很多隐患，当你使用 mixins 去提取公用代码时，若是一个 mixins 文件，那还好说，怎样都行；当 mixins 文件达到多个，去维护修改时就会不知道这个方法、属性来自那个 mixins 文件；

再想象一下多个同事写了多个 mixins, 大家的代码变量互相覆盖, 或者 npm 拉了多个包, 每个包的 mixins 互相影响, 那遇到 bug 是咋也理不清了.

### Vue3 Hook 如何来做

而我们使用 Hooks 来做的话，需要封装一个以 use 开头的函数，自定义 Hooks 有一个潜规则，以 `use` 开头

```javascript
// useLoading.ts
import { ref } from 'vue'
export useLoading = () => {
    const loading = ref(false)
    const show = () => {
        loading.value = true
    }
    const hiden = () => {
        loading.value = false
    }

    return {
        loading,
        hiden,
        show
    }
}

```

```html
<!-- index.vue -->
<table loading="loading"></table>

<script setup lang="ts">
  import { useLoading } from './hooks/useLoading.ts'

  const { loading, hiden, show } = useLoading()
</script>
```

以上就是一简单的 hooks, 其实 **自定义 Hooks 本质还是为了提高代码的可复用性**

但是这个时候可能就会有朋友说了，这个 useLoading 其实不就相当于一个函数吗？

这就涉及到了 utils 和 Vue 自定义 Hooks 的区别：

**utils 函数：不涉及响应式的函数, Vue 自定义 Hooks：涉及 Vue 的一些响应式 api，比如 ref/reactive/computed/watch/onMounted**
