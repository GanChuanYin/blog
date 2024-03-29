---
title: socket和websocket
date: 2023-05-19 10:32:20
permalink: /pages/eaf46c/
categories:
  - 计算机
tags:
  - 
---
### 1. 什么是 Socket

socket 原意是“插座”或“插孔”，在网络中每台服务器相当于一间房子，房子中有着不同的插口，每个插口都有一个编号，且负责某个功能。例如充电插口、网线插口、电话插口等。

也就是说，使用不同的插口连接到对应的插口，就可以获得对应的服务。其实，插口就是 socket 服务，插口的编号就是端口号，而插头也是一个 socket 服务。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230519142249.png)

所以，socket 的含义就是 `两个应用程序通过一个双向通信连接实现数据的交换` ，连接的一段就是一个 socket，又称为`套接字`。实现一个 socket 连接通信至少需要两个套接字，一个运行在服务端（插孔），一个运行在客户端（插头）。

套接字用于描述 IP 地址和端口，是一个通信链的句柄。应用程序通过套接字向网络发出请求或应答网络请求。注意的是`套接字既不是程序也不是协议，只是操作系统提供给通信层的一组抽象 API 接口`。

### 2. Socket 通信

Socket 是应用层与 TCP/IP 协议簇通信的中间抽象层，是一组接口。在设计模式中其实就是门面模式。Socket 将复杂的 TCP/IP 协议簇隐藏在接口后面，对于用户而言，一组接口即可让 Socket 去组织数据，以符合指定的协议。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230519142432.png)

1. TCP/IP
   传输控制协议/网间协议（Transmission Control Protocol/Internet Protocol）是一个工业标准的协议集，是为广域网 WAN 而设计的。
2. UDP
   用户数据报协议（User Data Protocol）是与 TCP 相对应的协议，属于 TCP/IP 协议簇中的一员。
3. HTTP
   超文本传输协议（Hypertext Transfer Protocol）是互联网的基础，也是手机网络协议之一，HTTP 协议是建立在 TCP 协议之上的一种应用。
4. Socket
   套接字是对 TCP/IP 协议的封装，自身并非协议而是一套调用的接口规范（API）。通过套接字 Socket，才能使用 TCP/IP 协议。
   socket 套接字作为网络底层核心，也是 TCP/IP 以及 UDP 底层协议的实现通道，它是计算机网络编程的基础，TCP/UDP 收发消息都依靠它。例如 web 服务器底层依赖它、关系型数据库 MySQL 底层依赖它、微信即时通信依赖它、网络游戏依赖它...

### 3. Socket 工作原理

工作原理

服务端首先初始化 Socket `socket()`，然后与端口绑定 `bind()`，再对端口进行监听 `listen()`，接着调用 `accept()`堵塞等待客户端连接。此时，若有一个客户端初始化了一个 Socket，然后连接服务端 `connect()`。若连接成功，此时客户端与服务端的连接就建立了。客户端发送请求 `write()`，服务端接收请求并处理 `read()`，然后将回应发送给客户端 `write()`，客户端读取数据 `read()`，最后关闭连接`close()`，一次交互结束。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230519142838.png)

关键字： `连接` `请求数据` `回复数据` `关闭连接`

### 4. 什么是 websocket

WebSocket 是一种`基于 HTTP` 协议实现全双工通信的协议，可以实现浏览器与服务器之间的实时通信，类似于传统的 Socket 编程。

WebSocket 协议在建立连接时使用 HTTP 协议中的 Upgrade 头来将连接从 HTTP 协议转变为 WebSocket 协议，因此 WebSocket 协议可以兼容 HTTP 协议。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230519144444.png)

WebSocket 协议在建立连接后，服务器可以主动向客户端发送消息，而不是仅由客户端发起请求。同时，通过 WebSocket 连接传输的数据是以帧（frame）为单位进行封装和传输的，可以保障数据的完整性和稳定性。

WebSocket 通常应用于实时通信、在线游戏、在线协作等场景。不需要客户端多次请求，服务器可以直接推送更新数据，从而提升数据传输的效率和实时性。同时，由于 WebSocket 协议支持全双工通信，服务器可以同时发送和接收数据，从而实现双向实时通信。

### 5. socket 和 websocket 区别

虽然 `Socket` 和 `WebSocket` 都用于实现通信的协议，但它们之间几乎毫无关系，就跟雷锋和雷峰塔，周杰和周杰伦一样，**只是叫法相似**。

SocketSocket 是一个`通信链的句柄`，可以用来实现不同虚拟机或不同计算机之间的通信，也可以实现相同主机内的不同进程之间的通讯。

Socket = IP 地址 + 端口 + 协议 组成一个唯一标识，用来标识一个通信链路。

Socket 其实是对 TCP/IP 进行了高度封装，屏蔽了很多网络细节。这样可以使开发者更好地进行网络编程。

其实就是我们写个高度封装内部细节的函数，通过传参来完成指定的行为。

可以这么说，所有的 TCP/UDP 等编程，基本都是按照 Socket 协议标准来进行编程的，换句话说，Socket 是一套标准，就好比 DOM ，所有语言都可以按照 DOM 的接口标准来实现自己的逻辑。Socket 有自己的原语，开发者可以按照 Socket 的原语在不同语言下的实现方式来进行网络编程。

websocket 本质上是`基于 HTTP 协议的应用层协议`

所以两者的作用完全不同

socket 套接字可以理解为：一` 套` `接 `收数`字`的系统
