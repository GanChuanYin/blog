---
title: node.js深入浅出阅读笔记
date: 2022-04-07 10:06:52
permalink: /pages/de3a77/
categories:
  - node
tags:
  - node
---

node.js 深入浅出阅读笔记

### 简介

#### 单线程

Node 保持了 JavaScript 在浏览器中单线程的特点。而且在 Node 中，JavaScript 与其余线程是无法共享状态的。**单线程的最大好处就是不用像多线程编程那样处处在意状态和同步问题，这里没有死锁的存在，也没有线程上下文交换所带来的性能上的开销。**

同样单线程也有它自身的弱点，这些弱点是学习 Node 的过程中必须要面对的。积极面对这些弱点，可以享受到 Node 带来的好处，也能避免潜在的问题，使其得以高效利用。单线程的弱电具体有以下三个方面：

- 无法利用多核 CPU
- 错误会引起整个应用退出，应用的健壮性值得考验
- 大量计算占用 CPU 导致无法继续调用异步 I/O

像浏览器中 JavaScript 与 UI 共用一个线程一样，JavaScript 长时间执行会导致 UI 的渲染和响应被中断。在 Node 中，长时间的 CPU 占用也会导致后续的异步 I/O 发不出调用，已完成的异步 I/O 的回调函数也会得不到及时执行。

最早解决这个大计算量问题的方案是 Google 公司开发的 Gears。它启用一个完全独立的进程，将需要计算的程序发送给这个进程，在得出结果后，通过事件将结果传递回来。这个模型将计算量分发到其它进程上，以此来降低运算造成阻塞的几率。后来 HTML5 定制了 Web Workers 的标准，Google 放弃了 Gears，权力支持 Web Workers。Web Workers 能够创建工作线程来进行计算，来解决 JavaScript 大计算阻塞 UI 渲染的问题。工作线程为了不阻塞主线程，通过消息传递的方式来传递运行结果，这也使得工作线程不能访问主线程中的 UI。

Node 采用了与 Web Workers 相同的思路来解决单线程中大计算量的问题：child_process。

**子进程的出现，意味着 Node 可以从容地应对单线程在健壮性和无法利用多核 CPU 方面地问题。通过将计算分发到各个子进程，可以将大量计算分解掉**，然后再通过进程之间地事件消息来传递结果，这可以很好地保持应用模型地简单和低依赖。通过 Master-Worker 地管理方式，也可以很好地管理各个工作进程，以达到更高地健壮性。

#### I/O 密集型

在 Node 得推广过程中，无数次有人问其 Node 的应用场景是什么。如果将所有的脚本语言拿到一处来评判，那么从单线程的角度来说，Node 处理 I/O 的能力是值得竖起大拇指称赞的。通常，说 Node 擅长 I/O 密集型的应用场景基本没人反对。Node 面向网络且擅长并行 I/O，能够有效地阻止起更多地硬件资源，从而提供更多更好地服务。

I/O 密集型地优势在于 Node 利用事件循环地处理能力，而不是启动每一个线程为每一个请求服务，资源总用极少。

#### 是否不擅长 CPU 密集型业务

换一个角度，在 CPU 密集地应用场景中，Node 是否能够胜任呢？实际上，V8 地执行效率是十分高地。单以执行效率来做评判，V8 地执行效率是毋庸置疑的。

![](https://qiniu.espe.work/blog/20220407104253.png)

Node 在性能上不俗，从另一个角度来说，CPU 密集型应用其实并不可怕。CPU 密集型应用给 Node 带来的挑战主要是：由于 JavaScript 单线程的原因，如果有长时间运行的计算（如大循环），将会导致 CPU 时间片不能释放，使得后续 I/O 无法发起。但是适当调整和分解大型运算任务为多个小人物，使得运算能够适时释放，非阻塞 I/O 调用的发起，这样既可以同时享受到并行异步 I/O 的好处，又能充分利用 CPU。

**关于 CPU 密集型应用，Node 的异步 I/O 已经解决了在单线程上 CPU 与 I/O 之间阻塞无法重叠利用的关系，I/O 阻塞造成的性能浪费远比 CPU 的影响小**。对于长时间运行的计算，如果他的耗时超过普通阻塞 I/O 的耗时，那么应用场景需要重新评估，因为这类计算比阻塞 I/O 还影响效率，甚至说就是一个纯计算的场景，根本没有 I/O。此类应用场景或许应当采用多线程的方式进行计算。Node 虽然没有提供多线程用于计算支持，但是还是从以下两个方式来充分利用 CPU。

- Node 可以通过编写 C/C++扩展的方式更高效地利用 CPU，将一些 V8 不能左到性能极致地地方通过 C/C++来实现。C/C++扩展地方式实现，比 Java 速度还快。
- 如果单线程地 Node 不能满足需求，甚至用了 C/C++地扩展还觉得不够，那么通过子进程的方式，将一部分 Node 进程当作常驻服务进程用于计算，然后利用进程间的消息来传递结果，将计算与 I/O 分离，这样还能充分利用 CPU.

### 模块机制

CommonJS 规范为 JavaScript 制定了一个美好的愿景——希望 JavaScript 能够在任何地方运行。

#### CommonJS 的出发点

CommonJS 规范的提出，主要是为了弥补当前 JavaScript 没有标准的缺陷，以达到像 python、Ruby 和 Java 等具备开发大型应用的基础能力，而不是停留在小脚本程序的阶段。他们期望那些用 CommonJS API 写出的应用可以具备跨宿主环境执行的能力，这样不仅可以利用 JavaScript 开发富客户端应用，而且还可以编写以下应用。

- 服务端 JavaScrip 应用程序。
- 命令行工具。
- 桌面图形界面应用程序。
- 混合应用（Titanium 和 Adobe AIR 等形式的应用）。

如今，CommonJS 中的大部分规范虽然依旧是草案，但是已经初显成效，为 JavaScript 开发大型应用程序指明了一条非常棒的道路。目前，它依旧在成长中，这些规范涵盖了模块、二进制、Buffer、字符集、I/O 流、进程环境、文件系统、套接字、单元测试、Web 服务器网关接口、包管理等。

**Node 借助 CommonJS 的 Modules 规范实现了一套非常易用的模块系统，NPM 对 Packages 规范的完好支持使得 Node 应用在开发过程中事半功倍。**

#### 包与 npm

Node 组织了自身的核心模块，也使得第三方文件模块可以有序地编写和使用。但是在第三方模块中，模块与模块之间仍然是散列在各地的，相互之间不能直接引用。而在模块之外，包和 NPM 则是将模块联系起来的一种机制。

CommonJS 包规范是理论，NPM 是其中的一种实践。NPM 之于 Node，相当于 gem 之于 Ruby，pear 之于 PHP。对于 Node 而言，NPM 帮助完成了第三方模块的发布、安装和依赖等。借助 NPM，Node 与第三方模块之间形成了很好的生态系统。

![](https://qiniu.espe.work/blog/20220412110342.png)

### 包结构

包实际上是一个存档文件，即一个目录直接打包为.zip 或.tar.gz 格式的文件，安装后解压还原目录。完全符合 CommonJS 规范的包目录应该包含如下文件：

- package.json：包描述文件。
- bin：用于存放可执行二进制文件的目录。
- lib：用于存放 JavaScript 代码的目录。
- doc：用于存放文档的目录。
- test：用于存放单元测试用力的代码。

可以看出，CommonJS 包规范从文档、测试等方面都做过考虑。当一个包完成后向外公布时，用户看到单元测试和文档的时候，会给他们一种踏实可靠的感觉。

### 包描述文件和 NPM

包描述文件用于表达非代码相关的信息，它是一个 JSON 格式的文件——pacakge.json，位于包的根目录下，是包的重要组成部分。而 NPM 得所有行为斗鱼包描述文件中得字段息息相关。由于 CommonJS 包规范尚处于草案阶段，NPM 在实践中做了一定得取舍，具体细节在和后面会介绍到。

CommonJS 为 package.json 文件定义了如下一些必须字段。

- name。包名。规范定义它需要由小写字母和数字组成，可以包含.、\_和-，但不允许出现空格。包名必须是唯一得，以免对外公布时产生重名冲突得误解。除此之外，NPM 还建议不要在包名中附带上 node 或 js 来重复标识它是 JavaScript 或 Node 模块。

- description。包简介。

- version。版本号。一个语义化的版本号，在http://semver.org上有详细定义，通常为 major.minor.revision 格式。该版本号十分重要，常常用于一些版本控制的场合。

- keywords。关键词数组，NPM 中主要用来做分类搜索。一个好的关键词组有利于用户快速找到你编写的包。

- maintainers。包维护者列表。每个维护者由 name、email 和 web 这三个属性组成。示例"maintainers": [{"name": "Jackson Tian", "email": "shyvo1987@gmail.com", "web": "http://html5ify.com"}]。NPM 通过改属性进行权限认证。

- contributors。贡献者列表。在开源社区中，为开源项目提供代码是经常出现的事，如果名字能出现在知名项目的 contributors 列表中，是一件比较由荣誉感的事。列表中第一个贡献应当是包作者本人。格式与维护者列表相同。

- bugs。一个可以反馈 bug 的网页或者邮箱地址。

- licenses。当钱包所使用的许可证列表，表示这个包可以在哪些许可证下使用。它的格式："licenses": [{"type": "GPLv2", "url": "http://www.example.com/licenses/gpl.html"}]。

- repositories。托管源代码的位置列表，表明可以通过哪些方式和地址访问包的源代码。

- dependencies。使用当前包所需要依赖的包列表。这个属性十分重要，NPM 需要通过这个属性帮助自动加载依赖的包。
  除了必要字段外，规范还定义了一部分可选字段，如：

- homepage。当前包的网站地址。

- os。操作系统支持列表。这些操作系统的取值包括 aix、freebsd、linux、macos、solaris、vxworks、windows。如果设置了列表为空，则不对操作系统做任何假设。

- cpu。CPU 架构的支持列表，有效的架构名称有 arm、mips、ppc、sparc、x86 和 x86_64。通 os 一样，如果列表为空，则不对 CPU 架构做任何假设。

- engine。支持的 JavaScript 引擎列表，有效的引擎取值包括 ejs、flusspferd、gpsee、jsc、spidermonkey、narwhal、node、v8。

- builtin。标识当前包是否是内建在底层系统的标准组件。

- directories。包目录说明。

- implements。实现规范的列表。标志当前包实现了 CommonJS 的哪些规范。

- script。脚本说明对象。它主要被包管理器用来安装、编译、测试和卸载包。示例：

```json
"scripts":{
"install": "install.js",
"unistall": "uninstall.js",
"build": "build.js",
"doc": "make-doc.js",
"test": "test.js"
}
```

**包规范的定义可以帮助 Node 解决依赖包安装的问题，而 NPM 正式基于该规范进行了实现**。最初，NPM 工具是由 ISaac Z. Schlueter 单独创建，提供给 Node 服务的 Node 包管理器，需要单独安装。后来，在 v0.6.3 版本集成进 Node 中作为默认的包管理器，作为软件包的一部分一起安装。

在包描述文件的规范中，NPM 实际需要的字段主要有 name、version、description、keywords、repositories、author、bin、main、scripts、engines、dependencies、devDependencies。与包规范区别在于多了 author、bin、main 和 devDependencies4 个字段：

- author。包作者。

- bin。一些包作者希望包可以作为命令行工具使用。配置好 bin 字段后，通过 npm install package_name -g 命令可以将脚本添加到执行路径中，之后可以在命令行中直接执行。前面的 node-gyp 即是这样安装的。通过-g 命令安装的模块包称为全局模式。

- main。模块引入方法 require()在引入包时，会优先检查该字段，并将其作为包 中其余模块的入口。如果不存在这个字段，require()方法会查找包目录下的 index.js、index.node、index.json 文件作为默认入口。

- devDependencies。一些模块只在开发时需要依赖。配置这个属性，可以提示包的后续开发者安装依赖包。

下面是知名框架 express 项目的 package.json 文件，具有一定的参考意义：

```json
{
  "name": "express",
  "description": "Fast, unopinionated, minimalist web framework",
  "version": "4.17.1",
  "author": "TJ Holowaychuk <tj@vision-media.ca>",
  "contributors": [
    "Aaron Heckmann <aaron.heckmann+github@gmail.com>",
    "Ciaran Jessup <ciaranj@gmail.com>",
    "Douglas Christopher Wilson <doug@somethingdoug.com>",
    "Guillermo Rauch <rauchg@gmail.com>",
    "Jonathan Ong <me@jongleberry.com>",
    "Roman Shtylman <shtylman+expressjs@gmail.com>",
    "Young Jae Sim <hanul@hanul.me>"
  ],
  "license": "MIT",
  "repository": "expressjs/express",
  "homepage": "http://expressjs.com/",
  "keywords": [
    "express",
    "framework",
    "sinatra",
    "web",
    "http",
    "rest",
    "restful",
    "router",
    "app",
    "api"
  ],
  "dependencies": {
    "accepts": "~1.3.7",
    "array-flatten": "1.1.1",
    "body-parser": "1.19.0",
    "content-disposition": "0.5.3",
    "content-type": "~1.0.4",
    "cookie": "0.4.0",
    "cookie-signature": "1.0.6",
    "debug": "2.6.9",
    "depd": "~1.1.2",
    "encodeurl": "~1.0.2",
    "escape-html": "~1.0.3",
    "etag": "~1.8.1",
    "finalhandler": "~1.1.2",
    "fresh": "0.5.2",
    "merge-descriptors": "1.0.1",
    "methods": "~1.1.2",
    "on-finished": "~2.3.0",
    "parseurl": "~1.3.3",
    "path-to-regexp": "0.1.7",
    "proxy-addr": "~2.0.5",
    "qs": "6.7.0",
    "range-parser": "~1.2.1",
    "safe-buffer": "5.1.2",
    "send": "0.17.1",
    "serve-static": "1.14.1",
    "setprototypeof": "1.1.1",
    "statuses": "~1.5.0",
    "type-is": "~1.6.18",
    "utils-merge": "1.0.1",
    "vary": "~1.1.2"
  },
  "devDependencies": {
    "after": "0.8.2",
    "connect-redis": "3.4.2",
    "cookie-parser": "~1.4.4",
    "cookie-session": "1.3.3",
    "ejs": "2.7.2",
    "eslint": "2.13.1",
    "express-session": "1.17.0",
    "hbs": "4.1.0",
    "istanbul": "0.4.5",
    "marked": "0.7.0",
    "method-override": "3.0.0",
    "mocha": "7.0.1",
    "morgan": "1.9.1",
    "multiparty": "4.2.1",
    "pbkdf2-password": "1.2.1",
    "should": "13.2.3",
    "supertest": "4.0.2",
    "vhost": "~3.0.2"
  },
  "engines": {
    "node": ">= 0.10.0"
  },
  "files": ["LICENSE", "History.md", "Readme.md", "index.js", "lib/"],
  "scripts": {
    "lint": "eslint .",
    "test": "mocha --require test/support/env --reporter spec --bail --check-leaks test/ test/acceptance/",
    "test-ci": "istanbul cover node_modules/mocha/bin/_mocha --report lcovonly -- --require test/support/env --reporter spec --check-leaks test/ test/acceptance/",
    "test-cov": "istanbul cover node_modules/mocha/bin/_mocha -- --require test/support/env --reporter dot --check-leaks test/ test/acceptance/",
    "test-tap": "mocha --require test/support/env --reporter tap --check-leaks test/ test/acceptance/"
  }
}
```

#### 发布包

为了将整个 NPM 的流程串联起来，这里演示如何编写一个包，将其发布到 NPM 仓库中，并通过 NPM 安装回本地。

1.编写模块

模块的内容尽量保持简单，这里还是使用 sayHello 作为例子：

```js
exports.sayHello = function() {
  return 'Hello World!'
}
```

将代码保存为 hello.js 即可。

2.初始化包描述文件

package.json 文件的内容尽管相对较多，但是实际发布一个包时，并不需要一行一行编写。NPM 提供的 **npm init** 命令会帮助你生成 package.json 文件

NPM 通过提问式的交互逐个填入选项，最后生成预览的包描述文件。如果你满意，输入 yes,此时会在目录下得到 package.json 文件。

3.注册包仓库账号

为了维护这个包，NPM 必须要使用仓库账号才允许将包发布到仓库中。注册账号的命令是 npm adduser。这也是一个提问式的交互过程，按照顺序进行即可

4.上传包

上传包的命令是 npm publish \<folder>。在刚刚创建的 package.json 文件所在的目录下，执行 npm publish 开始上传包。

在这个过程中，NPM 会将目录打包为一个存档文件，然后上传到官方源仓库中。

5.安装包

为了体验和测试自己上传的包，可以换一个目录执行 npm install hello_test_jackson 安装它

6.包权限管理

通常一个包只有一个人拥有权限进行发布。如果需要多人进行发布，可以使用 npm owner 命令帮助你管理所有者

```shell

npm owner ls express

```

使用这个命令，也可以添加包的拥有者，删除一个包的拥有者：

```shell
npm owner ls <package name>
npm owner add <user> <package name>
npm owner rm <user> <package name>
```

#### 分析包

在使用 NPM 的过程中，或许你不能确认当前目录下能否通过 require()顺利引入想要的包，这时可以执行 npm ls 分析包。这个命令可以为你分析出当前路径下能够通过模块路径找到的所有包，并生成依赖树，如下：

```shell
`-- connect@3.7.0
  +-- debug@2.6.9
  | `-- ms@2.0.0
  +-- finalhandler@1.1.2
  | +-- debug@2.6.9 deduped
  | +-- encodeurl@1.0.2
  | +-- escape-html@1.0.3
  | +-- on-finished@2.3.0
  | | `-- ee-first@1.1.1
  | +-- parseurl@1.3.3 deduped
  | +-- statuses@1.5.0
  | `-- unpipe@1.0.0
  +-- parseurl@1.3.3
  `-- utils-merge@1.0.1
```

### 总结

CommonJS 提出的规范均十分简单，但是现实意义十分强大。Node 通过模块规范，组织了自身的原生模块，弥补了 JavaScript 弱结构性的问题，形成了稳定的结构，并向外提供服务。

NPM 通过对包规范的支持，有效地组织了第三方模块，这使得项目开发中地依赖问题得到很好的解决，并有效提供了分享和传播的平台，借助**第三方开源力量**，使得 Node 第三方模块的发展速度前所未有，这对于其他后端 JavaScript 语言实现而言是从未有过的。

### 异步 IO

**主流程**
![](https://qiniu.espe.work/blog/20220422094135.png)

**setTimeout()**
![](https://qiniu.espe.work/blog/20220422000350.png)

**利用 Node 构建 web 服务**
![](https://qiniu.espe.work/blog/20220424095304.png)

事件循环时异步实现的核心，它与浏览器中的执行模型基本保持了一致。而像古老的 Rhino，尽管时较早能在服务器端运行的 JavaScript 运行时，但是执行模型并不像浏览器采用事件驱动，而是像其他语言一般采用同步 I/O 作为主要模型，这造成了它在性能上务所发挥。Node 正是依靠构建了一套完善的高性能异步 I/O 框架，打破了 JavaScript 在服务器端止步不前的局面。

目前异步编程主要解决方案有如下 3 种：

1. 事件发布/订阅模式
2. Promise/Deferred 模式
3. 流程控制库

### 内存

V8 的垃圾回收机制与内存限制

我们在学习 JavaScript 编程时听说过，它与 Java 一样，由垃圾回收机制来进行自动内存管理，这使得开发者不需要像 C/C++程序员那样在编写代码的过程中时刻关注内存的分配和释放问题。但在浏览器中进行开发时，几乎很少有人能遇到垃圾回收对应用程序构成性能影响的情况。Node 极大地拓宽了 JavaScript 的应用场景，当主流应用场景从客户端延伸到服务器端后，我们就能发现，对于性能敏感的服务器端程序，内存管理的好坏、垃圾回收状况是否优良，都会对服务构成影响。

**高效使用内存**

在 V8 面签，开发者所要具备的责任是如何让垃圾回收机制更高效地工作。

**作用域**

提到如何触发垃圾回收，第一个介绍的是作用域（scope）。在 JavaScript 中能形成作用域的有函数调用、with 以及全局作用域。

以如下代码为例：

```javascript
var foo = function() {
  var local = {}
}
```

foo()函数在每次被调用时会创建对应的作用域，函数执行结束后，该作用域将会销毁。同时作用域中声明的局部变量分配在该作用域上，随作用域的销毁而销毁。只被局部变量引用的对象存货周期较短。在这个示例中，由于对象非常小，将会分配在新生代的 From 空间中。在作用域释放后，局部变量 local 失效，其引用的对象将会在下次垃圾回收时被释放。

以上就是最基本的内存回收过程。

**标识符查找**

与作用域相关的即是标识符查找。所谓标识符，可以理解为变量名。在下面代码中，执行 bar()函数时，将会遇到 local 变量：

var bar = function () {
console.log(local);
};
JavaScript 在执行时回去查找该变量定义在哪里。它最先查找的是当前作用域，如果在当前作用域中无法找到该变量的声明，将会向上级作用域查找，直到查到位置。

**作用域链**
在下面代码中：

```javascript
var foo = function() {
  var local = 'local var'
  var bar = function() {
    var local = 'another var'
    var baz = function() {
      console.log(local)
    }
    baz()
  }
  bar()
}
foo()
```

local 变量在 baz()函数形成的作用域里查找不到，继而将在 bar()的作用域里寻找。如果去掉上述代码 bar()中的 local 声明，将会继续向上查找，一直到全局作用域。这样的查找方式使得作用域像一条链条。由于标识符的查找方向是向上，所以变量只能向外访问，而不能向内访问。

当我们在 baz()函数中访问 local 变量时，由于作用域中的变量列表没有 local，所以会向上一个作用域中查找，接着会在 bar()函数执行得到的变量列表中找到一个 local 变量的定义，于是使用它。尽管在再上一层的作用域中也存在 local 的定义，但是不会继续查找了。如果查找一个不存在的变量，将会一直沿着作用域链查找到全局作用域，最后抛出未定义错误。

了解了作用域，有助于我们了解变量的分配和释放。

**变量的主动释放**

如果变量是全局作用域（不通过 var 声明或定义在 global 变量上），由于全局作用域需要直到进程退出才释放，此时将导致引用的对象常驻内存（常驻在老生代）。如果需要释放常驻内存的对象，可以通过 delete 操作来删除引用关系。或者将变量重新赋值，让旧的对象脱离引用关系。在接下来的老生代内存清理和整理过程中，会被回收释放。下面为示例代码：

```javascript
global.foo = 'I am global object'
console.log(global.foo) // => I am global object
delete global.foo

// 或者重新赋值
global.foo = undefined // or null
console.log(global.foo) // => undefined
```

同样，如果在非全局作用域中，想主动释放变量引用的对象，也可以通过这样的方式。虽然 delete 操作和重新赋值具有相同效果，**但是在 V8 中通过 delete 删除对象的属性有可能干扰 V8 的优化，所以通过赋值解除引用更好。**

**闭包**

我们直到作用域链上的对象访问只能向上，这样外部无法向内部访问。如下代码可以正常打印：

```javascript
var foo = function() {
  var local = '局部变量'
  ;(function() {
    console.log(local)
  })()
}
```

但在下面代码中，却会得到 local 未定义的异常：

```javascript
var foo = function() {
  ;(function() {
    var local = '局部变量'
  })()
  console.log(local)
}
```

在 JavaScript 中，实现外部作用域访问内部作用域中变量的方法叫做闭包（closure）。这得益于高阶函数的特性：函数可以作为参数或者返回值。示例代码如下：

```javascript
var foo = function() {
  var bar = function() {
    var local = '局部变量'

    return function() {
      return local
    }
  }
  var baz = bar()
  console.log(baz())
}
```

一般而言，在 bar()函数执行完成后，局部变量 local 将会随着作用域的销毁而被回收。但是注意这里的特点在于返回值是一个匿名函数，且这个函数中具备了访问 local 的条件。虽然在后续执行中，在外部作用域还是无法直接访问 local，但是若要反问他，只要通过这个中间函数稍作周转即可。

闭包是 JavaScript 的高级特性，利用它可以产生很巧妙的效果。它的问题在于，一旦变量引用了这个中间函数，这个中间函数将不会释放，同时也会使原来的作用域不会得到释放，作用域中产生的内存占用也不会得到释放。除非不再有引用，才会逐步释放。

**内存泄漏**
Node 对内存泄漏非常敏感，一旦线上应用有成千上万的流量，哪怕是一个字节的内存泄漏也会造成堆积，垃圾回收过程中将会耗费更多时间进行对象扫描，应用响应缓慢，直到进程内存溢出，应用奔溃。

在 V8 的垃圾回收机制下，在通常的代码编写中，很少会出现内存泄漏的情况。但是内存泄漏通常产生于无意间，较难排查。尽管内存泄漏的情况不尽相同，但其实质只有一个，那就是应当回收对象出现意外而没有被回收，变成了常驻老生代中的对象。

通常，造成内存泄漏的原因有如下几个：

- 缓存。
- 队列消费不及时。
- 作用域未释放。

如下代码虽然利用 JavaScript 对象十分容易创建一个缓存对象，但是受垃圾回收机制的影响，只能小量使用：

```javascript

var cache = {};
var get = function (key) {
  if(cacke[key])
    return cache[key];
  else
    // get from otherwise
};

var set = function (key, value) {
  cache[key] = value;
};

```

**缓存限制策略**

为了缓解缓存中的对象永远无法释放的问题，需要加入一种策略来限制缓存的无限增长。为此我曾写过一个模块 limitablemap，它可以实现对简直数量的限制。下面是其实现：

```javascript
var LimitableMap = function(limit) {
  this.limit = limit || 10
  this.map = {}
  this.keys = {}
}

var hasOwnProperty = Object.prototype.hasOwnProperty

LimitableMap.prototype.set = function(key, value) {
  var map = this.map
  var keys = this.keys
  if (!hasOwnProperty.call(map, key)) {
    if (keys.length === this.limit) {
      delete map[firstKey]
    }
    keys.push(key)
  }
  map[keys] = value
}

LimitableMap.prototype.get = function(key) {
  return this.map[key]
}

module.exports = LimitableMap
```

可以看到，实现过程还是非常简单的。记录在数组中，一旦超过变量，就先进先出的方式进行淘汰。

当然，这种淘汰策略并不十分高效，只能应付小型应用场景。如果需要更高效的缓存，可以参见 Isaac Z. Schlueter 采用 LRU 算法的缓存。

**小结**

Node 将 JavaScript 的主要应用场景扩展到了服务器端，相应要考虑的细节也从浏览器端不同，需要更严谨地为每一份资源做出安排。总的来说，内存在 Node 中不能随心所欲地使用，但也不是完全不擅长。本行介绍了内存地各种限制，希望读者可以在使用中规避禁忌，与生态系统中地各种软件搭配，发挥 Node 的长处。

### 理解 Buffer

由于应用场景不同，在 Node 中，应用需要处理网络协议、操作数据库、处理图片、接受上传文件等，在网络流和文件的操作中，还需要处理大量二进制数据，JavaScript 自有的字符串远远不能满足这些需求，于是 Buffer 对象应运而生。

Buffer 是一个像 Array 的对象，但它主要用于操作字节。下面我们从模块结构和对象结构的层面上认识它。

**模块结构**

Buffer 是一个典型的 JavaScript 与 C++结合的模块，它将性能相关部分用 C++实现，将非性能相关部分用 JavaScript 实现。

Buffer 所占用的内存不是通过 V8 分配的，属于堆外内存。由于 V8 垃圾回收性能的影响，将常用的操作对象用更高效和专有的内存分配回收策略来管理是个不错的思路。

由于 Buffer 太过常见，Node 在进程启动时就加载了它，并将其放在全局对象（global)上，所以在使用 Buffer 时，无需通过 require()即可使用。

**Buffer 对象**

Buffer 对象类似于数组，它的元素为 16 进制的两位数，即 0 到 255 的数之。示例代码如下：

```javascript
var str = '深入浅出 node.js'
var buf = new Buffer.from(str, 'utf8')
console.log(buf)
// => <Buffer e6 b7 b1 e5 85 a5 e6 b5 85 e5 87 ba 6e 6f 64 65 2e 6a 73>
```

不同编码的字符串占用的元素个数各不相同，上面代码中的中文字在 utf-8 编码下占用 3 个元素，字母和标点符号占用 1 个元素。

Buffer 受 Array 类型的影响很大，可以访问 length 属性得到长度，也可以通过下标访问元素，在构造对象时也十分相似：

```javascript
var buf = new Buffer(100)
console.log(buf.length) // => 100
```

上述代码分配了一个长 100 字节的 Buffer 对象。可以通过下标访问刚初始化的 Buffer 的元素：

```javascript
console.log(buf[10])
```

我们可以通过下表对每个元素进行赋值。值得注意的是，如果如果不是 0 到 255 的整数，会不一样。

给元素的赋值如果小于 0，则将该值逐次加到 256，直到得到一个 0 到 255 之间的整数。如果得到的值大于 255，则逐次减 256，直到得到 0-255 区间的数值。如果是小数则舍弃小数部分，只保留整数。

**Buffer 内存分配**

Buffer 对象的内存分配不是在 V8 的堆内存，而是在 Node 的 C++层面实现的内存的申请。因为处理大量的字节数据不能采用需要一点内存就能向操作系统申请一点内存的方式，这可能造成大量的内存申请的系统调用，对操作系统有一定压力。为此，**Node 在内存的使用上应用的是在 C++层面申请内存、在 JavaScript 中分配内存的策略。**

为了高效地使用申请来地内存，Node 采用了 slab 分配机制。slab 是一种动态内存管理机制，最早诞生在于 SunOS 操作系统中，目前一些\*nix 操作系统中广泛应用。

简单而言，slab 就是一块申请好地固定大小的内存区域。slab 具有如下三种状态：

- full：完全分配状态。
- partial：部分分配状态。
- empty：没有被分配状态。

我们需要一个 Buffer 对象，可以通过以下分配方式指定大小的 Buffer 对象：

```javascript
new Buffer(size)
```

Node 以 8kb 为界限来区分 Buffer 是大对象还是小对象：

```javascript
Buffer.poolSize = 8 * 1024
```

这个 8kb 的值也就是每个 slab 的大小值，在 JavaScript 层面，它作为单位单元进行内存的分配。

1.分配小 Buffer 对象

如果指定 Buffer 的大小小于 8kb，Node 会按照小对象的方式进行分配。Buffer 的分配过程中主要使用一个局部变量 pool 作为中间处理对象，处于分配状态的 slab 单元将指向它。以下是分配一个全新的 slab 单元的操作，它会将申请的 slowBuffer 对象指向它：

```javascript
var pool

function allocPool() {
  pool = new SlowBuffer(Buffer.spoolSize)
  pool.used = 0
}
```

构造小 Buffer 对象时的代码如下：

```javascript
new Buffer(1024)

// 这次构造回去检查 pool 对象，如果 pool 没有被创建，将会创建一个新的 slab 单元指向它：
if (!pool || pool.length - pool.used < this.length) allocPool()

// 同时当前 Buffer 对象的 parent 属性指向该 slab，并记录下从这个 slab 的哪个位置（offset)开始使用，
// slab 对象自身也记录被使用了多少字节：
this.parent = pool
this.offset = pool.used
pool.used += this.length
if (pool.used & 7) pool.used = (pool.used + 8) & ~7

// 当再次创建一个 Buffer 对象时，构造过程中将会判断这个 slab 的剩余空间是否足够。如果足够，使用剩余空间，并更新 slab 的分配状态。
new Buffer(3000)
```

如果 slab 剩余的空间不够，将会构造新的 slab，原 slab 中剩余的空间会造成浪费。例如，第一次构造 1 字节的 Buffer 对象，第二次构造 8192 字节的 Buffer 对象，由于第二次分配时 slab 中的空间不够，所以创建并使用新的 slab，第一个 slab 的 8kb 将会被第一个 1 字节的 Buffer 对象独占。

这里要注意的事项时，**由于同一个 slab 可能分配给多个 Buffer 对象使用，只有这些小 Buffer 对象在作用域释放并都可以回收时，slab 的 8kb 空间才会被回收**。尽管创建了 1 个字节的 Buffer 对象，但是如果不释放它，实际可能时 8kb 的内存没有释放。

2. 分配大 Buffer 对象
   如果需要超过 8kb 的 Buffer 对象，将会直接分配一个 SlowBuffer 对象作为 slab 单元，这个 slab 单元将会被这个 Buffer 对象独占。

```javascript
// Big buffer, just alloc one
this.parent = new SlowBuffer(this.length)
this.offset = 0
```

这里的 SlowBuffer 类时 C++中定义的，虽然引用 buffer 模块可以访问到它，但是不推荐直接操作它，而是用 Buffer 替代。

上面提到的 Buffer 对象都是 JavaScript 层面的，能够被 V8 的回收标记回收。但是其内部的 parent 属性指向的 SlowBuffer 对象确来自于 Node 自身 C++中的定义，如果是 C++层面的 Buffer 对象，所用内存不在 V8 的堆中。

简单而言，真正的内存是在 Node 的 C++层面提供的，JavaScript 层面只是使用它。当进行小而频繁的 Buffer 操作时，采用 slab 的机制进行预先申请和事后分配，使得 JavaScript 到操作系统之间不必有过多的内存申请方面的系统调用。对于大块的 Buffer 而言，则直接使用 C++层面提供的内存，而无需细腻的分配操作。

#### Buffer 的转换

Buffer 对象可以与字符串之间相互转换。目前支持的字符串编码类型有如下这几种：

- ASCII
- UTF-8
- UTF-16LE/UCS-2
- Base64
- Binary
- Hex

**字符串转 Buffer**

字符串转 Buffer 对象主要是通过构造函数来完成的：

```javascript
new Buffer(str, [encoding])
```

通过构造函数转换的 Buffer 对象，存储的只能是一种编码类型。encoding 参数不传递时，默认按 UTF-8 编码进行转换和存储。

**Buffer 转字符串**

```javascript
buf.toString([encoding, start, end])
```

比较精巧的是，可以设置 encoding（默认为 UTF-8）、start、end 这三个参数实现整体或局部的转换。如果 Buffer 对象由多种编码写入，就需要在局部指定不同的编码，才能转换正常的编码。

**Buffer 的拼接**

Buffer 在使用场景中，通常以一段一段的方式传输。以下是常见的从输入流中读取内容的示例代码：

```javascript
var fs = require('fs')

var rs = fs.createReadStream('test.md')
var data = ''
rs.on('data', function(trunk) {
  data += trunk
})
rs.on('end', function() {
  console.log(data)
})
```

上面这段代码常见于国外，用于流读取的示范，data 事件中获取的 chunk 对象即是 Buffer 对象。对于初学者而言，容易将 Buffer 当作字符串来理解，所以在接受上面的示例时不会觉得有任何异常。

一旦输入流中有宽字节编码时，问题就会暴露出来。如果在通过 Node 开发的网站上看到乱码符号，那么该问题起源多半来自于这里。

```javascript
// 这里潜藏的问题在于：
data += trunk
```

```javascript
// 这句代码英藏了 toString()操作，它等价于：
data = data.toString() + trunk.toString()
```

值得注意的是，外国人的语境通常是指英文环境，在该的场景下，这个 toString()不会造成任何问题。但是对于宽字节的中文，就会形成问题。为了重现这个问题，下面我们模拟近似场景，将文件可读流每次读取的 Buffer 长度限制为 11：

```javascript
var fs = fs.createReadStream('test.md', { highWaterMark: 11 })
```

搭配该代码的测试数据为李白的《静夜思》。所以将得到乱码数据。

![](https://qiniu.espe.work/blog/20220424111524.png)

这首诗的原始 Buffer 应存储为

![](https://qiniu.espe.work/blog/20220424111931.png)

上面诗歌中，产生这个输出结果的原因在于文件可读流在读取时会逐个读取 Buffer。由于我们限定了 Buffer 对象长度为 11，因此只读流读取 7 次才完成完整的读取，结果是以下几个 Buffer 对象依次输出：

![](https://qiniu.espe.work/blog/20220424112420.png)

上文提到的 buf.toString()方法默认以 UTF-8 为编码，中文字在 UTF-8 下占用 3 个字节。所以一个 Buffer 对象在输出时，只能显示 3 个字符，Buffer 中剩下的 2 个字节将会以乱码的形式显示。于是形成了一些文字无法正常显示的问题。在这个示例中，我们构造了 11 这个限制，但是对于任意长度的 Buffer 而言，宽字节字符串都有可能被截断的情况，只不过 Buffer 的长度越大出现的概率越低而已，但该问题依然不可忽视。

**setEncoding()与 string_decoder()**

在看过上述的示例后，我们忘记了可读流还有一个设置编码的方法 setEncoding()，示例：

```javascript
readable.setEncoding(encoding)
```

该方法的作用是让 data 事件中传递的不再是一个 Buffer 对象，而是编码后的字符串。为此，我们继续改进前面诗歌程序，添加 setEncoding()的步骤如下：

```javascript
var rs = fs.createReadStream('test.md', { highWaterMark: 11 })
rs.setEncoding('utf8')
```

重新执行程序，发现输出不再受 Buffer 大小的影响了。那 Node 是如何实现的呢？要知道，无论如何设置编码，触发 data 事件的次数依旧相同，这意味着设置编码并未改变按段读取的基本方式。

事实上，在调用 setEncoding()时，可读流对象在内部设置了一个 decoder 对象。每次 data 事件都通过该 decoder 对象进行 Buffer 到字符串的解码，然后传递给调用者。是故设置编码后，data 不再收到原始的 Buffer 对象。但是这依旧无法解释为何设置编码后乱码问题就解决掉了，因为前述分析中，无论如何转码，总是存在宽字节字符串被截断的问题。

最终乱码问题得以解决，还是在于 **decoder** 的神奇之处。decoder 对象来自于 string_decoder 模块 StringDecoder 的实例对象。它神奇的原理，我们以代码来说明：

```javascript
var StringDecoder = require('string_decoder').String.Decoder
var decoder = new StringDecoder('utf8')

var buf1 = new Buffer([
  0xe5,
  0xba,
  0x8a,
  0xe5,
  0x89,
  0x8d,
  0xe6,
  0x98,
  0x8e,
  0xe6,
  0x9c
])
console.log(decoder.write(buf1))
// => 床前明

var buf2 = new Buffer([
  0x88,
  0xe5,
  0x85,
  0x89,
  0xef,
  0xbc,
  0x8c,
  0xe7,
  0x96,
  0x91,
  0xe6
])
console.log(decoder.write(buf2))
// => 月光，疑
```

我们将前文提到的两个 Buffer 对象写入 decoder 中。奇怪的地方在于“月”的转码并没有如平常一样在两个部分分开输出。StringDecoder 在得到编码后，知道宽字节字符串在 UTF-8 编码下是以 3 个字节的方式存储的，所以第一次 write()时，只输出 9 个字节转码形成的字符，“月”字的前两个字节被保留在 StringDecoder 实例内部。第二次 write()时，会将这两个剩余字节和后续 11 个字节组合在一起，再次用 3 的整数倍字节进行转码。于是乱码问题通过这种中间形式被解决了。

虽然 string_decoder 模块很奇妙，但是它也并非万能药，**它目前只能处理 UTF-8、Base64 和 UCS-2/UTF-16LE 这三种编码**。所以通过 setEncoding()的方式不可否认能解决大部分乱码问题，但并不能从根本上解决该问题。

#### 正确拼接 Buffer

淘汰掉 setEncoding()方法后，剩下的解决方案只有将多个小 Buffer 对象拼接为一个 Buffer 对象，然后通过 iconv-lite 一类的模块来转码这种方式。+=的方式显然不行，那么正确的 Buffer 拼接方法应该是：

```javascript
var chunks = []
var size = 0
res.on('data', function(chunk) {
  chunks.push(chunk)
  size += chunk.length
})

res.on('end', function() {
  var buf = Buffer.concat(chunks, size)
  var str = iconv.decode(buf, 'utf8')
  console.log(str)
})
```

**正确的拼接方式时用一个数组来存储接收到的所有 Buffer 片段并记录下所有片段的总长度，然后调用 Buffer.concat()方法生成一个合并的 Buffer 对象**。Buffer.concat()方法封装了从小 Buffer 对象向大 Buffer 对象的赋值过程，实现十分细腻，值得围观学习：

```javascript
Buffer.concat = function(list, length) {
  if (!Array.isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [length])')
  }

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  if (typeof length !== 'number') {
    length = 0
    for (var i = 0; i < list.length; i++) {
      var buf = list[i]
      length += buf.length
    }
  }

  var buffer = new Buffer(length)
  var pos = 0
  for (var i = 0; i < list.length; i++) {
    var buf = list[i]
    buf.copy(buffer.pos)
    pos += buf.length
  }
  return buffer
}
```

#### Buffer 与性能

Buffer 在文件 I/O 和网络 I/O 中运用广泛，尤其在网络传输中，它的性能举足轻重。在应用中，我们通常会操作字符串，但**一旦在网络中传输，都需要转换为 Buffer,以二进制数据传输。在 Web 应用中，字符串转换到 Buffer 是时时刻刻发生的，提高字符串到 Buffer 的转换效率，可以很大程度地提高网络吞吐率。**

在展开 Buffer 与网络传输的关系之前，我们可以先来进行一次性能测试。下面的例子中构造了一个 10kb 大小的字符串。我们通过纯字符串的方式向客户端发送：

```javascript
var http = require('http')
var helloworld = ''

for (var i = 0; i < 1024 * 10; i++) {
  helloworld += 'a'
}

// helloworld = new Buffer(helloworld);

http
  .createServer(function(req, res) {
    res.writeHead(200)
    res.end(helloworld)
  })
  .listen(8001)
```

我们通过 ab 进行一次性能测试，发起 200 个并发客户端：

```shell
\$ ab -c 200 -t 100 http://127.0.0.1:8001/

```

得到的测试结果：

```shell
HTML transferred: 512000000 bytes
Requests per second: 2527.64 [#/sec](mean)
Time per request: 79.125 [ms](mean)
Time per request: 0.396 [ms] (mean, across all concurrent requests)
Transfer rate: 25370.16 [Kbytes/sec] received
```

测试的 QPS（每秒查询次数）是 2527.64，传输率为每秒 25370.16kb。

接下来我们打开 helloworld = new Buffer(helloworld);的注释，使向客户端输出的是一个 Buffer 对象，无需再每次响应时进行转换。再次进行性能测试的结果如下：

```shell
Total transferred: 513900000 bytes
HTML transferred: 512000000 bytes
Requests per second: 4843.28 [#/sec](mean)
Time per request: 41.294 [ms](mean)
Time per request: 0.205 [ms] (mean, across all concurrent requests)
Transfer rate: 48612.56 [Kbytes/sec] received
```

QPS 提升到 4843.28，传输率为每秒 48612.56kb，性能接近提高一倍。

**通过预先转换静态内容为 Buffer 对象，可以有效地减少 CPU 的重复使用,节省服务器资源**。在 Node 构建的 Web 应用中,可以选择页面中的动态内容和静态内容分离，静态内容部分可以通过预先转换为 Buffer 的方式，使性能得到提升。由于文件自身时二进制数据，所以在不需要改变内容的场景下，尽量只读取 Buffer，然后直接传输，不做额外的转换，避免损耗。

**文件读取**

Buffer 的使用除了与字符串的转换有性能损耗外，在文件的读取时，有一个 highWatermark 设置对性能的影响至关重要。在 fs.createReadStream(path, options)时，我们可以传入一些参数，代码如下：

```javascript
{
flags: 'r',
encoding: null,
fd: null,
mode: 0666,
highWaterMark: 64 * 1024
}
// 我们还可以传递 start 和 end 来指定读取文件的位置范围
{start: 90, end: 99}
```

fs.createReadStream 的工作方式是在内存中准备一段 Buffer,然后在 fs.read()读取时逐步从磁盘将字节复制到 Buffer 中。完成依次读取时，则从这个 Buffer 中通过 slice()方法取出部分数据作为小 Buffer 对象，在通过 data 事件传递给调用方。如果 buffer 用完，则重新分配一个；如果还有剩余，则继续使用。

```javascript
var pool

function allocNewPool(poolSize) {
  pool = new Buffer(poolSize)
  pool.used = 0
}
```

在理想状态下，每次读取的长度就是用户指定的 highWaterMark。但是有可能读到了文件结尾，或者文件本身就没有指定的 highWaterMark 这么大，这个预先指定的 Buffer 对象将会有部分甚于，不过好在这里的内存可以分配给下次读取时使用。pool 时常驻内存的，只有当 pool 单元剩余数量小于 128 字节时，才会重新分配一个新的 Buffer 对象。Node 源代码中分配新的 Buffer 对象的判断条件如下所示：

```javascript
if (!pool || pool.length - pool.used < kMinPoolSpace) {
  // discard the old pool
  pool = null
  allocNewPool(this.\_readabelState.highWaterMark)
}
```

这里与 Buffer 的内存分配比较类似，highWaterMark 的大小对性能有两个影响的点：

highWaterMark 设置对 Buffer 内存的分配和使用有一定的影响。
highWaterMark 设置国小，可能导致系统调用次数过多。
文件流读取基于 Buffer 分配，Buffer 则给予 SlowBuffer 分配，这可以理解为两个维度的分配策略。如果文件较小（小于 8kb），有可能造成 slab 未能完全使用。

由于 fs.createReadStream()内部采用 fs.read()实现，将会引起对磁盘的系统调用，对于大文件而言，highWaterMark 的大小决定会触发系统调用和 data 事件的次数。

以下为 Node 自带的基准测试，在 benchmark/fs/read-stream-throughput.js 中可以找到：

```javascript
function runTest() {
  assert(fs.statSync(filename).size === filesize)

  var rs = fs.createReadStream(filename, {
    highWaterMark: size,
    encoding: encoding
  })

  rs.on('open', function() {
    bench.start()
  })
  var bytes = 0

  rs.on('data', function(chunk) {
    bytes += chunk.length
  })

  rs.on('end', function() {
    try {
      fs.unlinkSync(filename)
    } catch (e) {
      // TODO
    }

    // MB/sec
    bench.end(bytes / (1024 * 1024))
  })
}
```

下面为某次执行的结果：

```shell
fs/read-stream-throughput.js type=buf size=1024: 46.284
fs/read-stream-throughput.js type=buf size=4096: 139.62
fs/read-stream-throughput.js type=buf size=65535: 681.88
fs/read-stream-throughput.js type=buf size=1048576: 857.98
```

**从上面的执行结果我们可以看到，读取一个相同的大文件时，highWaterMark 值得大小与读取速度的关系： 该值越大，读取速度越快。**

**总结**
体验过 JavaScript 友好的字符串操作后，有些开发发者可能会形成思维定势，将 Buffer 当作字符串来理解。但字符串与 Buffer 之间有实质上的差异，即 Buffer 是二进制数据，字符串与 Buffer 之间存在编码关系。因此，理解 Buffer 的诸多细节十分必要，对于如何高效处理二进制数据十分有用。
