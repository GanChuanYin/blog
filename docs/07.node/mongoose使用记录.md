---
title: mongoose使用记录
date: 2022-03-18 18:38:46
permalink: /pages/27582e/
categories:
  - node
tags:
  -
---

编程环境 nestJS + typescript + mongoose

### 查询

**根据 id 查询并更新 findByIdAndUpdate**

```js
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
    } else {
    }
  }
)
```

### 约束 number 类字段范围

```typescript
this.Model.find({
  age: { $gt: 17, $lt: 66 } // 年龄在 17 和 66 之间
})

this.Model.find({
  age: { $gte: 17, $lte: 66 } // 年龄在 17 和 66 之间 包括 17 和 66
})
```


