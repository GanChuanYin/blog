**Typescript official site reference**

> https://www.typescriptlang.org/docs/handbook/utility-types.html

## 1. Utility Types

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.

### 1.1 Partial \<Type>

Constructs a type with all properties of Type <font color=#3498db> set to optional</font> . This utility will return a type that represents all subsets of a given type.

![](https://qiniu.espe.work/blog/20220618104037.png)

### 1.2 Required \<Type>

Constructs a type consisting of all properties of Type <font color=#3498db>set to required</font>. The opposite of Partial.

![](https://qiniu.espe.work/blog/20220618104732.png)

### 1.3 Readonly \<Type>

Constructs a type with all properties of Type set to readonly, meaning the properties of the constructed type <font color=#3498db> cannot be reassigned</font>

![](https://qiniu.espe.work/blog/20220618105528.png)

**Object.freeze**

```typescript
function freeze<Type>(obj: Type): Readonly<Type>
```

### 1.4 Record \<Keys, Type>

Constructs an object type whose property keys are Keys and whose property values are Type. This utility can be used to map the properties of a type to another type.

![](https://qiniu.espe.work/blog/20220618110139.png)

### 1.5 Pick \<Type, Keys>

Constructs a type by picking the set of properties Keys (string literal or union of string literals) from Type.

![](https://qiniu.espe.work/blog/20220618110351.png)

### 1.6 Omit \<Type, Keys>

Constructs a type by picking all properties from Type and then removing Keys (string literal or union of string literals).

![](https://qiniu.espe.work/blog/20220618110725.png)

### 1.7 Exclude \<UnionType, ExcludedMembers>

![](https://qiniu.espe.work/blog/20220619090657.png)

### 1.8 Extract\<Type, Union>

Constructs a type by extracting from Type all union members that are assignable to Union

![](https://qiniu.espe.work/blog/20220619095914.png)

### 1.9 NonNullable \<Type>

Constructs a type by excluding null and undefined from Type.

![](https://qiniu.espe.work/blog/20220619100003.png)

### 1.10 Parameters<Type>

Constructs a tuple type from the types used in the parameters of a **function type Type**.

![](https://qiniu.espe.work/blog/20220619100522.png)

### 1.11 Intrinsic String Manipulation Types

```typescript
Uppercase<StringType>
Lowercase<StringType>
Capitalize<StringType>
Uncapitalize<StringType>
```

## 2. Decorators

With the introduction of Classes in TypeScript and ES6, there now exist certain scenarios that require additional features to support <font color=#3498db> annotating or modifying classes and class members</font>. Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members

To enable experimental support for decorators, you must enable the experimentalDecorators compiler option either on the command line or in your tsconfig.json:

Command Line:

```shell
tsc --target ES5 --experimentalDecorators
```

tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

### 2.1 Decorator Factories

If we want to customize how a decorator is applied to a declaration, we can write a decorator factory. A Decorator Factory is simply a function that returns the expression that will be called by the decorator at runtime.

```typescript
function color(value: string) {
  // this is the decorator factory, it sets up
  // the returned decorator function
  return function(target) {
    // this is the decorator
    // do something with 'target' and 'value'...
  }
}
```

### 2.2 Decorator Composition

Multiple decorators can be applied to a declaration, for example on a single line:

```typescript
@f @g x
```

On multiple lines:

```typescript
@f
@g
x
```

When multiple decorators apply to a single declaration, their evaluation is similar to function composition in mathematics. In this model, when composing functions f and g, the resulting composite (f ∘ g)(x) is equivalent to f(g(x)).

As such, the following steps are performed when evaluating multiple decorators on a single declaration in TypeScript:

- The expressions for each decorator are evaluated top-to-bottom.
- The results are then called as functions from bottom-to-top.

If we were to use decorator factories, we can observe this evaluation order with the following example:

```typescript
function first() {
  console.log('first(): factory evaluated')
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('first(): called')
  }
}

function second() {
  console.log('second(): factory evaluated')
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log('second(): called')
  }
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
```

Which would print this output to the console:

```shell
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

### 2.3 Class Decorators

A Class Decorator is declared just before a class declaration. The class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition. A class decorator cannot be used in a declaration file, or in any other ambient context (such as on a declare class).

The expression for the class decorator will be called as a function at runtime, with the constructor of the decorated class as its only argument.

If the class decorator returns a value, it will replace the class declaration with the provided constructor function.

The following is an example of a class decorator (@sealed) applied to a BugReport class:

```typescript
@sealed
class BugReport {
  type = 'report'
  title: string

  constructor(t: string) {
    this.title = t
  }
}
```

We can define the @sealed decorator using the following function declaration:

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}
```

### 2.4 Method Decorators

The expression for the method decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The Property Descriptor for the member.

The following is an example of a method decorator (@enumerable) applied to a method on the Greeter class:

```typescript
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }

  @enumerable(false)
  greet() {
    return 'Hello, ' + this.greeting
  }
}
```

We can define the @enumerable decorator using the following function declaration:

```typescript
function enumerable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.enumerable = value
  }
}
```

The @enumerable(false) decorator here is a decorator factory. When the @enumerable(false) decorator is called, it modifies the enumerable property of the property descriptor.

### 2.5 Property Decorators

We can use this information to record metadata about the property, as in the following example:

```typescript
class Greeter {
  @format('Hello, %s')
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    let formatString = getFormat(this, 'greeting')
    return formatString.replace('%s', this.greeting)
  }
}
```

We can then define the @format decorator and getFormat functions using the following function declarations:

```typescript
import 'reflect-metadata'
const formatMetadataKey = Symbol('format')
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString)
}
function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey)
}
```

The @format("Hello, %s") decorator here is a decorator factory. When @format("Hello, %s") is called, it adds a metadata entry for the property using the Reflect.metadata function from the reflect-metadata library. When getFormat is called, it reads the metadata value for the format.

### 2.6 Parameter Decorators

The following is an example of a parameter decorator (@required) applied to parameter of a member of the BugReport class:

```typescript
class BugReport {
  type = 'report'
  title: string

  constructor(t: string) {
    this.title = t
  }

  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`
    } else {
      return this.title
    }
  }
}
```

We can then define the @required and @validate decorators using the following function declarations:

```typescript
import 'reflect-metadata'
const requiredMetadataKey = Symbol('required')

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  let existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || []
  existingRequiredParameters.push(parameterIndex)
  Reflect.defineMetadata(
    requiredMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  )
}

function validate(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<Function>
) {
  let method = descriptor.value!

  descriptor.value = function() {
    let requiredParameters: number[] = Reflect.getOwnMetadata(
      requiredMetadataKey,
      target,
      propertyName
    )
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (
          parameterIndex >= arguments.length ||
          arguments[parameterIndex] === undefined
        ) {
          throw new Error('Missing required argument.')
        }
      }
    }
    return method.apply(this, arguments)
  }
}
```

## 3. Declaration Merging

### 3.1 Merging Interfaces

The simplest, and perhaps most common, type of declaration merging is interface merging. At the most basic level, the merge mechanically**joins the members of both declarations into a single interface with the same name.**

```typescript
interface Box {
  height: number
  width: number
}
interface Box {
  scale: number
}
let box: Box = { height: 5, width: 6, scale: 10 }
```

For function members, each function member of the same name is treated as describing an overload of the same function. Of note, too, is that in the case of interface A merging with later interface A, the second interface will have a higher precedence than the first.

That is, in the example:

```typescript
interface Cloner {
  clone(animal: Animal): Animal
}
interface Cloner {
  clone(animal: Sheep): Sheep
}
interface Cloner {
  clone(animal: Dog): Dog
  clone(animal: Cat): Cat
}
```

The three interfaces will merge to create a single declaration as so:

```typescript
interface Cloner {
  clone(animal: Dog): Dog
  clone(animal: Cat): Cat
  clone(animal: Sheep): Sheep
  clone(animal: Animal): Animal
}
```

### 3.2 Merging Namespaces

```typescript
namespace Animals {
  export class Zebra {}
}
namespace Animals {
  export interface Legged {
    numberOfLegs: number
  }
  export class Dog {}
}
```

is equivalent to:

```typescript
namespace Animals {
  export interface Legged {
    numberOfLegs: number
  }
  export class Zebra {}
  export class Dog {}
}
```

### 3.3 Merging Namespaces with Classes

This gives the user a way of describing inner classes.

```typescript
class Album {
  label: Album.AlbumLabel
}
namespace Album {
  export class AlbumLabel {}
}
```

namespaces can be used to extend enums with static members:

```typescript
enum Color {
  red = 1,
  green = 2,
  blue = 4
}
namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == 'yellow') {
      return Color.red + Color.green
    } else if (colorName == 'white') {
      return Color.red + Color.green + Color.blue
    } else if (colorName == 'magenta') {
      return Color.red + Color.blue
    } else if (colorName == 'cyan') {
      return Color.green + Color.blue
    }
  }
}
```

### 3.4 Global augmentation

You can also add declarations to the global scope from inside a module:

```typescript
// observable.ts
export class Observable<T> {
  // ... still no implementation ...
}
declare global {
  interface Array<T> {
    toObservable(): Observable<T>
  }
}
Array.prototype.toObservable = function() {
  // ...
}
```

## 4. Modules

### 4.1 Re-exports

Often modules extend other modules, and partially expose some of their features. A re-export does not import it locally, or introduce a local variable.

```typescript
export class ParseIntBasedZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && parseInt(s).toString() === s
  }
}
// Export original validator but rename it
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from './ZipCodeValidator'
```

Optionally,<font color=#3498db> a module can wrap one or more modules and combine all their exports using export \* from "module" syntax.</font>

### 4.2 Import

Importing is just about as easy as exporting from a module. Importing an exported declaration is done through using one of the import forms below:

**Import a single export from a module**

```typescript
import { ZipCodeValidator as ZCV } from './ZipCodeValidator'
let myValidator = new ZCV()
```

**Import the entire module into a single variable, and use it to access the module exports**

```typescript
import * as validator from './ZipCodeValidator'
let myValidator = new validator.ZipCodeValidator()
```

**Import a module for side-effects <font color=#3498db> only</font>**

Though not recommended practice, some modules set up some global state that can be used by other modules. These modules may not have any exports, or the consumer is not interested in any of their exports. To import these modules, use:

**Importing Types**

Prior to TypeScript 3.8, you can import a type using import. With TypeScript 3.8, you can import a type using the import statement, or using import type.

```typescript
// Re-using the same import
import { APIResponseType } from "./api";
// Explicitly use import type
import type { APIResponseType } from "./api";

```

### 4.3 Default exports

export

```typescript
declare let $: JQuery
export default $
```

import

```typescript
import $ from 'jquery'
$('button.continue').html('Next Step...')
```

### 4.4 Export all as x

```typescript
export * as utilities from "./utilities";
```

This takes all of the dependencies from a module and makes it an exported field, you could import it like this:

```typescript
import { utilities } from './index'
```

### 4.5 Working with Other JavaScript Libraries

To describe the shape of libraries not written in TypeScript, we need to declare the API that the library exposes.

We call declarations that don’t define an implementation “ambient”. Typically, these are defined in <font color=#3498db> .d.ts files</font> . If you’re familiar with C/C++, you can think of these as .h files. Let’s look at a few examples.

#### 4.5.1 Ambient Modules

In Node.js, most tasks are accomplished by loading one or more modules. We could define each module in its own .d.ts file with top-level export declarations, but it’s more convenient to write them as one larger .d.ts file. To do so, we use a construct similar to ambient namespaces, but we use the module keyword and the quoted name of the module which will be available to a later import. For example:

node.d.ts (simplified excerpt)

```typescript
declare module 'url' {
  export interface Url {
    protocol?: string
    hostname?: string
    pathname?: string
  }
  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url
}
declare module 'path' {
  export function normalize(p: string): string
  export function join(...paths: any[]): string
  export var sep: string
}
```

Now we can /// \<reference> node.d.ts and then load the modules using import url = require("url"); or import \* as URL from "url".

```typescript
/// <reference path="node.d.ts"/>
import * as URL from 'url'
let myUrl = URL.parse('https://www.typescriptlang.org')
```

<font color=#3498db>Shorthand ambient modules</font>

If you don’t want to take the time to write out declarations before using a new module, you can use a shorthand declaration to get started quickly.

declarations.d.ts

```typescript
declare module 'hot-new-module'
```

All imports from a shorthand module will have the any type.

```typescript
import x, { y } from 'hot-new-module'
x(y)
```

**Wildcard module declarations**

Some module loaders such as SystemJS and AMD allow non-JavaScript content to be imported. These typically use a prefix or suffix to indicate the special loading semantics. Wildcard module declarations can be used to cover these cases.

```typescript
declare module '*!text' {
  const content: string
  export default content
}
// Some do it the other way around.
declare module 'json!*' {
  const value: any
  export default value
}
```

Now you can import things that match "\*!text" or "json!\*".

```typescript
import fileContent from './xyz.txt!text'
import data from 'json!http://example.com/data.json'
console.log(data, fileContent)
```

### 4.6 Re-export to extend

Often you will need to extend functionality on a module. A common JS pattern is to augment the original object with extensions, similar to how JQuery extensions work. As we’ve mentioned before, modules do not merge like global namespace objects would.

The recommended solution is to not mutate the original object, but rather <font color=#3498db> export a new entity that provides the new functionality.</font>

Consider a simple calculator implementation defined in module Calculator.ts. The module also exports a helper function to test the calculator functionality by passing a list of input strings and writing the result at the end.

Calculator.ts

```typescript
export class Calculator {
  private current = 0
  private memory = 0
  private operator: string
  protected processDigit(digit: string, currentValue: number) {
    if (digit >= '0' && digit <= '9') {
      return currentValue * 10 + (digit.charCodeAt(0) - '0'.charCodeAt(0))
    }
  }
  protected processOperator(operator: string) {
    if (['+', '-', '*', '/'].indexOf(operator) >= 0) {
      return operator
    }
  }
  protected evaluateOperator(
    operator: string,
    left: number,
    right: number
  ): number {
    switch (this.operator) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return left / right
    }
  }
  private evaluate() {
    if (this.operator) {
      this.memory = this.evaluateOperator(
        this.operator,
        this.memory,
        this.current
      )
    } else {
      this.memory = this.current
    }
    this.current = 0
  }
  public handleChar(char: string) {
    if (char === '=') {
      this.evaluate()
      return
    } else {
      let value = this.processDigit(char, this.current)
      if (value !== undefined) {
        this.current = value
        return
      } else {
        let value = this.processOperator(char)
        if (value !== undefined) {
          this.evaluate()
          this.operator = value
          return
        }
      }
    }
    throw new Error(`Unsupported input: '${char}'`)
  }
  public getResult() {
    return this.memory
  }
}
export function test(c: Calculator, input: string) {
  for (let i = 0; i < input.length; i++) {
    c.handleChar(input[i])
  }
  console.log(`result of '${input}' is '${c.getResult()}'`)
}
```

Here is a simple test for the calculator using the exposed test function.

TestCalculator.ts

```typescript
import { Calculator, test } from './Calculator'
let c = new Calculator()
test(c, '1+2*33/11=') // prints 9
```

Now to extend this to add support for input with numbers in bases other than 10, let’s create ProgrammerCalculator.ts

ProgrammerCalculator.ts

```typescript
import { Calculator } from './Calculator'
class ProgrammerCalculator extends Calculator {
  static digits = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
  ]
  constructor(public base: number) {
    super()
    const maxBase = ProgrammerCalculator.digits.length
    if (base <= 0 || base > maxBase) {
      throw new Error(`base has to be within 0 to ${maxBase} inclusive.`)
    }
  }
  protected processDigit(digit: string, currentValue: number) {
    if (ProgrammerCalculator.digits.indexOf(digit) >= 0) {
      return (
        currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit)
      )
    }
  }
}
// Export the new extended calculator as Calculator
export { ProgrammerCalculator as Calculator }
// Also, export the helper function
export { test } from './Calculator'
```

The new module ProgrammerCalculator exports an API shape similar to that of the original Calculator module, but does not augment any objects in the original module. Here is a test for our ProgrammerCalculator class:

TestProgrammerCalculator.ts

```typescript
import { Calculator, test } from './ProgrammerCalculator'
let c = new Calculator(2)
test(c, '001+010=') // prints 3
```

### 4.7 Do not use namespaces in modules

When first moving to a module-based organization, a common tendency is to wrap exports in an additional layer of namespaces. Modules have their own scope, and only exported declarations are visible from outside the module. With this in mind, namespace provide very little, if any, value when working with modules.

On the organization front, namespaces are handy for grouping together logically-related objects and types in the global scope. For example, in C#, you’re going to find all the collection types in System.Collections. By organizing our types into hierarchical namespaces, we provide a good “discovery” experience for users of those types. Modules, on the other hand, are already present in a file system, necessarily. We have to resolve them by path and filename, so there’s a logical organization scheme for us to use. We can have a /collections/generic/ folder with a list module in it.

Namespaces are important to avoid naming collisions in the global scope. For example, you might have My.Application.Customer.AddForm and My.Application.Order.AddForm — two types with the same name, but a different namespace. This, however, is not an issue with modules. Within a module, there’s no plausible reason to have two objects with the same name. From the consumption side, the consumer of any given module gets to pick the name that they will use to refer to the module, so accidental naming conflicts are impossible.

## 5. Module Resolution

### 5.1 Relative vs. Non-relative module imports

Module imports are resolved differently based on whether the module reference is relative or non-relative.

A relative import is one that starts with /, ./ or ../. Some examples include:

```typescript
import Entry from './components/Entry'
import { DefaultHeaders } from '../constants/http'
import '/mod'
```

Any other import is considered non-relative. Some examples include:

```typescript
import * as $ from 'jquery'
import { Component } from '@angular/core'
```

A relative import is resolved relative to the importing file and <font color=#3498db> cannot resolve to an ambient module declaration</font>. You should use relative imports for your own modules that are guaranteed to maintain their relative location at runtime.

A non-relative import can be resolved relative to baseUrl, or through path mapping, which we’ll cover below. They can also resolve to ambient module declarations. Use non-relative paths when importing any of your external dependencies.

### 5.2 Module Resolution Strategies

**Classic**

This used to be TypeScript’s default resolution strategy. Nowadays, this strategy is mainly present for backward compatibility.

A relative import will be resolved relative to the importing file. So import { b } from "./moduleB" in source file /root/src/folder/A.ts would result in the following lookups:

```shell
/root/src/folder/moduleB.ts
/root/src/folder/moduleB.d.ts
```

For non-relative module imports, however, the compiler walks up the directory tree starting with the directory containing the importing file, trying to locate a matching definition file.

For example:

A non-relative import to moduleB such as import { b } from "moduleB", in a source file /root/src/folder/A.ts, would result in attempting the following locations for locating "moduleB":

![](https://qiniu.espe.work/blog/20220623095434.png)

TypeScript will mimic the Node.js run-time resolution strategy in order to locate definition files for modules at compile-time. To accomplish this, TypeScript overlays the TypeScript source file extensions (.ts, .tsx, and .d.ts) over Node’s resolution logic. TypeScript will also use a field in package.json named types to mirror the purpose of "main" - the compiler will use it to find the “main” definition file to consult.

For example, an import statement like import { b } from "./moduleB" in /root/src/moduleA.ts would result in attempting the following locations for locating "./moduleB":

```shell
/root/src/moduleB.ts
/root/src/moduleB.tsx
/root/src/moduleB.d.ts
/root/src/moduleB/package.json (if it specifies a types property)
/root/src/moduleB/index.ts
/root/src/moduleB/index.tsx
/root/src/moduleB/index.d.ts
```

Recall that Node.js looked for a file named moduleB.js, then an applicable package.json, and then for an index.js.

Similarly, a non-relative import will follow the Node.js resolution logic, first looking up a file, then looking up an applicable folder. So import { b } from "moduleB" in source file /root/src/moduleA.ts would result in the following lookups:

```shell
/root/src/node_modules/moduleB.ts
/root/src/node_modules/moduleB.tsx
/root/src/node_modules/moduleB.d.ts
/root/src/node_modules/moduleB/package.json (if it specifies a types property)
/root/src/node_modules/@types/moduleB.d.ts
/root/src/node_modules/moduleB/index.ts
/root/src/node_modules/moduleB/index.tsx
/root/src/node_modules/moduleB/index.d.ts

/root/node_modules/moduleB.ts
/root/node_modules/moduleB.tsx
/root/node_modules/moduleB.d.ts
/root/node_modules/moduleB/package.json (if it specifies a types property)
/root/node_modules/@types/moduleB.d.ts
/root/node_modules/moduleB/index.ts
/root/node_modules/moduleB/index.tsx
/root/node_modules/moduleB/index.d.ts

/node_modules/moduleB.ts
/node_modules/moduleB.tsx
/node_modules/moduleB.d.ts
/node_modules/moduleB/package.json (if it specifies a types property)
/node_modules/@types/moduleB.d.ts
/node_modules/moduleB/index.ts
/node_modules/moduleB/index.tsx
/node_modules/moduleB/index.d.ts
```

### 5.3 Path mapping

Sometimes modules are not directly located under baseUrl. For instance, an import to a module "jquery" would be translated at runtime to "node_modules/jquery/dist/jquery.slim.min.js". Loaders use a mapping configuration to map module names to files at run-time, see RequireJs documentation and SystemJS documentation.

The TypeScript compiler supports the declaration of such mappings using paths property in tsconfig.json files. Here is an example for how to specify the paths property for jquery.

```typescript
{
  "compilerOptions": {
    "baseUrl": ".", // This must be specified if "paths" is.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // This mapping is relative to "baseUrl"
    }
  }
}
```

### 5.4 Tracing module resolution

As discussed earlier, the compiler can visit files outside the current folder when resolving a module. This can be hard when diagnosing why a module is not resolved, or is resolved to an incorrect definition. Enabling the compiler module resolution tracing using traceResolution provides insight in what happened during the module resolution process.

Let’s say we have a sample application that uses the typescript module. app.ts has an import like import \* as ts from "typescript".

![](https://qiniu.espe.work/blog/20220623101607.png)

Invoking the compiler with traceResolution

```shell
tsc --traceResolution
```

Results in an output such as:

```shell
======== Resolving module 'typescript' from 'src/app.ts'. ========
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'typescript' from 'node_modules' folder.
File 'src/node_modules/typescript.ts' does not exist.
File 'src/node_modules/typescript.tsx' does not exist.
File 'src/node_modules/typescript.d.ts' does not exist.
File 'src/node_modules/typescript/package.json' does not exist.
File 'node_modules/typescript.ts' does not exist.
File 'node_modules/typescript.tsx' does not exist.
File 'node_modules/typescript.d.ts' does not exist.
Found 'package.json' at 'node_modules/typescript/package.json'.
'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========

```

### 5.5 Type Compatibility

Type compatibility in TypeScript is based on structural subtyping. Structural typing is a way of relating types based solely on their members. This is in contrast with nominal typing. Consider the following code:

```typescript
interface Pet {
  name: string
}
class Dog {
  name: string
}
let pet: Pet
// OK, because of structural typing
pet = new Dog()
```

In nominally-typed languages like C# or Java, the equivalent code would be an error because the Dog class does not explicitly describe itself as being an implementer of the Pet interface.

<font color=#3498db>TypeScript’s structural type system was designed based on how JavaScript code is typically written. Because JavaScript widely uses anonymous objects like function expressions and object literals, it’s much more natural to represent the kinds of relationships found in JavaScript libraries with a structural type system instead of a nominal one.</font>

The basic rule for TypeScript’s structural type system is that x is compatible with y if y has at least the same members as x. For example consider the following code involving an interface named Pet which has a name property:

```typescript
interface Pet {
  name: string
}
let pet: Pet
// dog's inferred type is { name: string; owner: string; }
let dog = { name: 'Lassie', owner: 'Rudd Weatherwax' }
pet = dog
```

To check whether dog can be assigned to pet, the compiler checks each property of pet to find a corresponding compatible property in dog. In this case, dog must have a member called name that is a string. It does, so the assignment is allowed.

The same rule for assignment is used when checking function call arguments:

```typescript
interface Pet {
  name: string
}
let dog = { name: 'Lassie', owner: 'Rudd Weatherwax' }
function greet(pet: Pet) {
  console.log('Hello, ' + pet.name)
}
greet(dog) // OK
```

### 5.5.1 Comparing two functions

While comparing primitive types and object types is relatively straightforward, the question of what kinds of functions should be considered compatible is a bit more involved. Let’s start with a basic example of two functions that differ only in their parameter lists:

```typescript
let x = (a: number) => 0
let y = (b: number, s: string) => 0
y = x // OK
x = y // Error
```

```typescript
let items = [1, 2, 3]
// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item))
// Should be OK!
items.forEach((item) => console.log(item))
```

Now let’s look at how return types are treated, using two functions that differ only by their return type:

```typescript
let x = () => ({ name: 'Alice' })
let y = () => ({ name: 'Alice', location: 'Seattle' })
x = y // OK
y = x // Error, because x() lacks a location property
```

### 5.5.2 Classes

Classes work similarly to object literal types and interfaces with one exception: they have both a static and an instance type. When comparing two objects of a class type, only members of the instance are compared. Static members and constructors do not affect compatibility.

```typescript
class Animal {
  feet: number
  constructor(name: string, numFeet: number) {}
}
class Size {
  feet: number
  constructor(numFeet: number) {}
}
let a: Animal
let s: Size
a = s // OK
s = a // OK
```


## 6. Type Inference

Best common type

When a type inference is made from several expressions, the types of those expressions are used to calculate a “best common type”. For example,

![](https://qiniu.espe.work/blog/20220627144235.png)

