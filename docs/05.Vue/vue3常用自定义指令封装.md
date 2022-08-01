---
title: vue3常用自定义指令封装
date: 2022-07-15 22:17:36
permalink: /pages/126fae/
categories:
  - Vue
tags:
  - 
---
## 1. tooltip

基于 Element plus 的 tooltip 封装的 tooltip 指令。

```typescript
import { nextTick, createApp, VueElement, DirectiveBinding, h } from 'vue'
import { ElTooltip } from 'element-plus'

// 目前是侵入式的 tooltip, 原 innerHTML 内容将被替换 待改进
export default {
  name: 'tooltip',
  mounted(el: any, binding: DirectiveBinding) {
    if (binding.modifiers.ellipsis && el.scrollWidth <= el.clientWidth) return
    el.mouseenterHandler = () => {
      // 超出内容部分才显示 tooltip
      // console.log(el)
      if (el._tooltipInstance) {
        return
      }
      const instance = createApp({
        template: `
        <el-tooltip 
          placement="${binding.arg || 'top'}" 
          content="${binding.value}">
          <div>${el.innerHTML}</div>
        </el-tooltip>`,
        components: { 'el-tooltip': ElTooltip }
      })
      el._tooltipInstance = instance.mount(el)
    }
    el.addEventListener('mouseenter', el.mouseenterHandler)
  },
  updated(el: any, binding: DirectiveBinding) {},
  unmounted(el: any) {
    if (el.mouseenterHandler) {
      el.removeEventListener('mouseenter', el._tipHandler)
    }
  }
}
```

使用

```html
<div v-tooltip:top.eclipse="提升内容"></div>
```

## 2. 点击复制文本指令

基于 Clipboard 的点击复制文本指令。

```typescript
import Clipboard from 'clipboard'

export default {
  name: 'copy',
  mounted: (el: any, binding: any = {}) => {
    const clipboard = new Clipboard(el, {
      text: () => binding.value
    })
    clipboard.on('success', (e) => {
      console.log(e)
    })
    clipboard.on('error', (e) => {})
    if (el) {
      el.__clipboard__ = clipboard
      el.style.cursor = 'pointer'
      el.title = el.title || '点击复制'
      el.onmouseover = () => {
        el.style.color = '#00a8ff'
      }
      el.onmouseout = () => {
        el.style.color = ''
      }
    }
  },
  update: (
    el: { __clipboard__: { text: () => any } },
    binding: { value: any }
  ) => {
    el.__clipboard__.text = () => binding.value
  },
  unbind: (el: any, binding: any) => {
    if (!el) return
    el.__clipboard__ && el.__clipboard__.destroy()
    delete el.__clipboard__
  }
}
```
