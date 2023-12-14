---
title: css-tips
date: 2022-07-14 16:50:28
permalink: /pages/4f1719/
categories:
  - 前端
tags:
  -
---

## 内层滚动不影响外层

[张鑫旭](https://www.zhangxinxu.com/wordpress/2020/01/css-overscroll-behavior/)

```css
/* 单个关键字值 */
overscroll-behavior: auto; /* 默认值 */
overscroll-behavior: contain;
overscroll-behavior: none;

/* 两个值，分别表示x方向和y方向 */
overscroll-behavior: auto contain;
```

参数

各个关键字词的含义如下：

`auto` 默认值。就是我们默认看到的滚动行为表现，滚动到边缘后继续滚动外部的可滚动容器。
`contain` 默认的滚动溢出行为只会表现在当前元素的内部（例如“反弹”效果或刷新），不会对相邻的滚动区域进行滚动。例如创建了一个浮层，浮层滚动（带弹性效果），但是底层元素不会滚动。
`none` 相邻的滚动区域不会发生滚动，并且会阻止默认的滚动溢出行为

contain 和 none 的行为差异体现主要在移动端。

## 文字换行

### white-space

white-space: normal;
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220714165006.png)

white-space: nowrap;
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220714165145.png)

### word-break

word-break: normal;
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220714165310.png)

word-break: break-all;
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220714165335.png)

word-break: keep-all;
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220714165408.png)
