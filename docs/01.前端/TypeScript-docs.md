---
title: TypeScript-docs
date: 2022-05-25 23:50:55
permalink: /pages/448cf9/
categories:
  - 前端
tags:
  - TypeScript
---

[Typescript Official Website](https://www.typescriptlang.org/)

## 1. TypeScript for JavaScript Programmers

TypeScript stands in an unusual relationship to JavaScript. TypeScript offers all of JavaScript’s features, and an additional layer on top of these: TypeScript’s type system.

The main benefit of TypeScript is that it can highlight unexpected behavior in your code, <font color=#3498db>lowering the chance of bugs</font>.

There is already a small set of primitive types available in JavaScript: boolean, bigint, null, number, string, symbol, and undefined, which you can use in an interface.

### 1.1 Defining Types

TypeScript extends this list with a few more, such as any (allow anything), <font color=#3498db>unknown (ensure someone using this type declares what the type is)</font>, never (it’s not possible that this type could happen), and void (a function which returns undefined or has no return value).

You’ll see that there are two syntaxes for building types: Interfaces and Types. <font color=#e74c3c>You should prefer interface</font> . Use type when you need specific features.

### 1.2 Composing Types

With TypeScript, you can create complex types by combining simple ones. There are two popular ways to do so: with unions, and with generics.

#### 1.2.1 unions

A popular use-case for union types is to describe the set of string or number literals that a value is allowed to be:

```typescript
type WindowStates = 'open' | 'closed' | 'minimized'
type LockStates = 'locked' | 'unlocked'
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9
Try
```

you can make a function return different values depending on whether it is passed a string or an array:

![](https://qiniu.espe.work/blog/20220526095056.png)

#### 1.2.2 Generics

Generics provide variables to types. A common example is an array. An array without generics could contain anything. An array with generics can describe the values that the array contains.

```typescript
type StringArray = Array<string>
type NumberArray = Array<number>
type ObjectWithNameArray = Array<{ name: string }>
```

You can declare your own types that use generics:

```typescript
interface Backpack<Type> {
  add: (obj: Type) => void
  get: () => Type
}

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from.
declare const backpack: Backpack<string>

// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get()

// Since the backpack variable is a string, you can't pass a number to the add function.
backpack.add(23) //Argument of type 'number' is not assignable to parameter of type 'string'.
```

### 1.3 Structural Type System

One of TypeScript’s core principles is that type checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural typing”.

<font color=#e74c3c>In a structural type system, if two objects have the same shape, they are considered to be of the same type</font>.

```typescript
interface Point {
  x: number
  y: number
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`)
}

// logs "12, 26"
const point = { x: 12, y: 26 }
logPoint(point)
```

The point variable is never declared to be a Point type. However, <font color=#3498db> TypeScript compares the shape of point to the shape of Point in the type-check. They have the same shape, so the code passes</font> .

The shape-matching <font color=#e74c3c>only requires a subset of the object’s fields to match</font>.

```typescript
const point3 = { x: 12, y: 26, z: 89 }
logPoint(point3) // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 }
logPoint(rect) // logs "33, 3"

const color = { hex: '#187ABF' }
logPoint(color)
// Argument of type '{ hex: string; }' is not assignable to parameter of type 'Point'.Type '{ hex: string; }' is missing the following properties from type 'Point': x, y
```

There is no difference between how classes and objects conform to shapes:

```typescript
class VirtualPoint {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

const newVPoint = new VirtualPoint(13, 56)
logPoint(newVPoint) // logs "13, 56"
```

<font color=#3498db>If the object or class has all the required properties, TypeScript will say they match, regardless of the implementation details.</font>

## 2. The TypeScript Handbook

The most common kinds of errors that programmers write can be described as type errors: a certain kind of value was used where a different kind of value was expected.

This could be due to simple typos, a failure to understand the API surface of a library, incorrect assumptions about runtime behavior, or other errors.

<font color=#3498db>The goal of TypeScript is to be a static typechecker for JavaScript programs - in other words, a tool that runs before your code runs (static) and ensures that the types of the program are correct (typechecked).</font>

### 2.1 The Basics

a type is the concept of describing which values can be passed to fn and which will crash. <font color=#3498db>JavaScript only truly provides dynamic typing - running the code to see what happens.</font>

<font color=#3498db>The alternative is to use a static type system to make predictions about what code is expected before it runs.</font>

### 2.2 Static type-checking


