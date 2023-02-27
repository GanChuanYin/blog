---
title: TypeScript泛型generic
date: 2022-12-13 10:36:33
permalink: /pages/0d2c76/
categories:
  - 前端
tags:
  - 
---
## 一、 Generic Functions

假设一个很常见的场景: 返回数组中的第一个元素

```typescript
function firstElement(arr: any[]) {
  return arr[0]
}
```

这样可以满足需求, 但是返回的类型是 any, 我们期望的是: 输入什么类型的数组, 就返回什么类型, 这可以做到吗?

引入 `Generic 泛型` 就可以

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0]
}

// s is of type 'string'
const s = firstElement(['a', 'b', 'c'])
// n is of type 'number'
const n = firstElement([1, 2, 3])
// u is of type undefined
const u = firstElement([])
```

更复杂的情况, 泛型也可以轻松应对

```typescript
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func)
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(['1', '2', '3'], (n) => parseInt(n))
```

上例中 Input Output 的类型都是不确定的, 但是通过泛型和类型推导可以得到预期的类型

### 搭配 extends 更进一步

前面我们只是推导出了输入输出的类型, 它们是确定的, 但是有时候我们想找出类型的 `共性` : 只要满足某种条件的类型都可以.、

比如: 有 length 属性的类型

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a
  } else {
    return b
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3])
// longerString is of type 'alice' | 'bob'
const longerString = longest('alice', 'bob')
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100) // Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

数组和字符串类型对象有 `.length` 属性, 而数字没有, 所以报错

再看下一个例子:

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj
  } else {
    return { length: minimum }
  }
}
```

上面代码在 'return { length: minimum }' 这一行报错了

```shell
Type '{ length: number; }' is not assignable to type 'Type'.
  '{ length: number; }' is assignable to the constraint of type 'Type', but 'Type' could be instantiated with a different subtype of constraint '{ length: number; }'.
```

问题是: 该函数承诺返回与传入 `相同类型` 的对象，而不仅仅是某个符合约束条件的对象。
