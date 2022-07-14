---
title: css-trick
date: 2022-06-06 00:45:42
permalink: /pages/8e90f7/
categories:
  - 前端
tags:
  - 
---
## 1. 如何画一条 0.5px 的边框

```css
div {
  border: 1px solid #000;
  transform: scaleY(0.5);
  height: 1px;
  transform-origin: 50% 100%;
}
```

单独用 transform: scaleY(0.5);height: 1px;这样肯定是会变虚，但是你可以指定变换的原点，加上这个 transform-origin: 50% 100%;就不会有虚化



## 2. attr 实现 tooltip

![](https://qiniu.espe.work/blog/attr-tooltip.gif)

```html
<h1>
  HTML/CSS tooltip
</h1>
<p>
  Hover <span class="tooltip" tooltip-data="Tooltip Content">Here</span> to see
  the tooltip.
</p>
<p>
  You can also hover
  <span class="tooltip" tooltip-data="This is another Tooltip Content"
    >here</span
  >
  to see another example.
</p>
```

```css
.tooltip {
  position: relative;
  border-bottom: 1px dotted black;
}

.tooltip:before {
  content: attr(tooltip-data);
  position: absolute;
  width: 250px;
  background-color: #efba93;
  color: #fff;
  text-align: center;
  padding: 15px;
  line-height: 1.1;
  border-radius: 5px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  font-size: 0.7em;
  visibility: hidden;
}

.tooltip:after {
  content: '';
  position: absolute;
  bottom: 75%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  opacity: 0;
  transition: opacity 0.5s;
  border-color: #000 transparent transparent transparent;
  visibility: hidden;
}

.tooltip:hover:before,
.tooltip:hover:after {
  opacity: 1;
  visibility: visible;
}
```

## 3. 纯 CSS 实现核算清单

![](https://qiniu.espe.work/blog/12312.gif)

```html
<div class="checklist">
  <h2>Item Checklist with CSS</h2>
  <label>
    <input type="checkbox" name="" id="" />
    <i></i>
    <span>Item #1</span>
  </label>
  <label>
    <input type="checkbox" name="" id="" />
    <i></i>
    <span>Item #2</span>
  </label>
  <label>
    <input type="checkbox" name="" id="" />
    <i></i>
    <span>Item #3</span>
  </label>
</div>
```

```CSS
.checklist {
    padding: 50px;
    position: relative;
    background: #043b3e;
    border-top: 50px solid #03a2f4;
}
.checklist h2 {
    color: #f3f3f3;
    font-size: 25px;
    padding: 10px 0;
    margin-left: 10px;
    display: inline-block;
    border-bottom: 4px solid #f3f3f3;
}
.checklist label {
    position: relative;
    display: block;
    margin: 40px 0;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
}
.checklist input[type="checkbox"] {
    -webkit-appearance: none;
}
.checklist i {
    position: absolute;
    top: 2px;
    display: inline-block;
    width: 25px;
    height: 25px;
    border: 2px solid #fff;
}
.checklist input[type="checkbox"]:checked ~ i {
    top: 1px;
    height: 15px;
    width: 25px;
    border-top: none;
    border-right: none;
    transform: rotate(-45deg);
}
.checklist span {
    position: relative;
    left: 40px;
    transition: 0.5s;
}
.checklist span:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #fff;
    transform: translateY(-50%) scaleX(0);
    transform-origin: left;
    transition: transform 0.5s;
}
.checklist input[type="checkbox"]:checked ~ span:before {
    transform: translateY(-50%) scaleX(1);
    transform-origin: right;
    transition: transform 0.5s;
}
.checklist input[type="checkbox"]:checked ~ span {
    color: #154e6b;
}
```
