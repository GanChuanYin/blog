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

在使用 NPM 的过程中，或许你不能确认当前目录下能否通过require()顺利引入想要的包，这时可以执行npm ls分析包。这个命令可以为你分析出当前路径下能够通过模块路径找到的所有包，并生成依赖树，如下：

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

