---
title:  Electron跨端原理
date: 2022-06-24 15:22:34
permalink: /pages/95f4ae/
categories:
  - 前端
tags:
  - 
---
## 1. 背景

Electron 是使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序的框架，可构建出兼容 Mac、Windows 和 Linux 三个平台的应用程序。

我工作流中使用的 VsCode, 各种通讯工具如微信、飞书等，Mac 图床工具 [PicGo](https://github.com/Molunerfinn/PicGo) 等，都是使用 Electron 构建的。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220624152839.png)

一个跨端框架的设计，有三个问题需要考虑，分别是 UI 渲染、原生 API 以及客户端构建方式。Electron 是如何解决上述问题的呐？

Electron 的跨端原理并不难理解：它通过集成浏览器内核，使用前端的技术来实现不同平台下的渲染，并结合了 Chromium 、Node.js 和用于调用系统本地功能的 API 三大板块。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220624152356.png

Chromium 为 Electron 提供强大的 UI 渲染能力，由于 Chromium 本身跨平台，因此无需考虑代码的兼容性。最重要的是，可以使用前端三大件进行 Electron 开发。

Chromium 并不具备原生 GUI 的操作能力，因此 Electron 内部集成 Node.js，编写 UI 的同时也能够调用操作系统的底层 API，例如 path、fs、crypto 等模块。

Native API 为 Electron 提供原生系统的 GUI 支持，借此 Electron 可以调用原生应用程序接口。

总结起来，<font color=#00dddd size=4>Chromium 负责页面 UI 渲染，Node.js 负责业务逻辑，Native API 则提供原生能力和跨平台。</font>

## 2. Chromium

Chromium 是一个 google 开源的浏览器内核，它提供了一个简单的渲染引擎，可以渲染 HTML、CSS、JS 等。 做过 python 自动化爬虫的应该很熟悉。

JavaScript 是单线程语言，但浏览器是多线程的，，自然也是基于多线程工作机制。
