---
title: 使用mockjs模拟复杂数据
date: 2022-09-13 10:33:33
permalink: /pages/55d169/
categories:
  - Vue
tags:
  - 
---
## 1、关于 Mock.js

### 1.1 Mock.js 能做什么？

- 生成随机数据
- 能拦截 Ajax 请求

### 1.2 我为什么选择 Mock.js 模拟数据?

- URL 支持正则匹配, 也就是可以批量拦截接口
- 低耦合 :无需修改既有代码，即可拦截 Ajax 请求，返回模拟的响应数据。
- 数据类型多样: 支持生成随机的文本、数字、布尔值、日期、邮箱、链接、图片、颜色等。

## 2. Vue 项目引入 mock.js

我将 mockjs 放在了 src 目录下

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220913103746.png)

然后在 main.js 中引入

```javascript
import './mock/mock.ts'
```

我们一般只需要在 dev 环境中 mock 数据, 所以一般会加个环境判断

```javascript
// mock.ts
import Mock from 'mockjs'
if (process.env.NODE_ENV === 'development') {
  initMock()
}

Mock.setup({ timeout: 1000 }) // 模拟数据返回的延时

function initMock() {
  Mock.mock('/api/news', data)
}
```

### 2.1 基本使用

Mock.mock()函数签名

```javascript
Mock.mock( requestUrl, requestType?, template | function( options ) )
```

`requestUrl`
可选参数，表示需要拦截的 Ajax URL，可以是 URL 字符串或 URL 正则。
例如 //domain/list.json/、'/domian/list.json'。

`requestType`
可选参数，表示需要拦截的 Ajax 请求类型。
例如 GET、POST、PUT、DELETE 等。

`template`
可选参数，表示数据模板，可以是对象或字符串。

`function(options)`
可选参数，表示用于生成响应数据的函数。

`options`
指向本次请求的 Ajax 选项集，含有 url、type 和 body 三个属性

举个例子:

```javascript
import Mock from 'mockjs'

function initMock() {
  Mock.mock('/api/news', 'get', {
    code: 'OK',
    results: [
      {
        id: '1',
        title: 'title1'
      },
      {
        id: '2',
        title: 'title2'
      }
    ]
  })
}
```

发起请求:

```javascript
// in any.vue
async getNews() {
    const { data: res } = await this.$http({ url: "/api/news" });
    console.log("get", res);
}
```

这段代码生效后 `/api/news` 这个接口就被拦截了, 在浏览器中的网络请求中也看不到了, 但是请求会正常收到 mock 的数据, 正常打印

### 2.2 引入正则 支持批量拦截

如果你的项目中所有接口都有 `/api/`, url 中每次都要加这个前缀显得有点多余

如果你想拦截

```shell
/api/news/content/getNews
/api/news/content/getArticle
/api/news/content/getBooks
```

需要将这个接口重复三遍, 这显然是不能接受的.

这里我们可以用正则来 `批量拦截`

```javascript
Mock.mock(/news\/content/, getRes(data))
```

这样所有包含 `/news/content` 的 url 都会被拦截

这里还有一个痒点: 假设我模拟 url `/news/content/getNews/day/night`, 拷贝过来后我得在每个 `/` 前面加上正则的转译符 `\`

```shell
 /news\/content\/getNews\/day\/night
```

挺麻烦, 为了解决这个问题我写了个方法

```javascript
export function transformUrlToReg(url: string) {
  if (url[0] === '/') {
    url = url.substring(1)
  }
  if (url[url.length - 1] === '/') {
    url = url.substring(0, url.length - 2)
  }
  let reg = new RegExp(url)
  return reg
}
```

再加上一个批量 mock 的方法

```typescript
type MockType = {
  url: string
  obj: any
}
const mockList: MockType[] = [
  {
    url: 'algorithm-manage/devices/algo-device-list', // 状态面板
    obj: {
      deviceName: '智能边缘计算设备-公交总公司离行式自助银行',
      deviceIp: '128.96.123.203',
      algoVersion: '2.4.0.8370',
      orgName: '省分行本部',
      partName: '公交总公司离行式自助银行',
      orgId: '34000000000489229',
      deviceId: '9e1a6d63da27886f7dee-wuhan-monitcenter-203-ccbft-in'
    }
  },
  {
    url: 'traffic/person-traffic-statistic/time-range-newest-record-list/', // 人员轨迹左侧人员列表
    obj: {
      personId: '56124513524-51-4513-56-25-',
      personName: '@cname',
      leastCaptureTime: '2021-03-30 14:14:08',
      totalNumber: 2,
      imageUrl: '@dataImage',
      faceStoreName: '@ctitle'
    }
  }
]

function initMock() {
  mockList.forEach((item) => {
    Mock.mock(transformUrlToReg(item.url), (params) => {
      return generatePaginationData(params, item.obj)
    })
  })
}
```

现在如果要新拦截一个接口, 只需要在 mockList 中新配置一个就完成了

### 2.3 批量分页数据生成

列表分页数据在项目中很常见也需要 mock 下

我们的分页规则是

```javascript
const body = {
  pageSize: 20,
  pageNum: 2,
  total: 100
}
```

我写了个方法

```typescript
export const generatePaginationData = (
  params,
  obj: any = {},
  total: number = 100
) => {
  const body = JSON.parse(params.body) // request body数据
  let num =
    body.pageSize * body.pageNum < total
      ? body.pageSize
      : total - body.pageSize * (body.pageNum - 1)
  console.log('mock request params', params)
  let data = {
    list: (() => {
      let i = 1 + body.pageSize * (body.pageNum - 1)
      let res = Mock.mock({
        // 调用mock方法生成数据
        ['datas|' + num]: [
          {
            'id|+1': i, // id 每次加一
            ...obj
          }
        ]
      }).datas
      return res
    })(),
    total: total,
    pageNum: body.pageNum,
    pageSize: body.pageSize
  }
  console.log('mock response data', data)
  return getStandRes(data)
}
```

这样就可以批量生成 MockType 的 obj 的数据了
