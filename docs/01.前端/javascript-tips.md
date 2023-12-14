---
title: javascript-tips
date: 2022-04-28 10:28:19
permalink: /pages/09c07c/
categories:
  - 前端
tags:
  -
---

### Array.flat() 拍平数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220627143218.png)

### javaScript split 按空格和换行切割

```javascript
input_str.split(/[\s\n]/)
```

### ES6 十大特性

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220627154401.png)

### 如果希望 const 定义的对象的属性也不能被修改该怎么做？

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220627154700.png)

### 检查对象是否为空

方法 1

```javascript
const isEmptyObject = (obj) => Object.keys(obj).length === 0
isEmptyObject({}) // true
isEmptyObject({ name: 'John' }) // false
```

方法 2

```javascript
const isEmptyObject = (obj) => JSON.stringify(obj) === '{}'
isEmptyObject({}) // true
isEmptyObject({ name: 'John' }) // false
```
