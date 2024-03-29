---
title: Echarts优化大数据渲染
date: 2023-05-10 21:02:29
permalink: /pages/fd368e/
categories:
  - Vue
tags:
  - 
---
工作中遇到一个 CPU 监控大数据渲染卡顿的问题

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230511142520.png)

### 1. echarts sampling

> Echarts 官方 https://echarts.apache.org/zh/option.html#series-line.sampling

折线图在数据量远大于像素点时候的降采样策略，开启后可以有效的优化图表的绘制效率，默认关闭，也就是全部绘制不过滤数据点。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230510214511.png)

这里重点研究一下 Largest-Triangle-Three-Bucket 算法

### 2. 如何优化渲染大数据？

以折线图为例，可视化场景中，当 x 轴的数据不断增多，对应 y 轴的数据量增多，体现在图上的折线就会变得越来越复杂，当数量达到一定程度，很难再通过图找到具体的某一个点所表述的真实值是什么，数据变得很拥挤。

> 5000 个数据点绘制图的折线图

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230510214925.png)

为了能够看到图形的整体，我们就要隐藏一些点，仅展示那些能够代表其他的点，或者是创建能够代表这些点的新数据点，这就是降采样算法解决的问题。

> 采用 LTTB 算法，5000 数据点降采样到 888 个数据点绘制的折线图，几乎完全一致

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230510215103.png)

### 3. Largest-Triangle-Three-Bucket 最大三角形三桶算法

算法都有自己的局限性，适用的范围，LTTB 算法也是一样，算法中仅保留能够提供重要信息、容易被人们感知到的点，其他的点被忽略。这样带来的好处显而易见，可以看见图表的全貌、加快渲染速度，节省带宽和时间。

#### 3.1. LTTB 实现步骤：

1. 除去首尾两个数据点，把所有的数据点按顺序尽量等分到每个桶。桶是什么？桶是多个数据点组成的数据子集。
2. 第一个数据点放进第一个桶，最后一个数据点放进最后一个桶，且均只有这一个点。
3. 遍历所有的桶，从每个桶中找到最合适的一个点，代表这个桶。

桶中的所有点，即有效点，就是降采样后的数据点集合。

重点就在于如何找到可以代表当前桶的那个点，也就是三桶算法的核心设计。

最大三角形面积，是使用的哪三个桶，怎么取数据，先看一张图。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230510215234.png)

虚竖线把区分成三部分，分别代表三个桶的数据区域。

从首个桶开始计算，因为首个桶只有第一个数据点，所以 A 就是第一个数据点，已知，不需要计算，是预选点。B 点来自于第二个桶，C 点来自于第三个桶。我们先说点 C 的选择，如果按照每个桶中有 100 个数据点计算，那么确定出合适的点，就需要 100 \* 100，共 1W 次的计算，更合适的做法，是选出一个临时点能够代表其他点，然后再通过 100 次计算求得合适的 B 点，简化过程。因此规定，C 点为临时点，是平均点，
简单可求得。

此时，我们已知预选点 A 和临时点 C，通过遍历 B 桶中的数据点，选取组成的三角形 ABC 面积最大的那个点作为 B 点，来代表 B 桶。

> 点 A，预选点
> 点 B，和 ABC 组成的三角形面积最大的点
> 点 C，C 桶数据点的平均点

然后，按照上述逻辑，继续把 B 点当成第一个点，作为预选点，已知。D 桶（图中未给出）中选取临时点 D 点，从而计算出 C 桶中真正能代表 C 桶的 C 点。

依次循环遍历，完成所有桶的逻辑计算。

### 4. 其它算法

超大数据量的图形可视化是非常有意思的话题，也是性能优化中经常遇到的核心点。结合性能、复杂度、准确度等指标，在绝大多数情况下，LTTB 算法的表现都是最优异的，也就是基于场景的不同，优先考虑 LTTB 算法，不满足需求时，再尝试其他算法。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230510215531.png)
