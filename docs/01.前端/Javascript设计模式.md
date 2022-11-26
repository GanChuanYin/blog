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

### 1.1 场景

使用 CreateDiv 单例类，它的作用是负责在页 面中创建唯一的 div 节点

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

### 1.2 通用的惰性单例

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

### 1.3 策略模式的优缺点

`优点`

- 策略模式利用组合、委托和多态等技术和思想,可以有效地避免多重条件选择语句。
- 策略模式提供了对开放—封闭原则的完美支持,将算法封装在独立的 strategy 中,使得它们易于切换,易于理解,易于扩展。
- 策略模式中的算法也可以复用在系统的其他地方,从而避免许多重复的复制粘贴工作。
- 在策略模式中利用组合和委托来让 Context 拥有执行算法的能力, 这也是继承的一种更轻便的替代方案

`缺点`

使用策略模式,必须了解所有的 strategy,必须了解各个 strategy 之间的不同点, 这样才能选择一个合适的 strategy。比如,我们要选择一种合适的旅游出行路线,必须先了解选择飞机、火车、自行车等方案的细节。此时 strategy 要向客户暴露它的所有实现,这是违反最少知识原则的

## 2. 策略模式

策略模式:定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换

### 2.1 场景

表单校验

### 2.2 普通实现

```javascript
var registerForm = document.getElementById('registerForm')
registerForm.onsubmit = function() {
  if (registerForm.userName.value === '') {
    alert('用户名不能为空')
    return false
  }
  if (registerForm.password.value.length < 6) {
    alert('密码长度不能少于 6 位')
    return false
  }
  if (!/(^1[3|5|8][0-9]{9}$)/.test(registerForm.phoneNumber.value)) {
    alert('手机号码格式不正确')
    return false
  }
}
```

### 2.3 策略模式实现

```javascript
var strategies = {
    isNonEmpty: function( value, errorMsg ){
        if ( value === '' ){
            return errorMsg ;
        }
    },
    minLength: function( value, length, errorMsg ){
        if ( value.length < length ){
            return errorMsg;
        }
    },
    isMobile: function( value, errorMsg ){ // 手机号码格式
        if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
            return errorMsg;
        }
    }
};
var Validator = function(){
    this.cache = []; // 保存校验规则
};
Validator.prototype.add = function(
    var ary = rule.split( ':' );
    this.cache.push(function(){ //
        var strategy = ary.shift();
        ary.unshift( dom.value );
        ary.push( errorMsg ); //
        return strategies[strategy].apply(dom, ary);
    });
};
Validator.prototype.start = function(){
    for ( var i = 0, validatorFunc; validatorFunc = this.cache[ i++ ]; ){
        var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
        if ( msg ){ // 如果有确切的返回值，说明校验没有通过
              return msg;
        }
    }
};
var validataFunc = function(){
    var validator = new Validator(); // 创建一个 validator 对象
    /***************添加一些校验规则****************/
    validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' );
    validator.add( registerForm.password, 'minLength:6', '密码长度不能少于 6位');
    validator.add( registerForm.phoneNumber, 'isMobile', '手机号码格式不正确' );
    var errorMsg = validator.start(); // 获得校验结果
    return errorMsg; // 返回校验结果
}
var registerForm = document.getElementById( 'registerForm' ); registerForm.onsubmit = function(){
    var errorMsg = validataFunc(); // 如果 errorMsg 有确切的返回值，说明未通过校验
    if ( errorMsg ){
        alert ( errorMsg );
        return false; // 阻止表单提交
    }
};
```

### 2.4 场景 2

奖金计算，绩效为 S 的人年 终奖有 4 倍工资，绩效为 A 的人年终奖有 3 倍工资，而绩效为 B 的人年终奖是 2 倍工资

#### 2.5 普通实现

```javascript
var calculateBonus = function(performanceLevel, salary) {
  if (performanceLevel === 'S') {
    return salary * 4
  }
  if (performanceLevel === 'A') {
    return salary * 3
  }
  if (performanceLevel === 'B') {
    return salary * 2
  }
}
calculateBonus('B', 20000) // 输出:40000
calculateBonus('S', 6000) // 输出:24000
```

#### 2.6 使用策略模式

```javascript
var strategies = {
  S: function(salary) {
    return salary * 4
  },
  A: function(salary) {
    return salary * 3
  },
  B: function(salary) {
    return salary * 2
  }
}
var calculateBonus = function(level, salary) {
  return strategies[level](salary)
}
console.log(calculateBonus('S', 20000)) // 输出:80000
console.log(calculateBonus('A', 10000)) // 输出:30000
```

## 3. 职责链模式

职责链模式的定义是: 使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。
职责链模式的名字非常形象，`一系列可能会处理请求的对象被连接成一条链，请求在这些对 象之间依次传递，直到遇到一个可以处理它的对象，我们把这些对象称为链中的节点`

### 3.1 场景

假设我们负责一个售卖手机的电商网站，经过分别交纳 500 元定金和 200 元定金的两轮预定后(订单已在此时生成)，现在已经到了正式购买的阶段。 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过 500 元定金的用 户会收到 100 元的商城优惠券，200 元定金的用户可以收到 50 元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。

### 3.2 普通实现

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

### 3.3 使用职责链模式实现

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

### 3.4 异步的职责链

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

### 3.5 用 AOP 实现职责链

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

## 4. 代理模式

### 4.1 场景 1

假设当 A 在心情好的时候收到花，小明表白成功的几率有 60%，而当 A 在心情差的时候收到花，小明表白的成功率无限趋近于 0。

小明跟 A 刚刚认识两天，还无法辨别 A 什么时候心情好。如果不合时宜地把花送给 A，花 被直接扔掉的可能性很大，这束花可是小明吃了 7 天泡面换来的。

但是 A 的朋友 B 却很了解 A，所以小明只管把花交给 B，B 会监听 A 的心情变化，然后选 择 A 心情好的时候把花转交给 A

### 4.2 代码实现:

```javascript
var Flower = function() {}
var xiaoming = {
  sendFlower: function(target) {
    var flower = new Flower()
    target.receiveFlower(flower)
  }
}
var B = {
  receiveFlower: function(flower) {
    A.listenGoodMood(function() {
      var flower = new Flower()
      A.receiveFlower(flower)
    })
  }
}
var A = {
  receiveFlower: function(flower) {
    // 监听 A 的好心情
    console.log('收到花 ' + flower)
  },
  listenGoodMood: function(fn) {
    setTimeout(function() {
      // 假设 10 秒之后 A 的心情变好
      fn()
    }, 10000)
  }
}
xiaoming.sendFlower(B)
```

由上面的例子可以引出两种代理模式的用处

- 保护代理: `代理 B 可以帮助 A 过滤掉一些请求`，比如送花的人中年龄太大的或者没有宝马的，这种请求就可以直接在代理 B 处被拒绝掉

- 虚拟代理: 假设现实中的花价格不菲，导致在程序世界里，new Flower 也是一个代价昂贵的操作， 那么我们可以把 new Flower 的操作交给代理 B 去执行，代理 B 会选择在 A 心情好时再执行 new Flower

### 4.3 虚拟代理实现图片预加载

```javascript
var myImage = (function() {
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: function(src) {
      imgNode.src = src
    }
  }
})()
var proxyImage = (function() {
  var img = new Image()
  img.onload = function() {
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function(src) {
      myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif')
      img.src = src
    }
  }
})()
proxyImage.setSrc('http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg')
```

### 4.4 合并 HTTP 请求

虚拟代理合并 HTTP 请求, 假设我们在做一个文件同步的功能，当我们选中一个 checkbox 的时候，它对应的文件就会被同 步到另外一台备用服务器上面。当一次选中过多时，会产生频繁的网络请求。

将带来很大的开销。可以通过一个代理函数 proxySynchronousFile 来收集一段时间之内的请求， 最后一次性发送给服务器

```javascript
var synchronousFile = function(id) {
  console.log('开始同步文件，id 为: ' + id)
}
var proxySynchronousFile = (function() {
  var cache = [], // 保存一段时间内需要同步的 ID
    timer // 定时器
  return function(id) {
    cache.push(id)
    if (timer) {
      // 保证不会覆盖已经启动的定时器
      return
    }
    timer = setTimeout(function() {
      synchronousFile(cache.join(','))
      clearTimeout(timer) // 清空定时器
      timer = null
      cache.length = 0 // 清空 ID 集合
    }, 2000)
  } // 2 秒后向本体发送需要同步的 ID 集合
})()

var checkbox = document.getElementsByTagName('input')
for (var i = 0, c; (c = checkbox[i++]); ) {
  c.onclick = function() {
    if (this.checked === true) {
      proxySynchronousFile(this.id)
    }
  }
}
```

## 5. 组合模式

> 组合模式将对象组合成树形结构，以表示“部分-整体”的层次结构。 除了用来表示树形结构之外，组合模式的另一个好处是通过对象的多态性表现，使得`用户对单个对象和组合对象的使用具有一致性`

以命令模式中的宏命令代码为例，宏命令对象包含了一组具体的子命令对象，不管是宏命令对象，还是子命令对象，都有一个 execute 方法负责执行命令。宏命令中包含了一组子命令，它们组成了一个树形结构，这里是一棵结构非常简单的树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220802150855.png)

在组合模式中，请求在树中传递的过程总是遵循一种逻辑。请求从树最顶端的对象往下传递，如果当前处理请求的对象是叶对象(普通子命令)，叶对象自身会对请求作出相应的处理;如果当前处理请求的对象是组合对象(宏命令)， 组合对象则会遍历它属下的子节点，将请求继续传递给这些子节点。

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220802151034.png)

### 5.1 组合模式下的宏命令

目前的万能遥控器，包含了关门、开电脑、登录 QQ 这 3 个命令。现在我们需要一个“超级万能遥控器”，可以控制家里所有的电器，这个遥控器拥有以下功能

- 打开空调
- 打开电视和音响
- 关门、开电脑、登录 QQ

```javascript
var MacroCommand = function() {
  return {
    commandsList: [],
    add: function(command) {
      this.commandsList.push(command)
    },
    execute: function() {
      for (var i = 0, command; (command = this.commandsList[i++]); ) {
        command.execute()
      }
    }
  }
}
var openAcCommand = {
  execute: function() {
    console.log('打开空调')
  }
}
/*家里的电视和音响是连接在一起的，所以可以用一个宏命令来组合打开电视和打开音响的命令*/
var openTvCommand = {
  execute: function() {
    console.log('打开电视')
  }
}
var openSoundCommand = {
  execute: function() {
    console.log('打开音响')
  }
}
var macroCommand1 = MacroCommand()
macroCommand1.add(openTvCommand)
macroCommand1.add(openSoundCommand)
/*关门、打开电脑和打登录 QQ 的命令*/
var closeDoorCommand = {
  execute: function() {
    console.log('关门')
  }
}
var openPcCommand = {
  execute: function() {
    console.log('开电脑')
  }
}
var openQQCommand = {
  execute: function() {
    console.log('登录 QQ')
  }
}
var macroCommand2 = MacroCommand()
macroCommand2.add(closeDoorCommand)
macroCommand2.add(openPcCommand)
macroCommand2.add(openQQCommand)

/*现在把所有的命令组合成一个“超级命令”*/
var macroCommand = MacroCommand()
macroCommand.add(openAcCommand)
macroCommand.add(macroCommand1)
macroCommand.add(macroCommand2)

/*最后给遥控器绑定“超级命令”*/
var setCommand = (function(command) {
  document.getElementById('button').onclick = function() {
    command.execute()
  }
})(macroCommand)
```

从这个例子中可以看到，基本对象可以被组合成更复杂的组合对象，组合对象又可以被组合， 这样不断递归下去，这棵树的结构可以支持任意多的复杂度。

在树最终被构造完成之后，让整颗 树最终运转起来的步骤非常简单，只需要调用最上层对象的 execute 方法。每当对最上层的对象 进行一次请求时，实际上是在对整个树进行深度优先的搜索

而创建组合对象的程序员并不关心这些内在的细节，往这棵树里面添加一些新的节点对象是非常容易的事情。

### 5.2 应用场景 —— 扫描文件夹

文件夹和文件之间的关系，非常适合用组合模式来描述。文件夹里既可以包含文件，又可以 包含其他文件夹，最终可能组合成一棵树

当使用用杀毒软件扫描该文件夹时，往往不会关心里面有多少文件和子文件夹，组合模式使得我们只需要操作最外层的文件夹进行扫描。

```javascript
/* Folder */
var Folder = function( name ){
    this.name = name;
    this.files = [];
};
Folder.prototype.add= function( file ){
    this.files.push(file );
};
Folder.prototype.scan = function(){
    console.log( '开始扫描文件夹: ' + this.name );
    for ( var i = 0, file, files = this.files; file = files[ i++ ]; ){
        files file.scan();
    }
};
/*File*/
var File = function( name ){
    this.name = name;
};
File.prototype.add = function(){
    throw new Error( '文件下面不能再添加文件' );
};
File.prototype.scan = function(){
    console.log( '开始扫描文件: ' + this.name );
};
/*创建一些文件夹和文件对象， 并且让它们组合成一棵树，这棵树就是我们 F 盘里的 现有文件目录结构*/
var folder = new Folder( '学习资料' );
var folder1 = new Folder( 'JavaScript' );
var folder2 = new Folder ( 'jQuery' );
var file1 = new File( 'JavaScript 设计模式与开发实践' );
var file2 = new File( '精通 jQuery' );
var file3 = new File('重构与模式' );
folder1.add( file1 );
folder2.add( file2 );
folder.add( folder1 );
folder.add( folder2 );
folder.add( file3 );

/*现在的需求是把移动硬盘里的文件和文件夹都复制到这棵树中，假设我们已经得到了这些文件对象*/
var folder3 = new Folder( 'Nodejs' );
var file4 = new File( '深入浅出 Node.js' );
folder3.add( file4 );
var file5 = new File( 'JavaScript 语言精髓与编程实践' );

/*接下来就是把这些文件都添加到原有的树中*/
folder.add( folder3 );
folder.add( file5 );
```

组合模式可以让我们使用树形方式创 建对象的结构。我们可以把相同的操作应用在组合对象和单个对象上。在大多数情况下，我们都 可以忽`略掉组合对象和单个对象之间的差别`，从而用一致的方式来处理它们。

然而，组合模式并不是完美的,它可能会产生一个这样的系统:系统中的每个对象看起来都 与其他对象差不多。它们的区别只有在运行的时候会才会显现出来,这会使代码难以理解。此外,如果通过组合模式创建了太多的对象，那么这些对象可能会让系统负担不起。


