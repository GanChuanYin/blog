---
title: 纯CSS设计菜单toggle-icon
date: 2022-06-24 16:30:09
permalink: /pages/29b91c/
categories:
  - 前端
tags:
  - 
---
## 1. 效果

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/Jun-24-2022-16-31-12.gif)

## 2. 原理

这里三条杠的菜单由三个 span 组成

```html
<div class="menu-toggle">
  <span></span>
  <span></span>
  <span></span>
</div>
```

切换为关闭按钮时，隐藏中间的杠， 上下分分别旋转组成一个 X

```css
.menu-toggle {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  height: 20px;
  width: 24px;
  -webkit-user-select: none;
  user-select: none;
}
.menu-toggle span {
  display: block;
  width: 24px;
  height: 3px;
  position: relative;
  background: #cdcdcd;
  border-radius: 3px;
  z-index: 1;
  transform-origin: left;
  transition: transform 1s cubic-bezier(0.77, 0.2, 0.05, 1);
}
.menu-toggle.unfold span:nth-child(1) {
  opacity: 1;
  transform: rotate(45deg);
}
.menu-toggle.unfold span:nth-child(2) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}
.menu-toggle.unfold span:nth-child(3) {
  opacity: 1;
  transform: rotate(-45deg);
}
```

设置旋转的中心点在左侧的话是最简单的， 只需要将第一、三条杠分别旋转 45、-45 度即可

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220624163615.png)

transform-origin 也支持方向 + 数值的组合设置

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220624163711.png)

> [transform-origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin)

中间的杠设置 scale 可以让动画更加顺滑

```css
.menu-toggle.unfold span:nth-child(2) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}
```
