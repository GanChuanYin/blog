---
title: css实现打字机效果
date: 2022-06-05 16:20:41
permalink: /pages/21ba79/
categories:
  - 前端
tags:
  - 
---
## 1. 打字机效果

实现类似以下效果
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/typewriter.gif)

上面效果有多种实现方式，这里考虑只用 CSS 实现

## 2. 代码实现

这里贴上基于 Vue3 的实现方式

```html
<template>
  <div class="typewriter">
    <div ref="textDom" class="typewriter-text">{{ props.text }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, Ref, watch } from 'vue'
  const textDom = ref<HTMLElement | null>(null)

  const props = defineProps(['text'])
  const length = ref(props.text.length)
  let textWidth = ref(length.value)

  function updateTextDomWidth() {
    textDom.value?.style.setProperty(
      '--textWidth',
      textDom.value.offsetWidth + 'px'
    ) // 设置文字宽度
    textDom.value?.style.setProperty('--step', textWidth.value) // 设置动画步长
    textDom.value?.style.setProperty('--duration', textWidth.value / 10 + 's') // 设置动画时长
  }

  // 文字变化时， 更新文字宽度， 并设置动画步长、时长
  watch(
    () => {
      return props.text
    },
    () => {
      length.value = props.text.length
      textWidth.value = length.value
      updateTextDomWidth()
    }
  )

  onMounted(() => {
    updateTextDomWidth()
  })
</script>

<style lang="scss" scoped>
  .typewriter {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .typewriter-text {
    width: var(--textWidth);
    white-space: nowrap;
    overflow: hidden;
    border-right: 3px solid;
    font-family: monospace;
    font-size: 2em;
    animation: typewriter var(--duration) steps(var(--step)), effect 0.5s
        step-end infinite alternate;
  }

  @keyframes typewriter {
    from {
      width: 0;
    }
  }

  @keyframes effect {
    50% {
      border-color: transparent;
    }
  }
</style>
```


### 2.2 核心代码

1. 利用css3 var() 传递变量，动态控制动画参数
2. typewriter动画中，利用css3 animation 步长steps() 实现容器宽度一步一步变化，模拟打字机效果
3. watch组件的prop 传入文字变化时， 更新文字宽度， 并重新设置动画步长、时长
