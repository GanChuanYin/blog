## rgb 和 16 进制颜色转换

### 原理

首先我们需要知道 RGB 与十六进制之间的关系，例如我们最常见的白色 RGB 表示为 rgb(255, 255, 255), 十六进制表示为#FFFFFFF, 我们可以把十六进制颜色除‘#’外按两位分割成一部分，即 FF,FF,FF, 看一下十六进制的 FF 转为十进制是多少呢？没错，就是 255!

了解了十六进制和 RGB 关系之后，我们就会发现 RGB 转十六进制方法就很简单了

将 RGB 的 3 个数值分别转为十六进制数，然后拼接，即 rgb(255, 255, 255) => ‘#’ + ‘FF’ + ‘FF’ + ‘FF’。 巧妙利用左移，我们把十六进制数值部分当成一个整数，即 FFFFFF,我们可以理解为 FF0000 + FF00 + FF, 如同我们上面解释，如果左移是基于十六进制计算的，则可以理解为 FF << 4, FF << 2 , FF ,如下：

实际计算中我们要用二进制的左移运算

![](https://qiniu.espe.work/blog/20221009105338.png)

转换一下

```javascript
x * 16^4 = x * 2 ^ 16  // 也就是左移16位
x * 16^2 = x * 2 ^ 8   // 左移18位
```

为了求 FFFFFF, 我们可以利用位运算 `或` FF0000 | FF00 | FF

![](https://qiniu.espe.work/blog/20221009105748.png)

所以最后的表达式为

```javascript
let hex = ((num1 << 16) | (num2 << 8) | num3).toString(16)
```

### 代码

了解了原理以后，代码如下：

```javascript
function rgbTo16(rgb) {
  // 取出rgb中的数值
  let arr = rgb.match(/\d+/g)
  if (!arr || arr.length !== 3) {
    console.error('rgb数值不合法')
    return
  }

  // 位运算
  let hex = ((arr[0] << 16) | (arr[1] << 8) | arr[2]).toString(16)

  // 补全第一位
  if (hex.length < 6) {
    hex = '0' + hex
  }

  return `#${hex}`
}

rgbTo16('rgb(0,255,0)') // '#00ff00'
```
