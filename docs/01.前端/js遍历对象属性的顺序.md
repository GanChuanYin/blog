---
title: js遍历对象属性的顺序
date: 2022-10-17 16:19:10
permalink: /pages/b8abca/
categories:
  - 前端
tags:
  - 
---
## 为什么 JS 对象内部属性遍历的顺序乱了

看一个例子:

```javascript
let obj = {
  '2018': {
    modelCode: '204313',
    modelName: '2018款 Vanquish 6.0L S Coupe'
  },
  '2017': {
    modelCode: '202479',
    modelName: '2017款 Rapide 6.0L AMR'
  },
  '2013': {
    modelCode: '139705',
    modelName: '2013款  Rapide  6.0L S'
  }
}

console.log(obj)
// {2013: {…}, 2017: {…}, 2018: {…}}
```

它们会

1. 先提取所有 key 能被转为数字（并不是 parseFloat，是内部的方法），值为非负整数的属性
2. 然后根据数字顺序对属性排序首先遍历出来，然后按照对象定义的顺序遍历余下的所有属性。

按照上面的解释，那么我来一个例子

```javascript
let obj = {
  b: 'testb',
  a: 'testa',
  '1': 'test1',
  测: 'test测',
  '2': 'test2'
}

console.log(Object.keys(obj))

// [1, 2, 'b', 'a', '测']
```

果然会把 '1' 和 '2' 这种能被 parseFloat 转化为正整数的提到前面并且按照升序排

而 'a' 和 '测' 没法转为整数那就排在 '1'、'2' 后并按照构建时的顺序拍

## 原理

js 对象像一个字典，但是 v8 实现对象存储并没有完全按字典实现。字典是非线性结构，查找速度比线性结构慢。

它有两类属性，`elements` 排序属性, `properties`常规属性。

事实上，这是为了满足 ECMA 规范 要求所进行的设计。按照规范中的描述，可索引的属性应该按照索引值大小升序排列，而命名属性根据`创建`的顺序升序排列。

存储在线性结构里的属性叫快属性，非线性结构里的属性叫慢属性。

数字类型属性会排序放在 elements 里，是线性存储，查找快，添加删除慢。字符串属性按照添加顺序放在 properties 里，是字典存储，它虽然降低了查找速度，但是提高了增删速度。

这样每次会多访问一层 elements 或 properties，为了提高访问速度，v8 会将前 n 个属性直接作为对象内属性存储。如果没有多余属性，就不会生成 properties 属性,对象内属性数量取决于初始对象大小。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221017164814.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221017164848.png)

遍历属性时先 elements 而后在 properties。 所以导致了前面的遍历顺序不稳定问题

tip:

为什么不推荐 delete 属性？
删除后可能导致`重新生成`内部属性

更好的方式:

```javascript
// 用
user.password = undefined
// 替代
delete user.password
```

## 解决方案

下面给几个方案

1. 既然对象不能保证顺序，对于线性结构，直接使用数组
2. 数字欺骗，将数字加上额外的字符，等待处理完毕，再将数据还原
