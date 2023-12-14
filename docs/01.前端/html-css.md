---
title: html-css
date: 2023-04-04 17:08:25
permalink: /pages/ce5c2f/
categories:
  - 前端
tags:
  -
---

---

###### 1. What's the output?

```javascript
function sayHi() {
  console.log(name);
  console.log(age);
  var name = 'Lydia';
  let age = 21;
}

sayHi();
```

  - A: `Lydia` and `undefined`
- B: `Lydia` and `ReferenceError`
- C: `ReferenceError` and `21`
- D: `undefined` and `ReferenceError`

<details><summary><b>Answer</b></summary>
<p>
<iframe height="400" style="width: 100%;" scrolling="no" title="【CSS：行为】使用:hover和attr()定制悬浮提示" src="https://codepen.io/xugaoyi/embed/vYNKNaq?height=400&theme-id=light&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true" loading="lazy">
  See the Pen <a href='https://codepen.io/xugaoyi/pen/vYNKNaq'>【CSS：行为】使用:hover和attr()定制悬浮提示</a> by xugaoyi
  (<a href='https://codepen.io/xugaoyi'>@xugaoyi</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

</p>
</details>

---

### script 标签中 defer 和 async 的区别？

- `script` ：会阻碍 HTML 解析，只有下载好并执行完脚本才会继续解析 HTML。
- `async script 异步` ： 解析 HTML 过程中进行脚本的异步下载，下载成功立马执行，有可能会阻断 HTML 的解析。
- `defer script 延迟`：完全不会阻碍 HTML 的解析，解析完成之后再按照顺序执行脚本。

下图清晰地展示了三种 `script` 的过程：

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230404170722.png)

### 两种盒模型 content-box、border-box 的区别？

CSS3 box-sizing 中的盒模型有以下两种：

- `content-box` 标准盒模型 ： 只包含 content
- `border-box` IE 盒模型 ： content + padding + border

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230404180428.png)

Example:

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20230404180503.png)

### CSS 选择器权重怎么计算的？ 

> https://www.w3.org/TR/selectors-3/#specificity

CSS 的优先级关系是:

> !important > 内联 > ID 选择器 > 类选择器 > 标签选择器。

下面解析浏览器具体的优先级算法是怎样的：

important 与 内联 样式判断逻辑很简单： **后面的覆盖前面的**

重点分析一下 CSS 选择器的计算方式：

- 计算选择器中 ID 选择器的数量(= a)
- 计算选择器中类选择器、属性选择器和伪类的数量(= b)
- 计算选择器中类型选择器和伪元素的数量(= c)
- 忽略通用选择器

否定伪类中的选择器与其他选择器一样被计数，但否定类本身不被计数为伪类。

Examples:

```css
*                                   /* ( 0, 0, 0) *
li                                  /* ( 0, 0, 1) */
ul li                               /* ( 0, 0, 2) */
ul ol+li                            /* ( 0, 0, 3) */
ul ol+li                            /* ( 0, 0, 3) */
h1 + *[REL=up]                      /* ( 0, 1, 1) */
ul ol li.red                        /* ( 0, 1, 3) */
li.red.level                        /* ( 0, 2, 1) */
a1.a2.a3.a4.a5.a6.a7.a8.a9.a10.a11  /* ( 0, 11,0) */
#x34y                               /* ( 1, 0, 0) */
li:first-child h2 .title            /* ( 0, 2, 2) */
#nav .selected > a:hover            /* ( 1, 2, 1) */
html body #nav .selected > a:hover  /* ( 1, 2, 3) */
```

**比较规则是: 从左往右依次进行比较 ，较大者胜出，如果相等，则继续往右移动一位进行比较 。如果 3 位全部相等，则后面的会覆盖前面的**

---

### 怎么理解 BFC ？

<details><summary><b>Answer</b></summary>

> https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context

BFC： Block Formatting Context 即块级格式上下文，根据盒模型可知，每个元素都被定义为一个矩形盒子，它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用，当涉及到可视化布局的时候，Block Formatting Context 提供了一个环境，HTML 元素在这个环境中按照一定规则进行布局。

BFC 的目的：**形成一个完全独立的空间，让空间中的子元素不会影响到外面的布局。**

BFC 具有一些特性：

1. 块级元素会在垂直方向一个接一个的排列，和文档流的排列方式一致。
2. 在 BFC 中上下相邻的两个容器的 margin 会重叠，创建新的 BFC 可以避免外边距重叠。
3. 计算 BFC 的高度时，需要计算浮动元素的高度。
4. BFC 区域不会与浮动的容器发生重叠。
5. 每个元素的左 margin 值和容器的左 border 相接触。

创建 BFC 的方式：

- **overflow 的值不为 visible** （最常用） 。
- 绝对定位元素（position 为 absolute 或 fixed ）。
- 行内块元素，即 display 为 inline-block 。

BFC 的应用：

- 利用 3 ，BFC 内部的浮动元素也会参与高度计算，可以清除 BFC 内部的浮动， 避免高度塌陷 [在线预览](https://codepen.io/xingyun0820/pen/eYPOdmx)
- 利用 2 ，创建新的 BFC ，让相邻的块级盒位于不同 BFC 下可以防止外边距折叠， 避免 margin 重叠问题 [在线预览](https://codepen.io/xingyun0820/pen/MWPgjgP)
- 利用 4 和 5 ，我们可以实现三栏（或两栏）自适应布局 [在线预览](https://codepen.io/xingyun0820/pen/yLRBJdq)。

</details>

---

### 水平垂直居中最常用方式

经常看到有的面试题分析列出十几种水平垂直居中方式，有的方式可能写一辈子代码都用不到 😒😒😒

下面按照实用度列出三种方式：

1. flex

```css
.father {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

2. 绝对定位 + transform

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

3. 绝对定位子元素所有方向都为 0 + margin:auto, 该方法必须盒子有宽高

由于宽高固定，对应方向 margin 实现自动平分

```css
.father {
  position: relative;
}
.son {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
  margin: auto;
  height: 100px;
  width: 100px;
}
```

如果这三种说完面试官问还有吗？ 你直接怼回去： 还有，但是我怕写出来同事看不懂，有通俗易懂的方式为啥要整偏门呢？

### flex 布局

flex 是最常用的布局方式，必须精通并熟练运用

可以通过这个题目练习 [骰子在线联系](https://codepen.io/xingyun0820/pen/vYVBXRZ)

