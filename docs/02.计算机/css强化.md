---
title: css强化
date: 2022-06-27 17:12:58
permalink: /pages/f585e4/
categories:
  - 前端
tags:
  - 
---
## position:sticky

单词 sticky 的中文意思是“粘性的”，position:sticky 表现也符合这个粘性的表现。

基本上，可以看出是 <font color=#00dddd size=4> position:relative 和 position:fixed 的结合体——当元素在屏幕内，表现为 relative，就要滚出显示器屏幕的时候，表现为 fixed。</font>

![](https://qiniu.espe.work/blog/Jun-27-2022-17-13-56.gif)

```css
nav {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
```

position:sticky 有个非常重要的特性，那就是 sticky 元素效果完全受制于父级元素们。

这和 position:fixed 定位有着根本性的不同，fixed 元素直抵页面根元素，其他父元素对其 left/top 定位无法限制。

sticky 元素有以下一些特性表现：

- 父级元素不能有任何 overflow:visible 以外的 overflow 设置，否则没有粘滞效果。因为改变了滚动容器（即使没有出现滚动条）。因此，如果你的 position:sticky 无效，看看是不是 <font color=#dd0000 size=4>某一个</font> 祖先元素设置了 overflow:hidden，移除之即可。

父级元素设置和粘性定位元素等高的固定的 height 高度值，或者高度计算值和粘性定位元素高度一样，也没有粘滞效果。同一个父容器中的 sticky 元素，如果定位值相等，则会重叠；如果属于不同父元素，且这些父元素正好紧密相连，则会鸠占鹊巢，挤开原来的元素，形成依次占位的效果.

sticky 定位，不仅可以设置 top，基于滚动容器上边缘定位；还可以设置 bottom，也就是相对底部粘滞。如果是水平滚动，也可以设置 left 和 right 值。

## 如何提高动画的渲染性能

你需要尽量做到如下条件：

- 动画中尽量少使用能触发 layout 和 paint 的 CSS 属性，使用更低耗的 transform、opacity 等属性
- 尽量减少或者固定层的数量，不要在动画过程中创建层
- 尽量减少层的更新（paint）次数

transform 和 opacity 属性保证既不影响也不受正常流或 DOM 环境的影响（即，它们不会导致重排或重绘，因此其动画可以完全卸载到 GPU）。 基本上，这意味着你可以有效地动画实现移动，缩放，旋转，不透明度和仿射变换。 有时你可能想要模拟具有这些属性的其他动画类型。

以一个很常见的例子：一个背景颜色转换。 基本方法是添加一个 transition 属性：

```html
<div id="bg-change"></div>

<style>
  #bg-change {
    width: 100px;
    height: 100px;
    background: red;
    transition: background 0.4s;
  }

  #bg-change:hover {
    background: blue;
  }
</style>
```

在这种情况下，动画将完全在 CPU 上工作，并在动画的每个步骤中重绘。 但是我们可以使这样的动画在 GPU 上工作：代替动画的 background-color 属性，我们在顶部添加一个图层和给它的不透明度添加动画：

```html
<div id="bg-change"></div>

<style>
  #bg-change {
    width: 100px;
    height: 100px;
    background: red;
  }

  #bg-change::before {
    background: blue;
    opacity: 0;
    transition: opacity 0.4s;
  }

  #bg-change:hover::before {
    opacity: 1;
  }
</style>
```
