---
title: TypeScript-docs
date: 2022-05-25 23:50:55
permalink: /pages/448cf9/
categories:
  - 前端
tags:
  - TypeScript
---

> The way to learn something well is to read the official documentation

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

### 3.2 Truthiness narrowing

Truthiness might not be a word you’ll find in the dictionary, but it’s very much something you’ll hear about in JavaScript.

```typescript
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === 'object') {
    for (const s of strs) {
      console.log(s)
    }
  } else if (typeof strs === 'string') {
    console.log(strs)
  }
}
```

Keep in mind though that truthiness checking on primitives can often be error prone. As an example, consider a different attempt at writing printAll

```typescript
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === 'object') {
      for (const s of strs) {
        console.log(s)
      }
    } else if (typeof strs === 'string') {
      console.log(strs)
    }
  }
}
```

We wrapped the entire body of the function in a truthy check, but this has a subtle downside: we may no longer be handling the <font color=#3498db>empty string </font> case correctly.

### 3.3 Equality narrowing

TypeScript also uses switch statements and equality checks like ===, !==, ==, and != to narrow types. For example:

![](https://qiniu.espe.work/blog/20220601102756.png)

When we checked that x and y are both equal in the above example, TypeScript knew their types also had to be equal. Since string is the only common type that both x and y could take on, TypeScript knows that x and y must be a string in the first branch.

JavaScript’s looser equality checks with == and != also get narrowed correctly. If you’re unfamiliar, <font color=#3498db> checking whether something == null actually not only checks whether it is specifically the value null - it also checks whether it’s potentially undefined.</font> The same applies to == undefined: it checks whether a value is either null or undefined.

![](https://qiniu.espe.work/blog/20220601103336.png)

### 3.4 The <font color=#3498db> in </font> operator narrowing

JavaScript has an operator for determining if an object has a property with a name: the in operator. TypeScript takes this into account as a way to narrow down potential types.

For example, with the code: "value" in x. where "value" is a string literal and x is a union type. The “true” branch narrows x’s types which have either an optional or required property value, and the “false” branch narrows to types which have an optional or missing property value.

```typescript
type Fish = { swim: () => void }
type Bird = { fly: () => void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    return animal.swim()
  }

  return animal.fly()
}
```

To reiterate optional properties will exist in both sides for narrowing, for example a human could both swim and fly (with the right equipment) and thus should show up in both sides of the in check:

![](https://qiniu.espe.work/blog/20220601104809.png)

### 3.5 instanceof narrowing

JavaScript has an operator for checking whether or not a value is an “instance” of another value. More specifically, in JavaScript x instanceof Foo checks whether the prototype chain of x contains Foo.prototype. While we won’t dive deep here, and you’ll see more of this when we get into classes, they can still be useful for most values that can be constructed with new. As you might have guessed, instanceof is also a type guard, and TypeScript narrows in branches guarded by instanceof s.

![](https://qiniu.espe.work/blog/20220602094507.png)

### 3.6 Assignments

As we mentioned earlier, when we assign to any variable, TypeScript looks at the right side of the assignment and narrows the left side appropriately

![](https://qiniu.espe.work/blog/20220602094631.png)

Notice that each of these assignments is valid. Even though the observed type of x changed to number after our first assignment, we were still able to assign a string to x. This is because the declared type of x - the type that x started with - is string | number, and <font color=#3498db>assignability is always checked against the declared type.</font>

If we’d assigned a boolean to x, we’d have seen an error since that wasn’t part of the declared type.

![](https://qiniu.espe.work/blog/20220602095050.png)

### 3.7 Control flow analysis

Up until this point, we’ve gone through some basic examples of how TypeScript narrows within specific branches. But there’s a bit more going on than just walking up from every variable and looking for type guards in ifs, whiles, conditionals, etc. For example

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + input
  }
  return padding + input
}
```

padLeft returns from within its first if block. TypeScript was able to analyze this code and see that the rest of the body (return padding + input;) is unreachable in the case where padding is a number. As a result, it was able to remove number from the type of padding (narrowing from string | number to string) for the rest of the function.

This analysis of code based on reachability is called control flow analysis, and <font color=#3498db>TypeScript uses this flow analysis to narrow types as it encounters type guards and assignments</font> . When a variable is analyzed, control flow can split off and re-merge over and over again, and that variable can be observed to have a different type at each point.

![](https://qiniu.espe.work/blog/20220602095713.png)

### 3.8 Using type predicates

We’ve worked with existing JavaScript constructs to handle narrowing so far, however sometimes you want more direct control over how types change throughout your code.

To define a user-defined type guard, we simply need to define a function whose return type is a type predicate:

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}
```

pet is Fish is our type predicate in this example. A predicate takes the form parameterName is Type, where parameterName must be the name of a parameter from the current function signature.

Any time isFish is called with some variable, TypeScript will narrow that variable to that specific type if the original type is compatible.

```typescript
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet()

if (isFish(pet)) {
  pet.swim()
} else {
  pet.fly()
}
```

Notice that TypeScript not only knows that pet is a Fish in the if branch; it also knows that in the else branch, you don’t have a Fish, so you must have a Bird.

You may use the type guard isFish to filter an array of Fish | Bird and obtain an array of Fish:

```typescript
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()]
const underWater1: Fish[] = zoo.filter(isFish)
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[]

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === 'sharkey') return false
  return isFish(pet)
})
```

### <font color=#e74c3c>3.8 Discriminated unions</font>

For some motivation, let’s imagine we’re trying to encode shapes like circles and squares. Circles keep track of their radiuses and squares keep track of their side lengths. We’ll use a field called kind to tell which shape we’re dealing with. Here’s a first attempt at defining Shape.

```typescript
interface Shape {
  kind: 'circle' | 'square'
  radius?: number
  sideLength?: number
}
```

Notice we’re using a union of string literal types: "circle" and "square" to tell us whether we should treat the shape as a circle or square respectively. By using "circle" | "square" instead of string, we can avoid misspelling issues.

![](https://qiniu.espe.work/blog/20220602101728.png)

We can write a getArea function that applies the right logic based on if it’s dealing with a circle or square. We’ll first try dealing with circles.

![](https://qiniu.espe.work/blog/20220602101826.png)

Under strictNullChecks that gives us an error - which is appropriate since radius might not be defined. But what if we perform the appropriate checks on the kind property?

![](https://qiniu.espe.work/blog/20220602101900.png)

Hmm, <font color=#3498db>TypeScript still doesn’t know what to do here. We’ve hit a point where we know more about our values than the type checker does</font>. We could try to use a non-null assertion (a ! after shape.radius) to say that radius is definitely present.

![](https://qiniu.espe.work/blog/20220602101943.png)

But this doesn’t feel ideal. <font color=#e74c3c>We had to shout a bit at the type-checker with those non-null assertions (!) to convince it that shape</font> .radius was defined, <font color=#e74c3c> but those assertions are error-prone if we start to move code around. </font> Additionally, outside of strictNullChecks we’re able to accidentally access any of those fields anyway (since optional properties are just assumed to always be present when reading them). **We can definitely do better.**

The problem with this encoding of Shape is that the <font color=#e74c3c>type-checker doesn’t have any way to know whether or not radius or sideLength are present based on the kind property. We need to communicate what we know to the type checker.</font> With that in mind, let’s take another swing at defining Shape.

![](https://qiniu.espe.work/blog/20220602102253.png)

Here, <font color=#3498db>we’ve properly separated Shape out into two types with different values for the kind property, but radius and sideLength are declared as required properties in their respective types.</font>

Let’s see what happens here when we try to access the radius of a Shape.

![](https://qiniu.espe.work/blog/20220602102856.png)

Like with our first definition of Shape, this is still an error. When radius was optional, we got an error (with strictNullChecks enabled) because TypeScript couldn’t tell whether the property was present. Now that Shape is a union, TypeScript is telling us that shape might be a Square, and Squares don’t have radius defined on them! Both interpretations are correct, but only the union encoding of Shape will cause an error regardless of how strictNullChecks is configured.

But what if we tried checking the kind property again?

![](https://qiniu.espe.work/blog/20220602103053.png)

That got rid of the error! When every type in a union contains a common property with literal types, TypeScript considers that to be a discriminated union, and can narrow out the members of the union.

In this case, kind was that common property (which is what’s considered a discriminant property of Shape). Checking whether the kind property was "circle" got rid of every type in Shape that didn’t have a kind property with the type "circle". That narrowed shape down to the type Circle.

The same checking works with switch statements as well. Now we can try to write our complete getArea without any pesky ! non-null assertions.

![](https://qiniu.espe.work/blog/20220602104638.png)

The important thing here was the encoding of Shape. **Communicating the right information to TypeScript** - that Circle and Square were really two separate types with specific kind fields - was crucial. Doing that let us write type-safe TypeScript code that looks no different than the JavaScript we would’ve written otherwise. From there, the type system was able to do the “right” thing and figure out the types in each branch of our switch statement.

> As an aside, try playing around with the above example and remove some of the return keywords. You’ll see that type-checking can help avoid bugs when accidentally falling through different clauses in a switch statement.

Discriminated unions are useful for more than just talking about circles and squares. They’re good for representing any sort of messaging scheme in JavaScript, like when sending messages over the network (client/server communication), or encoding mutations in a state management framework.

### 3.9 The never type

When narrowing, you can reduce the options of a union to a point where you have removed all possibilities and have nothing left. In those cases, TypeScript will use a never type to represent a state which shouldn’t exist.

### 3.10 Exhaustiveness checking

<font color=#e74c3c>The never type is assignable to every type; however, no type is assignable to never (except never itself). </font> This means you can use narrowing and rely on never turning up to do exhaustive checking in a switch statement.

For example, adding a default to our getArea function which tries to assign the shape to never will raise when every possible case has not been handled.

![](https://qiniu.espe.work/blog/20220602143350.png)

Adding a new member to the Shape union, will cause a TypeScript error:

![](https://qiniu.espe.work/blog/20220602143423.png)

## 4. More on Functions

### 4.1 Function Type Expressions

The simplest way to describe a function is with a function type expression. These types are syntactically similar to arrow functions:

```typescript
function greeter(fn: (a: string) => void) {
  fn('Hello, World')
}

function printToConsole(s: string) {
  console.log(s)
}

greeter(printToConsole)
```

The syntax (a: string) => void means “a function with one parameter, named a, of type string, that doesn’t have a return value”. Just like with function declarations, <font color=#3498db>if a parameter type isn’t specified, it’s implicitly any.</font>

> Note that the parameter name is required. The function type (string) => void means “a function with a parameter named string of type any“!

Of course, we can use a type alias to name a function type:

```typescript
type GreetFunction = (a: string) => void
function greeter(fn: GreetFunction) {
  // ...
}
```

### 4.2 Call Signatures

In JavaScript, functions can have properties in addition to being callable. However, the function type expression syntax doesn’t allow for declaring properties. If we want to describe something callable with properties, we can write a call signature in an object type:

```typescript
type DescribableFunction = {
  description: string
  (someArg: number): boolean
}
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + ' returned ' + fn(6))
}
```

Note that the syntax is slightly different compared to a function type expression - use : between the parameter list and the return type rather than =>.

### 4.3 Construct Signatures

JavaScript functions can also be invoked with the new operator. TypeScript refers to these as constructors because they usually create a new object. You can write a construct signature by adding the new keyword in front of a call signature:

```typescript
type SomeConstructor = {
  new (s: string): SomeObject
}
function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}
```

Some objects, like JavaScript’s Date object, can be called with or without new. You can combine call and construct signatures in the same type arbitrarily:

```typescript
interface CallOrConstruct {
  new (s: string): Date
  (n?: number): number
}
```

### 4.4 Generic Functions

It’s common to write a function where the types of the input relate to the type of the output, or where the types of two inputs are related in some way. Let’s consider for a moment a function that returns the first element of an array:

```typescript
function firstElement(arr: any[]) {
  return arr[0]
}
```

This function does its job, but unfortunately has the return type any. It’d be better if the function returned the type of the array element.

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0]
}
```

By adding a type parameter Type to this function and using it in two places, we’ve created a link between the input of the function (the array) and the output (the return value). Now when we call it, a more specific type comes out:

```typescript
// s is of type 'string'
const s = firstElement(['a', 'b', 'c'])
// n is of type 'number'
const n = firstElement([1, 2, 3])
// u is of type undefined
const u = firstElement([])
```

**Inference**

Note that we didn’t have to specify Type in this sample. The type was inferred - chosen automatically - by TypeScript.

We can use multiple type parameters as well. For example, a standalone version of map would look like this:

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

Note that in this example, TypeScript could infer both the type of the Input type parameter (from the given string array), as well as the Output type parameter based on the return value of the function expression (number).

**Constraints**

We’ve written some generic functions that can work on any kind of value. Sometimes we want to relate two values, but can only operate on a certain subset of values. In this case, we can use a constraint to limit the kinds of types that a type parameter can accept.

Let’s write a function that returns the longer of two values. To do this, we need a length property that’s a number. We constrain the type parameter to that type by writing an extends clause:

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
const notOK = longest(10, 100)

// Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

There are a few interesting things to note in this example. We allowed TypeScript to infer the return type of longest. Return type inference also works on generic functions.

Because we constrained Type to { length: number }, we were allowed to access the .length property of the a and b parameters. Without the type constraint, we wouldn’t be able to access those properties because the values might have been some other type without a length property.

The types of longerArray and longerString were inferred based on the arguments. Remember, generics are all about relating two or more values with the same type!

Finally, just as we’d like, the call to longest(10, 100) is rejected because the number type doesn’t have a .length property.

**Working with Constrained Values**

Here’s a common error when working with generic constraints:

![](https://qiniu.espe.work/blog/20220603172718.png)

It might look like this function is OK - Type is constrained to { length: number }, and the function either returns Type or a value matching that constraint. The problem is that the function promises to return the same kind of object as was passed in, not just some object matching the constraint. If this code were legal, you could write code that definitely wouldn’t work:

```typescript
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6)
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0))
```

### 4.5 Specifying Type Arguments

TypeScript can usually infer the intended type arguments in a generic call, but not always. For example, let’s say you wrote a function to combine two arrays:

```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2)
}
```

Normally it would be an error to call this function with mismatched arrays:

```typescript
const arr = combine([1, 2, 3], ['hello'])
// Type 'string' is not assignable to type 'number'.
```

If you intended to do this, however, you could manually specify Type:

```typescript
const arr = combine<string | number>([1, 2, 3], ['hello']).
```

**Guidelines for Writing Good Generic Functions**

### 4.6 Push Type Parameters Down

Here are two ways of writing a function that appear similar:

```typescript
function firstElement1<Type>(arr: Type[]) {
  return arr[0]
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0]
}

// a: number (good)
const a = firstElement1([1, 2, 3])
// b: any (bad)
const b = firstElement2([1, 2, 3])
```

These might seem identical at first glance, but firstElement1 is a much better way to write this function. Its inferred return type is Type, but firstElement2’s inferred return type is any because TypeScript has to resolve the arr[0] expression using the constraint type, rather than “waiting” to resolve the element during a call.

> Rule: When possible, use the type parameter itself rather than constraining it

<font color=#3498db>Use Fewer Type Parameters</font>

Here’s another pair of similar functions:

```typescript
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func)
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func)
}
```

We’ve created a type parameter Func that doesn’t relate two values. That’s always a red flag, because it means callers wanting to specify type arguments have to manually specify an extra type argument for no reason. Func doesn’t do anything but make the function harder to read and reason about!

> Rule: Always use as few type parameters as possible

### 4.7 Type Parameters Should Appear Twice

Sometimes we forget that a function might not need to be generic:

```typescript
function greet<Str extends string>(s: Str) {
  console.log('Hello, ' + s)
}

greet('world')
```

We could just as easily have written a simpler version:

```typescript
function greet(s: string) {
  console.log('Hello, ' + s)
}
```

Remember, type parameters are for relating the types of multiple values. <font color=#e74c3c> If a type parameter is only used once in the function signature, it’s not relating anything.</font>

> Rule: If a type parameter only appears in one location, strongly reconsider if you actually need it

### 4.8 Optional Parameters

Functions in JavaScript often take a variable number of arguments. For example, the toFixed method of number takes an optional digit count:

```typescript
function f(n: number) {
  console.log(n.toFixed()) // 0 arguments
  console.log(n.toFixed(3)) // 1 argument
}
```

We can model this in TypeScript by marking the parameter as optional with ?:

```typescript
function f(x?: number) {
  // ...
}
f() // OK
f(10) // OK
```

Although the parameter is specified as type number, the x parameter will actually have the type number | undefined because unspecified parameters in JavaScript get the value undefined.

You can also provide a parameter default:

```typescript
function f(x = 10) {
  // ...
}
```

Now in the body of f, x will have type number because any undefined argument will be replaced with 10. Note that when a parameter is optional, callers can always pass undefined, as this simply simulates a “missing” argument:

```typescript
declare function f(x?: number): void
// cut
// All OK
f()
f(10)
f(undefined)
```

### 4.9 Optional Parameters in Callbacks

Once you’ve learned about optional parameters and function type expressions, it’s very easy to make the following mistakes when writing functions that invoke callbacks:

```typescript
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i)
  }
}
```

What people usually intend when writing index? as an optional parameter is that they want both of these calls to be legal:

```typescript
myForEach([1, 2, 3], (a) => console.log(a))
myForEach([1, 2, 3], (a, i) => console.log(a, i))
```

What this actually means is that callback might get invoked with one argument. In other words, the function definition says that the implementation might look like this:

```typescript
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // I don't feel like providing the index today
    callback(arr[i])
  }
}
```

In turn, TypeScript will enforce this meaning and issue errors that aren’t really possible:

```typescript
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed())
  // Object is possibly 'undefined'.
})
```

<font color=#3498db>In JavaScript, if you call a function with more arguments than there are parameters, the extra arguments are simply ignored. TypeScript behaves the same way.</font> Functions with fewer parameters (of the same types) can always take the place of functions with more parameters.

> When writing a function type for a callback, never write an optional parameter unless you intend to call the function without passing that argument

### 4.10 Function Overloads

In TypeScript, we can specify a function that can be called in different ways by writing overload signatures. To do this, write some number of function signatures (usually two or more), followed by the body of the function:

```typescript
function makeDate(timestamp: number): Date
function makeDate(m: number, d: number, y: number): Date
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d)
  } else {
    return new Date(mOrTimestamp)
  }
}
const d1 = makeDate(12345678)
const d2 = makeDate(5, 5, 5)
const d3 = makeDate(1, 3)
// No overload expects 2 arguments, but overloads do exist that expect either 1 or 3 arguments.
```

In this example, we wrote two overloads: one accepting one argument, and another accepting three arguments. These first two signatures are called the overload signatures.

Then, we wrote a function implementation with a compatible signature. Functions have an implementation signature, but this signature can’t be called directly. Even though we wrote a function with two optional parameters after the required one, it can’t be called with two parameters!

### 4.11 Overload Signatures and the Implementation Signature

This is a common source of confusion. Often people will write code like this and not understand why there is an error:

```typescript
function fn(x: string): void
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn()
// Expected 1 arguments, but got 0.
```

<font color=#3498db>Again, the signature used to write the function body can’t be “seen” from the outside.</font>

> The signature of the implementation is not visible from the outside. When writing an overloaded function, you should always have two or more signatures above the implementation of the function.

The implementation signature must also be compatible with the overload signatures. For example, these functions have errors because the implementation signature doesn’t match the overloads in a correct way:

```typescript
function fn(x: boolean): void
// Argument type isn't right
function fn(x: string): void
// This overload signature is not compatible with its implementation signature.
function fn(x: boolean) {}
```

```typescript
function fn(x: string): string
// Return type isn't right
function fn(x: number): boolean
// This overload signature is not compatible with its implementation signature.
function fn(x: string | number) {
  return 'oops'
}
```

### 4.12 Writing Good Overloads

Like generics, there are a few guidelines you should follow when using function overloads. Following these principles will make your function easier to call, easier to understand, and easier to implement.

Let’s consider a function that returns the length of a string or an array:

```typescript
function len(s: string): number
function len(arr: any[]): number
function len(x: any) {
  return x.length
}
```

This function is fine; we can invoke it with strings or arrays. However, we can’t invoke it with a value that might be a string or an array, because TypeScript can only resolve a function call to a single overload:

```typescript
len('') // OK
len([0]) // OK
len(Math.random() > 0.5 ? 'hello' : [0])
```

![](https://qiniu.espe.work/blog/20220604163056.png)

Because both overloads have the same argument count and same return type, we can instead write a non-overloaded version of the function:

```typescript
function len(x: any[] | string) {
  return x.length
}
```

This is much better! Callers can invoke this with either sort of value, and as an added bonus, we don’t have to figure out a correct implementation signature.

> <font color=#e74c3c>Always prefer parameters with union types instead of overloads when possible</font>

### 4.13 Declaring this in a Function

TypeScript will infer what the this should be in a function via code flow analysis, for example in the following:

```typescript
const user = {
  id: 123,

  admin: false,
  becomeAdmin: function() {
    this.admin = true
  }
}
```

TypeScript understands that the function user.becomeAdmin has a corresponding this which is the outer object user.

this, heh, can be enough for a lot of cases, but there are a lot of cases where you need more control over what object this represents.

The JavaScript specification states that you cannot have a parameter called this, and so TypeScript uses that syntax space to let you declare the type for this in the function body.

```typescript
interface DB {
  filterUsers(filter: (this: User) => boolean): User[]
}

const db = getDB()
const admins = db.filterUsers(function(this: User) {
  return this.admin
})
```

This pattern is common with callback-style APIs, where another object typically controls when your function is called. <font color=#e74c3c> Note that you need to use function and not arrow functions to get this behavior:
</font>

![](https://qiniu.espe.work/blog/20220604164544.png)

### 4.14 Other Types to Know About

There are some additional types you’ll want to recognize that appear often when working with function types. Like all types, you can use them everywhere, but these are especially relevant in the context of functions.

**void**

void represents the return value of functions which don’t return a value. It’s the inferred type any time a function doesn’t have any return statements, or doesn’t return any explicit value from those return statements:

```typescript
// The inferred return type is void
function noop() {
  return
}
```

In JavaScript, a function that doesn’t return any value will implicitly return the value undefined. However, void and undefined are not the same thing in TypeScript. There are further details at the end of this chapter.

> <font color=#e74c3c>void is not the same as undefined.</font>

**unknown**

The unknown type represents any value. This is similar to the any type, but is safer because it’s not legal to do anything with an unknown value:

```typescript
function f1(a: any) {
  a.b() // OK
}
function f2(a: unknown) {
  a.b()
  // Object is of type 'unknown'.
}
```

This is useful when describing function types because you can describe functions that accept any value without having any values in your function body.

Conversely, you can describe a function that returns a value of unknown type:

```typescript
function safeParse(s: string): unknown {
  return JSON.parse(s)
}

// Need to be careful with 'obj'!
const obj = safeParse(someRandomString)
```

**never**

Some functions never return a value:

```typescript
function fail(msg: string): never {
  throw new Error(msg)
}
```

The never type represents values which are never observed. In a return type, this means that the function throws an exception or terminates execution of the program.

never also appears when TypeScript determines there’s nothing left in a union.

```typescript
function fn(x: string | number) {
  if (typeof x === 'string') {
    // do something
  } else if (typeof x === 'number') {
    // do something else
  } else {
    x // has type 'never'!
  }
}
```

**Function**

The global type Function describes properties like bind, call, apply, and others present on all function values in JavaScript. It also has the special property that values of type Function can always be called; these calls return any:

```typescript
function doSomething(f: Function) {
  return f(1, 2, 3)
}
```

This is an untyped function call and is generally best avoided because of the unsafe any return type.

If you need to accept an arbitrary function but don’t intend to call it, the type () => void is generally safer.

### 4.15 Rest Parameters and Arguments

**Rest Parameters**

In addition to using optional parameters or overloads to make functions that can accept a variety of fixed argument counts, we can also define functions that take an unbounded number of arguments using rest parameters.

A rest parameter appears after all other parameters, and uses the ... syntax:

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x)
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4)
```

**Rest Arguments**

Conversely, we can provide a variable number of arguments from an array using the spread syntax. For example, the push method of arrays takes any number of arguments:

```typescript
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]
arr1.push(...arr2)
```

Note that in general, TypeScript does not assume that arrays are immutable. This can lead to some surprising behavior:

![](https://qiniu.espe.work/blog/20220604174956.png)

The best fix for this situation depends a bit on your code, but in general a const context is the most straightforward solution:

```typescript
// Inferred as 2-length tuple
const args = [8, 5] as const
// OK
const angle = Math.atan2(...args)
```

### 4.16 Parameter Destructuring

You can use parameter destructuring to conveniently unpack objects provided as an argument into one or more local variables in the function body. In JavaScript, it looks like this:

```typescript
function sum({ a, b, c }) {
  console.log(a + b + c)
}
sum({ a: 10, b: 3, c: 9 })
```

The type annotation for the object goes after the destructuring syntax:

```typescript
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c)
}
```

This can look a bit verbose, but you can use a named type here as well:

```typescript
// Same as prior example
type ABC = { a: number; b: number; c: number }
function sum({ a, b, c }: ABC) {
  console.log(a + b + c)
}
```

## 5. Object Types

In JavaScript, the fundamental way that we group and pass around data is through objects. In TypeScript, we represent those through object types.

As we’ve seen, they can be anonymous:

```typescript
function greet(person: { name: string; age: number }) {
  return 'Hello ' + person.name
}
```

or they can be named by using either an <font color=#3498db>interface</font>

```typescript
interface Person {
  name: string
  age: number
}

function greet(person: Person) {
  return 'Hello ' + person.name
}
```

or a type alias.

```typescript
type Person = {
  name: string
  age: number
}

function greet(person: Person) {
  return 'Hello ' + person.name
}
```

### 5.1 Property Modifiers

**readonly Properties**

Properties can also be marked as readonly for TypeScript. While it won’t change any behavior at runtime, a property marked as readonly can’t be written to during type-checking.

```typescript
interface SomeType {
  readonly prop: string
}

function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`)

  // But we can't re-assign it.
  obj.prop = 'hello'
  // Cannot assign to 'prop' because it is a read-only property.
}
```

Using the readonly modifier doesn’t necessarily imply that a value is totally immutable - or in other words, that its internal contents can’t be changed. It just means the property itself can’t be re-written to.

```typescript
interface Home {
  readonly resident: { name: string; age: number }
}

function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`)
  home.resident.age++
}

function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  home.resident = {
    // Cannot assign to 'resident' because it is a read-only property.
    name: 'Victor the Evictor',
    age: 42
  }
}
```

It’s important to manage expectations of what readonly implies. It’s useful to signal intent during development time for TypeScript on how an object should be used.

<font color=#3498db>TypeScript doesn’t factor in whether properties on two types are readonly when checking whether those types are compatible, so readonly properties can also change via aliasing.
</font>

```typescript
interface Person {
  name: string
  age: number
}

interface ReadonlyPerson {
  readonly name: string
  readonly age: number
}

let writablePerson: Person = {
  name: 'Person McPersonface',
  age: 42
}

// works
let readonlyPerson: ReadonlyPerson = writablePerson

console.log(readonlyPerson.age) // prints '42'
writablePerson.age++
console.log(readonlyPerson.age) // prints '43'
```

**Index Signatures**

Sometimes you don’t know all the names of a type’s properties ahead of time, but you do know the shape of the values.

In those cases you can use an index signature to describe the types of possible values, for example:

![](https://qiniu.espe.work/blog/20220605210052.png)

Above, we have a StringArray interface which has an index signature. This index signature states that when a StringArray is indexed with a number, it will return a string.

While string index signatures are a powerful way to describe the “dictionary” pattern, they also enforce that all properties match their return type. This is because a string index declares that obj.property is also available as obj\["property"]. In the following example, name’s type does not match the string index’s type, and the type checker gives an error:

![](https://qiniu.espe.work/blog/20220605210418.png)

However, properties of different types are acceptable if the index signature is a union of the property types:

```typescript
interface NumberOrStringDictionary {
  [index: string]: number | string
  length: number // ok, length is a number
  name: string // ok, name is a string
}
```

Finally, you can make index signatures readonly in order to prevent assignment to their indices:

![](https://qiniu.espe.work/blog/20220605210536.png)

### 5.2 Extending Types

we can extend the original BasicAddress type and just add the new fields that are unique to AddressWithUnit.

```typescript
interface BasicAddress {
  name?: string
  street: string
  city: string
  country: string
  postalCode: string
}

interface AddressWithUnit extends BasicAddress {
  unit: string
}
```

interfaces can also extend from multiple types.

```typescript
interface Colorful {
  color: string
}

interface Circle {
  radius: number
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: 'red',
  radius: 42
}
```

### 5.3 Intersection Types

An intersection type is defined using the & operator.

```typescript
interface Colorful {
  color: string
}
interface Circle {
  radius: number
}

type ColorfulCircle = Colorful & Circle
```

Here, we’ve intersected Colorful and Circle to produce a new type that has all the members of Colorful and Circle.

```typescript
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`)
  console.log(`Radius was ${circle.radius}`)
}

// okay
draw({ color: 'blue', radius: 42 })
```

### 5.4 Interfaces vs. Intersections

We just looked at two ways to combine types which are similar, but are actually subtly different.

With interfaces, we could use an extends clause to extend from other types, and we were able to do something similar with intersections and name the result with a type alias.

The principle difference between the two is how conflicts are handled, and that difference is typically one of the main reasons why you’d pick one over the other between an interface and a type alias of an intersection type.

### 5.5 Generic Object Types

Let’s imagine a Box type that can contain any value - strings, numbers, Giraffes, whatever.

```typescript
interface Box {
  contents: any
}
```

Right now, the contents property is typed as any, which works, but can lead to accidents down the line.

We could instead use unknown, but that would mean that in cases where we already know the type of contents, we’d need to do precautionary checks, or use error-prone type assertions.

```typescript
interface Box {
  contents: unknown
}

let x: Box = {
  contents: 'hello world'
}

// we could check 'x.contents'
if (typeof x.contents === 'string') {
  console.log(x.contents.toLowerCase())
}

// or we could use a type assertion
console.log((x.contents as string).toLowerCase())
```

One type safe approach would be to instead scaffold out different Box types for every type of contents.

we can make a generic Box type which declares a type parameter.

```typescript
interface Box<Type> {
  contents: Type
}
```

You might read this as “A Box of Type is something whose contents have type Type”. Later on, when we refer to Box, we have to give a type argument in place of Type.

```typescript
let box: Box<string>
```

![](https://qiniu.espe.work/blog/20220605212135.png)

Box is reusable in that Type can be substituted with anything. That means that when we need a box for a new type, we don’t need to declare a new Box type at all (though we certainly could if we wanted to).

```typescript
interface Box<Type> {
  contents: Type
}

interface Apple {
  // ....
}

// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>
```

This also means that we can avoid overloads entirely by instead using generic functions.

```typescript
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents
}
```

It is worth noting that type aliases can also be generic. We could have defined our new Box\<Type> interface, which was:

```typescript
interface Box<Type> {
  contents: Type
}
```

by using a type alias instead:

```typescript
type Box<Type> = {
  contents: Type
}
```

Since type aliases, unlike interfaces, can describe more than just object types, we can also use them to write other kinds of generic helper types.

![](https://qiniu.espe.work/blog/20220605212453.png)

### 5.6. The Array Type

Generic object types are often some sort of container type that work independently of the type of elements they contain. It’s ideal for data structures to work this way so that they’re re-usable across different data types.

It turns out we’ve been working with a type just like that throughout this handbook: the Array type. Whenever we write out types like number[] or string[], that’s really just a shorthand for Array\<number> and Array\<string>.

```typescript
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ['hello', 'world']

// either of these work!
doSomething(myArray)
doSomething(new Array('hello', 'world'))
```

#### 5.6.1 The ReadonlyArray Type

The ReadonlyArray is a special type that describes arrays that shouldn’t be changed.

```typescript
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice()
  console.log(`The first value is ${values[0]}`)

  // ...but we can't mutate 'values'.
  values.push('hello!')
  // Property 'push' does not exist on type 'readonly string[]'.
}
```

Much like the readonly modifier for properties, it’s mainly a tool we can use for intent. When we see a function that returns ReadonlyArrays, it tells us we’re not meant to change the contents at all, and when we see a function that consumes ReadonlyArrays, it tells us that we can pass any array into that function without worrying that it will change its contents.

Unlike Array, there isn’t a ReadonlyArray constructor that we can use.

![](https://qiniu.espe.work/blog/20220605215840.png)

Instead, we can assign regular Arrays to ReadonlyArrays.

```typescript
const roArray: ReadonlyArray<string> = ['red', 'green', 'blue']
```

Just as TypeScript provides a shorthand syntax for Array\<Type> with Type[], it also provides a shorthand syntax for ReadonlyArray\<Type> with readonly Type[].

![](https://qiniu.espe.work/blog/20220605220206.png)

One last thing to note is that unlike the readonly property modifier, assignability isn’t bidirectional between regular Arrays and ReadonlyArrays.

![](https://qiniu.espe.work/blog/20220605220348.png)

### 5.7. Tuple Types

A tuple type is another sort of Array type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.

```typescript
type StringNumberPair = [string, number]
```

Here, StringNumberPair is a tuple type of string and number. Like ReadonlyArray, it has no representation at runtime, but is significant to TypeScript. To the type system, StringNumberPair describes arrays whose 0 index contains a string and whose 1 index contains a number.

![](https://qiniu.espe.work/blog/20220605220939.png)

if we try to index past the number of elements, we’ll get an error.

```typescript
function doSomething(pair: [string, number]) {
  // ...

  const c = pair[2]
  // Tuple type '[string, number]' of length '2' has no element at index '2'.
}
```

We can also destructure tuples using JavaScript’s array destructuring.

![](https://qiniu.espe.work/blog/20220605221332.png)

Other than those length checks, simple tuple types like these are equivalent to types which are versions of Arrays that declare properties for specific indexes, and that declare length with a numeric literal type.

```typescript
interface StringNumberPair {
  // specialized properties
  length: 2
  0: string
  1: number

  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>
}
```

Another thing you may be interested in is that tuples can have optional properties by writing out a question mark (? after an element’s type). Optional tuple elements can only come at the end, and also affect the type of length.

![](https://qiniu.espe.work/blog/20220605221635.png)

## 6. Type Manipulation

### 6.1 Generics

we need a way of capturing the type of the argument in such a way that we can also use it to denote what is being returned. Here, we will use a type variable, a special kind of variable that works on types rather than values.

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}
```

Once we’ve written the generic identity function, we can call it in one of two ways. The first way is to pass all of the arguments, including the type argument, to the function:

![](https://qiniu.espe.work/blog/20220606095834.png)

The second way is also perhaps the most common. Here we use <font color=#3498db>type argument inference</font> — that is, we want the compiler to set the value of Type for us automatically based on the type of the argument we pass in:

![](https://qiniu.espe.work/blog/20220606100017.png)

What if we want to also log the length of the argument arg to the console with each call? We might be tempted to write this:

![](https://qiniu.espe.work/blog/20220606100402.png)

Let’s say that we’ve actually intended this function to work on arrays of Type rather than Type directly. Since we’re working with arrays, the .length member should be available. We can describe this just like we would create arrays of other types:

```typescript
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length)
  return arg
}
```

We can alternatively write the sample example this way:

```typescript
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length) // Array has a .length, so no more error
  return arg
}
```

### 6.1.1 Generic Types

The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}

let myIdentity: <Type>(arg: Type) => Type = identity
```

We could also have used a different name for the generic type parameter in the type, so long as the number of type variables and how the type variables are used line up.

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}

let myIdentity: <Input>(arg: Input) => Input = identity
```

We can also write the generic type as a call signature of an object literal type:

```typescript
function identity<Type>(arg: Type): Type {
  return arg
}

let myIdentity: { <Type>(arg: Type): Type } = identity
```

Which leads us to writing our first generic interface. Let’s take the object literal from the previous example and move it to an interface:

```typescript
interface GenericIdentityFn {
  <Type>(arg: Type): Type
}

function identity<Type>(arg: Type): Type {
  return arg
}

let myIdentity: GenericIdentityFn = identity
```

In a similar example, we may want to move the generic parameter to be a parameter of the whole interface. This lets us see what type(s) we’re generic over (e.g. Dictionary\<string> rather than just Dictionary). This makes the type parameter visible to all the other members of the interface.

```typescript
interface GenericIdentityFn<Type> {
  (arg: Type): Type
}

function identity<Type>(arg: Type): Type {
  return arg
}

let myIdentity: GenericIdentityFn<number> = identity
```

### 6.1.2 Generic Classes

A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets (\<>) following the name of the class.

```typescript
class GenericNumber<NumType> {
  zeroValue: NumType
  add: (x: NumType, y: NumType) => NumType
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) {
  return x + y
}
```

This is a pretty literal use of the GenericNumber class, but you may have noticed that nothing is restricting it to only use the number type. We could have instead used string or even more complex objects.

```typescript
let stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function(x, y) {
  return x + y
}

console.log(stringNumeric.add(stringNumeric.zeroValue, 'test'))
```

### 6.1.3 Generic Constraints

the compiler could not prove that every type had a .length property, so it warns us that we can’t make this assumption.

![](https://qiniu.espe.work/blog/20220606102027.png)

Instead of working with any and all types, we’d like to constrain this function to work with any and all types that also have the .length property. As long as the type has this member, we’ll allow it, but it’s required to have at least this member. To do so, <font color=#3498db>we must list our requirement as a constraint on what Type can be.</font>

```typescript
interface Lengthwise {
  length: number
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length) // Now we know it has a .length property, so no more error
  return arg
}
```

Because the generic function is now constrained, it will no longer work over any and all types:

![](https://qiniu.espe.work/blog/20220606102236.png)

Instead, we need to pass in values whose type has all the required properties:

```typescript
loggingIdentity({ length: 10, value: 3 })
```

### 6.1.4 Using Type Parameters in Generic Constraints

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key]
}

let x = { a: 1, b: 2, c: 3, d: 4 }

getProperty(x, 'a')
getProperty(x, 'm') // Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

### 6.2 The keyof type operator

The keyof operator takes an object type and produces a string or numeric literal union of its keys. The following type P is the same type as “x” | “y”:

![](https://qiniu.espe.work/blog/20220606103127.png)

If the type has a string or number index signature, keyof will return those types instead:

![](https://qiniu.espe.work/blog/20220606103200.png)

Note that in this example, M is string | number — this is because JavaScript object keys are always coerced to a string, so obj\[0] is always the same as obj\["0"].

### 6.3 Typeof Type Operator

JavaScript already has a typeof operator you can use in an expression context:

```typescript
// Prints "string"
console.log(typeof 'Hello world')
```

TypeScript adds a typeof operator you can use in a type context to refer to the type of a variable or property:

```typescript
let s = 'hello'
let n: typeof s
```

This isn’t very useful for basic types, but combined with other type operators, you can use typeof to conveniently express many patterns. For an example, let’s start by looking at the predefined type ReturnType\<T>. It takes a function type and produces its return type:

```typescript
type Predicate = (x: unknown) => boolean
type K = ReturnType<Predicate>
```

If we try to use ReturnType on a function name, we see an instructive error:

```typescript
function f() {
  return { x: 10, y: 3 }
}
type P = ReturnType<f>
//'f' refers to a value, but is being used as a type here. Did you mean 'typeof f'?
```

Remember that values and types aren’t the same thing. To refer to the type that the value f has, we use typeof:

```typescript
function f() {
  return { x: 10, y: 3 }
}
type P = ReturnType<typeof f>
```

### 6.4 Indexed Access Types

We can use an indexed access type to look up a specific property on another type:

![](https://qiniu.espe.work/blog/20220609103225.png)

The indexing type is itself a type, so we can use unions, keyof, or other types entirely:

![](https://qiniu.espe.work/blog/20220609103257.png)

You’ll even see an error if you try to index a property that doesn’t exist:

![](https://qiniu.espe.work/blog/20220609103323.png)

Another example of indexing with an arbitrary type is using number to get the type of an array’s elements. We can combine this with typeof to conveniently capture the element type of an array literal:

![](https://qiniu.espe.work/blog/20220609103624.png)

You can only use types when indexing, meaning you can’t use a const to make a variable reference:

![](https://qiniu.espe.work/blog/20220609103713.png)

However, you can use a type <font color=#3498db>alias</font> for a similar style of refactor:

```typescript
type key = 'age'
type Age = Person[key]
```

### 6.5 Conditional Types

At the heart of most useful programs, we have to make decisions based on input. JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs. Conditional types help describe the relation between the types of inputs and outputs.

![](https://qiniu.espe.work/blog/20220610100732.png)

Conditional types take a form that looks a little like conditional expressions (condition ? trueExpression : falseExpression) in JavaScript:

```typescript
SomeType extends OtherType ? TrueType : FalseType;
```

Instead, we can encode that logic in a conditional type:

```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel
```

**Conditional Type Constraints**

For example, let’s take the following:

![](https://qiniu.espe.work/blog/20220610103003.png)

In this example, TypeScript errors because T isn’t known to have a property called message. We could constrain T, and TypeScript would no longer complain:

![](https://qiniu.espe.work/blog/20220610103117.png)

However, what if we wanted MessageOf to take any type, and default to something like never if a message property isn’t available? We can do this by moving the constraint out and introducing a conditional type:

![](https://qiniu.espe.work/blog/20220610103201.png)

### 6.5.1 Inferring Within Conditional Types

Conditional types provide us with a way to infer from types we compare against in the true branch using the infer keyword. For example, we could have inferred the element type in Flatten instead of fetching it out “manually” with an indexed access type:

```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type
```

Here, we used the infer keyword to declaratively introduce a new generic type variable named Item instead of specifying how to retrieve the element type of T within the true branch. This frees us from having to think about how to dig through and probing apart the structure of the types we’re interested in.

![](https://qiniu.espe.work/blog/20220610104102.png)

### 6.5.2 Distributive Conditional Types

When conditional types act on a generic type, they become distributive when given a union type. For example, take the following:

```typescript
type ToArray<Type> = Type extends any ? Type[] : never
```

If we plug a union type into ToArray, then the conditional type will be applied to each member of that union.

![](https://qiniu.espe.work/blog/20220610104601.png)

What happens here is that StrArrOrNumArr distributes on:

```typescript
string | number
```

and maps over each member type of the union, to what is effectively:

```typescript
  ToArray<string> | ToArray<number>;
```

which leaves us with:

```typescript
 string[] | number[];
```

Typically, distributivity is the desired behavior. To avoid that behavior, you can surround each side of the extends keyword with square brackets.

![](https://qiniu.espe.work/blog/20220610104946.png)

### 6.6 Mapped Types

When you don’t want to repeat yourself, sometimes a type needs to be based on another type.

Mapped types build on the syntax for index signatures, which are used to declare the types of properties which have not been declared ahead of time:

![](https://qiniu.espe.work/blog/20220612193325.png)

A mapped type is a generic type which uses a union of PropertyKeys (frequently created via a keyof) to iterate through keys to create a type:

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean
}
```

In this example, OptionsFlags will take all the properties from the type Type and change their values to be a boolean.

![](https://qiniu.espe.work/blog/20220612193427.png)

#### 6.6.1 Mapping Modifiers

There are two additional modifiers which can be applied during mapping: readonly and ? which affect mutability and optionality respectively.

You can remove or add these modifiers by prefixing with - or +. If you don’t add a prefix, then + is assumed.

![](https://qiniu.espe.work/blog/20220612193555.png)

![](https://qiniu.espe.work/blog/20220612193620.png)

#### 6.6.2 Key Remapping via

In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an as clause in a mapped type:

```typescript
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

You can leverage features like template literal types to create new property names from prior ones:

![](https://qiniu.espe.work/blog/20220612193812.png)

You can filter out keys by producing never via a conditional type:

![](https://qiniu.espe.work/blog/20220612193846.png)

You can map over arbitrary unions, not just unions of string | number | symbol, but unions of any type:

![](https://qiniu.espe.work/blog/20220612193939.png)

**Further Exploration**

Mapped types work well with other features in this type manipulation section, for example here is a mapped type using a conditional type which returns either a true or false depending on whether an object has the property pii set to the literal true:

![](https://qiniu.espe.work/blog/20220612194109.png)

### 6.7 Template Literal Types

Template literal types build on string literal types, and have the ability to expand into many strings via unions.

They have the same syntax as template literal strings in JavaScript, but are used in type positions. When used with concrete literal types, a template literal produces a new string literal type by concatenating the contents.

![](https://qiniu.espe.work/blog/20220612221943.png)

When a union is used in the interpolated position, the type is the set of every possible string literal that could be represented by each union member:

![](https://qiniu.espe.work/blog/20220612222059.png)

For each interpolated position in the template literal, the unions are cross multiplied:

![](https://qiniu.espe.work/blog/20220612222146.png)

#### 6.7.1 String Unions in Types

The power in template literals comes when defining a new string based on information inside a type.

Consider the case where a function (makeWatchedObject) adds a new function called on() to a passed object. In JavaScript, its call might look like: makeWatchedObject(baseObject). We can imagine the base object as looking like:

```typescript
const passedObject = {
  firstName: 'Saoirse',
  lastName: 'Ronan',
  age: 26
}
```

#### 6.7.2 Intrinsic String Manipulation Types

To help with string manipulation, TypeScript includes a set of types which can be used in string manipulation. These types come built-in to the compiler for performance and can’t be found in the .d.ts files included with TypeScript.

```typescript
Uppercase<StringType>
```

Converts each character in the string to the uppercase version.

Example

![](https://qiniu.espe.work/blog/20220612222955.png)

![](https://qiniu.espe.work/blog/20220612223137.png)

## 7. Classes

As with other JavaScript language features, TypeScript adds type annotations and other syntax to allow you to express relationships between classes and other types.

### 7.1 Class Members

**readonly**

Fields may be prefixed with the readonly modifier. This prevents assignments to the field outside of the constructor.
![](https://qiniu.espe.work/blog/20220613095557.png)

**Super Calls**

Just as in JavaScript, if you have a base class, you’ll need to call super(); in your constructor body before using any this. members:

![](https://qiniu.espe.work/blog/20220613100838.png)

Forgetting to call super is an easy mistake to make in JavaScript, but <font color=#3498db> TypeScript will tell you when it’s necessary</font> .

### 7.2 Getters / Setters

```typescript
class C {
  _length = 0
  get length() {
    return this._length
  }
  set length(value) {
    this._length = value
  }
}
```

TypeScript has some special inference rules for accessors:

- If get exists but no set, the property is automatically readonly
- If the type of the setter parameter is not specified, it is inferred from the return type of the getter
- Getters and setters must have the same Member Visibility

### 7.3 Index Signatures

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean)

  check(s: string) {
    return this[s] as boolean
  }
}
```

### 7.4 Class Heritage

**implements Clauses**

You can use an implements clause to check that a class satisfies a particular interface. An error will be issued if a class fails to correctly implement it:

![](https://qiniu.espe.work/blog/20220613231331.png)

Classes may also implement multiple interfaces, e.g. class C implements A, B {.

**Cautions**

It’s important to understand that an implements clause is only a check that the class can be treated as the interface type. It doesn’t change the type of the class or its methods at all. A common source of error is to assume that an implements clause will change the class type - it doesn’t!

![](https://qiniu.espe.work/blog/20220613231549.png)

In this example, we perhaps expected that s’s type would be influenced by the name: string parameter of check. It is not - implements clauses don’t change how the class body is checked or its type inferred.

Similarly, implementing an interface with an optional property doesn’t create that property:

![](https://qiniu.espe.work/blog/20220613231738.png)

Classes may extend from a base class. A derived class has all the properties and methods of its base class, and also define additional members.

```typescript
class Animal {
  move() {
    console.log('Moving along!')
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log('woof!')
    }
  }
}

const d = new Dog()
// Base class method
d.move()
// Derived class method
d.woof(3)
```

### 7.5 Member Visibility

You can use TypeScript to control whether certain methods or properties are visible to code outside the class.

**public**

The default visibility of class members is public. A public member can be accessed anywhere:

```typescript
class Greeter {
  public greet() {
    console.log('hi!')
  }
}
const g = new Greeter()
g.greet()
```

Because <font color=#3498db> public is already the default visibility modifier</font> , you don’t ever need to write it on a class member, but might choose to do so for style/readability reasons.

**protected**

protected members are only visible to subclasses of the class they’re declared in.

![](https://qiniu.espe.work/blog/20220613234208.png)

Exposure of protected members

Derived classes need to follow their base class contracts, but may choose to expose a subtype of base class with more capabilities. This includes making protected members public:

```typescript
class Base {
  protected m = 10
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15
}
const d = new Derived()
console.log(d.m) // OK
```

Note that Derived was already able to freely read and write m, so this doesn’t meaningfully alter the “security” of this situation. The main thing to note here is that in the derived class, we need to be careful to repeat the protected modifier if this exposure isn’t intentional.

**private**

private is like protected, but doesn’t allow access to the member even from subclasses:

![](https://qiniu.espe.work/blog/20220614101545.png)

Because private members aren’t visible to derived classes, a derived class can’t increase its visibility:

![](https://qiniu.espe.work/blog/20220614101621.png)

**Cross-instance private access**

TypeScript does allow cross-instance private access:

![](https://qiniu.espe.work/blog/20220614101756.png)

<font color=#e74c3c>Caveats</font>

Like other aspects of TypeScript’s type system, <font color=#3498db>private and protected are only enforced during type checking.</font>

This means that JavaScript runtime constructs like in or simple property lookup can still access a private or protected member:

```typescript
class MySafe {
  private secretKey = 12345
}

// In a JavaScript file...
const s = new MySafe()
// Will print 12345
console.log(s.secretKey)
```

### 7.6 Static Members

Classes may have static members. These members aren’t associated with a particular instance of the class. They can be accessed through the class constructor object itself:

```typescript
class MyClass {
  static x = 0
  static printX() {
    console.log(MyClass.x)
  }
}
console.log(MyClass.x)
MyClass.printX()
```

Static members can also use the same public, protected, and private visibility modifiers:

![](https://qiniu.espe.work/blog/20220614102333.png)

Static members are also inherited:

```typescript
class Base {
  static getGreeting() {
    return 'Hello world'
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting()
}
```


### 7.7 Generic Classes

Classes, much like interfaces, can be generic. When a generic class is instantiated with new, its type parameters are inferred the same way as in a function call:

![](https://qiniu.espe.work/blog/20220614103511.png)

### 7.8 Parameter Properties

![](https://qiniu.espe.work/blog/20220615094948.png)

### 7.9 Relationships Between Classes

![](https://qiniu.espe.work/blog/20220615095909.png)

Similarly, subtype relationships between classes exist even if there’s no explicit inheritance:

![](https://qiniu.espe.work/blog/20220615100004.png)