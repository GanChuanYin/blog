---
title: TypeScript强化
date: 2022-05-06 16:11:25
permalink: /pages/603a17/
categories:
  - 前端
tags:
  - TypeScript
---

## 1. interface 和 type 到底有什么区别

### 1.1 都允许拓展（extends）

interface 和 type 都可以拓展，并且两者并不是相互独立的，也就是说 interface 可以 extends type, type 也可以 extends interface 。 虽然效果差不多，但是两者语法不同。

interface extends interface

```typescript
interface Name {
  name: string
}
interface User extends Name {
  age: number
}
```

type extends type

```typescript
type Name = {
  name: string
}
type User = Name & { age: number }
```

interface extends type

```typescript
type Name = {
  name: string
}
interface User extends Name {
  age: number
}
```

type extends interface

```typescript
interface Name {
  name: string
}
type User = Name & {
  age: number
}
```

### 1.2 小结

> 用 interface 描述**数据结构**，用 type 描述**类型关系**

如果不清楚什么时候用 interface/type，能用 interface 实现，就用 interface , 如果不能就用 type

## 2. 泛型

### 2.1 为什么需要泛型 ？

TS 文档里面有这样两段话：

> 软件工程中，我们不仅要创建一致的定义良好的 API，同时也要考虑可重用性。 组件不仅能够支持当前的数据类型，同时也能支持未来的数据类型，这在创建大型系统时为你提供了十分灵活的功能。

> 在像 C# 和 Java 这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。

用一个例子来理解这段话：

假如要设计一个函数， 打印传入的字符串参数，并返回

```typescript
function print(arg: string): string {
  console.log(arg)
  return arg
}
```

后来我们需要这个函数支持数字类型

```typescript
function print(arg: string | number): string | number {
  console.log(arg)
  return arg
}
```

后来又变了, 要支持所有类型

于是你祭出了 AnyScript

```typescript
function print(arg: any): any {
  console.log(arg)
  return arg
}
```

其实如果利用泛型，我们完全可以不用 any 解决这个问题

```typescript
function print<T>(arg: T): T {
  console.log(arg)
  return arg
}
```

这样，我们就做到了输入和输出的类型统一，且可以输入输出任何类型。

泛型中的 T 就像一个 <font color=#e74c3c>占位符</font> 、或者说一个变量，在使用的时候可以把定义的类型像参数一样传入，它可以原封不动地输出。

### 2.2 泛型默认参数

如果要给泛型加默认参数，可以这么写：

```typescript
interface Iprint<T = number> {
  (arg: T): T
}

function print<T>(arg: T) {
  console.log(arg)
  return arg
}

const myPrint: Iprint = print
```

### 2.3 约束泛型

假设现在有这么一个函数，打印传入参数的长度，我们这么写：

```typescript
function printLength<T>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

因为不确定 T 是否有 length 属性，会报错：

![](https://qiniu.espe.work/blog/20220506164619.png)

那么现在我想约束这个泛型，一定要有 length 属性，怎么办？

可以和 interface 结合，来约束类型。

```typescript
interface ILength {
  length: number
}

function printLength<T extends ILength>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

这其中的关键就是 \<T extends ILength>，让这个泛型继承接口 ILength，这样就能约束泛型。

我们定义的变量一定要有 length 属性，比如下面的 str、arr 和 obj，才可以通过 TS 编译。

```typescript
const str = printLength('lin')
const arr = printLength([1, 2, 3])
const obj = printLength({ length: 10 })
```

只要你有 length 属性，都符合约束，那就不管你是 str，arr 还是 obj，都没问题。 如果没有 length，就会报错

![](https://qiniu.espe.work/blog/20220506165044.png)

### 2.4 泛型的一些应用

使用泛型，可以在定义函数、接口或类的时候，不预先指定具体类型，而是在使用的时候再指定类型。

#### 2.4.1 泛型约束类

定义一个栈，有入栈和出栈两个方法，如果想入栈和出栈的元素类型统一，就可以这么写：

```typescript
class Stack<T> {
  private data: T[] = []
  push(item: T) {
    return this.data.push(item)
  }
  pop(): T | undefined {
    return this.data.pop()
  }
}
```

在定义实例的时候写类型，比如，入栈和出栈都要是 number 类型，就这么写：

```typescript
const s1 = new Stack<number>()
```

这样，入栈一个字符串就会报错：

![](https://qiniu.espe.work/blog/20220506165357.png)

这是非常灵活的，如果需求变了，入栈和出栈都要是 string 类型，在定义实例的时候改一下就好了：

```typescript
const s1 = new Stack<string>()
```

这样，入栈一个数字就会报错：

#### 2.4.2 泛型约束接口

使用泛型，也可以对 interface 进行改造，让 interface 更灵活。

```typescript
interface IKeyValue<T, U> {
  key: T
  value: U
}

const k1: IKeyValue<number, string> = { key: 18, value: 'lin' }
const k2: IKeyValue<string, number> = { key: 'lin', value: 18 }
```

#### 2.4.3 泛型定义数组

定义一个数组，我们之前是这么写的：

```typescript
const arr: number[] = [1, 2, 3]
```

现在这么写也可以：

```typescript
const arr: Array<number> = [1, 2, 3]
```

#### 2.4.4 实际开发 ：泛型约束后端接口参数类型

```typescript
import axios from 'axios'

interface API {
    '/book/detail': {
        id: number,
    },
    '/book/comment': {
        id: number
        comment: string
    }
    ...
}


function request<T extends keyof API>(url: T, obj: API[T]) {
    return axios.post(url, obj)
}

request('/book/comment', {
    id: 1,
    comment: '非常棒！'
})

```

如果路径写错了
![](https://qiniu.espe.work/blog/20220506172358.png)

如果参数少了
![](https://qiniu.espe.work/blog/20220506170623.png)

如果参数类型错了
![](https://qiniu.espe.work/blog/20220506170656.png)

### 2.5 小结

泛型的作用

1. 增强程序的扩展性： 函数和类可以轻松支持多种类型
2. 合理运用可以避免冗长的联合类型和 any, 增强程序可读性
3. 灵活控制类型之间的约束

## 3. 利用声明文件 声明类型

声明文件必需以  .d.ts  为后缀。一般来说，TypeScript 会解析项目中所有的  \*.ts  文件，因此也包含以  .d.ts  结尾的声明文件。

![](https://qiniu.espe.work/blog/20220518101956.png)

只要 tsconfig.json  中的配置包含了  typing.d.ts  文件，那么其他所有  \*.ts  文件就都可以获得声明文件中的类型定义。

## 4. 可选链（Optional Chaining）

可选链（Optional Chaining） ?. 是 ES11(ES2020)新增的特性，TypeScript 3.7 支持了这个特性。可选链可以让我们在查询具有多层级的对象时，不再需要进行冗余的各种前置校验：

```typescript
const num = user.info.getAge()
```

直接访问 user.info.getAge() 很容易命中 Uncaught TypeError: Cannot read property...。

所以我们一般会这么写

```typescript
const num = user && user.info && user.info.getAge && user.info.getAge()
```

用了可选链，上面代码会变成：

```typescript
const num = user?.info?.getAge?()
```

可选链是一种先检查属性是否存在，再尝试访问该属性的运算符。

TypeScript 在尝试访问  user.info  前，会先尝试访问  user ，**只有当 user  既不是  null  也不是  undefined  才会继续往下访问**，如果 user 是  null  或者  undefined，则表达式直接返回  undefined。

目前，可选链支持以下语法操作：

![](https://qiniu.espe.work/blog/20220518103621.png)

## 5. 内置工具范型

TypesScript 中内置了很多工具泛型，前面介绍过 Readonly、Extract 这两种，内置的泛型在 TypeScript 内置的 lib.es5.d.ts 中都有定义，所以不需要任何依赖就可以直接使用。

![](https://qiniu.espe.work/blog/20220518105020.png)

### 5.1 Partial

将一个接口的所有属性设置为可选状态

![](https://qiniu.espe.work/blog/20220518105114.png)

### 5.2 Required

作用刚好与 Partial 相反，就是将接口中所有可选的属性改为必须的：

![](https://qiniu.espe.work/blog/20220518111123.png)

### 5.3 Extract

提取公共属性

![](https://qiniu.espe.work/blog/20220518111028.png)

### 5.4 Exclude

排除某些属性

![](https://qiniu.espe.work/blog/20220518110848.png)

### 5.5 Pick

主要用于提取接口的某几个属性：

![](https://qiniu.espe.work/blog/20220518111233.png)

### 5.6 Omit

Omit 的作用刚好和 Pick 相反，主要用于剔除接口的某几个属性：

![](https://qiniu.espe.work/blog/20220518111601.png)
