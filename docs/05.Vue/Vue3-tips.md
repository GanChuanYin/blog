---
title: Vue3-tips
date: 2022-05-11 18:33:35
permalink: /pages/af410a/
categories:
  - Vue
tags:
  -
---

### <font color=#dd0000 size=4>注意 watch 简单类型时要用函数返回</font>

因为直接返回的话是一个数值，就没办法追踪数据变化了

```typescript
const state: State = reactive({
  search: '',
  options: [],
  searchPool: [],
  show: false,
  fuse: {}
})

watch(state.searchPool, (list) => {
  initFuse(list)
})

watch(
  () => state.show,
  (value) => {
    if (value) {
      document.body.addEventListener('click', close)
    } else {
      document.body.removeEventListener('click', close)
    }
  }
)
```

### <font color=#dd0000 size=4>vue3 下 echarts resize()报错</font>

![](https://qiniu.espe.work/blog/20220513165412.png)

有关 <font color=#dd0000 size=4>shallowRef</font>
![](https://qiniu.espe.work/blog/20220513165639.png)

### async setup()

A Composition API component's setup() hook can be async:

```javascript
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

If using `<script setup>`, the presence of top-level await expressions automatically makes the component an async dependency:

```html
<script setup>
  const res = await fetch(...)
  const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

