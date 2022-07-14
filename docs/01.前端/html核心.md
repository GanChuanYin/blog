---
title: html核心
date: 2022-04-26 16:43:15
permalink: /pages/95046b/
categories:
  - 前端
tags:
  -
---

<font color=#00dddd size=4>src 与 href 的区别</font>

1. src 外部资源 阻塞其他资源 js 脚本页面底部
2. href 超文本 网络， 并行， 常用 a、link

<font color=#00dddd size=4>script 标签中 defer 和 async 的区别</font>

1. 都是异步，不阻塞
2. async 不保证顺序
3. async 并行下载与执行
4. defer 并行下载, <font color=#dd0000 size=4>最后执行</font>

<font color=#00dddd size=4>HTML5 有哪些更新</font>

1. 语义化标签
2. 媒体标签 audio video source
3. 表单类型
4. DOM 查询 document.querySelector() document.querySelectorAll()
5. Web 存储 localStorage sessionStorage
6. canvas svg

<font color=#00dddd size=4>SVG 与 Canvas 比较</font>

基本介绍

Canvas
通过 js 来绘制 2D 图形。
canvas 图像单位是像素。
canvas 图像绘制完毕之后，浏览器将不再关注它，如果位置发生变换，就需要重新绘制。

SVG
svg 使用 XML 描述的 2D 图像。
svg 是基于 xml 的，所以 svg 中绘制图形还是使用的元素，js 给元素任意添加事件。
svg 绘制的图像是一个对象，如果对象的属性发生改变，浏览器将重新绘制图形。

1. **svg 是一种矢量图，而 canvas 依赖于分辨率。所以 svg 放大不会失真，但是 canvas 绘制的图形会失真**。
2. svg 支持事件处理器，而 canvas 不支持事件处理器。
3. **svg 中的文字独立于图像**，文字可保留，可编辑和可搜索，canvas 的文本渲染能力弱。
4. canvas 适合图像密集型的游戏，**频繁地重绘图像**，svg 绘制的复杂度高时减慢渲染的速度。
5. canvas 绘制的图形可以多种格式 (jpg、png) 保存图片，但是 svg 绘制的只能以 .svg 格式保存，使用时可以引入 html 文件。
6. canvas 适合开发游戏，svg 不适合游戏应用。

应用

- 功能方面
  canvas 是一个画布，绘制出来的图形是位图，因此 canvas 可以绘制图片，在实际应用中，由于渲染性能高，所以大型游戏开发都用的 canvas 。除此之外，还有统计中常见的柱状图、饼图、雷达图等也使用的 canvas 。而 svg 绘制的是矢量图，放大后不会失真，所以很适合做地图。
- 操作方面
  canvas 绘制的图形，只能给 canvas 整个画布添加事件，而不能给某个图形或文件添加事件处理器，但是 svg 支持事件绑定，如果需要添加带有事件的动画效果时，就需要选择 svg。

<font color=#00dddd size=4>iframe 有哪些优点与缺点？</font>

优点
1. 加载速度较慢的内容
2. 脚本并行下载
3. 实现跨子域通信

缺点
4. iframe 会阻塞主页面的 onload 事件
5. 无法被一些搜索引擎识别，不利于 SEO
6. 不易管理
