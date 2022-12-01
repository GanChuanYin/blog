---
title: node给微信推送服务器异常消息
date: 2022-11-17 17:21:00
permalink: /pages/f027a1/
categories:
  - 前端
tags:
  - 
---
### 需求

有时候我们不在电脑旁但想要监控程序的运行情况, 邮件通知不够及时, 有没有更方便更及时的方法? 有、 微信推送

效果

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221117173512.png)

### 前置条件

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221117172458.png)

申请企业微信的流程可以参考 https://www.iasuna.com/post-4.html

注意 ⚠️: 账号申请完成后要在这里配置 IP 白名单

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221117172827.png)

否则 nodejs 访问不了接口

### node 代码

下面是一个请求的 demo

```javascript
/*** config.js ***/

// 导入所需插件模块
const request = require('request')

// 企业ID 替换成自己
const corpId = 'ww0334d26d31b07c233a'
// 应用密钥 替换成自己
const corpSecret = 'XiytlH312311LNDc2lYlSoO9GTq8VA3CAfMTmNJQxGVS2Dls'
// 应用ID 替换成自己
const agentId = 1000002
// 发送给所有人
const toUser = '@all'

const tokenUrl = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${corpSecret}`
const sendMsgUrl =
  'https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token='
/******** 企业微信相关配置信息 填写自己的信息 ***********/

/**
 * 获取令牌
 */
function getToken(success, error) {
  request(tokenUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body)
      console.log(json)
      success(json.access_token)
    } else {
      error('获取token失败')
    }
  })
}

/**
 * 真正发送消息
 */
function sendMessage(token, content) {
  const requestData = {
    touser: toUser,
    msgtype: 'text',
    agentid: agentId,
    safe: 0,
    text: {
      content: content
    }
  }

  request(
    {
      url: `${sendMsgUrl}${token}`,
      method: 'POST',
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body: requestData
    },
    function(error, response, body) {
      console.log(body)
      if (!error && response.statusCode == 200) {
      }
    }
  )
}

/***
 * 发送具体消息
 */
function sendText(content) {
  getToken(
    (token) => {
      sendMessage(token, content)
    },
    (error) => {
      console.log(error)
    }
  )
}

sendText('Node程序发送的测试 https://github.com/ ')
```

运行效果

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221117173629.png)

服务器异常的时候, 可以用这个方式实时推送
