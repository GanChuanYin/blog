---
title: javascript强化
date: 2022-06-27 16:09:50
permalink: /pages/a621d1/
categories:
  - 前端
tags:
  - 
---
### 闭包的原理

闭包的实现原理，其实是利用了**作用域链的特性**，我们都知道作用域链就是在当前执行环境下访问某个变量时，如果不存在就一直向外层寻找，最终寻找到最外层也就是全局作用域，这样就形成了一个链条。

### typeof 原理

typeof 原理： 不同的对象在底层都表示为二进制，在 Javascript 中二进制前（低）三位存储其类型信息。

- 000: 对象
- 010: 浮点数
- 100：字符串
- 110： 布尔
- 1： 整数

typeof null 为"object", 原因是因为 不同的对象在底层都表示为二进制，在 Javascript 中二进制前（低）三位都为 0 的话会被判断为 Object 类型，null 的二进制表示全为 0，自然前三位也是 0，所以执行 typeof 时会返回"object"。
一个不恰当的例子，假设所有的 Javascript 对象都是 16 位的，也就是有 16 个 0 或 1 组成的序列，猜想如下：

```shell
Array: 1000100010001000
null: 0000000000000000
```

```javascript
typeof [] // "object"
typeof null // "object"
```

因为 Array 和 null 的前三位都是 000。为什么 Array 的前三位不是 100?因为二进制中的“前”一般代表低位， 比如二进制 00000011 对应十进制数是 3，它的前三位是 011。

### instanceof 原理

要想从根本上理解，需要从两个方面入手：

语言规范中是如何定义这个运算符的

通俗一些讲，<font color=#00dddd size=4>instanceof 用来比较一个对象是否为某一个构造函数的实例。注意，instanceof 运算符只能用于对象，不适用原始类型的值</font>。

判断某个实例是否属于某种类型

```typescript

function Foo() {};
Foo.prototype.message = ...;
const a = new Foo();

也可以判断一个实例是否是其父类型或者祖先类型的实例。

function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

console.log(auto instanceof Car);
// expected output: true

console.log(auto instanceof Object);
// expected output: true

```

### 判断是否为数组有几种方法

1. Array.isArray(obj)
2. obj instanceof Array
3. Object.prototype.toString.call(obj) === '[object Array]'
