---
title: typescript-tik
date: 2022-12-08 10:39:59
permalink: /pages/633bce/
categories:
  - 前端
tags:
  - 
---
- The only way in pure JavaScript to tell what fn does with a particular value is to call it and see what happens,typescript use a static type system to make predictions about what code is expected before it runs.

`uncalled functions`

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221208110947.png)

- it’s best `not` to add annotations when the type system would end up inferring the same type anyway.

```javascript
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = 'Alice'
```

Much like variable type annotations, you usually <font color=#dd0000 size=4>don’t need</font> a return type annotation because TypeScript will infer the function’s return type based on its return statements.

### noImplicitAny

When you don’t specify a type, and TypeScript can’t infer it from context, the compiler will typically default to any.

You usually want to avoid this, though, because any isn’t type-checked. Use the compiler flag noImplicitAny to flag any implicit any as an error.

### Optional Properties

In JavaScript, if you access a property that doesn’t exist, you’ll get the value `undefined` rather than a runtime error. Because of this, when you read from an optional property, you’ll have to check for `undefined` before using it.

```javascript
function printName(obj: { first: string, last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase())
  // Object is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase())
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase())
}
```

### Type Assertions

For example, if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.

In this situation, you can use a type assertion to specify a more specific type:

```typescript
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement
```

Like a type annotation, type assertions are removed by the compiler and won’t affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a .tsx file), which is equivalent:

```typescript
const myCanvas = <HTMLCanvasElement>document.getElementById('main_canvas')
```

> Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. <font color=#dd0000 size=4> There won’t be an exception or null generated if the type assertion is wrong</font> .

### Literal Types

In addition to the general types `string` and `number`, we can refer to `specific` strings and numbers in type positions.

by combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```typescript
function printText(s: string, alignment: 'left' | 'right' | 'center') {
  // ...
}
printText('Hello, world', 'left')
printText("G'day, mate", 'centre') // Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

Numeric literal types work the same way:

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1
}
```

### Non-null Assertion Operator (Postfix)

TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking. Writing `!` after any expression is effectively a type assertion that the value isn’t null or undefined:
