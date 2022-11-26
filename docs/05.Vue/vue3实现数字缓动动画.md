---
title: vue3实现数字缓动动画
date: 2022-06-23 17:40:33
permalink: /pages/e0e173/
categories:
  - Vue
tags:
  - 
---
## 1. 效果

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/Jun-23-20220017-41-13.gif)

## 2. 实现数字缓动动画

为了让动画更顺滑，可以借助现代浏览器的 <font color=#00dddd size=4>requestAnimationFrame</font> 方法

[浏览器是如何渲染页面的](https://xingyun.espe.work/pages/d88f70/#_8-%E6%9B%B4%E6%96%B0%E6%B8%B2%E6%9F%93%E7%AE%A1%E9%81%93%E6%88%90%E6%9C%AC%E9%AB%98%E6%98%82)

如果旧版浏览器不支持 requestAnimationFrame 就用 setTimeout 来代替

```typescript
// requestAnimationFrame.ts

function getFunc() {
  let lastTime = 0
  let requestAnimationFrame
  let cancelAnimationFrame

  requestAnimationFrame = window.requestAnimationFrame
  cancelAnimationFrame = window.cancelAnimationFrame
  // 如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
  if (!requestAnimationFrame || !cancelAnimationFrame) {
    requestAnimationFrame = function(callback: (arg0: number) => void) {
      const currTime = new Date().getTime()
      // 为了使setTimeout的尽可能的接近每秒60帧的效果
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = window.setTimeout(() => {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }
    cancelAnimationFrame = function(id: number | undefined) {
      window.clearTimeout(id)
    }
  }
  return {
    requestAnimationFrame,
    cancelAnimationFrame
  }
}

const { requestAnimationFrame, cancelAnimationFrame } = getFunc()

export { requestAnimationFrame, cancelAnimationFrame }
```

## 3. Vue3 setup script 版本代码实现

```vue
<template>
  <span>{{ state.displayValue }}</span>
</template>

<script lang="ts" setup>
import { reactive, computed, watch, onUnmounted, ref, Ref } from 'vue'

interface Props {
  startVal?: number
  endVal: number
  duration?: number
  autoplay?: boolean
  decimals?: number
  decimal?: string
  separator?: string
  prefix?: string
  suffix?: string
  useEasing?: boolean
  easingFunc?: (t: number, b: number, c: number, d: number) => number
}

const props = withDefaults(defineProps<Props>(), {
  startVal: 0,
  endVal: 1000,
  duration: 1000,
  autoplay: true,
  decimals: 0,
  decimal: '.',
  separator: ',',
  prefix: '',
  suffix: '',
  useEasing: false,
  easingFunc: (t: number, b: number, c: number, d: number) => {
    return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
  }
})

const emit = defineEmits(['callback'])

const isNumber = (val: string) => {
  return !isNaN(parseFloat(val))
}

const formatNumber = (num: number) => {
  let str = num.toFixed(props.decimals)
  str += ''
  const x = str.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? props.decimal + x[1] : ''
  const rgx = /(\d+)(\d{3})/
  if (props.separator && !isNumber(props.separator)) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + props.separator + '$2')
    }
  }
  return props.prefix + x1 + x2 + props.suffix
}

const state = reactive<{
  localStartVal: number
  displayValue: string
  printVal: null | number
  paused: boolean
  localDuration: number
  startTime: null | number
  timestamp: null | number
  remaining: null | number
  rAF: null | number
}>({
  localStartVal: props.startVal,
  displayValue: formatNumber(props.startVal),
  printVal: null,
  paused: false,
  localDuration: props.duration,
  startTime: null,
  timestamp: null,
  remaining: null,
  rAF: null
})

const countDown = computed(() => {
  return props.startVal > props.endVal
})

const count = (timestamp: number) => {
  if (!state.startTime) state.startTime = timestamp
  state.timestamp = timestamp
  const progress = timestamp - state.startTime
  state.remaining = state.localDuration - progress

  if (props.useEasing) {
    if (countDown.value) {
      state.printVal =
        state.localStartVal -
        props.easingFunc(
          progress,
          0,
          state.localStartVal - props.endVal,
          state.localDuration
        )
    } else {
      state.printVal = props.easingFunc(
        progress,
        state.localStartVal,
        props.endVal - state.localStartVal,
        state.localDuration
      )
    }
  } else {
    if (countDown.value) {
      state.printVal =
        state.localStartVal -
        (state.localStartVal - props.endVal) * (progress / state.localDuration)
    } else {
      state.printVal =
        state.localStartVal +
        (props.endVal - state.localStartVal) * (progress / state.localDuration)
    }
  }
  if (countDown.value) {
    state.printVal =
      state.printVal < props.endVal ? props.endVal : state.printVal
  } else {
    state.printVal =
      state.printVal > props.endVal ? props.endVal : state.printVal
  }

  state.displayValue = formatNumber(state.printVal)
  if (progress < state.localDuration) {
    state.rAF = requestAnimationFrame(count)
  } else {
    emit('callback')
  }
}

const start = () => {
  state.localStartVal = props.startVal
  state.startTime = null
  state.localDuration = props.duration
  state.paused = false
  state.rAF = requestAnimationFrame(count)
}

const pauseResume = () => {
  if (state.paused) {
    resume()
    state.paused = false
  } else {
    pause()
    state.paused = true
  }
}
const pause = () => {
  cancelAnimationFrame(state.rAF!)
}
const resume = () => {
  state.startTime = null
  state.localDuration = +state.remaining!
  state.localStartVal = +state.printVal!
  requestAnimationFrame(count)
}
const reset = () => {
  state.startTime = null
  cancelAnimationFrame(state.rAF!)
  state.displayValue = formatNumber(props.startVal)
}

watch(
  () => props.startVal,
  (value) => {
    if (props.autoplay) {
      start()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  cancelAnimationFrame(state.rAF!)
})
</script>

<style lang="scss" scoped></style>
```

核心代码就是 在 requestAnimationFrame 中计算进度，并更新 displayValue 值。 cancelAnimationFrame 取消或暂停动画。
