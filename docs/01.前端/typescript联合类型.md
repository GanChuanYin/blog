---
title: typescript联合类型
date: 2022-12-12 10:39:16
permalink: /pages/9c149a/
categories:
  - 前端
tags:
  - 
---
介绍一种 ts 联合类型的用法

## typescript 计算圆和矩形的面积怎么定义

### 面积公式

圆的面积等于 pai 乘以半径的平方

```typescript
s = Math.PI * shape.radius ** 2
```

正方形面积等于边长的平方

```typescript
s = sideLength ** 2
```

### 定义面积计算方法

首先定义一下图形的 interface

```typescript
interface Shape {
  kind: 'circle' | 'square'
  radius?: number
  sideLength?: number
}
```

然后定义计算方法

```typescript
function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
  }
}
```

以上代码看起来没什么问题, 但是编辑器报错

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221212104837.png)

这里出现了一个问题: <font color=#dd0000 size=4>编码的人输入 circle 类型的时候会输入 radius, 但是编译器不知道, 也就是说编译器不明白 circle 和 radius 是一组, square 和 sideLength 是一组</font>

### 联合类型引入

变换一下思路: 将正方形和圆形类型分开定义

```javascript
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

type Shape = Circle | Square

function getArea(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.sideLength ** 2
  }
}
```

这样编译器就能正确识别类型

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221212111127.png)
