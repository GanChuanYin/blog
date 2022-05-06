---
title: TypeScript强化
date: 2022-05-06 16:11:25
permalink: /pages/603a17/
categories:
  - 前端
tags:
  - TypeScript
---

### 泛型

<font color=#3498db>为什么需要泛型？</font>

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

默认参数

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

<font color=#3498db>约束泛型</font>

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

#### 泛型的一些应用

使用泛型，可以在定义函数、接口或类的时候，不预先指定具体类型，而是在使用的时候再指定类型。

<font color=#3498db>泛型约束类</font>

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

<font color=#3498db>泛型约束接口</font>

使用泛型，也可以对 interface 进行改造，让 interface 更灵活。

```typescript
interface IKeyValue<T, U> {
  key: T
  value: U
}

const k1: IKeyValue<number, string> = { key: 18, value: 'lin' }
const k2: IKeyValue<string, number> = { key: 'lin', value: 18 }
```

<font color=#3498db>泛型定义数组</font>

定义一个数组，我们之前是这么写的：

```typescript
const arr: number[] = [1, 2, 3]
```

现在这么写也可以：

```typescript
const arr: Array<number> = [1, 2, 3]
```

<font color=#3498db>实际开发 ：泛型约束后端接口参数类型</font>

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

#### 小结

泛型的作用

1. 增强程序的扩展性： 函数和类可以轻松支持多种类型
2. 合理运用可以避免冗长的联合类型和 any, 增强程序可读性
3. 灵活控制类型之间的约束
