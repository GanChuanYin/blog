---
title: 什么是Bitmap
date: 2022-05-25 10:00:29
permalink: /pages/f00a19/
categories:
  - 算法与数据结构
tags:
  - 
---
## 1. 什么是 Bitmap

### 1.1 概念

Bit 即比特，是目前计算机系统里边数据的最小单位，8 个 bit 即为一个 Byte。

Bitmap 可以理解为通过一个 bit 数组来存储特定数据的一种数据结构；由于 bit 是数据的最小单位，所以这种数据结构往往是非常节省存储空间。

### 1.2 用例子理解 Bitmap 的能力

比如一个公司有 8 个员工，现在需要记录公司的考勤记录，传统的方案是记录下每天正常考勤的员工的 ID 列表，比如 2012-01-01:[1,2,3,4,5,6,7,8]。

假如员工 ID 采用 byte 数据类型，则保存每天的考勤记录需要 N 个 byte，其中 N 是当天考勤的总人数。

另一种方案则是构造一个 8bit（01110011）的数组，将这 8 个员工跟员工号分别映射到这 8 个位置，如果当天正常考勤了，则将对应的这个位置置为 1，否则置为 0；这样可以每天采用恒定的 1 个 byte 即可保存当天的考勤记录。

综上所述，<font color=#00dddd size=4>Bitmap 节省大量的存储空间</font>，因此可以被一次性加载到内存中。

再看其结构的另一个更重要的特点，它也显现出巨大威力：就是很 <font color=#00dddd size=4>方便通过位的运算（AND/OR/XOR/NOT）</font> ，高效的对多个 Bitmap 数据进行处理，这点很重要，它直接的支持了多维交叉计算能力。

比如上边的考勤的例子里，如果想知道哪个员工最近两天都没来，只要将昨天的 Bitmap 和今天的 Bitmap 做一个按位的“OR”计算，然后检查那些位置是 0，就可以得到最近两天都没来的员工的数据了，比如：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525100510.png)

再比如，我们想知道哪些男员工没来？我们可以在此结果上再“And”上一个 Bitmap 就能得到结果。

## 2. Bitmap 如何做到高速运算的？

### 2.1 优化资源

存储空间的浪费：Bitmap 比文件强多了，但它需要保存到外部存储（数据库或者文件），计算时需要从外部存储加载到内存，因此存储的 Bitmap 越大，需要的外部存储空间就越大；并且计算时 I/O 的消耗会更大，加载 Bitmap 的时间也越长。

其二是计算资源的浪费，计算时要加载到内存，越大的 Bitmap 消耗的内存越多；位数越多，计算时消耗的 cpu 时间也越多。

对于第一种浪费，最直觉的方案就是可以引入一些文件压缩技术，比如 gzip/lzo 之类的，对存储的 Bitmap 文件进行压缩，在加载 Bitmap 的时候再进行解压，这样可以很好的解决存储空间的浪费，以及加载时 I/O 的消耗；

代价则是压缩/解压缩都需要消耗更多的 CPU/内存资源；并且文件压缩技术对第二种浪费也无能为力。因此只有系统有足够多空闲的 CPU 资源而 I/O 成为瓶颈的情况下，可以考虑引入文件压缩技术。

那么有没有一些技术可以同时解决这两种浪费呢？好消息是有，那就是 Bitmap 压缩技术；而常见的压缩技术都是基于 RLE（Run Length Encoding，详见http://en.wikipedia.org/wiki/Run-length_encoding）。

RLE 编码很简单，比较适合有很多连续字符的数据，比如以下边的 Bitmap 为例：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525101013.png)

可以编码为 0,8,2,11,1,2,3,11

其意思是:第一位为 0，连续有 8 个，接下来是 2 个 1，11 个 0，1 个 1，2 个 0，3 个 1，最后是 11 个 0（当然此处只是对 RLE 的基本原理解释，实际应用中的编码并不完全是这样的）。

可以预见，对于一个很大的 Bitmap，如果里边的数据分布很 <font color=#00dddd size=4>稀疏</font> （说明有很多大片连续的 0），采用 RLE 编码后，占用的空间会比原始的 Bitmap 小很多。

同时引入一些对齐的技术，可以让采用 RLE 编码的 Bitmap 不需要进行解压缩，就可以直接进行 AND/OR/XOR 等各类计算；因此采用这类压缩技术的 Bitmap，加载到内存后还是以压缩的方式存在，从而可以保证计算时候的低内存消耗；

而采用 word（计算机的字长，64 位系统就是 64bit）对齐等技术又保证了对 CPU 资源的高效利用。因此采用这类压缩技术的 Bitmap，保持了 Bitmap 数据结构最重要的一个特性，就是高效的针对每个 bit 的逻辑运算。

常见的压缩技术包括

- BBC（有专利保护）
- WAH（http://code.google.com/p/compressedbitset/）
- EWAH(http://code.google.com/p/javaewah/)。在 Apache Hive 里边使用了 EWAH。

### 2.2 Bitmap 在大数据计算上的能力？

我们用一个 TalkingData Analytics 中用户留存的例子来看 Bitmap 如何做到用户回访的统计。比如想知道某个应用，昨天新增的用户中，有多少人今天又开启了应用（ <font color=#00dddd size=4>次日留存</font> ）。使用过 Hive 的工程师，不难理解下面语句的含义：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525101405.png)

同时，我们使用 Bitmap 技术后，同样实现上述的计算，对比测试显示出效率的差异是巨大的：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525101441.png)

### 2.3 引入 Bitmap 技术后，分析系统可能的处理流程大体是什么样的？

数据收集系统收集设备上传数据，然后分发给实时处理系统和批量处理系统；实时系统采用自有计数器程序，或者基于 Storm 之类中间件的计数器程序，计算各类简单计数器，然后批量（比如 30s 或者 1min）更新到 Redis 之类的存储；前端供应计数器类数据的服务通过访问后台计算器程序或者是计数器存储来给报表系统提供服务；

批量系统对该批的数据按用户进行去重 <font color=#00dddd size=4>生成/修改某天/某个应用的活跃用户 Bitmap</font> ，同时可以根据需要，将机型、地域、操作系统等等各种数据 <font color=#00dddd size=4>提炼成属性 Bitmap</font>，备用。
报表中针对分析需要，提取各种 Bitmap（用户、属性……Bitmap），高效的利用 CPU/内存，通过组合 And/Or/Not 等基础计算，最终完成多维交叉计算功能，反馈客户结果。

## 3. 实际应用

### 3.1 需求

为了帮助公司精确定位用户群体, 需要开发一个用户画像系统， 实现用户画像标签化， 用户标签包括用户的社会属性、生活习惯、消费行为等信息， 例如下面这个样子

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525102603.png)

通过用户标签， 我们可以对多样的用户群体进行统计，例如统计用户的男女比例，统计喜欢旅游的用户数量等

### 3.2 常规实现方法

为了满足用户标签的统计需求， 我利用关系数据库设计了如下的表结构， 每一个维度的标签对应着数据库表中的一列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525103004.png)

加入我需要统计所有的 “90” 后程序员， 一条 sql 语句即可

```shell
Select count(distinct Name) as 用户数 from table where age = '90后' and Occupation = '程序员'

```

需求很简单嘛

### 3.3 常规方法的问题

可两个月后发现事情没那么简单，现在标签越来越多，例如用户去过的城市、消费水平、爱吃的东西、喜欢的音乐 ⋯⋯ 都快有 <font color=#00dddd size=4>上千个标签了</font> ，这要给
数据库表增加多少 <font color=#00dddd size=4>列</font> 啊！

筛选的标签条件过多的时候，拼出来的 SQL 语句像面条一样长....

不仅如此，当对多个用户群体求并集时，需要用 distinct 来去掉 <font color=#00dddd size=4>重复数据</font> ，性能实在太差了...

### 3.4 Bitmap 登场

仔细想一想，我所做的用户标签能不能用 Bitmap 的形式进行存储呢？

我的每一条用户数据都对应着成百上千个标签，怎么也无法转换成 Bitmap 的形式啊？

不妨把思路逆转-一下，为什么一定要让一用户对应多个标签，而不是一个标签对应多个用户呢？

<font color=#00dddd size=4>信息不一定非要以用户为中心，也能够以标签为中心来存储，让每一个标签存储包含此标签的所有用户 1D，就像倒排索引一样！</font>

第一步：建立用户名和用户 ID 映射

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525104510.png)

第二步：让每一个标签存储包含此标签的所有用户的 ID， 每个标签都是一个独立的 Bitmap

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525104636.png)

这样一来，每个用户特征都变得一目了然

例如程序员和“00 后” 这两个群体， 各自的 Bitmap 分别如下

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525104913.png)

### 3.5 为什么不用哈希表呢

使用哈希表也同样能实现用户的去重和统计操作，为什么一定要使用 Bitmap 呢？

如果使用哈希表的话，每一个用户 1 都要存成 int 或 long 类型，少则占用 4 宇节(32bit），多则占用 8 宇节(64bit）。而个用户 1D 在 Bitmap 中只占 1bit， 内存是使用哈希表所占用内存的 1/32，甚至更少

不仅如此，Bitmap 在对用户群做交集和并集运算时也有极大的便利。我们来看看下面的例子。

如何查找使用苹果手机的程序员用户

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525105255.png)

如何查找男性用户或所有 “00 后” 用户

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525105311.png)

这就是 Bitmap 算法的另一个优势 - 高性能位运算

### 3.6 Bitmap 非运算问题

例如我想查找非 “90 后”的用户，如果简单地做取反运算操作，会出现问题吧？

会出现什么问题呢？我们来看一看。

"90 后" 用户的 Bitmap 如下

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525110232.png)

如果想得到非 〝90 后〞的用户 ，能够直接进行非运算吗？

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525110247.png)

显然，非〝90 后〞 用户实际上只有 1 个，而不是图中所得到的 8 个结果，所以不能直接进行非运算。

这确实是个问题, 我们可以用一个 <font color=#00dddd size=4>全量 Bitmap</font> 解决

同样是刚才的例子，我们给出 “99 后〞 用广的 Bitmap，再给出一个全量用户的 Bitmap。最终要求出的是存在于全量用户，但又不存在于 “90 后〞 用户的部分。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525110447.png)

如何求出这部分用户呢？ 我们可以使用异或运算, 即相同位为 1， 不同位为 0

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220525110507.png)

问题完美解决

### 3.7 JS 实现简单 Bitmap

简单实现一个添加数据和判断是否存在的 demo

```javascript
function BitMap(size) {
  var bit_arr = new Array(size)
  for (var i = 0; i < bit_arr.length; i++) {
    bit_arr[i] = 0
  }
  this.addMember = function(member) {
    //决定在数组中的索引
    var arr_index = Math.floor(member / 32)
    //决定在整数的32个bit位的哪一位
    var bit_index = member % 32
    bit_arr[arr_index] = bit_arr[arr_index] | (1 << bit_index)
  }
  this.isExist = function(member) {
    var arr_index = Math.floor(member / 32)
    var bit_index = member % 32
    var value = bit_arr[arr_index] & (1 << bit_index)
    if (value != 0) {
      return true
    }
    return false
  }
}
```
