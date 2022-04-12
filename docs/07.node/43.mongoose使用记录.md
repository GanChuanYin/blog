---
title: mongoose使用记录
date: 2022-03-18 18:38:46
permalink: /pages/27582e/
categories:
  - node
tags:
  - 
---
### Schema

一个标准的 Schema 示例：

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
      enum: ['admin', 'user', 'root']
    },
    password: {
      type: String,
      required: true,
      select: false // 保护密码字段 查询时默认不返回 如果需要 Users.findOne({_id: id}).select('+password').exec(...)，'+password' 可以显示隐藏字段
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

### 查询

**根据 id 查询并更新 findByIdAndUpdate**

```js
router.post('/update', async (req, res) => {
  const body = req.body
  const update = { ...body }
  UserModel.findByIdAndUpdate(
    req.user._id,
    update,
    {
      returnDocument: 'after', // 返回修改后的doc
      runValidators: true // 更新前检测字段合法性
    },
    (err, doc) => {
      if (err) {
        // 数据库没匹配到用户或者修改字段不符合规范
        res.send(ResponseBody.fail(err, err.message))
      } else {
        res.send(ResponseBody.success(doc))
      }
    }
  )
})
```
