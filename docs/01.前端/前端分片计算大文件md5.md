---
title: 前端分片计算大文件md5
date: 2022-12-12 15:58:22
permalink: /pages/9e4f86/
categories:
  - 前端
tags:
  - 
---
公司运维项目有个需求: 上传一个大文件包(大概 3GB), 为了保证包的完整性, 需要前端计算 md5 后随文件一起上传

### 什么是 md5

md5 全称: Message-Digest Algorithm 5（信息-摘要算法）

从名字来看就知道它是从 MD3、MD4 发展而来的一种加密算法，其主要通过采集文件的信息摘要，以此进行计算并加密。通过 MD5 算法进行加密，文件就可以获得一个`唯一`的 MD5 值，这个值是独一无二的，就像我们的指纹一样，因此我们就可以通过文件的 MD5 值来确定文件是否正确，密码进行加密后也会生成 MD5 值，论坛就是通过 MD5 值来验证用户的密码是否正确的。

MD5 是输入 `不定长度` 信息，输出 `固定长度 128-bits` 的算法, 一般是以 16 进制输出, 所以计算结果是 32 位 16 进制数

例: `8580f12e027c2d30885b7bba675fe1c6`

#### 计算原理

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220308175055.png)

1. 把消息分为 n 个分组
2. 对最后一个消息分组进行填充
3. 和输入量进行运算，运算结果位下一个分组的输入量
4. 输出最终结果

JS 实现例子: [插件 js-spark-md5](https://github.com/satazor/js-spark-md5)

### 前端实现大文件 md5 计算

首先需要明确的点是: 前端不可能一次性读取 3GB 的文件直接用于计算(内存会原地爆炸)

所以这里需要用到分片计算:

引用 js-spark-md5 插件代码如下:

```html
<html>
  <input type="file" id="file" />
  <script src="./spark-md5.min.js"></script>
  <script>
    document.getElementById('file').addEventListener('change', function () {
      var blobSlice =
          File.prototype.slice ||
          File.prototype.mozSlice ||
          File.prototype.webkitSlice,
        file = this.files[0],
        chunkSize = 104857600, // Read in chunks of 100MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader()
      console.time('md5计算耗时:')
      console.log(file)

      var temp = file.size / (1024 * 1024)
      console.log(file.name)
      console.log('文件大小:  ' + temp.toFixed(2) + 'MB')
      fileReader.onload = function (e) {
        console.log('read chunk nr', currentChunk + 1, 'of', chunks)
        spark.append(e.target.result) // Append array buffer
        currentChunk++

        if (currentChunk < chunks) {
          loadNext()
        } else {
          console.timeEnd('md5计算耗时:')
          console.log('finished loading')
          console.info('computed hash', spark.end()) // Compute hash
        }
      }

      fileReader.onerror = function () {
        console.warn('oops, something went wrong.')
      }

      function loadNext() {
        var start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      }

      loadNext()
    })
  </script>
</html>
```

以上代码运行可以看到 2.2GB 的文件计算耗时 24 秒左右

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221212162628.png)
