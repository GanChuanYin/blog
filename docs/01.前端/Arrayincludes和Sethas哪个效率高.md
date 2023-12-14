---
title: Arrayincludes()和Sethas()哪个效率高?
date: 2022-09-06 16:31:41
permalink: /pages/36714b/
categories:
  - 前端
tags:
  - 
---
## Array.prototype.includes() vs Set.prototype.has()哪个效率高

在 leetcode 上做了一个题

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906163323.png)

我的代码

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
  let len = nums.length
  if (len === 1) return
  if (k > len) k = k % len
  let switchedList = []
  for (let i = 0; i < len; i++) {
    if (switchedList.includes(j)) continue
    let last = nums[i]
    let j = -1
    while (j !== i) {
      if (j === -1) j = i
      j = j + k >= len ? k + j - len : j + k
      if (j > 10) return
      if (switchedList.includes(j)) break
      switchedList.push(j)
      let temp = nums[j]
      nums[j] = last
      last = temp
    }
  }
}
```

自我感觉没啥问题, 可是提交后

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906163753.png)

无情`超时`

这个测试用例元素个数居然有`10w`个

为了优化效率, 我把 array 换成了 set

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
  let len = nums.length
  if (len === 1 || len === k) return
  if (k > len) k = k % len
  let switched = new Set() // 记录已经被移动过的位置的下标
  for (let i = 0; i < len; i++) {
    if (switched.has(i)) continue //被移动过了就跳过
    let last = nums[i]
    let j = i
    do {
      j = j + k >= len ? k + j - len : j + k
      if (switched.has(j)) break // 碰到移动过的元素 直接break
      switched.add(j)
      let temp = nums[j]
      nums[j] = last
      last = temp
    } while (j !== i) //  一圈圈移动
  }
}
```

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906164014.png)

成功通过

于是我有个猜想,` set.has` 的效率比 `array.includes()` 高的多?

## 测试一下

为了测一下两者的效率, 我写了下面代码

```javascript
const getRandomInt = () => {
  let sign = Math.random() > 0.5 ? 1 : -1
  return Math.ceil(Math.random() * 1000000 * sign) //生成 -100w 到 100w  随机数
}

const LENGTH = 100000

// array / set 包含的数字个数
const valuesToKeep = Array.from({ length: LENGTH }, () => getRandomInt())

// 测试数据
const valuesToTest = Array.from({ length: LENGTH * 10 }, () => getRandomInt())

// test includes
console.time(LENGTH + ' includes')
valuesToTest.filter((v) => valuesToKeep.includes(v))
console.timeEnd(LENGTH + ' includes')

// test has
console.time(LENGTH + ' has')
const valuesToKeepSet = new Set(valuesToKeep)
valuesToTest.filter((v) => valuesToKeepSet.has(v))
console.timeEnd(LENGTH + ' has')
```

运行结果如下

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906165739.png)

果然, 我的猜想成立

可以总结下 <font color=#dd0000 size=4>`Set.prototype.has() 的效率比 Array.prototype.includes() 高, 且数据量越大has优势越明显`</font>

## 为什么 has 比 includes 效率高 ?

[Array.prototype.includes()源码](https://chromium.googlesource.com/v8/v8/+/4.3.49/src/harmony-array-includes.js?autodive=0%2F%2F)

```javascript
function ArrayIncludes(searchElement, fromIndex) {
  var array = ToObject(this)
  var len = ToLength(array.length)
  if (len === 0) {
    return false
  }
  var n = ToInteger(fromIndex)
  var k
  if (n >= 0) {
    k = n
  } else {
    k = len + n
    if (k < 0) {
      k = 0
    }
  }
  while (k < len) {
    var elementK = array[k]
    if (SameValueZero(searchElement, elementK)) {
      return true
    }
    ++k
  }
  return false
}
```

可以看出 `Array.prototype.includes()`的时间复杂度为 O(n)

Set 的底层数据结构是哈希表, 所以 `Set.prototype.has()` 的时间复杂度为 O(1)

所以 `Set.prototype.has()` 比 `Array.prototype.includes()` 快就不奇怪了
