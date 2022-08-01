---
title: Javascript设计模式
date: 2022-06-29 11:02:51
permalink: /pages/5eff20/
categories:
  - 前端
tags:
  - 
---

> 参考 [[ JavaScript 设计模式与开发实践 ]]

## 1.单例模式

单例模式的定义是: <font color=#00ff00 size=4>保证一个类仅有一个实例，并提供一个访问它的全局访问点。</font>

单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏 览器中的 window 对象等。在 JavaScript 开发中，单例模式的用途同样非常广泛。试想一下，当我 们单击登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少 次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。

核心点 ： <font color=#00ff00 size=4>确保只有一个实例，并提供全局访问。</font>

```javascript
var CreateDiv = function(html) {
  if (instance) {
    return instance
  }
  this.html = html
  this.init()
  return (instance = this)
}

var CreateDiv = function(html) {
  this.html = html
  this.init()
}
CreateDiv.prototype.init = function() {
  var div = document.createElement('div')
  div.innerHTML = this.html
  document.body.appendChild(div)
}

var ProxySingletonCreateDiv = (function() {
  var instance
  return function(html) {
    if (!instance) {
      instance = new CreateDiv(html)
    }
    return instance
  }
})()
var a = new ProxySingletonCreateDiv('sven1')
var b = new ProxySingletonCreateDiv('sven2')

alert(a === b) //true
```

通过引入代理类的方式，我们同样完成了一个单例模式的编写, 我们 把负责管理单例的逻辑移到了代理类 proxySingletonCreateDiv 中。这样一来，CreateDiv 就变成了 一个普通的类，它跟 proxySingletonCreateDiv 组合起来可以达到单例模式的效果。

### 1.1 通用的惰性单例

惰性单例指的是在需要的时候才创建对象实例。惰性单例是单例模式的重点，这种技术在实 际开发中非常有用，有用的程度可能超出了我们的想象，实际上在本章开头就使用过这种技术， 11 instance 实例对象总是在我们调用 Singleton.getInstance 的时候才被创建，而不是在页面加载好 的时候就创建

```javascript
Singleton.getInstance = (function() {
  var instance = null
  return function(name) {
    if (!instance) {
      instance = new Singleton(name)
    }
    return instance
  }
})()
```

在 getSinge 函数中，实际上也提到了闭包和高阶函数的概念。单例模式是一种简单但非常实 用的模式，特别是惰性单例技术，在合适的时候才创建对象，并且只创建唯一的一个。更奇妙的 是，创建对象和管理单例的职责被分布在两个不同的方法中，这两个方法组合起来才具有单例模 式的威力。

## 2. 策略模式

```javascript
```

## 职责链模式

职责链模式的定义是: 使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
职责链模式的名字非常形象，`一系列可能会处理请求的对象被连接成一条链，请求在这些对 象之间依次传递，直到遇到一个可以处理它的对象，我们把这些对象称为链中的节点`

### 场景

假设我们负责一个售卖手机的电商网站，经过分别交纳 500 元定金和 200 元定金的两轮预定后(订单已在此时生成)，现在已经到了正式购买的阶段。 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过 500 元定金的用 户会收到 100 元的商城优惠券，200 元定金的用户可以收到 50 元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。

### 普通实现

`if else` 嵌套

```javascript
var order = function(orderType, pay, stock) {
  if (orderType === 1) {
    // 500 元定金购买模式
    if (pay === true) {
      // 已支付定金
      console.log('500 元定金预购, 得到 100 优惠券')
    } else {
      // 未支付定金，降级到普通购买模式
      if (stock > 0) {
        // 用于普通购买的手机还有库存
        console.log('普通购买, 无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  } else if (orderType === 2) {
    if (pay === true) {
      // 200 元定金购买模式
      console.log('200 元定金预购, 得到 50 优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买, 无优惠券')
      } else {
        console.log('手机库存不足')
      }
    }
  } else if (orderType === 3) {
    if (stock > 0) {
      console.log('普通购买, 无优惠券')
    } else {
      console.log('手机库存不足')
    }
  }
}
order(1, true, 500) // 输出: 500 元定金预购, 得到 100 优惠券
```

可以看到虽然功能实现了,但代码很乱, 很难读懂

### 使用职责链模式重构

现在我们采用职责链模式重构这段代码，先把 500 元订单、200 元订单以及普通购买分成 3 个函数。

接下来把 orderType、pay、stock 这 3 个字段当作参数传递给 500 元订单函数，如果该函数不符合处理条件，则把这个请求传递给后面的 200 元订单函数，如果 200 元订单函数依然不能处理该请求，则继续传递请求给普通购买函数。

```javascript
var order500 = function(orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券')
  } else {
    return 'nextSuccessor' // 我不知道下一个节点是谁，反正把请求往后面传递
  }
}
var order200 = function(orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购，得到 50 优惠券')
  } else {
    return 'nextSuccessor' // 我不知道下一个节点是谁，反正把请求往后面传递
  }
}
var orderNormal = function(orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log('手机库存不足')
  }
}

// Chain.prototype.setNextSuccessor 指定在链中的下一个节点
// Chain.prototype.passRequest 传递请求给某个节点
var Chain = function(fn) {
  this.fn = fn
  this.successor = null
}
Chain.prototype.setNextSuccessor = function(successor) {
  return (this.successor = successor)
}
Chain.prototype.passRequest = function() {
  var ret = this.fn.apply(this, arguments)
  if (ret === 'nextSuccessor') {
    return (
      this.successor &&
      this.successor.passRequest.apply(this.successor, arguments)
    )
  }
  return ret
}
var chainOrder500 = new Chain(order500)
var chainOrder200 = new Chain(order200)
var chainOrderNormal = new Chain(orderNormal)

chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)

chainOrder500.passRequest(1, true, 500) // 输出:500 元定金预购，得到 100 优惠券
chainOrder500.passRequest(2, true, 500) // 输出:200 元定金预购，得到 50 优惠券
chainOrder500.passRequest(3, true, 500) // 输出:普通购买，无优惠券
chainOrder500.passRequest(1, false, 0) // 输出:手机库存不足
```

通过改进，我们可以自由灵活地增加、移除和修改链中的节点顺序，假如某天网站运营人员 又想出了支持 300 元定金购买，那我们就在该链中增加一个节点即可

```javascript
var order300 = function() {
  // 具体实现略
}
chainOrder300 = new Chain(order300)
chainOrder500.setNextSuccessor(chainOrder300)
chainOrder300.setNextSuccessor(chainOrder200)
```

### 异步的职责链

在现实开发中，我们经常会遇到一些异步的问题，比如我们要在 节点函数中发起一个 ajax 异步请求，异步请求返回的结果才能决定是否继续在职责链中 passRequest。 这时候让节点函数同步返回"nextSuccessor"已经没有意义了，所以要给 Chain 类再增加一个原型方法 Chain.prototype.next，表示手动传递请求给职责链中的下一个节点

```javascript
Chain.prototype.next = function() {
  return (
    this.successor &&
    this.successor.passRequest.apply(this.successor, arguments)
  )
}
/* 异步职责链 */
var fn1 = new Chain(function() {
  console.log(1)
  return 'nextSuccessor'
})
var fn2 = new Chain(function() {
  console.log(2)
  var self = this
  setTimeout(function() {
    self.next()
  }, 1000)
})
var fn3 = new Chain(function() {
  console.log(3)
})
fn1.setNextSuccessor(fn2).setNextSuccessor(fn3)
fn1.passRequest()
```

现在我们得到了一个特殊的链条，请求在链中的节点里传递，但`节点有权利决定什么时候把 请求交给下一个节点`。可以想象，异步的职责链加上命令模式(把 ajax 请求封装成命令对象)，我们可以很方便地创建一个异步 ajax 队列库。

### 用 AOP 实现职责链

```javascript
Function.prototype.after = function(fn) {
  var self = this
  return function() {
    var ret = self.apply(this, arguments)
    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments)
    }
    return ret
  }
}
var order = order500yuan.after(order200yuan).after(orderNormal)
order(1, true, 500) // 输出:500 元定金预购，得到 100 优惠券
order(2, true, 500) // 输出:200 元定金预购，得到 50 优惠券
order(1, false, 500) // 输出:普通购买，无优惠券
order(2, false, 0) // 手机库存不足
```

用 AOP 来实现职责链既简单又巧妙，但这种把函数叠在一起的方式，同时也叠加了函数的 作用域，如果链条太长的话，也会对性能有较大的影响

