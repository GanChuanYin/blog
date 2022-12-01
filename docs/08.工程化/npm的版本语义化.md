---
title: npm的版本语义化
date: 2022-11-26 22:41:24
permalink: /pages/60704e/
categories:
  - 工程化
tags:
  - 
---
## npm 的版本语义化

### 版本规范：主版本号.次版本号.补丁版本号

如下是 npm 的常见配置

```json
{
  "dependencies": {
    "echarts": "^5.0.2",
    "element-ui": "^2.15.9",
    "lodash": "^4.17.11"
  }
}
```

以 echarts 为例子 `5.0.2` 表示什么

`5` <font color=#3498db size=4>`主版本号`</font>：仅当程序发生了重大变化时才会增长，如新增了重要功能、新增了大量的 API、技术架构发生了重大变化

`0` <font color=#3498db size=4>`次版本号`</font>：仅当程序发生了一些小变化时才会增长，如新增了一些小功能、新增了一些辅助型的 API

`2` <font color=#3498db size=4>`补丁版本号`</font>：仅当解决了一些 bug 或 进行了一些局部优化时更新，如修复了某个函数的 bug、提升了某个函数的运行效率

所以 <font color=#3498db size=4>`从左到右, 版本号从大到小`</font>

### npm 依赖包版本的~、>、^符号各代表什么？

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221121223118.png)

### 注意 ⚠️

可能是为了利于包的更新迭代, npm 默认的版本控制是 `^ 此版本和补丁版本可增`

这可能导致一些包自动升级的 bug

比如我最近遇到的

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221121223419.png)

由于我的 ts 是低版本(大版本为 3), 我的 vue 版本为 `^2.6.10`, 流水线部署时直接给我升级到了 `2.7.*`, 而 2.7 依赖的是高版本的 ts, 导致了报上图错

所以最后我将 vue 版本锁定为 `~2.6.11`, 这样即使流水线将 package-lock.json 删了部署, 也能拉到正确的版本
