### 封装 wx.request

#### wx.request 与 requestTask.abort()

```typescript
const requestTask = wx.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '',
    y: ''
  },
  header: {
    'content-type': 'application/json'
  },
  success(res) {
    console.log(res.data)
  }
})
requestTask.abort() // 取消请求任务
```

#### 利用 promise 封装 Request

```typescript
function request(opt) {
  return new Promise((success, fail) => {
    const requestTask = wx.request({
      ...opt,
      success,
      fail
    })
  })
}
// usage
request({
  url: 'localhost',
  signal: signal
})
  .then((response) => console.debug(response))
  .catch((error) => console.error(error))
```

#### 如何封装后取消请求?

```javascript
function request(opt) {
  return new Promise((success, fail) => {
    const requestTask = wx.request({
      ...opt,
      success,
      fail
    })
    //
    opt.signal && (opt.signal.onabort = () => requestTask.abort())
  })
}
// usage
const signal = {}
request({
  url: 'localhost',
  signal: signal
})
  .then((response) => console.debug(response))
  .catch((error) => console.error(error))

signal.onabort()
```

设计思路来源于 [fetch AbortSignal ](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)
