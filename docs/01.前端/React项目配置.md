---
title: React项目配置
date: 2022-05-23 16:25:36
permalink: /pages/e44662/
categories:
  - 前端
tags:
  - 
---


## Redux

### Redux 是用来做什么的？

简单通俗的解释，Redux 是用来管理项目级别的全局变量，而且是可以实时监听变量的变化并改变 DOM 的。当多个模块都需要动态显示同一个数据，并且这些模块从属于不同的父组件，或者在不同的页面中，如果没有 Redux，那实现起来就很麻烦了，问题追踪也很痛苦。因此 Redux 就是解决这个问题的。

做过 vue 开发的同学都知道 vuex，react 对应的工具就是 Redux，当然还有一些附属工具，比如 react-redux、redux-thunk、immutable。

redux 涉及的内容较多，把各个依赖组件的官方文档都阅读一遍确实不容易消化。本次分享通过一个简单的 Demo，把 redux、react-redux、redux-thunk、immutable 这些依赖组件的使用方法串起来，非常有利于理解。

上述 Redux 相关内容较多，跟着操作一遍好像大概知道了，但又说不清为什么使用这些依赖包。这里做一下小结，便于消化理解。

<font color=#00dddd size=4>其实 react-redux、redux-thunk、immutable 都是围绕如何简化 redux 开发的。</font>

react-redux 是为了简化 redux 通过订阅方式修改 state 的繁琐过程。

redux-thunk 是为了 redux 的 dispatch 能够支持 function 类型的数据，请回顾 8.9 章节中 login 页面代码的 mapDispatchToProps。

immutable 是为了解决 store 中的数据不能被直接赋值修改的问题（引用类型数据的变化导致无法监测到数据的变化）。

