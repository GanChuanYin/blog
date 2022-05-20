## 1. new

### 1.1 new 的作用

我们用 new 实例化一个构造函数，生成一个实例对象，而 new 到底做了什么呢，主要分为以下五步：

1.  获取构造函数
2.  创建一个新对象
3.  将函数的作用域赋给新对象（这里实际上就是生产了一个新的上下文）
4.  执行函数中的代码（为新对象添加属性、方法）
5.  返回值，无返回值或者返回一个非对象值时，则将创建的新对象返回，否则会将返回值作为新对象返回。（也就是说一定会返回一个对象回来，这一步可以从下面的代码得结论）

### 1.2 代码实现

```javascript
function MyNew() {
  let Constructor = Array.prototype.shift.call(arguments) // 1：取出构造函数

  let obj = {} // 2：执行会创建一个新对象

  obj.__proto__ = Constructor.prototype // 3：该对象的原型等于构造函数prototype

  let result = Constructor.apply(obj, arguments) // 4： 执行函数中的代码

  return typeof result === 'object' ? result : obj // 5： 返回的值必须为对象
}
```

### 1.3 验证

```javascript
function Man(name, age) {
  this.name = name
  this.age = age
}
var tom = new Man('tom', 20)
var mike = MyNew(Man, 'mike', 30)
console.log(tom instanceof Man, mike instanceof Man) // true true
```

## 2. call

### 2.1 call 的作用

1.  把调用函数 fn 的上下文指向 obj
2.  形参 a,b 等是以逗号分隔传进去
3.  执行函数 fn，并返回结果

### 2.2 代码实现

```javascript
Function.prototype.myCall = function(context) {
  context = context ? Object(context) : window
  context.fn = this // 重置上下文
  let args = [...arguments].slice(1) // 截取参数a,b
  let r = context.fn(...args) // 执行函数
  delete context.fn // 删除属性，避免污染
  return r // 返回结果
}
```

### 2.3 验证

```javascript
// 浏览器环境下
var a = 1,
  b = 2
var obj = { a: 10, b: 20 }
function test(key1, key2) {
  console.log(this[key1] + this[key2])
}
test('a', 'b') // 3
test.myCall(obj, 'a', 'b') // 30
```

## 3. apply

### 3.1 call 的作用

apply 方法和 call 方法大同小异，唯一差别就是，apply 传入的参数是数组格式。

```javascript
// apply 原理
Function.prototype.myApply = function(context) {
  context = context ? Object(context) : window
  context.fn = this
  let args = [...arguments][1]
  if (!args) {
    return context.fn()
  }
  let r = context.fn(...args)
  delete context.fn
  return r
}
```

### 3.2 验证

```javascript
// 浏览器环境下
var a = 1,
  b = 2
var obj = { a: 10, b: 20 }
function test(key1, key2) {
  console.log(this[key1] + this[key2])
}
test('a', 'b') // 3
test.myCall(obj, ['a', 'b']) // 30 注意这里是传入数组 ['a', 'b']
```

## 4.bind

### 4.1 bind 作用

bind 方法和 call、apply 方法的差别是，他们都改变了上下文，但是 bind 没有立即执行函数。

### 4.2 代码实现

```javascript
// bind 原理
Function.prototype.Mybind = function(context) {
  let _me = this
  return function() {
    return _me.apply(context)
  }
}
```

### 4.3 验证

```javascript

bind 方法校验
var a = 1, b = 2;
var obj ={a: 10, b: 20}
function test(key1, key2){
console.log(this[key1] + this[key2])
}
var fn = test.bind(obj)
fn('a', 'b') // 30

```
