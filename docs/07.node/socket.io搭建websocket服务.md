---
title: socket.io搭建websocket服务
date: 2022-05-28 00:35:07
permalink: /pages/7a796e/
categories:
  - node
tags:
  - 
---
## 1. Socket.IO 是什么

### 1.1 官网描述

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220528003701.png)

### 1.2 对 Socket.IO 的误解

<font color=#dd0000 size=4>Socket.IO 不是对 WebSocket 的简单实现.</font>

虽然 Socket.IO 在可能的情况下使用 WebSocket 进行传输，但它向每个包添加额外的元数据。这就是 WebSocket 客户端不能成功连接到 Socket 的原因。IO 服务器，以及一个 Socket.IO 客户端也不能连接到普通的 WebSocket 服务器。

```typescript
// WARNING: the client will NOT be able to connect!
const socket = io('ws://echo.websocket.org')
```

总结一下就是

1. Socket.IO 是一个基于 WebSocket 协议的库，由于它更改了每个包元数据，所以它不兼容原生 Socket
2. Socket.IO 支持服务端和客户端
3. Socket.IO 支持 http 长链接

## 2. 搭建一个 websocket 服务器

```typescript
import { Server } from 'socket.io'

const io = new Server(3000)

io.on('connection', (socket) => {
  // send a message to the client
  socket.emit('hello from server', 1, '2', { 3: Buffer.from([4]) })

  // receive a message from the client
  socket.on('hello from client', (...args) => {
    // ...
  })
})
```

关键字 on 表示接收信息， emit 表示发送信息

## 3. 搭建一个 websocket 客户端

```typescript
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3000')

// send a message to the server
socket.emit('hello from client', 5, '6', { 7: Uint8Array.from([8]) })

// receive a message from the server
socket.on('hello from server', (...args) => {
  // ...
})
```

同理 关键字 on 表示接收信息， emit 表示发送信息

连接成功后，在 network 中可以看到信息推送

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220528005533.png)

## 4. 对 TypeScript 的支持

```typescript
import { io, SocketOptions, ManagerOptions } from 'socket.io-client'

const SocketBaseURL = 'ws://127.0.0.1:3000'

export const Websocket = (
  config: Partial<ManagerOptions & SocketOptions> | undefined
) => {
  return io(SocketBaseURL, config)
}
```
