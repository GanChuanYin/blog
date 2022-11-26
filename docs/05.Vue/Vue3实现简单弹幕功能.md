---
title: Vue3实现简单弹幕功能
date: 2022-04-25 22:21:08
permalink: /pages/f58a48/
categories:
  - Vue
tags:
  - Vue
---

利用刚学的 Vue3 写一个弹幕 Demo

### 原理

在弹幕比较多的时候，浏览器的 CPU 占用比较高，页面容易变卡，这时最好是利用 GPU 加速提升用户体验。

单式并不是所有的 CSS 属性都能触发 GPU 的硬件加速，实际上只有少数属性可以，比如下面的这些：

- transform
- opacity
- filter

**所以弹幕功能一般基于 transform 属性实现**， 让弹幕内容从右侧 **transform: translateX(-100%)** 搭配 **animation: xxx 10s linear**属性，即可实现

### 实现

```vue
<template>
  <div class="barrage-stream" ref="barrageStream">
    <div
      class="barrage-block"
      v-for="(stream, streamIndex) of barrageStreamList"
      :key="'barrageStreamList' + streamIndex"
    >
      <div class="barrage-block-item" v-for="item of stream" :key="item.id">
        {{ item.msg }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref, watch, Ref } from 'vue'

interface Stream {
  id: string
  msg: string
}

const barrageStream: Ref = ref(null) // barrageStream.value 即可获得Dom
let barrageStreamRect: DOMRect
const barrageStreamList: Stream[][] = reactive([]) // 弹幕二维数组
const fakeList: Stream[] = reactive([{ id: '1', msg: '111' }]) // mock弹幕数据
const state = reactive({ barrageStreamListNum: 1 })

// 初始化弹幕数据
const initData = () => {
  let index = 0
  setInterval(() => {
    fakeList.push({
      id: `id${index}`,
      msg: `${index}`
    })
    index++
    fakeList.shift() // 删除上一条
  }, 1000)
}

onMounted(() => {
  // 获取dom元素的信息
  barrageStreamRect = barrageStream.value.getBoundingClientRect() // 获得容器宽高
  // 根据容器的高度 计算弹幕轨道的数量
  state.barrageStreamListNum =
    Math.floor((barrageStreamRect.height - 100) / 36) - 3
  console.log(state.barrageStreamListNum)
  // 初始化轨道
  for (let i = 0; i < state.barrageStreamListNum; i++) {
    barrageStreamList.push([])
  }
  initData()
})

// 每次弹幕数据更新后 将新的数据随机的推入弹幕轨道中
watch(fakeList, (newValue) => {
  if (newValue.length) {
    // 获取随机轨道下标
    let randomNum = Math.floor(Math.random() * state.barrageStreamListNum)
    // 将弹幕推送到随机轨道中
    barrageStreamList[randomNum].push(newValue[newValue.length - 1])
    // 延时8s后（弹幕已经飘到最左侧），删除该弹幕，释放内存
    setTimeout(() => {
      barrageStreamList[randomNum].shift()
    }, 8000)
  }
})
</script>

<style lang="scss" scoped>
.barrage-stream {
  overflow: hidden;
  width: 100%;
  height: 100%;
  .barrage-block {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 40px;
    color: #333;
    font-size: 16px;
    &-item {
      position: absolute;
      display: inline-block;
      animation: barrage 10s linear;
      animation-fill-mode: forwards;
    }
  }
}
@keyframes barrage {
  from {
    transform: translateX(100%); //最右侧开始
  }
  to {
    transform: translateX(calc(-100vw - 200%)); // translate到最左侧
  }
}
</style>
```

效果预览

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/111.gif)