---
title: leetcode2
date: 2022-12-08 15:19:20
permalink: /pages/ab3b30/
categories:
  - 算法与数据结构
tags:
  -
---

### 938. 二叉搜索树的范围和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221208151951.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} low
 * @param {number} high
 * @return {number}
 */
var rangeSumBST = function (root, low, high) {
  let nums = []
  search(root, nums, low, high)
  console.log(nums)
  return nums.reduce((pre, cur) => pre + cur)
}

// 中序遍历 从小到大 遍历所有节点
var search = function (node, nums, low, high) {
  if (!node) return
  search(node.left, nums, low, high)
  // 满足 大小范围的记录节点
  if (node.val >= low && node.val <= high) nums.push(node.val)
  // 如果比最大值还大 直接return
  search(node.right, nums, low, high)
}
```

## 942. 增减字符串匹配

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221208154225.png)

```javascript
/**
 * @param {string} s
 * @return {number[]}
 */
var diStringMatch = function (s) {
  let len = s.length
  let low = 0 // 当前最小值
  let high = len // 当前最大值
  const ans = []
  for (let i = 0; i < len; i++) {
    // 如果为I 推入最小值
    // 如果为D 推入最大值
    if (s[i] === 'I') {
      ans.push(low)
      low++
    } else {
      ans.push(high)
      high--
    }
  }
  ans.push(low) // 推入最后一个数字 此时low和high是一样的
  return ans
}
```

## 993. 二叉树的堂兄弟节点

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221210204704.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
var isCousins = function (root, x, y) {
  const paths = []
  // 找出目标节点的路径树
  getPath(root, paths, [], x)
  getPath(root, paths, [], y)
  // 判断是不是同一层 不是同一层直接 return false
  if (paths[0].length !== paths[1].length) return false
  // 同一层的话判断父节点是否相同
  return paths[0][paths[0].length - 2] !== paths[1][paths[1].length - 2]
}

var getPath = function (node, path, temp, target) {
  if (!node) return
  if (node.val === target) {
    path.push([...temp, node.val])
    return
  }
  getPath(node.left, path, [...temp, node.val], target)
  getPath(node.right, path, [...temp, node.val], target)
}
```

## 976. 三角形的最大周长

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221213151004.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var largestPerimeter = function (nums) {
  nums.sort((a, b) => b - a)
  let ans = 0
  let len = nums.length
  for (let i = 0; i < len; i++) {
    // 如果当前结果比当前最大边3倍还大 退出循环
    if (ans > nums[i] * 3) break
    for (let j = i + 1; j < len; j++) {
      for (let k = j + 1; k < len; k++) {
        if (nums[j] + nums[k] > nums[i]) {
          ans = Math.max(ans, nums[j] + nums[k] + nums[i])
          break
        }
      }
    }
  }
  return ans
}
```

## 1379. 找出克隆二叉树中的相同节点

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221224112746.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} original
 * @param {TreeNode} cloned
 * @param {TreeNode} target
 * @return {TreeNode}
 */

var getTargetCopy = function (original, cloned, target) {
  if (cloned === null) return null
  if (cloned.val === target.val) return cloned
  return (
    getTargetCopy(original, cloned.left, target) &&
    getTargetCopy(original, cloned.left, target)
  )
}
```

## 1446. 连续字符

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221225134058.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var maxPower = function (s) {
  let idx = 1
  let temp = 1
  let ans = 1
  while (idx < s.length) {
    if (s[idx] === s[idx - 1]) {
      temp++
      ans = Math.max(ans, temp)
    } else {
      temp = 1
    }
    idx++
  }
  return ans
}
```

## 1450. 在既定时间做作业的学生人数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221225135916.png)

```javascript
/**
 * @param {number[]} startTime
 * @param {number[]} endTime
 * @param {number} queryTime
 * @return {number}
 */
var busyStudent = function (startTime, endTime, queryTime) {
  let ans = 0
  for (let i = 0; i < startTime.length; i++) {
    if (startTime[i] >= queryTime && endTime <= queryTime) ans++
  }
  return ans
}
```

## 1460. 通过翻转子数组使两个数组相等

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221225171004.png)

```javascript
/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {boolean}
 */
var canBeEqual = function (target, arr) {
  // 只需要判断target和arr的元素是否全部相等
  if (target.length !== arr.length) return false
  for (let i = 0; i < target.length; i++) {
    let idx = arr.indexOf(target[i])
    if (idx === -1) return false
    arr.splice(idx, 1)
  }
  return true
}
```

## 1464. 数组中两元素的最大乘积

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221226223413.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  nums.sort((a, b) => a - b)
  return (nums[nums.length - 1] - 1) * (nums[nums.length - 2] - 1)
}
```

## 1470. 重新排列数组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221226223439.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} n
 * @return {number[]}
 */
var shuffle = function (nums, n) {
  let ans = new Array(2 * n)
  for (let i = 0; i < n; i++) {
    ans.push(nums[i])
    ans.push(nums[i + n])
  }
  return ans
}
```

## 1455. 检查单词是否为句中其他单词的前缀

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221228141017.png)

```javascript
/**
 * @param {string} sentence
 * @param {string} searchWord
 * @return {number}
 */
var isPrefixOfWord = function (sentence, searchWord) {
  let words = sentence.split(' ')
  for (let i = 0; i < words.length; i++) {
    if (words[i].slice(0, searchWord.length) === searchWord) {
      return i + 1
    }
  }
  return -1
}
```

## 1475. 商品折扣后的最终价格

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221228170345.png)

```javascript
/**
 * @param {number[]} prices
 * @return {number[]}
 */
var finalPrices = function (prices) {
  let ans = []
  for (let i = 0; i < prices.length; i++) {
    let current = prices[i]
    for (let j = i + 1; j < prices.length; j++) {
      // 寻找第一个满足条件的prices[j]
      if (prices[j] <= current) {
        current = current - prices[j]
        break
      }
    }
    ans.push(current)
  }
  return ans
}
```

## 1502. 判断能否形成等差数列

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221230162258.png)

```javascript
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var canMakeArithmeticProgression = function (arr) {
  arr.sort((a, b) => a - b)
  let gap = arr[1] - arr[0]
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] !== gap) return false
  }
  return true
}
```

## 1528. 重新排列字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221230171811.png)

```javascript
/**
 * @param {string} s
 * @param {number[]} indices
 * @return {string}
 */
var restoreString = function (s, indices) {
  const ans = new Array(s.length)
  for (let i = 0; i < s.length; i++) {
    let idx = indices[i]
    ans[idx] = s[i]
  }
  return ans.join('')
}
```

## 1588. 所有奇数长度子数组的和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221230175418.png)

```javascript
/**
 * @param {number[]} arr
 * @return {number}
 */
var sumOddLengthSubarrays = function (arr) {
  let ans = arr.reduce((pre, cur) => pre + cur)
  // 依次遍历奇数个子数组长度
  let current = 3
  while (current <= arr.length) {
    for (let i = 0; i <= arr.length - current; i++) {
      for (let j = i; j < i + current; j++) {
        ans += arr[j]
      }
    }
    // 子数组长度+=2
    current += 2
  }

  return ans
}
```

## 1550. 存在连续三个奇数的数组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230101143533.png)

```javascript
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var threeConsecutiveOdds = function (arr) {
  let count = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 !== 0) {
      count++
    } else {
      count = 0
    }
    if (count === 3) return true
  }
  return false
}
```

## 1603. 设计停车系统

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230101153257.png)

```javascript
/**
 * @param {number} big
 * @param {number} medium
 * @param {number} small
 */
var ParkingSystem = function (big, medium, small) {
  this.opacity = {
    1: big,
    2: medium,
    3: small
  }
  this.parking = {
    1: 0,
    2: 0,
    3: 0
  }
}

/**
 * @param {number} carType
 * @return {boolean}
 */
ParkingSystem.prototype.addCar = function (carType) {
  if (this.parking[carType] >= this.opacity[carType]) return false
  this.parking[carType] = this.parking[carType] + 1
  return true
}

/**
 * Your ParkingSystem object will be instantiated and called as such:
 * var obj = new ParkingSystem(big, medium, small)
 * var param_1 = obj.addCar(carType)
 */
```

## 1619. 删除某些元素后的数组均值

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230101224140.png)

```javascript
/**
 * @param {number[]} arr
 * @return {number}
 */
var trimMean = function (arr) {
  arr.sort((a, b) => a - b)
  let count = Math.ceil(arr.length / 20)
  arr = arr.slice(count, arr.length - count)
  return arr.reduce((pre, cur) => pre + cur) / arr.length
}
```

## 1624. 两个相同字符之间的最长子字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230101225017.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var maxLengthBetweenEqualCharacters = function (s) {
  let ans = -1
  const map = {}
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] != undefined) {
      ans = Math.max(ans, i - map[s[i]] - 1)
    } else {
      // 记录当前位置 只需要记一次 即第一次出现的位置
      map[s[i]] = i
    }
  }
  return ans
}
```

## 1636. 按照频率将数组升序排序

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230102104727.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var frequencySort = function (nums) {
  let map = new Map()
  for (let i = 0; i < nums.length; i++) {
    map.set(nums[i], map.has(nums[i]) ? map.get(nums[i]) + 1 : 1)
  }
  let list = [...map]
  // 按照每个值的频率 升序 排序。如果有多个值的频率相同，请你按照数值本身将它们 降序 排序
  list.sort((a, b) => {
    if (a[1] === b[1]) return b[0] - a[0]
    return a[1] - b[1]
  })
  // 重新组装
  const res = []
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i][1]; j++) {
      res.push(list[i][0])
    }
  }
  return res
}
```

## 1662. 检查两个字符串数组是否相等

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230102152610.png)

```javascript
/**
 * @param {string[]} word1
 * @param {string[]} word2
 * @return {boolean}
 */
var arrayStringsAreEqual = function (word1, word2) {
  return word1.toString() === word2.toString()
}
```

## 1678. 设计 Goal 解析器

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230103153551.png)

```javascript
/**
 * @param {string} command
 * @return {string}
 */
var interpret = function (command) {
  let ans = ''
  let stack = ''
  for (let i = 0; i < command.length; i++) {
    stack += command[i]
    switch (stack) {
      case 'G':
        ans += 'G'
        stack = ''
        break
      case '()':
        ans += 'o'
        stack = ''
        break
      case '(al)':
        ans += 'al'
        stack = ''
        break
      default:
        break
    }
  }
  return ans
}
```

## 1684. 统计一致字符串的数目

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230103155323.png)

```javascript
/**
 * @param {string} allowed
 * @param {string[]} words
 * @return {number}
 */
var countConsistentStrings = function (allowed, words) {
  let set = new Set() // 存储allowed的所有字符类型
  for (let i = 0; i < allowed.length; i++) {
    set.add(allowed[i])
  }
  let ans = 0
  for (let i = 0; i < words.length; i++) {
    let flag = true
    for (let j = 0; j < words[i].length; j++) {
      if (!set.has(words[i][j])) {
        flag = false
        break
      }
    }
    if (flag) ans++
  }
  return ans
}
```

## 1688. 比赛中的配对次数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230104213856.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var numberOfMatches = function (n) {
  let ans = 0
  while (n > 1) {
    ans += Math.floor(n / 2)
    if (n % 2 === 0) {
      // 偶数
      n = n / 2
    } else {
      // 奇数
      n = Math.floor(n / 2) + 1
    }
  }
  return ans
}
```

## 1704. 判断字符串的两半是否相似

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230104214518.png)

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var halvesAreAlike = function (s) {
  let vowel = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'])
  let s1 = s.slice(0, s.length / 2)
  let s2 = s.slice(s.length / 2)
  let count1 = 0
  let count2 = 0
  for (let i = 0; i < s1.length; i++) {
    if (vowel.has(s1[i])) count1++
    if (vowel.has(s2[i])) count2++
  }
  return count1 === count2
}
```

## 面试题 01.09. 字符串轮转

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230604210452.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230604210436.png)

```javascript
var isFlipedString = function (s1, s2) {
  return s1.length === s2.length && (s1 + s1).indexOf(s2) !== -1
}
```

## 1217. 玩筹码

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230608154741.png)

那么我们可以把初始每一个偶数位置的「筹码」看作一个整体，每一个奇数位置的「筹码」看作一个整体。因为我们的目标是最后将全部的「筹码」移动到同一个位置，那么最后的位置只有两种情况：

- 移动到某一个偶数位置，此时的开销最小值就是初始奇数位置「筹码」的数量。
- 移动到某一个奇数位置，此时的开销最小值就是初始偶数位置「筹码」的数量。

那么这两种情况中的最小值就是最后将所有筹码移动到同一位置上所需要的最小代价。

```javascript
var minCostToMoveChips = function (position) {
  let even = 0,
    odd = 0
  for (const pos of position) {
    if ((pos & 1) !== 0) {
      odd++
    } else {
      even++
    }
  }
  return Math.min(odd, even)
}
```

## 2423. 删除字符使频率相同

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230613153734.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230613153756.png)

## 1752. 检查数组是否经排序和轮转得到

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230618154809.png)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var check = function (nums) {
  // 比较相邻元素（将数组看成环形，最后一个元素的下一个元素是第一个元素）
  // 最多只能出现一次前一个数大于后一个数的情况。
  let sign = 0
  for (let i = 0; i < nums.length; i++) {
    // 最后一个数的下一个数是第一个数
    let next = i === nums.length - 1 ? nums[0] : nums[i + 1]
    if (nums[i] > next) sign++
    if (sign > 1) break
  }
  return sign <= 1
}
```
