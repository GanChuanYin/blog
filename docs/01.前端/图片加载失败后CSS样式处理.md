## 1. 图片异常处理一般方式

img 如果因为网络或者跨域限制等原因无法正常加载，在默认情况下会显示浏览器默认的“裂开”的图片效果，如果设置了 alt 属性值，则 alt 属性对应的内容也会一并显示。例如：

```html
<img src="//www.baidudu.com/demo.jpg" alt="test" />
```

例如 Chrome 浏览器下的效果截图如下所示：

![](https://qiniu.espe.work/blog/20220531171345.png)

可以看到图片加载异常之后的视觉效果实在是太粗糙了，程序员可忍设计师不可忍，因此，为了更好的视觉效果，实际项目开发中，我们总会对图片加载异常的边界场景进行额外的处理。

传统的图片加载异常会使用一个加载失败的占位符代替，这个占位图通常会是一张裂开的图片。

![](https://qiniu.espe.work/blog/20220531171441.png)

触发使用占位图可以通过 onerror 事件，代码示意如下：

```html
<img src="xxx.png" alt="test" onerror="this.src='img-error-placeholder.svg';" />
```

效果：

![](https://qiniu.espe.work/blog/20220531175007.png)

然而上面这种实现方式有一个比较致命的问题，那就是**用户并不清楚无法显示的图片具体表示的含义是什么**。

对于用户而言，内容和功能绝对比视觉表现更重要。

原生的图片出错会显示图片的 alt 信息，这样，用户是能够知道图片描述的内容是什么，而这里使用占位图片兜底处理后，这些信息都没有了。

因此，传统的图片出错的处理方法可以有进一步的优化。

## 2. 更好的处理方式

```html
<img
  src="test.png"
  alt="图片信息描述"
  onerror="this.setAttribute('lazy','error');"
/>
```

```css
img[lazy='error'] {
  height: 0;
  width: 0;
}
img[lazy='error']::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #f5f5f5, $alpha: 0.2) url('@/assets/images/img-error-placeholder.svg')
    no-repeat center / 50% 50%;
}
img[lazy='error']::after {
  content: attr(alt);
  /* content: attr(自定义attr); */
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  line-height: 2;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

效果

![](https://qiniu.espe.work/blog/20220531175629.png)

可以看到，内容展示和视觉表现同时兼顾了

以上这段代码可以添加到全局，然后项目中其他地方也可以直接用， 下面是我在
el-drawer 中使用的效果

![](https://qiniu.espe.work/blog/20220531175747.png)

## 3. 搭配 vue3-lazyload 使用

上面我偷懒 用的 attr 为 lazy， 因为我的 vue 项目里用的是 vue3-lazyload 懒加载组件。

```html
<div class="movie-poster">
  <img v-lazy="{ src: item.data.poster}" :desc="item.data.name + '的海报'" />
</div>
```

图片懒加载有三种状态

![](https://qiniu.espe.work/blog/20220531180254.png)

所以我只需要在 attr lazy 为 error 时写上相应的 css 代码即可
