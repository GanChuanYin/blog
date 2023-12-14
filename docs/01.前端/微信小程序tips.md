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

### 利用数据监听器实现类似 vue computed 效果

使用数据监听器
有时，在一些数据字段被 setData 设置时，需要执行一些操作。

例如， this.data.sum 永远是 this.data.numberA 与 this.data.numberB 的和。此时，可以使用数据监听器进行如下实现。

```javascript
Component({
  attached: function () {
    this.setData({
      numberA: 1,
      numberB: 2
    })
  },
  observers: {
    'numberA, numberB': function (numberA, numberB) {
      // 在 numberA 或者 numberB 被设置时，执行这个函数
      this.setData({
        sum: numberA + numberB
      })
    }
  }
})
```

数据监听器支持监听属性或内部数据的变化，可以同时监听多个。一次 setData 最多触发每个监听器一次。

同时，监听器可以监听子数据字段，如下例所示。

```javascript
Component({
  observers: {
    'some.subfield': function (subfield) {
      // 使用 setData 设置 this.data.some.subfield 时触发
      // （除此以外，使用 setData 设置 this.data.some 也会触发）
      subfield === this.data.some.subfield
    },
    'arr[12]': function (arr12) {
      // 使用 setData 设置 this.data.arr[12] 时触发
      // （除此以外，使用 setData 设置 this.data.arr 也会触发）
      arr12 === this.data.arr[12]
    }
  }
})
```

如果需要监听所有子数据字段的变化，可以使用通配符 \*\* 。

```javascript
Component({
  observers: {
    '**': function () {
      // 每次 setData 都触发
    }
  }
})
```

### 微信小程序 canvas 2d + weapp.qrcode.esm.js 绘制同层渲染二维码

微信小程序官方 canvas 2d 说明

> https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html

2.9.0 起支持一套新 Canvas 2D 接口（需指定 type 属性），同时支持`同层渲染`

```html
<canvas type="2d" id="my-game-qrcode"></canvas>
```

```javascript
 drawQr() {
    const obj: any = this.data.playerList.find(
      (item: any) => item.userId === this.data.selectedPlayerId
    )
    if (!obj) return
    const query = wx.createSelectorQuery()
    query
      .select('#my-game-qrcode')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const canvas = res[0].node
        // 调用方法drawQrcode生成二维码
        if (canvas)
          drawQrcode({
            canvas: canvas,
            width: 200,
            height: 200,
            // background: '#ffffff',
            // foreground: '#000000',
            text: obj.gameMa
          })
      })
  }
```

注意: 这里 `wx.createSelectorQuery` 如果是在组件中使用 需要替换为 `this.createSelectorQuery`

#### weapp.qrcode.esm.js demo

> https://github.com/DoctorWei/weapp-qrcode-canvas-2d

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230726213651.png)
