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

### 2.2 Optional Properties

Object types can also specify that some or all of their properties are optional. To do this, add a ? after the property name:

```typescript
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: 'Bob' })
printName({ first: 'Alice', last: 'Alisson' })
```

In JavaScript, if you access a property that doesn’t exist, you’ll get the value undefined rather than a runtime error. Because of this, when you read from an optional property, <font color=#3498db>you’ll have to check for undefined before using it</font> .

```typescript
function printName(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
Object is possibly 'undefined'.
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase());
}
```

### 2.3 Union Types

#### 2.3.1 Defining a Union Type

A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union’s members.

Let’s write a function that can operate on strings or numbers:

```typescript
function printId(id: number | string) {
console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.

```

#### 2.3.2 Working with Union Types

It’s easy to provide a value matching a union type - simply provide a type matching any of the union’s members. If you have a value of a union type, how do you work with it?

TypeScript will only allow an operation if it is valid for every member of the union. For example, <font color=#3498db>if you have the union string | number, you can’t use methods that are only available on string:</font>

```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase())
  // Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}
```

The solution is to narrow the union with code, the same as you would in JavaScript without type annotations. Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.

For example, TypeScript knows that only a string value will have a typeof value "string":

```typescript
function printId(id: number | string) {
  if (typeof id === 'string') {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase())
  } else {
    // Here, id is of type 'number'
    console.log(id)
  }
}
```

Another example is to use a function like Array.isArray:

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log('Hello, ' + x.join(' and '))
  } else {
    // Here: 'x' is 'string'
    console.log('Welcome lone traveler ' + x)
  }
}
```

### 2.4 Interfaces

An interface declaration is another way to name an object type:

```typescript
interface Point {
  x: number
  y: number
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x)
  console.log("The coordinate's y value is " + pt.y)
}

printCoord({ x: 100, y: 100 })
```

Just like when we used a type alias above, the example works just as if we had used an anonymous object type. TypeScript is only concerned with the structure of the value we passed to printCoord - <font color=#e74c3c>it only cares that it has the expected properties. Being concerned only with the structure and capabilities of types is why we call TypeScript a structurally typed type system.</font>

#### 2.4.1 Differences Between Type Aliases and Interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely. <font color=#3498db>Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.</font>

![](https://qiniu.espe.work/blog/20220530105443.png)

![](https://qiniu.espe.work/blog/20220530105612.png)

### 2.5 Type Assertions

Sometimes you will have information about the type of a value that TypeScript can’t know about.

For example, if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.

In this situation, you can use a type assertion to specify a more specific type:

```typescript
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid. If this happens, you can use two assertions, first to any (or unknown, which we’ll introduce later), then to the desired type:

```typescript
const a = (expr as any) as T
```

### 2.6 Literal Types

In addition to the general types string and number, we can refer to specific strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both var and let allow for changing what is held inside the variable, and const does not. This is reflected in how TypeScript creates types for literals.

![](https://qiniu.espe.work/blog/20220531094319.png)

by combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

![](https://qiniu.espe.work/blog/20220531094410.png)

Numeric literal types work the same way:

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1
}
```

Of course, you can combine these with non-literal types:

```typescript
interface Options {
  width: number
}
function configure(x: Options | 'auto') {
  // ...
}
configure({ width: 100 })
configure('auto')
configure('automatic')
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

#### 2.6.1 Literal Inference

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later. For example, if you wrote code like this:

```typescript
const obj = { counter: 0 }
if (someCondition) {
  obj.counter = 1
}
```

TypeScript doesn’t assume the assignment of 1 to a field which previously had 0 is an error. Another way of saying this is that obj.counter must have the type number, not 0, because types are used to determine both reading and writing behavior.

The same applies to strings:

```typescript
const req = { url: 'https://example.com', method: 'GET' }
handleRequest(req.url, req.method)
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

In the above example req.method is inferred to be **string**, not "GET". Because code can be evaluated between the creation of req and the call of handleRequest which could assign a new string like "GUESS" to req.method, TypeScript considers this code to have an error.

There are two ways to work around this.

1. You can change the inference by adding a type assertion in either location:

```typescript
// Change 1:
const req = { url: 'https://example.com', method: 'GET' as 'GET' }
// Change 2
handleRequest(req.url, req.method as 'GET')
```

Change 1 means “I intend for req.method to always have the literal type "GET"”, preventing the possible assignment of "GUESS" to that field after.

Change 2 means “I know for other reasons that req.method has the value "GET"“.

2. You can use as const to convert the entire object to be type literals:

```typescript
const req = { url: 'https://example.com', method: 'GET' } as const
handleRequest(req.url, req.method)
```

The as const suffix acts like const but for the type system,
<font color=#3498db>ensuring that all properties are assigned the literal type instead of a more general version like string or number.</font>

### 2.7 null and undefined

TypeScript has two corresponding types by the same names. How these types behave depends on whether you have the strictNullChecks option on.

strictNullChecks on

With strictNullChecks on, when a value is null or undefined, you will need to test for those values before using methods or properties on that value.

Just like checking for undefined before using an optional property, we can use narrowing to check for values that might be null:

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log('Hello, ' + x.toUpperCase())
  }
}
```

**Non-null Assertion Operator (Postfix!)**

TypeScript also has a special syntax for removing null and undefined from a type without doing any explicit checking.

<font color=#3498db> Writing ! after any expression is effectively a type assertion that the value isn’t null or undefined:</font>

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed())
}
```

Just like other type assertions, this doesn’t change the runtime behavior of your code,

<font color=#e74c3c>so it’s important to only use ! when you know that the value can’t be null or undefined.</font>

### 2.8 Enums

Enums are a feature added to JavaScript by TypeScript which allows for **describing a value which could be one of a set of possible named constants**.

Unlike most TypeScript features, this is not a type-level addition to JavaScript but something added to the language and runtime. Because of this, it’s a feature which you should know exists

### 2.9 Less Common Primitives

It’s worth mentioning the rest of the primitives in JavaScript which are represented in the type system. Though we will not go into depth here.

#### 2.9.1 bigint

From ES2020 onwards, there is a primitive in JavaScript used for very large integers, BigInt:

```typescript
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100)

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n
```

#### 2.9.2 symbol

There is a primitive in JavaScript used to create a globally unique reference via the function Symbol():

```typescript
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
This condition will always return 'false' since the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // Can't ever happen
}
```

## 3. Narrowing

![](https://qiniu.espe.work/blog/20220531102705.png)

Within our if check, TypeScript sees typeof padding === "number" and understands that as a special form of code called a type guard.

TypeScript follows possible paths of execution that our programs can take to analyze the most specific possible type of a value at a given position. It looks at these special checks (called type guards) and assignments, and <font color=#e74c3c> the process of refining types to more specific types than declared is called narrowing</font>.

In many editors we can observe these types as they change, and we’ll even do so in our examples.

There are a couple of different constructs TypeScript understands for narrowing.

### 3.1 Type Guards

As we’ve seen, JavaScript supports a typeof operator which can give very basic information about the type of values we have at runtime. TypeScript expects this to return a certain set of strings:

- "string"
- "number"
- "bigint"
- "boolean"
- "symbol"
- "undefined"
- "object"
- "function"
