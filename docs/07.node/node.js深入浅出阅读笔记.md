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

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220407104253.png)

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

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220412110342.png)

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
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220422094135.png)

**setTimeout()**
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220422000350.png)

**利用 Node 构建 web 服务**
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220424095304.png)

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

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220424111524.png)

这首诗的原始 Buffer 应存储为

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220424111931.png)

上面诗歌中，产生这个输出结果的原因在于文件可读流在读取时会逐个读取 Buffer。由于我们限定了 Buffer 对象长度为 11，因此只读流读取 7 次才完成完整的读取，结果是以下几个 Buffer 对象依次输出：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220424112420.png)

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

### 构建 Web 应用

#### Session

通过 Cookie，浏览器和服务器可以实现状态的记录。但是 Cookie 并非完美的，前文提及的体积过大就是一个显著的问题，最为严重的问题是 **Cookie 可以在前后端进行修改**，因此数据就极容易被篡改和伪造。如果服务器端有部分逻辑根据 Cookie 的 isVIP 字段进行判断，那么一个普通用户通过修改 Cookie 就可以轻松享受 VIP 服务了。综上所述，Cookie 对于敏感数据的保护是无效的。

**为了解决 Cookie 敏感数据的问题，Session 应运而生。Session 的数据只保留在服务器端，客户端无法修改，这样数据的安全性得到一定的保障，数据也无需在协议中每次都被传递。**

虽然服务器端存储数据十分方便，但是如何将每个客户和服务器的数据一一对应起来，这里有常见的两种实现方式：

#### 第一种：基于 Cookie 来实现用户和数据的映射

虽然将所有数据放在 Cookie 中不可取，但是将口令放在 Cookie 中还是可以的。因为口令一旦被篡改，就丢失了映射关系，也无法修改服务器端存在的数据了。并且 **Session 的有效期通常较短**，普遍设置为 20 分钟，如果 20 分钟内客户端和服务器端没有交互产生，服务器端就会将数据删除。由于数据过期时间较短，且在服务器端存储数据，因此安全性相对较高。那么口令是如何产生的呢？

一旦服务器端启用了 Session，它将约定一个键值作为 Session 的口令，这个值可以随意约定，比如 Connect 默认采用 connect_uid，Tomcat 会采用 jsessionid 等。一旦服务器检查用户请求 Cookie 中没有携带该值，他就会为之生成一个值，这个值是唯一且不重复的值，并设定超时时间。以下为生成 Session 的代码：

```javascript
var sessions = {}
var key = 'session_id'
var EXPIRES = 20 * 60 * 1000

var generate = function() {
  var session = {}
  session.id = new Date().getTime() + Math.random()
  session.cookie = {
    expire: new Date().getTime() + EXPIRES
  }

  sessions[session.id] = session
  return session
}
```

每个请求到来时，检查 Cookie 的口令与服务器端的数据，如果过期，就重新生成：

```javascript

function (req, res) {
  var id = req.cookies[key];

  if(!id) {
    req.session = generate();
  } else {
    var session  = session[id];
    if(session) {
      if(session.cookie.expire > (new Date()).getTime()) {
        // 更新超时时间
        session.cooke.expire = (new Date()).getTime + EXPIRES;
        req.session = session;
      } else {
        // 超时，删除旧数据，并重新生成
        delete sessions[id];
        req.session = generate();
      }
    } else {
      // 如果session 过期或口令不对，重新生成session
      req.session = generate();
    }
  }

  handle(req, res);
}
```

当然仅仅重新生成 Session 还不足以完成整个流程，还需要在响应客户端时设置新的值，以便下次请求时能够对应服务器端的数据，这里我们 hack 响应对象的 writeHead()方法，在它内部注入设置 Cookie 的逻辑：

```javascript
var writeHead = res.writeHead

res.writeHead = function() {
  var cookies = res.getHeader('Set-Cookie')
  var session = serialize('Set-Cookie', req.session.id)
  cookies = Array.isArray(cookies)
    ? cookies.concat(session)
    : [cookies, session]
  res.setHeader('Set-Cookie', cookies)
  return writeHead.apply(this, arguments)
}
```

至此，session 在前后端进行对应的过程就完成了。这样的业务逻辑可以判断和设置 session，一次来维护用户与服务器端的关系：

```javascript
var handle = function(req, res) {
  if (!req.session.isVisit) {
    res.session.isVisit = true
    res.writeHead(200)
    res.end('欢迎第一次来到动物园')
  } else {
    res.writeHead(200)
    res.end('动物园再次欢迎你')
  }
}
```

这样在 session 中保存的数据比直接在 Cookie 中保存数据要安全得多。这种实现方案依赖 Cookie 实现，而且也是目前大多数 Web 应用的方案。如果客户端禁止使用 Cookie，这个时间上大多数的网站将无法实现登录等操作。

#### 第二种：通过查询字符串来实现浏览器端和服务器端数据的对应

它的原理时间差请求的查询字符串，如果没有值，会先生成新的带值的 URL：

```javascript
var getURL = function(url, key, value) {
  var obj = url.parse(url, true)
  obj.query[key] = value
  return url.format(obj)
}
```

然后形成跳转，让客户端重新发起请求：

```javascript
function (req, res) {
  var redirect = function (url) {
    res.setHeader('Location', url);
    res.writeHead(302);
    res.end();
  };

  var id = req.query[key];

  if(!id) {
    var session = generate();
    redirect(getURL(req.url, key, session.id));
  } else {
    var session = sessions[id];
    if(session) {
      if(session.cookie.expire > (new Date()).getTime()) {
        // 更新超时时间
        session.cookie.expire = (new Date()).getTime() + EXPIRES;
        req.session = session;
        handle(req, res);
      } else {
        // 超时，删除旧数据，并重新生成
        delete sessions[id];
        var session = generate();
        redirect(getURL(req.url, key, session.id));
      }
    } else {
      // session 过期或口令不对
      var session = generate();
      redirect(getURL(req.url, key, session.id));
    }
  }
}
```

用户访问http://localhost/pathname时，如果服务器端发现查询字符串中不带 session_id 参数，将会将用户跳转到http://localhost/pathname?session_id=1234567这样类似的地址。如果浏览器收到 302 状态码和 Location 报头，就会重新发起新的请求。这样新的请求到来时就能通过 Session 的检查，除非呢村中的数据过期。

有的服务器在客户端禁用 Cookie 时，会采用这种方案实现退化。通过这种方案，无需再响应时设置 Cookie。但是这种方案带来的风险远大于基于 Cookie 实现的风险，因为只要将地址栏中的地址发给另一个人，那么他就拥有跟你同样的身份。Cookie 的方案在换了浏览器或者换了电脑之后就无法生效，相对较为安全。

#### Session 与内存

在上面的示例代码中，我们都将 Session 数据直接存在变量 sessions 中，它位于内存中中。然而在第五章内存控制部分，我们分析了为什么 Node 会存在内存限制。这里将数据存放在内存中，将带来极大的隐患，如果用户增多，**我们很可能就接触到了内存限制的上限，并且内存中的数据量加大，必然会引起垃圾回收的频繁扫描，引起性能问题**。

另一个问题则是我们可能为了利用多核 CPU 而启动多个进程，这个细节在第九章中详细描述, **用户请求的连接将可能随意分配搭配各个进程中，Node 的进程与进程之间是不能共享内存的，用户的 Session 可能会引起错乱。**

为了解决性能问题和 Session 数据无法跨进程共享的问题, **常用的方案就是将 Session 集中化，将原本分散在多个进程里的数据，统一转移到集中的数据存储中**。目前常用的工具是 Redis、Memcached 等，通过这些高效的缓存，Node 进程无需在内部维护数据对象，垃圾回收问题和内存限制问题都可以迎刃而解，并且这些告诉缓存设计的缓存过期策略更合理更高效，比在 Node 中自行设计缓存策略更好。

采用第三方缓存来存储 Session 引起的一个问题是会引起网络访问。理论上来说，访问网络中的数据要比访问本地磁盘中的数据速度要慢，因为涉及到握手、传输以及网络终端自身的磁盘 I/O 等，尽管如此但依然会采用这些高速缓存的理由有以下几条：

- Node 与缓存服务保持长连接，而非频繁的短链接，握手导致的延迟只影响初始化。
- 高速缓存直接在内存中进行数据存储和访问。
- 缓存服务通常与 Node 进程运行在相同机器上或者相同的机房里，网络速度收到的影响较小。
- 尽管采用专门缓存服务会比直接在内存中访问慢，但其影响小之又小，带来的好处却远远大于直接在 Node 中缓存数据。

为此，一旦 Session 需要异步的方式获取，代码就需要略作调整，变成异步的方式：

```javascript
function (req, res) {
  var id = req.cookies[key];

  if(!id) {
    req.session = generate();
    handle(req, res);
  } else {
    store.get(id, function (err, session) {
      if(session) {
        if(session.cookie.expire > (new Date()).getTime()) {
          // 更新超时时间
          session.cookie.expire = (new Date()).getTime + EXPIRES;
          req.session = session;
        } else {
          // 超时，删除旧数据，并重新生成
          delete session[id];
          req.session = generate();
        }
      } else {
        // 过期或者口令不对，重新生成
        req.session = generate();
      }
      handle(req, res);
    });
  }
}
```

在响应时，将新的 session 保存会缓存中：

```javascript
var writeHead = res.writeHead

res.writeHead = function() {
  var cookies = res.getHeader('Set-Cookie')
  var session = serialize('Set-Cookie', req.session.id)
  cookies = Array.isArray(cookies)
    ? coolies.concat(session)
    : [cookies, session]

  res.setHeader('Set-Cookie', cookies)

  // 保存回缓存
  store.save(req.session)
  return writeHead.apply(this, arguments)
}
```

### 玩转进程

Node 在选型时决定在 V8 引擎之上构建，也就意味着它的木星于浏览器类似。我们的 JavaScript 将会运行在单个进程的单个线程上。**它带来的好处是：程序状态是单一的，在没有多线程的情况下没有锁、线程同步问题，操作系统在调度时也因为较少上下文的切换，可以很好地提高 CPU 的使用率。**

但是单进程单线程并非完美的结构，如今 CPU 基本均是多核的，真正的服务器（非 VPS）往往还有多个 CPU。一个 Node 进程只能利用一个核，这将抛出 Node 实际应用的第一个问题：如何充分利用多核 CPU 服务器？

另外，由于 Node 执行在单进程上，**一旦单线程上抛出的异常没有捕获，将会引起整个进程奔溃。这给 Node 的实际应用抛出了第二个问题：如何保证进程的健壮性和稳定性？**

从严格的意义上而言，Node 并非真正的单线程架构，在第三章中我们有叙述过 Node 自身还有一定的 I/O 线程存在，这些 I/O 线程由底层 libuv 处理，这部分线程对于 JavaScript 开发者而言是透明的，只在 C++扩展开发时才会关注到。JavaScript 代码永远运行在 V8 上，是单线程的。本章将围绕 JavaScript 部分展开，所以屏蔽底层细节的讨论。

#### 事件驱动

多线程的服务模型服役了很长一段时间，Apache 就是采用多线程/多进程模型实现的，当并发量增长到上万时，内存耗用的问题将会暴露出来，这即是著名的 C10k 问题。

为了解决高并发问题，基于事件驱动的服务模型出现了，向 Node 与 Nginx 均是基于事件驱动的方式实现的，采用单线程避免了不必要的内存开销和上下文切换开销。

基于事件的服务模型存在的问题即是本章起始时提及的两个问题：CPU 的利用率和进程的健壮性。单线程的架构并不少，其中尤以 PHP 最为知名——在 PHP 中没有线程的支持。它的健壮性是由它给每个请求都建立独立的上下文来实现的。但是对于 Node 来说，所有请求的上下文都是统一的，它的稳定性是亟需解决的问题。

由于所有处理都在单线程上进行，影响事件驱动服务模型性能的点在于 CPU 的计算能力，它的上限绝对这类服务模型的上限，但它不受多进程或多线程模式中资源上限的影响，可伸缩性远比前两者高。如果解决掉多核 CPU 的利用问题，带来的性能提升是客观的。

#### 多进程架构

面对单进程单线程对多核使用不足的问题，前人的经验是启动多进程即可。理想状态下每个进程各自利用一个 CPU，依次实现多核 CPU 的利用。所幸，Node 提供了 **child_process** 模块，并且提供了 child_process.fork()函数，供我们实现进程的复制。

我们再一次将经典的示例代码存为 worker.js 文件：

```javascript
var http = require('http')
http
  .createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World\n')
  })
  .listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1')
```

通过 node worker.js 启动它，竟会侦听 1000 到 2000 之间的一个随机端口。将以下代码存为 master.js，并通过 node master.js 启动它：

```javascript
var fork = require('child_process').fork
var cpus = require('os').cpus()
for (var i = 0; i < cpus.length; i++) {
  fork('./worker.js')
}
```

这段代码将会根据机器上的 CPU 数量复制出对应 Node 进程数。在 Linux 系统下可以通过 ps aux |grep worker.js 查看进程数量：

```shell
ps aux | grep worker.js
```

这就是著名的 **Master-Worker** 模式，又称为**主从模式**。在主从模式中，进程分为两种：主进程和工作进程。这时典型的分布式架构中用于并行处理业务的模式，具备较好的可伸缩性和稳定性。主进程不负责具体的业务处理，而是负责调度或管理工作进程，它是趋向于稳定的。工作进程负责具体的业务处理，因为业务的多种多样，甚至一项业务由多人开发完成，所以工作进程的稳定性值得开发者关注。

通过 fork()复制的进程都是一个独立的进程，这个进程中有着独立而全新的 V8 实例。它需要至少 30ms 的启动时间和至少 10MB 的内存。尽管 Node 提供了 fork()供我们复制进程使每个 CPU 内核都四用上，丹斯依然要切记 fork()进程是昂贵的。好在 Node 通过事件驱动的方式在单线程上解决了大并发的问题，这里启动多个进程只是为了充分将 CPU 资源利用起来，而不是为了解决并发问题。

**创建子进程**

child_process 模块给予 Node 可以随意创建子进程（child_process）的能力。它提供了 4 个方法用于创建子进程。

- spawn()：启动一个子进程来执行命令。
- exec()：启动一个子进程来执行命令，与 spawn()不同的是其接口不同，它有一个回调函数获知子进程的状况。
- execFile()：启动一个子进程来执行可执行文件。
- fork()：与 spawn()类似，不同点在于它创建 Node 的子进程只需要指定执行的 JavaScript 文件模块即可。

spawn()与 exec()、execFile()不同的是，后两者创建时可以指定 timeout 属性设置超时时间，一旦创建的进程运行超过设定的时间将会被杀死。

exec()与 execFile()不同的是，exec()适合执行已有命令，execFile()适合执行文件。这里我们以一个寻常命令为例，node worker.js 分贝用上述 4 种方法实现：

```javascript
var sp = require('child_process')

cp.spawn('node', ['worker.js'])
cp.exec('node worker.js', function(err, stdout, stderr) {
  // some code
})
cp.execFile('worker.js', function(err, stdout, stderr) {
  // some code
})
cp.fork('./worker.js')
```

以上 4 个方法在创建子进程之后均会返回子进程对象。他们的差别在于：
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220425100535.png)

#### 进程间通信

在 Master-Worker 模式中，要实现主进程管理和调度工作进程的功能，需要主进程和工作进程之间的通信。对于 child_process 模块，创建好了子进程，然后与父子进程间通信是十分容易的。

在前端浏览器中，JavaScript 主进程与 UI 渲染共用同一个进程。执行 JavaScript 的时候 UI 渲染是停滞的，渲染 UI 时，JavaScript 是停滞的，两者互相阻塞。长时间执行 JavaScript 将会造成 UI 停顿不响应。为了解决这个问题，HTML5 提供了 **WebWorker API**。**WebWorker 允许创建工作线程并在后台运行，使得一些阻塞较为严重的计算不影响主线程上的 UI 渲染**。它的 API 如下所示：

```javascript
var worker = new Worker('worker.js')
worker.onmessage = function(event) {
  document.getElementById('result').textContent = event.data
}

// 其中， worker.js如下：
var n = 1
search: while (true) {
  n += 1
  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (n % i == 0) {
      continue search
      // found a prime
      postMessage(n)
    }
  }
}
```

**主进程与工作进程之间通过 onmessage()和 postMessage()进行通信**，子进程对象则由 send()方法实现主进程向子进程发送数据，message 事件实现收听子进程发来的数据，与 API 在一定程度上相似。通过消息传递内容，而不是共享或直接操作相关资源，这时较为轻量和无依赖的做法。Node 种对应示例如下：

```javascript
// parent.js

var cp = require('child_process')
var n = cp.fork(_dirname + './sub.js')

n.on('message', function(m) {
  console.log('PARENT go message:', m)
})

n.send({ hello: 'world' })

// sub.j
process.on('message', function(m) {
  console.log('CHILD got message: ', m)
})

process.send({ foo: 'bar' })
```

通过 fork()或者其它 APiece，创建子进程之后，为了实现父子进程之间的通信，父进程与子进程之间将会创建 IPC 通道。通过 IPC 通道，父子进程才能通过 message 和 send()传递消息。

#### 进程间通信原理

IPC 的全称是 Inter-Process Communication，即进程间通信。进程间通信的目的是为了让不同的进程能够互相访问资源并进行协调工作。实现进程间通信的技术由很多，如命名管道、匿名管道、socket、信号量、共享内存、消息队列、Domain Socket 等。

Node 种实现 IPC 通道的是管道（pipe)技术。但此管道非彼管道，在 Node 中管道是个抽象层的称呼，具体实现细节由 libuv 提供，在 Window 下由命名管道（named pipe）实现，Linux 系统则采用 Unix Domain Socket 实现。**表现在应用层上的进程间通信只有简单的 message 事件和 send()方法，接口十分简洁和消息化**。

父进程在实际创建子进程之前，会创建 IPC 通道并监听它，然后才真正创建出子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个 IPC 通道的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已经存在的 IPC 通道，从而完成父子进程的连接。

建立连接之后，父子进程就可以自由地通信了。由于 IPC 通道是用命名管道或 Domain Socket 创建的，它们与网络 socket 的行为比较类似，属于双向通信。不同的是它们在系统内核种就完成了进程间的通信，而不用经过实际的网络层，非常高效。在 Node 中，IPC 通道被抽象为 Stream 对象，在调用 send()时发送数据（类似于 write()），接受到的消息会通过 message 事件（类似于 data）触发给应用层。

> 只有启动的子进程是 Node 进程时，子进程才会根据环境变量去连接 IPC 通道，对于其它类型的子进程则无法实现进程间的通信，除非其它进程也按约定去连接这个已经创建好的 IPC 通道。

#### 句柄传递

建立好进程之间的 IPC 后，如果仅仅只用来发送一些简单的数据，显然不够我们的实际应用使用。还记得本章第一部分代码需要将启动的服务器分别监听各自的端口么，如果让服务都监听到相同的端口，将会有什么样的结果？

```javascript
var http = require('http')
http
  .createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World\n')
  })
  .listen(8888, '127.0.0.1')
```

再次启动 master.js，将报错。这时只有一个工作进程能够监听到该端口，其余的进程在监听的过程中都抛出了 EADDRINUSE 异常，这是端口被专用的情况，新的进程不能继续监听该端口了。这个问题破坏了我们将多个进程监听同一个端口的想法。要解决这个问题，通常的做法是让每个进程监听不同的端口，其中主进程监听著端口（如 80），主进程堆外接受所有的网络请求，再将这些请求分别代理到不同的端口的进程上。

通过代理，可以避免端口不能重复监听的问题，甚至可以在代理进程上做适当的负载均衡，使得每个子进程可以较为均衡地执行任务。由于进程每接收到一个请求，将会用掉一个文件描述符，因此代理方案中客户端连接到代理进程，代理进程连接到工作进程的过程需要用掉两个文件描述符。操作系统的文件描述符是有限的，代理方案浪费掉一倍数量的文件描述符的做法影响了系统的扩展能力。

为了解决上述这样的问题，Node 在版本 v0.5.9 引入了进程间发送句柄的功能。send()方法除了能通过 IPC 发送数据外，还能发送句柄，第二个可选参数就是句柄：child.send(message[, sendHanle])。

那什么是句柄？句柄是一种可以用来标识资源的引用，它的内部包含了指向对象的文件描述符。比如句柄可以用来标识一个服务器端的 socket 对象、一个客户端 soket 对象、一个 UDP 套接字、一个管道等。

发送句柄意味着什么？在前一个问题中，我们可以去掉代理这种方案，使主进程接受到 socket 请求后，将这个 socket 直接发送给工作进程，而不是重新与工作进程之间建立新的 socket 连接来转发数据。文件描述符浪费的问题可以通过这样的方式轻松解决。来看看我们的示例代码：

```javascript
//主进程代码
var child = require('child_process').fork('child.js')

// open up the server object and send the handle
var server = require('net').createServer()
server.on('connection', function(soket) {
  socket.end('handled by parent\n')
})

server.listen(1337, function() {
  child.send('server', server)
})

// 子进程代码：
process.on('message', function(m, server) {
  if (m === 'server') {
    server.on('connection', function(socket) {
      soket.end('handled by child\n')
    })
  }
})
```

这个示例中，直接将一个 TCp 服务器发送给子进程。这是看起来不可思议的事情，我们先来测试一番，看看效果如何：

```shell

# 先启动服务器

node parent.js

# 然后开一个新的命令行窗口，用上 curl 工具

curl 'http://127.0.0.1:1337/'

# => handled by parent

curl 'http://127.0.0.1:1337/'

# => handled by child

curl 'http://127.0.0.1:1337/'

# => handled by child

curl 'http://127.0.0.1:1337/'

# => handled by parent

```

命令行中的响应结果也是很不可思议的，这里的子进程和父进程都有可能处理我们客户端发起的请求。实时将服务发送给多个子进程：

```javascript
// parent.js
var cp = require('child_process')

var child1 = cp.fork('child.js')
var child2 = cp.fork('child.js')

// Open up server Object and send the handle

var server = require('net').createServer()
server.on('connection', function(socket) {
  socket.end('handled by parent\n')
})

server.listen(1337, function() {
  child1.send('server', server)
  child2.send('server', server)
})
```

// 然后在子进程中将进程 ID 打印出来：

```javascript
// child.js
process.on('message', function(m, server) {
  if (m === 'server') {
    server.on('connection', function(socket) {
      socket.end('handled by child, pid is ' + process.pid + '\n')
    })
  }
})
```

再用 curl 测试我们的服务：

```shell
curl 'http://127.0.0.1:1337/'

# => handled by child pid is 24673

curl 'http://127.0.0.1:1337'

# => handled by parent

curl 'http://127.0.0.1:1337'

# => handled by child, pid is 24672
```

测试的结果是每次出现的结果都可能不同，如果可能被父进程处理，也可能被不同的子进程处理。并且这是在 TCP 层面上完成的事情，我们尝试将其转换到 HTTP 层面来实时。对于主进程而言，我们甚至可以让他更轻量一点，那么是否将服务器句柄发送给子进程之后，就可以关闭服务器的监听，让子进程来处理请求呢？

我们对主进程进行改动：

```javascript
var cp = require('child_process')

var child1 = cp.fork('child.js')
var child2 = cp.fork('child.js')

// Open up the server object and send the handle
var server = require('net').createServer()
server.listen(1337, function() {
  child1.send('server', server)
  child2.send('server', server)
  // 关闭
  server.close()
})

// 子进程进行改动：
var http = require('http')
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('handled by child, pid is ' + process.pid + '\n')
})

process.on('message', function(m, tcp) {
  if (m === 'server') {
    tcp.on('connection', function(socket) {
      server.emit('connection', soket)
    })
  }
})
```

重启 parent.js 后，再次测试：

```javascript
curl "http://127.0.0.1:1337/"
# => handled by child, pid = 24852
curl "http://127.0.0.1:1337/"
# => handled by child, pid = 24851
```

这样一来，所有的请求都由子进程处理了。整个过程中，服务的过程发生了依次改变。

我们神奇地发现，**多个子进程可以同时监听相同端口**，在没有 EADDRINUSE 异常发生了。

#### 句柄发送与还原

上文介绍地虽然是句柄发送，但是仔细看看，句柄发送跟我们直接将服务器对象发送给子进程有没有差别？它是否真的将服务器对象发送给子进程？为什么它可以发送到多个子进程中？发送给子进程为什么父进程中还存在这个对象？本节将解开这些秘密地所在。

目前子进程对象 send()方法可以发送地句柄类型包括以下几种：

- net.Socket。TCP 套接字。
- net.Server。TCP 服务器，任意建立在 TCP 服务上的应用层服务都可以享受到它带来的好处。
- net.Native。C++层面的 TCP 套接字或 IPC 管道。
- dgram.Socket。UDP 套接字。
- dgram.Native。C++层面的 UDP 套接字。

send()方法在将消息发送到 IPC 管道前，将消息组装成两个对象，一个参数是 handle，另一个参数是 message。message 参数如下：

```javascript
{
  cmd: 'NODE_HANDLE',
  type: 'net.Server',
  msg: message
}
```

发送到 IPC 管道中的实际上是我们要发送的句柄文件描述符，文件描述符实际上是一个整数值。这个 message 对象在写入到 IPC 管道时也会通过 JSON.stringify()进行序列化。所以最终发送到 IPC 通道的信息都是字符串，send()方法能发送消息和句柄并不意味着他能发送任意对象。

连接 IPC 通道的子进程可以读取到父进程发来的消息，将字符串通过 JSON.parse()解析还原为对象后，才触发 message 事件将消息体传递给应用层使用。在这个过程中，消息对象还被进行过滤处理，message.cmd 的值如果以 NODE\_为前缀，它将响应一个内部事件 internalMessage。如果 message.cmd 的值为 NODE_HANDLE，它将取出 message.type 的值和得到的文件描述符一起还原出一个对应的对象。

以发送的 TCP 服务器的句柄为例，子进程收到消息后的还原过程如下：

```javascript
function (message, handle, emit) {
  var self = this;
  var server = new net.Server();
  server.listen(handle, function () {
  emit(server);
  });
}
```

上面的代码中，子进程根据 message.type 创建对应的 TCP 服务器对象，然后监听到文件描述符上。由于底层细节不被应用层感知，所以在子进程中，开发者会有一种服务器就是从父进程中直接传递过来的错觉。值得注意的是，Node 进程之间只有消息传递，不会真正地传递对象，这种错觉是抽象封装地结果。

目前 Node 只支持上述提到的几种句柄，并非任意类型的句柄都能在进程之间传递，除非它有完整的发送和还原的过程。

**端口共同监听**

在了解了句柄传递背后的原理后，我们继续探究为何通过发送句柄后，多个进程可以监听到相同的端口而不引起 EADDRINUSE 异常。其答案也很简单，**我们独立启动的进程中，TCP 服务器端 socket 套接字的文件描述符并不相同，导致监听到相同的端口时会抛出异常。**

**Node 底层对每个端口监听都设置了 SO_REUSEADDR 选项，这个选项的含义是不同进程可以就相同的网卡和端口进行监听，这个服务器端套接字可以被不同的进程复用**：

```shell
setsocket(tcp->io_watcher.fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on));

```

由于独立启动的进程互相之间并不知道文件描述符，所以监听相同端口时就会失败。但对于 send()发送的句柄还原出来的服务而言，他们的文件描述符是相同的，所以监听相同端口不会引起异常。

**多个应用监听相同端口时，文件描述符同一时间只能被某个进程所用。换言之就是网络请求向服务器端发送时，只有一个幸运的进程能够抢到连接，也就是说只有它能为这个请求进行服务。这些进程服务是抢占式的。**

#### 总结

尽管 Node 从单线程的角度来讲它有够脆弱的：既不能充分利用多核 CPU 资源，稳定性也无法得到保障。但是群体的力量时强大的，通过简单的主从模式，就可以将应用的质量提升一个档次。在实际的复杂业务中，我们可能要启动很多子进程来处理任务，结构甚至远比主从模式复杂，但是每个子进程应当是简单到只做一件事，并做好一件事，将复杂分解为简单，将简单组合成强大。

尽管通过 **child_process 模块可以大幅度提升 Node 的稳定性，但是一旦主进程出现问题，所有子进程将失去管理**。在 Node 的进程管理之外，还需要用监听进程数量或监听日志的方式确保整个系统的稳定性，即使主进程出错退出时，也能及时得到监控警报，使得开发者可以及时处理故障。


