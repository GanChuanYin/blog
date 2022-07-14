---
title: Javascript设计模式
date: 2022-06-29 11:02:51
permalink: /pages/5eff20/
categories:
  - 前端
tags:
  -
---

## 1.单例模式

单例模式的定义是: <font color=#00dddd size=4>保证一个类仅有一个实例，并提供一个访问它的全局访问点。</font>

单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如线程池、全局缓存、浏 览器中的 window 对象等。在 JavaScript 开发中，单例模式的用途同样非常广泛。试想一下，当我 们单击登录按钮的时候，页面中会出现一个登录浮窗，而这个登录浮窗是唯一的，无论单击多少 次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。

核心点 ： <font color=#00dddd size=4>确保只有一个实例，并提供全局访问。</font>

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
