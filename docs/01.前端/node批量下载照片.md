---
title: node批量下载照片
date: 2021-12-13 17:11:45
permalink: /pages/7b596e/
categories:
  - 前端
tags:
  -
---

### 一、需求

前面为吃货 xpy 写了个 web 页面用来摇菜单

为了存储静态资源还踩了不少坑

现在网站搭好了，那菜单和图片怎么来？

### 二、爬下厨房的收藏菜单

[下厨房官网](https://www.xiachufang.com/)

F12 研究了一下下厨房 web 端发现它是服务端渲染

为了偷懒，我采用了人工大法
![](https://gitee.com/gan_chuan_yin/blog-image/raw/master/img/2801639387896_.pic.jpg)

### 三、解析 dom

解析 dom 利用了 cheerio，可以把它理解为爬虫版 jquery，解析语法基本和 jq 一致

以下为列表里需要解析的某个菜单

```html
<li>
  <div class="recipe pure-g">
    <div class="cover pure-u">
      <a href="/recipe/106405041/" class="image-link" target="_blank">
        <img
          src="https://i2.chuimg.com/c32e6335ab904475a0c141e08586361a_3024w_4032h.jpg?imageView2/1/w/215/h/138/interlace/1/q/90"
          data-src="https://i2.chuimg.com/c32e6335ab904475a0c141e08586361a_3024w_4032h.jpg?imageView2/1/w/215/h/138/interlace/1/q/90"
          width="215"
          height="138"
          alt="玉米排骨汤"
          class="unveiled"
        />
      </a>
    </div>
    <div class="info pure-u">
      <p class="name">
        <a href="/recipe/106405041/" target="_blank">玉米排骨汤</a>
        <i class="step-icon"></i>
      </p>
      <p class="ing ellipsis">
        排骨、甜玉米、胡萝卜、料酒、姜、盐、白胡椒粉、小葱
      </p>
      <p class="stats">
        综合评分&nbsp;<span class="score bold green-font">8.2</span
        >&nbsp;（<span class="bold score">706</span>&nbsp;做过）
      </p>
      <p class="author">
        籽酱妈
      </p>
    </div>
  </div>
</li>
```

我需要的 菜单名字，图片 url， 菜单链接 都在 class= 'image-link' 的标签内

解析代码

```js
const str = require('./dom')
const cheerio = require('cheerio')
const $ = cheerio.load(str)

const objList = [] // 菜单结构体
$('.image-link').each(function(i, elem) {
  const url = $(this)
    .find('.unveiled')
    .attr('src')
    .replace(
      '?imageView2/1/w/215/h/138/interlace/1/q/90',
      '?imageView2/1/w/400/h/400/' // 替换为400*400 我需要的大小
    )
  objList[i] = {
    url,
    name: $(this)
      .find('.unveiled')
      .attr('alt')
      .trim(),
    link: $(this).attr('href'),
    foodID: $(this)
      .attr('href')
      .replace(/[^0-9]/gi, ''),
    level: 2
  }
})
```

解析后获得结果

```js
[
  {
    url: 'https://i2.chuimg.com/c32e6335ab904475a0c141e08586361a_3024w_4032h.jpg?imageView2/1/w/400/h/400/',
    name: '玉米排骨汤',
    link: '/recipe/106405041/',
    foodID: '106405041',
    level: 2,
    images: ['20211212T012447-106405041.jpg']
  },
  {
    url: 'https://i2.chuimg.com/8bb9827ca0a649b4a5503d295cac3880_756w_756h.jpg?imageView2/1/w/400/h/400/',
    name: '无肉简易版干煸菜花',
    link: '/recipe/104536804/',
    foodID: '104536804',
    level: 2,
    images: ['20211212T012447-104536804.jpg']
  },
  {
    url: 'https://i2.chuimg.com/0e018cbf887d48429ea2f8f214b9fab9_3024w_4032h.jpg?imageView2/1/w/400/h/400/',
    name: '肉沫茄子（非油炸健康版）',
    link: '/recipe/104398095/',
    foodID: '104398095',
    level: 2,
    images: ['20211212T012447-104398095.jpg']
  }
  ...
  ...
]
```

### 四、批量下载图片

根据第三步拿到图片 URL 列表数据，利用 request 库和 async 库批量并发下载图片

```js
/**
 * node 爬虫
 */
var fs = require('fs')
var request = require('request')
var async = require('async')
let moment = require('moment')

// 本地存储目录
var dir = './images'

var setting = {
  download_num: 5 // 同时并行下载的文件数
}

// 发送请求
function requestall(urls) {
  downloadImg(urls, dir, setting.download_num)
}

// 下载图片
function downloadImg(photos, dir, asyncNum) {
  console.log('即将异步并发下载图片，当前并发数为:' + asyncNum)
  async.mapLimit(
    photos,
    asyncNum,
    function(photo, callback) {
      var filename = moment().format('YYYYMMDDTHHmmss-') + photo.foodID + '.jpg'
      if (filename) {
        console.log('正在下载' + filename)
        // 防止pipe错误
        request(photo.url)
          .on('error', function(err) {
            console.log(err)
          })
          .pipe(fs.createWriteStream(dir + '/' + filename))
        console.log('下载完成' + photo.name)
        callback(null, filename)
      }
    },
    function(err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(
          '任务-------------------------------------------------------------------------------------------------------执行完成'
        )
        console.log(result)
      }
    }
  )
}

const { testList, objList } = require('./parse-dom')


requestall(objList)
```
下载完成
![](https://gitee.com/gan_chuan_yin/blog-image/raw/master/img/20211213180840.png)
