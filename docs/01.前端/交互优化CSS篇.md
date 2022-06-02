## 1. user-select

一些需要需要文字选中的地方特殊处理, 如下图

![](https://qiniu.espe.work/blog/Jun-02-2022-16-28-03.gif)

```html
<ul class="g-container">
  <li class="">XingYun</li>
  <li class="g-select-all">Not Single Word</li>
  <li class="g-select-all">138-1111-2222</li>
  <li class="">
    这是一长串的地址，<span class="g-select-all">四川省，成都市，xxxxxxx</span>
  </li>
  <li>
    这是无用信息
    <span class="g-select-all">中间的有用信息，被分割</span>
    这是无用信息
  </li>
</ul>
```

```css
html,
body {
  width: 100%;
  height: 100%;
  place-items: center;
  padding: 20px;
}

ul li {
  display: block;
  line-height: 24px;
  letter-spacing: 4px;

  span {
    // color: deeppink;
  }
}

.g-select-all {
  user-select: all; // 文字全选
}

.g-select-all::selection {
  background: #f7ec91;
  color: #333;
  text-shadow: 0 0 0.5px #aaa, 1px 1px 0.5px #aaa, 2px 2px 0.5px #aaa, 3px 3px
      0.5px #aaa, 4px 4px 0.5px #aaa;
}
```

这里关键字段就是 
- user-select: all; // 文字全选
- .g-select-all::selection 选中样式调整




