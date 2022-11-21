/*** config.js ***/

// 导入所需插件模块
const request = require('request')

// 企业ID 替换成自己
const corpId = 'ww0334d26db07c233a'
// 应用密钥 替换成自己
const corpSecret = 'XiytlH1LNDc2lYlSoO9GTq8VA3CAfMTmNJQxGVS2Dls'
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




