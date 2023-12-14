---
title: axois如何兼容桌面端和node端
date: 2023-01-03 22:28:46
permalink: /pages/d8b52c/
categories:
  - 前端
tags:
  - 
---
## 一、web 端和 node 端的 axios

以下是 axios web 端和 node 端的通用用法

```javascript
axios
  .get('/user')
  .then(function (response) {
    // handle success
    console.log(response)
  })
  .catch(function (error) {
    // handle error
    console.log(error)
  })
  .then(function () {
    // always executed
  })

axios
  .post('/user', {
    name: 'Fred',
    phone: '123'
  })
  .then(function (response) {
    console.log(response)
  })
  .catch(function (error) {
    console.log(error)
  })
```

web 端的网络请求底层由 `XMLHttpRequests` 实现, 而 node 端是 `Http Request`

在底层不一样的情况下 axios 无论是浏览器端和 node 端都是用的同一个包, 它是如何做到的呢?

## 二、axios 如何兼容 web 端和 node 端

> 如下所示是 Axios 的源码目录及各个文件的作用

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230103224312.png)

今天重点关注在 `adapter` 部分

在 [axios 的核心逻辑](https://github.com/axios/axios/blob/master/lib/core/Axios.js)中，我们可以注意到实际上派发请求的是 [dispatchRequest 方法](https://github.com/axios/axios/blob/master/lib/core/dispatchRequest.js). 该方法内部其实主要做了两件事：

1.  数据转换，转换请求体/响应体，可以理解为数据层面的适配；
2.  调用适配器.

调用适配器的逻辑如下：

```javascript
// 若用户未手动配置适配器，则使用默认的适配器
var adapter = config.adapter || defaults.adapter

// dispatchRequest方法的末尾调用的是适配器方法
return adapter(config).then(
  function onAdapterResolution(response) {
    // 请求成功的回调
    throwIfCancellationRequested(config)

    // 转换响应体
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    )

    return response
  },
  function onAdapterRejection(reason) {
    // 请求失败的回调
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config)

      // 转换响应体
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        )
      }
    }

    return Promise.reject(reason)
  }
)
```

实际开发中，我们使用默认适配器的频率更高. 默认适配器在[`axios/lib/default.js`](https://github.com/axios/axios/blob/master/lib/defaults.js)里是通过`getDefaultAdapter`方法来获取的：

```javascript
function getDefaultAdapter() {
  var adapter
  // 判断当前是否是node环境
  if (
    typeof process !== 'undefined' &&
    Object.prototype.toString.call(process) === '[object process]'
  ) {
    // 如果是node环境，调用node专属的http适配器
    adapter = require('./adapters/http')
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // 如果是浏览器环境，调用基于xhr的适配器
    adapter = require('./adapters/xhr')
  }
  return adapter
}
```

我们再来看看 Node 的 http 适配器和 xhr 适配器大概长啥样：

> http 适配器：

```javascript
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    // 具体逻辑
  }
}

```

> xhr 适配器：

```javascript
module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    // 具体逻辑
  }
}

```

这么封装后，通过 axios 发起跨平台的网络请求，不仅调用的接口名是同一个，连入参、出参的格式都只需要掌握同一套. 这导致它的学习成本非常低，开发者看了文档就能上手；同时因为足够简单，在使用的过程中也不容易出错，带来了极佳的用户体验.

## 三、封装的核心设计模式: 适配器模式

需要适配的底层在内部实现，暴露给用户统一的接口. 在 axios 内，所有关于 http 模块、关于 xhr 的实现细节，全部被 Adapter 封装进了自己复杂的底层逻辑里，暴露给用户的都是十分简单的统一的东西——统一的接口，统一的入参，统一的出参，统一的规则. 这就是适配器模式的经典应用.
