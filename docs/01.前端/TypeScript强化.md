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

### 1.2 偏好使用 interface 还是 type 来定义类型？

从扩展的角度来说，type 比 interface 更方便拓展一些，假如有以下两个定义：

```typescript
type Name = { name: string }
interface IName {
  name: string
}
```

想要做类型的扩展的话，type 只需要一个&，而 interface 要多写不少代码。

```typescript
type Person = Name & { age: number }
interface IPerson extends IName {
  age: number
}
```

另外 type 有一些 interface 做不到的事情，比如使用|进行枚举类型的组合，使用 typeof 获取定义的类型等等。

不过 interface 有一个比较强大的地方就是可以 <font color=#00dddd size=4>重复定义添加属性</font> ，比如我们需要给 window 对象添加一个自定义的属性或者方法，那么我们直接基于其 Interface 新增属性就可以了。

```typescript
declare global {
  interface Window {
    MyNamespace: any
  }
}
```

总体来说，大家知道 TS 是类型兼容而不是类型名称匹配的，所以一般不需用面向对象的场景或者不需要修改全局类型的场合，我一般都是用 type 来定义类型。

### 1.3 小结

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

泛型中的 T 就像一个 <font color=#dd0000 size=4>占位符</font> 、或者说一个变量，在使用的时候可以把定义的类型像参数一样传入，它可以原封不动地输出。

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

## 6. unknown

unknown 指的是不可预先定义的类型，在很多场景下，它可以替代 any 的功能同时保留静态检查的能力。

```typescript
const num: number = 10
;((num as unknown) as string).split('') // 注意，这里和any一样完全可以通过静态检查
```

这个时候 unknown 的作用就跟 any 高度类似了，你可以把它转化成任何类型，不同的地方是，在静态编译的时候，unknown 不能调用任何方法，而 any 可以。

```typescript
const foo: unknown = 'string'
foo.substr(1) // Error: 静态检查不通过报错

const bar: any = 10
bar.substr(1) // Pass: any 类型相当于放弃了静态检查
```

unknown 的一个使用场景是，避免使用 any 作为函数的参数类型而导致的静态类型检查 bug：

```typescript
function test(input: unknown): number {
  if (Array.isArray(input)) {
    return input.length // Pass: 这个代码块中，类型守卫已经将 input 识别为 array 类型
  }
  return input.length // Error: 这里的 input 还是 unknown 类型，静态检查报错。如果入参是 any，则会放弃检查直接成功，带来报错风险
}
```

## 7. 可选链运算符 ?.

?.是开发者最需要的运行时(当然编译时也有效)的非空判断。

```typescript
obj?.prop    obj?.[index]    func?.(args)

```

复制代码
?.用来判断左侧的表达式是否是 null | undefined，如果是则会停止表达式运行，可以减少我们大量的&&运算。

比如我们写出 a?.b 时，编译器会自动生成如下代码

```typescript
a === null || a === void 0 ? void 0 : a.b
```

这里涉及到一个小知识点:undefined 这个值在非严格模式下会被重新赋值，使用 void 0 必定返回真正的 undefined。

## 8. 键值获取 keyof

keyof 可以获取一个类型所有键值，返回一个联合类型，如下：

```typescript
type Person = {
  name: string
  age: number
}

type PersonKey = keyof Person // PersonKey 得到的类型为 'name' | 'age'
```

keyof 的一个典型用途是限制访问对象的 key 合法化，因为 any 做索引是不被接受的。

```typescript
function getValue(p: Person, k: keyof Person) {
  return p[k] // 如果 k 不如此定义，则无法以 p[k]的代码格式通过编译
}
```

## 9. 遍历属性 in

in 只能用在类型的定义中，可以对枚举类型进行遍历，如下：

```typescript
// 这个类型可以将任何类型的键值转化成number类型
type TypeToNumber<T> = {
  [key in keyof T]: number
}
```

keyof 返回泛型 T 的所有键枚举类型，key 是自定义的任何变量名，中间用 in 链接，外围用[]包裹起来(这个是固定搭配)，冒号右侧 number 将所有的 key 定义为 number 类型。

于是可以这样使用了：

```typescript
const obj: TypeToNumber<Person> = { name: 10, age: 10 }
```

总结起来 in 的语法格式如下：

```shell
[ 自定义变量名 in 枚举类型 ]: 类型
```


