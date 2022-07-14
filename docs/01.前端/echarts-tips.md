---
title: echarts-tips
date: 2022-07-04 17:10:11
permalink: /pages/5dc72c/
categories:
  - 前端
tags:
  - 
---
### 暗黑模式切换

是否是暗黑模式，默认会根据背景色 backgroundColor 的亮度自动设置。 如果是设置了容器的背景色而无法判断到，就可以使用该配置手动指定，echarts 会根据是否是暗黑模式调整文本等的颜色。

```typescript
const myChart = echarts.init(chartDom, 'dark')
```
