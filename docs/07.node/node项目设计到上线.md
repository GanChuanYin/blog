---
title: node项目从设计到上线
date: 2022-03-25 00:39:41
permalink: /pages/fe5864/
categories:
  - node
tags:
  - node
---

记录一下 node 豆瓣 TOP250 项目从设计到上线的过程

### 技术栈

- web 框架 express
- 数据库 mongodb + orm mongoose
- 数据来源 爬虫获取
- 前端 vue
- 部署 后端 Docker + 前端 nginx

### 项目功能模块

1. 登陆注册功能、用户密码加密、JWT 鉴权、 游客与登陆用户区分权限控制
2. 设计统一的接口结构
3. 豆瓣 TOP250 电影信息的 crud 、 列表分页。
4. node 爬虫获取豆瓣 TOP250 电影信息入库

### 开发环境

开发工具： VsCode + APIFox + Chrome

代码格式化工具： eslint + prettier

### 开发

node 项目目录
![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220325102443.png)

node 项目 3000 端口，前端 vue 项目 5000 端口，先来一套组合拳让 express app 支持跨域

#### 1.支持跨域

```JavaScript

// 跨域配置
app.all('*', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Access-Token,Authorization'
  )
  res.setHeader('Access-Control-Expose-Headers', '*')
  next()
})

```

#### 2.入口文件

```JavaScript

const express = require('express')
const app = express()
module.exports = app

// 开放静态目录
app.use(express.static('public'))

// 注册中间件
require('./web/middleware')

// 注册路由表
require('./web/api/router')

// node run时如果不指定端口， 默认3000
const port = process.env.PORT || 3000

app.listen(port, () =>
  console.log(`Server running on ${port}, http://localhost:${port}`)
)

```

> 这里的静态目录基本没用它， 一般建议把图片，文本等静态资源放到前端让 nginx 代理，这样不仅能降低服务端压力，且 nginx 性能更高

#### 3.router.js

```JavaScript
const path = require('path')

const app = require(path.resolve('.', 'index.js')) // 测试 movie

// 登陆
app.use('/user', require('./user'))

// 系统信息接口
app.use('/system', require('./system-info'))

// 电影相关接口
app.use('/movie', require('./movie'))

// 未授权
app.use(function (err, req, res) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('No authorization')
  }
})

```

这里注册路由时 app.use('/user', require('./user')) ， 会把 user 文件 里的所有接口都加上/user 前缀

### jwt 登陆

### 一、前端发起登陆请求

```js
this.login({
  username: values.username,
  password: md5(values.password)
})
```

这里 password 用 md5 算法加密

### 二、服务端处理登陆请求

先看一下用户模型

user-model.js

```js
const mongoose = require('mongoose')
const DB = require('../../db/connection')

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['admin', 'user', 'root'] // 枚举 只能是这三种类型
    },
    password: {
      type: String,
      required: true,
      select: false // 保护密码字段 查询时默认不返回
    },
    avatar: {
      type: String
    }
  },
  {
    collection: 'user', // 指定collection名称 如果不指定 mongoose会在默认名后加s 也就是users
    timestamps: true // 添加时间戳
  }
)

const UserModel = DB.model('user', UserSchema)

module.exports = UserModel
```

> 为了保护密码安全， 这里 password 将 select 置为了 false， 查询 user 默认不会返回这个字段

router user.js

```js
const jwt = require('jsonwebtoken')
const express = require('express')
const UserModel = require('../../models/user/user-model')
const ResponseBody = require('../stand-response-body')
const { AUTH_SECRET_KEY, AUTH_EXPIRE_TIME } = require('../../config')
const { encrypt, decrypt } = require('../../utils/crypto')
const router = express.Router()

router.post('/login', async (req, res) => {
  const body = req.body
  const user = await UserModel.findOne({ username: body.username }).select(
    '+password'
  )
  if (!user) {
    res.status(200).send(ResponseBody.fail(null, '用户名或密码错误'))
  } else {
    const isPasswordValid = encrypt(req.body.password) === user.password
    if (!isPasswordValid) {
      // 密码无效
      return res.status(200).send(ResponseBody.fail(null, '用户名或密码错误'))
    }
    // 生成token
    const token =
      'Bearer ' +
      jwt.sign(
        {
          _id: String(user._id)
        },
        AUTH_SECRET_KEY,
        {
          expiresIn: AUTH_EXPIRE_TIME //token有效期
        }
      )
    res.status(200).send(
      ResponseBody.success(
        {
          user: {
            username: user.username,
            type: user.type,
            avatar: user.avatar,
            pwd: decrypt(user.password)
          },
          token
        },
        '登录成功'
      )
    )
  }
})
})

module.exports = router
```

**用户登陆**

用户登陆时，前端把 user + pwd（用 md5 加密后）发送过来， 后端先查库判断用户是否存在

```js
const user = await UserModel.findOne({ username: body.username }).select(
  '+password'
)
```

> 这里 只有手动选定隐藏字段 .select('+password') ， 查询结果中才会附带 password 字段

> 为了偷懒用的 username 作唯一筛选条件（一般真实业务用 phone 或者 email），注册入库时需要检查唯一性

**用户存在 -> 验证密码是否正确**

```js
const isPasswordValid = encrypt(req.body.password) === user.password
```

encrypt 函数如下

```js
const crypto = require('crypto')

const algorithm = 'aes-256-ctr'
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
const iv = Buffer.from('50bbe79764dd91fb30c25754483efe68', 'hex')

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return encrypted.toString('hex')
}

module.exports = {
  encrypt
}
```

这里使用了 node 自带包 crypto 中的 createCipheriv 函数加密 password

> 注册时 密码也是用 crypto 加密后再存储的， 在数据库中直接存储用户的 password 明文的话，如果发生数据库泄露，用户的 password 就会直接被窃取。

密码验证成功 -> 生成 token 并返回

```js
// 生成token
const token =
  'Bearer ' +
  jwt.sign(
    {
      _id: String(user._id) // token加密内容
    },
    AUTH_SECRET_KEY, // secretKey
    {
      expiresIn: AUTH_EXPIRE_TIME //token有效期 72h
    }
  )
```

jsonwebtoken 将 内容和过期时间通过加密算法 生成 token

将 token 包裹在 ResponseBody 里返回给前端

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220325120834.png)

### 三、前端接收并缓存 Token

```js
login({ data: body })
  .then((res: any) => {
    if (res.code === '000000') {
      this.$message.success('登录成功，即将跳转')
      setAuthorization(res.data.token)
      setTimeout(() => {
        this.$router.go(-1)
      }, 1500)
    } else {
      alert(res.message)
    }
  })
  .finally(() => {
    this.loading = false
  })
```

前端将 token 存储到 localStorage

```js
function setAuthorization(auth: string) {
  localStorage.setItem('AuthorizationKey', auth)
}
```

在 Ajax 请求时，加入请求拦截器

```js
export const captureRequest = (client: client) => {
  client
    .getInstance()
    .interceptors.request.use((request: AxiosRequestConfig) => {
      const JwtToken = window.localStorage.getItem(AuthorizationKey)
      if (JwtToken) {
        request.headers['Authorization'] = `${JwtToken}`
      }
      return request
    })
}
```

在每个请求的 header 中加入 Authorization

### 四、服务端处理带 token 的请求

express-jwt 中间件处理 token

```js
// 2: jwt 身份验证中间件
const expressJwt = require('express-jwt')
const jwtAuth = expressJwt({
  secret: AUTH_SECRET_KEY,
  // requestProperty: 'user', //默认解析token后结果会赋值在 req.user
  algorithms: ['HS256']
}).unless({
  path: [
    '/user/login',
    '/user/register',
    /\/movie*/,
    '/upload-photo',
    '*/images/*',
    '/qiniu-token'
  ]
})
app.use(jwtAuth)
```

express-jwt 中间件内部引用了 jsonwebtoken，对其封装用来验证 token。 如果验证成功， 默认解析 token 后的信息赋值给 res.user

```js
router.post('/update', async (req, res) => {
  console.log(req.user) // {_id:'3113142331231'}
}
```

如果验证失败 会抛出一个 UnauthorizedError 错误

可以在 router 尾部处理，

```js
// 未授权
app.use(function(err, req, res) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('No authorization')
  }
})
```

前端退出登陆直接清空 localStorage 的对应 key 内容即可

到这里整个登陆流程就完成了

**总结**

整个流程依赖 jwt (Json web Tokens)设计。

为了密码安全做了一些工作

- 前端 MD5 加密保证传输安全（md5 算法不可逆，除非暴力破解，但是如果密码长度超过 8 位，包含字母数字符号组合，基本不可能破解）

- 后端 aes-256-ctr 加密保证存储安全 （secretKey 和 iv 不泄露的话，基本不可能破解）

### 电影 CRUD

分页查询列表

```js
router.get('/list', async (req, res) => {
  let result // 返回主体
  let pageNum = Number(req.query.pageNum || 1)
  let pageSize = Number(req.query.pageSize || 20)
  const total = await MovieModel.find().countDocuments()
  const list = await MovieModel.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
  if (list) {
    result = ResponseBody.success({
      total,
      pageNum,
      pageSize,
      list
    })
  } else {
    result = ResponseBody.fail(null, '数据库查询错误')
  }
  res.status(200).json(result)
})
```

这里的核心方法是 await MovieModel.find().**skip**((pageNum - 1) \* pageSize).**limit**(pageSize)

返回主体

```js
{
    "code": "000000",
    "message": "成功",
    "data": {
        "total": 207, // 总数 
        "pageNum": 2,  // 当前页码
        "pageSize": 50, // 一页多少个
        "list": [
            {
                "_id": "61ea1ce4aeabaae771764b78",
                "name": "被嫌弃的松子的一生",
                "poster": "https://img9.doubanio.com/view/photo/s_ratio_poster/public/p884763596.jpg",
                "ranking": "92",
                "grade": "8.9",
                "author": "导演: 中岛哲也 Tetsuya Nakashima   主演: 中谷美纪 Miki Nakatani / 瑛太 E...\n                            2006 / 日本 / 剧情 歌舞",
                "introduction": "以戏谑来戏谑戏谑。",
                "created_at": "2022-01-21T02:39:32.568Z"
            }
            ...
        ]}
}
```


更新与删除电影信息

```js
// 更新电影信息
router.post('/update', async (req, res) => {
  const body = req.body
  console.log(body)
  MovieModel.findOneAndUpdate(
    { _id: body._id },
    {
      // name: body.name,
      // grade: body.grade,
      // author: body.author,
      introduction: body.introduction // 这里控制想要修改哪些字段
    },
    { new: true },
    function(err, result) {
      if (err) {
        console.log('got an error')
      }
      res.status(200).json(ResponseBody.success(result))
    }
  )
})

router.post('/delete', async (req, res) => {
  const body = req.body
  console.log(body)
  MovieModel.deleteMany({ _id: { $in: body._id } }).then((doc) => {
    // $in 批量删除
    res.status(200).json(ResponseBody.success(doc))
  })
})
```


