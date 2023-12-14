---
title: Vue3+Ts封装echarts
date: 2022-05-13 18:31:41
permalink: /pages/1e91a5/
categories:
  - Vue
tags:
  - 
---
### TS Echart

echarts 官方定义了一些 type
[](https://echarts.apache.org/handbook/zh/basics/import/#%E5%9C%A8-typescript-%E4%B8%AD%E6%8C%89%E9%9C%80%E5%BC%95%E5%85%A5)

```typescript
import { LineSeriesOption, XAXisComponentOption } from 'echarts'

const xAxis: XAXisComponentOption = {
  type: 'category',
  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  axisLabel: {
    color: 'red'
  }
}
```

VsCode 中写代码就有类型提示了
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220513183622.png)

### 封装 Echarts 基础组件

封装基础组件需要实现以下功能

1. 基础组件里根据项目配置 defaultOptions， 然后使用者传入的 option 配置将覆盖基础配置
2. 窗口发生 resize 时，更新图例
3. 传入的 options 支持动态修改

```html
<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts" setup>
  import {
    onMounted,
    ref,
    defineProps,
    watch,
    toRefs,
    Ref,
    onUnmounted,
    onBeforeUnmount,
    shallowRef
  } from 'vue'
  import * as echarts from 'echarts' // 引入echarts

  interface Props {
    options: any
    theme: string
  }

  const props = withDefaults(defineProps<Props>(), {
    options: {},
    theme: 'dark'
  })

  // 默认echart options配置
  const defaultOptions = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Direct',
        type: 'bar',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ],
    tooltip: {
      show: true, // 是否显示
      trigger: 'axis', // 触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
      axisPointer: {
        // 坐标轴指示器配置项。
        type: 'shadow', // 'line' 直线指示器  'shadow' 阴影指示器  'none' 无指示器  'cross' 十字准星指示器。
        axis: 'auto', // 指示器的坐标轴。
        snap: true // 坐标轴指示器是否自动吸附到点上
      },
      // showContent: true, //是否显示提示框浮层，默认显示。
      // triggerOn: 'mouseover', // 触发时机  'mouseover'鼠标移动时触发。     'click'鼠标点击时触发。  'mousemove|click'同时鼠标移动和点击时触发。
      // enterable: false, // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
      renderMode: 'html', // 浮层的渲染模式，默认以 'html 即额外的 DOM 节点展示 tooltip；
      backgroundColor: 'rgba(50,50,50,0.7)', // 提示框浮层的背景颜色。
      borderColor: '#333', // 提示框浮层的边框颜色。
      borderWidth: 0, // 提示框浮层的边框宽。
      padding: 5, // 提示框浮层内边距，
      textStyle: {
        // 提示框浮层的文本样式。
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 14
      },
      extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);', // 额外附加到浮层的 css 样式
      confine: false // 是否将 tooltip 框限制在图表的区域内。
      // formatter: '{b} 的成绩是 {c}'
      // formatter: function (arg: any) {
      //   return arg[0].name + ' : ' + arg[0].data
      // }
    }
  }

  const container = shallowRef<HTMLElement>()
  const chart = shallowRef<any>()

  const resizeEchart = () => {
    if (chart.value) {
      chart.value.resize()
    }
  }

  //组件挂载后将echarts挂载在container上，并将给echarts设置传入的options
  onMounted(() => {
    chart.value = echarts.init(container.value!, props.options.theme)
    chart.value.setOption({ ...defaultOptions, ...props.options })
    window.addEventListener('resize', resizeEchart) //窗口大小改变 resize
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeEchart)
  })

  //监听options发生变化时，重新给echarts设置传入的options
  watch(
    props.options,
    (newOptions) => {
      // setOption(newOption, true) will clear the previous data and use the new one.
      chart.value.setOption({ ...defaultOptions, ...newOptions }, true)
    },
    { deep: true }
  )
</script>

<style scoped>
  .container {
    width: 100%;
    max-width: 1000px;
    height: 100%;
  }
</style>
```

### 使用

```html
<template>
  <div class="btn">
    <el-button type="primary" @click="changeOption">change option</el-button>
  </div>
  <div class="chart">
    <Chart :options="options" theme="light" />
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { LineSeriesOption, XAXisComponentOption } from 'echarts'
  import Chart from '@/components/echart/echart-base.vue'
  const options: any = reactive({})

  function changeOption() {
    options.series = [line]
    options.xAxis = xAxis
  }

  const line: LineSeriesOption = {
    type: 'line',
    data: [555, 200, 150, 80, 700, 110, 1340],
    lineStyle: {
      color: 'red'
    }
  }
  const xAxis: XAXisComponentOption = {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: {
      color: 'red'
    }
  }
</script>
<style scoped>
  .chart {
    width: 100%;
    height: 400px;
  }
</style>
```
