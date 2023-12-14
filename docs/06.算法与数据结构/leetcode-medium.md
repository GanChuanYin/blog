---
title: leetcode-medium
date: 2022-08-10 00:22:08
permalink: /pages/2ddfd7/
categories:
  - 算法与数据结构
tags:
  -
---

## 两数相加

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220810002250.png)
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220810002328.png)

类似大数相加

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  if (!l1 && !l2) return null
  const arr1 = []
  const arr2 = []
  while (l1) {
    arr1.push(l1.val)
    l1 = l1.next
  }
  while (l2) {
    arr2.push(l2.val)
    l2 = l2.next
  }

  const res = []
  let = carryBit = 0
  while (arr1.length && arr2.length) {
    let num = arr1.shift() + arr2.shift() + carryBit
    carryBit = 0
    if (num > 9) {
      carryBit = 1
      num -= 10
    }
    res.push(num)
  }

  while (arr1.length) {
    let num = arr1.shift() + carryBit
    carryBit = 0
    if (num > 9) {
      carryBit = 1
      num -= 10
    }
    res.push(num)
  }
  while (arr2.length) {
    let num = arr2.shift() + carryBit
    carryBit = 0
    if (num > 9) {
      carryBit = 1
      num -= 10
    }
    res.push(num)
  }

  if (carryBit) {
    res.push(1)
  }

  const root = new ListNode(res[0])
  let current = root
  for (let index = 1; index < res.length; index++) {
    current.next = new ListNode(res[index])
    current = current.next
  }
  return root
}
```

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  const dummy = new ListNode()
  let carry = 0
  let cur = dummy
  while (l1 || l2 || carry) {
    const s = (l1?.val || 0) + (l2?.val || 0) + carry
    carry = Math.floor(s / 10)
    cur.next = new ListNode(s % 10)
    cur = cur.next
    l1 = l1?.next
    l2 = l2?.next
  }
  return dummy.next
}
```

## 盛最多水的容器

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220811214008.png)
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220811214022.png)

双指针解决。

一开始，我们考虑相距最远的两个柱子所能容纳水的面积。水的宽度是两根柱子之间的距离，而水的高度取决于两根柱子之间较短的那个。

- 当前柱子是最两侧的柱子，水的宽度最大，其他的组合，水的宽度都比这个小；
- 当前左侧柱子较短，决定了水的高度。如果移动左侧的柱子，新的水面高度不确定，但一定不会超过右侧的柱子高度；
- <font color=#dd0000 size=4>`如果移动右侧的柱子，新的水面高度一定不会超过左侧的柱子高度，也就是不会超过当前的水面高度。`</font>

可见，如果固定左侧的柱子，向内移动右侧的柱子，水的高度一定不会增加，且宽度一定减少，所以水的面积一定减少。所以左侧的柱子跟右侧其他柱子的组合，都可以排除了。也就是代码中的 i++。

移动左侧的柱子中，重复进行上面的操作。

在此过程中，我们不断排除掉无法成为构成最大值的柱子组合，而每一次都获取到可能为最大值的面积 t。那么遍历结束之后，我们就可以得到最大值。

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let i = 0,
    j = height.length - 1
  let res = 0
  while (i < j) {
    const t = (j - i) * Math.min(height[i], height[j])
    res = Math.max(res, t)
    if (height[i] < height[j]) ++i
    else --j
  }
  return res
}
```

## 括号生成

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220813213804.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220813215622.png)

画图以后，可以分析出的结论：

- 当前左右括号都有大于 00 个可以使用的时候，才产生分支；
- 产生左分支的时候，只看当前是否还有左括号可以使用；
- 产生右分支的时候，还受到左分支的限制，右边剩余可以使用的括号数量一定得在严格大于左边剩余的数量的时候，才可以产生分支；
- 在左边和右边剩余的括号数都等于 00 的时候结算。

```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function (n) {
  const generateOne = (list, str, left, right) => {
    if (left == 0 && right == 0) {
      list.push(str)
      return
    }
    if (left > 0) {
      generateOne(list, str + '(', left - 1, right)
    }
    // 可用的括号 右括号大于左括号时，说明有 左括号先放置，才会是有效的括号组合
    if (right > left) {
      generateOne(list, str + ')', left, right - 1)
    }
  }
  const res = []
  generateOne(res, '', n, n)
  return res
}
```

进阶: 组合法

比如 n=1 时为“（）”，那么 n=2 时，“0（1）2”，有 0,1,2 三个位置可以插入一个完整的“（）”，分别得到“（）（）”，“（（））”，以及“（）（）”，去除重复的就得到了 n=2 时的结果。

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220813215158.png)

## 最长回文子串

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220814223228.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function (s) {
  let maxLength = 0,
    left = 0,
    right = 0
  for (let i = 0; i < s.length; i++) {
    let singleCharLength = getPalLenByCenterChar(s, i, i)
    let doubleCharLength = getPalLenByCenterChar(s, i, i + 1)
    let max = Math.max(singleCharLength, doubleCharLength)
    if (max > maxLength) {
      maxLength = max
      left = i - parseInt((max - 1) / 2)
      right = i + parseInt(max / 2)
    }
  }
  return s.slice(left, right + 1)
}

function getPalLenByCenterChar(s, left, right) {
  // 中间值为两个字符，确保两个字符相等
  if (s[left] != s[right]) {
    return right - left // 不相等返回为1个字符串
  }
  while (left > 0 && right < s.length - 1) {
    // 先加减再判断
    left--
    right++
    if (s[left] != s[right]) {
      return right - left - 1
    }
  }
  return right - left + 1
}
```

## 全排列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220816225149.png)

迭代插入法

```shell
当输入为 [1] 时只有 [[1]],  当变为 [1,2], 相当于在[[1]]的 左边和右边插入2, 得到 [[2,1],[1,2]]

以此类推
```

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
  let res = [[nums[0]]]
  const arrange = (arr, num) => {
    let res = []
    arr.forEach((n) => {
      let len = n.length + 1
      for (let index = 0; index < len; index++) {
        let temp = [...n]
        temp.splice(index, 0, num)
        res.push([...temp])
      }
    })
    return res
  }
  let i = 1
  while (i < nums.length) {
    res = arrange(res, nums[i])
    i++
  }
  return res
}
```

## 无重复的最长值子串

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220817171423.png)

### 暴力迭代

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  if (s.length === 0) return 0
  if (s.length === 1) return 1
  const strArr = s.split('')
  let left = 0
  let resArr = []
  while (left < strArr.length) {
    let tempArr = []
    for (let index = left; index < strArr.length; index++) {
      if (!tempArr.includes(strArr[index])) {
        tempArr.push(strArr[index])
      } else {
        break
      }
    }
    if (tempArr.length > resArr.length) {
      resArr = tempArr
    }
    left++
  }
  return resArr.length
}
```

### 双指针 + 哈希表

定义一个哈希表记录当前窗口内出现的字符，记 和 分别表示不重复子串的开始位置和结束位置，无重复字符子串的最大长度记为 。

遍历字符串 的每个字符 ，我们记为 。若 窗口内存在 ，则 循环向右移动，更新哈希表，直至 窗口不存在 ，循环结束。将 加入哈希表中，此时 窗口内不含重复元素，更新 的最大值 。

最后返回 即可。

时间复杂度 ，其中 表示字符串 的长度。

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const ss = new Set()
  let i = 0
  let ans = 0
  for (let j = 0; j < s.length; ++j) {
    while (ss.has(s[j])) {
      ss.delete(s[i++])
    }
    ss.add(s[j])
    ans = Math.max(ans, j - i + 1)
    console.log(ss)
    console.log(i)
  }
  return ans
}

console.log(lengthOfLongestSubstring('aacbddfefs'))
// console.log(lengthOfLongestSubstring('abcdefg'))
```

## 每日温度

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220817221101.png)

```javascript
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function (temperatures) {
  const res = []
  for (let index = 0; index < temperatures.length; index++) {
    let current = temperatures[index]
    let sign = 0
    for (let i = index + 1; i < temperatures.length; i++) {
      if (temperatures[i] > current) {
        sign = i - index
        break
      }
    }
    res.push(sign)
  }
  return res
}
```

## 在排序数组中查找元素的第一个和最后一个位置

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220818144941.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function (nums, target) {
  if (nums.length === 0) return [-1, -1]
  let left = 0
  let right = nums.length
  while (left < right) {
    let middle = (left + right) >> 1
    if (nums[middle] >= target) {
      right = middle
    } else {
      left = middle + 1
    }
  }
  if (nums[left] === target) {
    // 找到了
    let end = left
    while (nums[end] === nums[left]) {
      end++
    }
    end--
    return [left, end]
  } else {
    // 其他情况就是没找到
    return [-1, -1]
  }
}
```

## 整数反转

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220818154721.png)

```javascript
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function (x) {
  if (Math.abs(x) < 10) return x
  let absX = Math.abs(x)
  let absStr = absX.toString()
  let absArr = absStr.split('')
  absArr = absArr.reverse()
  absStr = absArr.join('')
  if (Math.abs(parseInt(absStr)) > Math.pow(2, 31) - 1) {
    return 0 // 超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。
  }
  return x > 0 ? parseInt(absStr) : -parseInt(absStr)
}
```

## 子集

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220819115702.png)

```javascript
// [] [1]

// [] [1] [2] [1, 2]

// [],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]

// 每次新增数字就是在上一组数字中组合新增
```

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function (nums) {
  let res = []
  while (nums.length) {
    res = merge(res, nums.shift())
  }
  return res
}

var merge = function (nestArr, num) {
  if (nestArr.length < 2) return [[], [num]]
  let tail = [[num]]
  for (let i = 1; i < nestArr.length; i++) {
    const item = [...nestArr[i]]
    item.push(num)
    tail.push(item)
  }
  return nestArr.concat(tail)
}
```

## 三数子和

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220819150441.png)

以下版本超时了

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  if (nums.length < 3) return []
  let left = 0
  let resArr = []
  let tempStrArr = []
  while (left < nums.length - 1) {
    let right = left + 1
    while (right < nums.length) {
      findNum(nums, left, right, resArr, tempStrArr)
      right++
    }
    left++
  }
  return resArr
}

var findNum = function (arr, left, right, resArr, tempStrArr) {
  const subSum = arr[left] + arr[right]
  let index = arr.findIndex((item) => {
    return item === -subSum
  })
  if (![-1, left, right].includes(index)) {
    let resItem = [arr[left], arr[right], arr[index]].sort()
    let str = resItem.toString()
    if (!tempStrArr.includes(str)) {
      resArr.push(resItem)
      tempStrArr.push(str)
    }
  }
}
```

下面版本先将数组排序，然后使用双指针，时间复杂度为 O(n^2)

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const n = nums.length
  if (n < 3) return []
  let res = []
  nums.sort((a, b) => a - b)
  for (let i = 0; i < n - 2 && nums[i] <= 0; ++i) {
    if (i > 0 && nums[i] == nums[i - 1]) continue
    let j = i + 1
    let k = n - 1
    while (j < k) {
      if (nums[i] + nums[j] + nums[k] === 0) {
        res.push([nums[i], nums[j], nums[k]])
        ++j
        --k
        while (nums[j] === nums[j - 1]) ++j
        while (nums[k] === nums[k + 1]) --k
      } else if (nums[i] + nums[j] + nums[k] < 0) {
        ++j
      } else {
        --k
      }
    }
  }
  return res
}
```

## 电话号码的字母组合

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220820214841.png)

重点是抽象出表盘, 然后组合即可

```javascript
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function (digits) {
  if (digits.length === 0) return []
  let standArr = [
    null,
    null,
    ['a', 'b', 'c'],
    ['d', 'e', 'f'],
    ['g', 'h', 'i'],
    ['j', 'k', 'l'],
    ['m', 'n', 'o'],
    ['p', 'q', 'r', 's'],
    ['t', 'u', 'v'],
    ['w', 'x', 'y', 'z']
  ]
  let res = [...standArr[digits[0]]]
  let left = 1
  while (left < digits.length) {
    let numArr = standArr[digits[left]]
    let temp = []
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < numArr.length; j++) {
        temp.push(res[i] + numArr[j])
      }
    }
    res = temp
    left++
  }
  return res
}
```

## 删除链表的倒数第 N 个结点

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220820221456.png)

重点是把链表用数组存起来, 然后注意删除头尾的情况处理

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  if (!head.next) return null
  let tempArr = []
  let current = head
  while (current) {
    tempArr.push(current)
    current = current.next
  }
  tempArr.reverse()
  if (n === 1) {
    tempArr[1].next = null
  } else if (n === tempArr.length) {
    return tempArr[n - 2]
  } else {
    tempArr[n].next = tempArr[n - 2]
  }
  return head
}
```

## 搜索旋转排序数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220821153006.png)

重点是分头尾, 并考虑好边际情况

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  if (nums.length === 0) return nums[0] === target ? 0 : -1
  let len = nums.length
  let first = nums[0]
  let last = nums[len - 1]
  if (target === first) return 0
  if (target === last) return len - 1 // 这里先判断头尾
  let index
  if (first > target) {
    // 如果头大于目标, 说明目标在后半段
    index = len - 1
    while (nums[index] > nums[index - 1]) {
      if (nums[index] === target) return index
      index--
    }
    return nums[index] === target ? index : -1
  } else {
    // 如果头小于目标, 说明目标在前半段
    index = 0
    while (nums[index] < nums[index + 1]) {
      if (nums[index] === target) return index
      index++
    }
    return nums[index] === target ? index : -1
  }
}
```

## 有效的数独

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220821182324.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220821182330.png)

综合 3x3 的判断, 以及行列的判断

```javascript
/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function (board) {
  let flag = true
  let lineIndex = 0
  let len = board.length
  while (lineIndex < len) {
    flag = isMultiple(board[lineIndex]) // 检测行
    if (!flag) return false
    lineIndex++
  }
  for (let i = 0; i < len; i++) {
    // 检查列
    let tempArr = []
    for (let j = 0; j < len; j++) {
      tempArr.push(board[j][i])
    }
    flag = isMultiple(tempArr)
    if (!flag) return false
  }
  let r = 0
  let c = 0
  while (r <= 6 && c <= 6) {
    // 检查九宫格
    let tempArr = []
    for (let i = r; i < r + 3; i++) {
      for (let j = c; j < c + 3; j++) {
        tempArr.push(board[i][j])
      }
    }
    flag = isMultiple(tempArr)
    if (!flag) return false
    if (c < 6) {
      c += 3
    } else {
      c = 0
      r += 3
    }
  }
  return flag
}
var isMultiple = function (list) {
  let temp = list.filter((item) => item !== '.')
  let tempSet = new Set(temp)
  return temp.length === [...tempSet].length
}
```

## 不同路径

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220821234117.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220821234334.png)

对于每一个格子：
走到它的路径数 = 到达它上面格子的路径数 + 到达它左面格子的路径数

```javascript
dp[i] = dp[i - 1][j] + dp[j - 1][i]
// 最后求
dp[m - 1][n - 1]
```

```javascript
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function (m, n) {
  let arr = new Array(m) //有m行
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(n).fill(0) // 有n列
  }
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 || j === 0) {
        arr[i][j] = 1 //第0行和第0列的元素 路径都是只有一条
        continue
      }
      arr[i][j] = arr[i - 1][j] + arr[i][j - 1]
    }
  }
  return arr[m - 1][n - 1]
}
```

## 两数相除

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220822152802.png)

解题思路：这题是除法, 商，公式是：(被除数-余数)÷ 除数=商，记作：被除数 ÷ 除数=商...余数，是一种数学术语。

在一个除法算式里，被除数、余数、除数和商的关系为：(被除数-余数)÷ 除数=商，记作：被除数 ÷ 除数=商...余数，
进而推导得出：商 × 除数+余数=被除数。

要求商，我们首先想到的是减法，能被减多少次，那么商就为多少，但是明显减法的效率太低

那么我们可以用位移法，因为计算机在做位移时效率特别高，向左移 1 相当于乘以 2，向右位移 1 相当于除以 2

我们可以把一个 dividend（被除数）先除以 2^n，n 最初为 31，不断减小 n 去试探,当某个 n 满足 dividend/2^n>=divisor 时，

表示我们找到了一个足够大的数，这个数\*divisor 是不大于 dividend 的，所以我们就可以减去 2^n 个 divisor，以此类推

我们可以以 100/3 为例

2^n 是 1，2，4，8...2^31 这种数，当 n 为 31 时，这个数特别大，100/2^n 是一个很小的数，肯定是小于 3 的，所以循环下来，

当 n=5 时，100/32=3, 刚好是大于等于 3 的，这时我们将 100-32\*3=4，也就是减去了 32 个 3，接下来我们再处理 4，同样手法可以再减去一个 3

所以一共是减去了 33 个 3，所以商就是 33

这其中得处理一些特殊的数，比如 divisor 是不能为 0 的，32 位数的边界 2^31

```javascript
/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
var divide = function (dividend, divisor) {
  if (dividend == 0) {
    return 0
  }
  if (dividend === -(2 ** 31) && divisor === -1) {
    return 2 ** 31 - 1
  }
  if (dividend === -(2 ** 31) && divisor === 1) {
    return -(2 ** 31)
  }
  let negative = (dividend ^ divisor) < 0
  let t = Math.abs(dividend)
  let d = Math.abs(divisor)
  let result = 0
  for (let i = 31; i >= 0; i--) {
    if (t >>> i >= d) {
      //这里不能是 >> 不然t将变为负值
      result += 1 << i
      t -= d << i
    }
  }
  return negative ? -result : result
}
```

## 旋转图像

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823002123.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823002130.png)

规律

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220822232648.png)

代码实现

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  let n = matrix.length
  if (n === 1) return matrix
  let i = 0
  // 先转置
  while (i < n) {
    let j = n - 1
    while (j > i - 1) {
      let temp = matrix[i][j]
      matrix[i][j] = matrix[j][i]
      matrix[j][i] = temp
      j--
    }
    i++
  }
  // 再左后镜像
  i = 0
  let middle = n >> 1
  while (i < n) {
    let j = 0
    while (j < middle) {
      let temp = matrix[i][j]
      matrix[i][j] = matrix[i][n - j - 1]
      matrix[i][n - j - 1] = temp
      j++
    }
    i++
  }
  return matrix
}
```

## 外观数列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823112027.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823112046.png)

```javascript
/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function (n) {
  if (n === 1) return '1'
  let i = 1
  str = '1'
  while (i < n) {
    str = transfer(str)
    i++
  }
  return str
}

var transfer = function (str) {
  let arr = str.split('')
  let resArr = [{ value: arr[0], count: 1 }]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] === arr[i - 1]) {
      resArr[0].count += 1
    } else {
      resArr.unshift({ value: arr[i], count: 1 })
    }
  }
  let res = ''
  while (resArr.length > 0) {
    let obj = resArr.pop()
    res = res + obj.count + obj.value
  }
  return res
}
```

## 下一个排列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823132509.png)
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823132522.png)

题干的意思是：找出这个数组排序出的所有数中，刚好比当前数大的那个数

比如当前 `nums = [1,2,3]`。这个数是 123，找出 1，2，3 这 3 个数字排序可能的所有数，排序后，比 123 大的那个数 也就是 132

如果当前 `nums = [3,2,1]`。这就是 1，2，3 所有排序中最大的那个数，那么就返回 1，2，3 排序后所有数中最小的那个，也就是 1，2，3 -> `[1,2,3]`

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823132608.png)

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function (nums) {
  if (nums.length === 1) return
  let len = nums.length

  let i = nums.length - 2 // 向左遍历，i从倒数第二开始是为了nums[i+1]要存在
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    // 寻找第一个小于右邻居的数
    i--
  }

  let right = len - 1
  if (i >= 0) {
    while (right >= 0 && nums[i] >= nums[right]) {
      right--
    }
    temp = nums[i]
    nums[i] = nums[right]
    nums[right] = temp
  }

  let left = i + 1
  right = len - 1

  while (left < right) {
    // i 右边的数进行翻转，使得变大的幅度小一些
    temp = nums[left]
    nums[left] = nums[right]
    nums[right] = temp
    left++
    right--
  }
}
```

## 合并有序数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823170624.png)

要求: 时间复杂度为 O(m + n)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220823175509.png)

```javascript
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  let len = m + n - 1
  m--
  n--
  while (m >= 0 && n >= 0) {
    nums1[len] = nums1[m] > nums2[n] ? nums1[m--] : nums2[n--]
    len--
  }
  if (n < 0) return
  while (n >= 0) {
    nums1[n] = nums2[n]
    n--
  }
}
```

## 字母异位词分组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220824111035.png)

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  if (strs.length === 1) return [strs]
  let i = 0
  let len = strs.length
  let keyMap = {}
  let emptyArr = []
  while (i < len) {
    let sortedStr = strs[i].split('').sort().join('') // 保证不同顺序的字母组合到同一个key
    if (sortedStr === '') {
      emptyArr.push(strs[i])
      i++
      continue
    }
    if (keyMap[sortedStr]) {
      keyMap[sortedStr].push(strs[i])
    } else {
      keyMap[sortedStr] = [strs[i]]
    }
    i++
  }
  let res = []
  for (let i in keyMap) {
    res.push(keyMap[i])
  }
  if (emptyArr.length) res.push(emptyArr) // 处理空串
  return res
}
```

## 螺旋矩阵

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220825162026.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220825162238.png)

像剥洋葱一样一层层迭代

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  if (matrix.length === 1) return matrix[0]
  let rowLen = matrix.length
  let colLen = matrix[0].length
  let row = 0
  let col = 0
  let res = []
  while (row < rowLen && col < colLen) {
    res = res.concat(traversal(matrix, row, rowLen, col, colLen))
    row++
    col++
    colLen--
    rowLen--
  }
  return res
}

var traversal = function (matrix, row, rowLen, col, colLen) {
  let res = []
  let i = row
  while (i < rowLen) {
    if (i === row) {
      let j = col
      while (j < colLen) {
        res.push(matrix[i][j])
        j++
      }
    } else if (i === rowLen - 1) {
      let j = colLen - 1
      while (j >= col) {
        res.push(matrix[i][j])
        j--
      }
    } else {
      res.push(matrix[i][colLen - 1])
    }
    i++
  }
  if (col < colLen - 1) {
    i = i - 2
    while (i > row) {
      res.push(matrix[i][col])
      i--
    }
  }
  return res
}
```

## 合并区间

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220825171609.png)

先按照第一个数字排序 然后一个个合并区间

```javascript
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  if (intervals.length === 0) return intervals
  intervals.sort((a, b) => a[0] - b[0])
  let i = 1
  let res = [intervals[0]]
  while (i < intervals.length) {
    let item = intervals[i]
    let resLast = res[res.length - 1]
    if (item[0] > resLast[1]) {
      res.push(item)
    } else {
      res[res.length - 1] = [resLast[0], Math.max(item[1], resLast[1])]
    }
    i++
  }
  return res
}
```

## 跳跃游戏

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220826160323.png)

解题思路

- nums 如果都大于 0 那一定可以跳到尾部
- 如果 `nums[i]` 等于 0 那就遍历 0 前面的数字`num[j]` 如果 `nums[j] > i - j` 证明 0 可以 `跨过`
- 检测 nums 中的每个 0 如果都可以跨过就返回 true

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  let index = nums.indexOf(0, 0)
  if (index < 0) return true
  while (index >= 0 && index < nums.length - 1) {
    let flag = false
    for (let i = index; i >= 0; i--) {
      if (nums[i] > index - i) {
        flag = true
        break
      }
    }
    if (!flag) return false
    index = nums.indexOf(0, index + 1)
  }
  return true
}
```

## 字符串转换整数 (atoi)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220826170530.png)
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220826170556.png)
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220826170717.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  let result = s.trim().match(/^[-|+]{0,1}[0-9]+/)
  if (result !== null) {
    if (result[0] > Math.pow(2, 31) - 1) {
      return Math.pow(2, 31) - 1
    }
    if (result[0] < Math.pow(-2, 31)) {
      return Math.pow(-2, 31)
    }
    return result[0]
  }
  return 0
}
```

## Pow(x, n)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220827161930.png)

采用分治的思想

注意点：此处分为两部分以后，myPow( x , n/2) _ myPow( x , n/2) === myPow(x_ x , n/2)

终止条件是 n==0 n==1 ，当 n 被分到 1 以后，直接返回 x

还要注意 n 为负数的情况

```javascript
/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function (x, n) {
  if (n === 0 || n === 1) {
    return n === 0 ? 1 : x
  } else if (n < 0) {
    return myPow(1 / x, Math.abs(n))
  } else {
    return n % 2 === 0
      ? myPow(x * x, n / 2)
      : myPow(x * x, Math.floor(n / 2)) * x
  }
}
```

## 73. 矩阵置零

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220827164204.png)

为了保证置零时不把原来的 0 冲掉 先找出全部 0 的位置 再依次置 0

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
  let zeroArr = []
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        zeroArr.push([i, j])
      }
    }
  }
  for (let i = 0; i < zeroArr.length; i++) {
    let item = zeroArr[i]
    let row = item[0]
    let col = item[1]
    for (let j = 0; j < matrix[row].length; j++) {
      matrix[row][j] = 0
    }
    for (let k = 0; k < matrix.length; k++) {
      matrix[k][col] = 0
    }
  }
}
```

## 75. 颜色分类

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220827174300.png)

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var sortColors = function (nums) {
  let len = nums.length
  let left = 0
  let right = len - 1
  let i = 0
  let temp
  while (i < len && i <= right) {
    // console.log(left, nums)
    if (nums[i] === 0) {
      temp = nums[left]
      nums[left] = nums[i]
      nums[i] = temp
      left++
      i++
    } else if (nums[i] === 1) {
      i++
    } else if (nums[i] === 2) {
      temp = nums[right]
      nums[right] = nums[i]
      nums[i] = temp
      right--
    }
  }
}
```

## 79. 单词搜索

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220828143549.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220828143603.png)

记录该元素已使用
上下左右不能超边界
如果没找到最终值的时候恢复上一个节点的值

```javascript
var exist = function (board, word) {
  //越界处理
  board[-1] = [] // 这里处理比较比较巧妙，利用了js的特性
  board.push([])

  //寻找首个字母
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      if (word[0] === board[y][x] && dfs(word, board, y, x, 0)) return true
    }
  }
  return false
}
const dfs = function (word, board, y, x, i) {
  if (i + 1 === word.length) return true
  var tmp = board[y][x]
  // 标记该元素已使用
  board[y][x] = false
  if (board[y][x + 1] === word[i + 1] && dfs(word, board, y, x + 1, i + 1))
    return true
  if (board[y][x - 1] === word[i + 1] && dfs(word, board, y, x - 1, i + 1))
    return true
  if (board[y + 1][x] === word[i + 1] && dfs(word, board, y + 1, x, i + 1))
    return true
  if (board[y - 1][x] === word[i + 1] && dfs(word, board, y - 1, x, i + 1))
    return true
  // 回溯
  board[y][x] = tmp
}
```

## 139. 单词拆分

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220829143844.png)

解题思路
将问题转化为完全背包来解决。

因为字符串列表 wordDict 中的单词可以重复使用，而且可以将 s 的长度作为背包容量，字符串列表 wordDict 中的单词可以看作物品。

确定 dp 数组定义。`dp[i]`为当字符串长度为 i 时，能否用字符串列表 wordDict 中的单词组成。

确定递推公式。只有当某一个段子字符串与字符串列表 wordDict 中的单词相同，并且这个子字符串前面的字符串也可以由字符串列表 wordDict 组成（即该子字符串的前一位，序号为 i 的字符在 dp 数组中为`dp[i]=true`）

确定数组初始化。`dp[0]=true`，否则后面无法出现 true，而且当字符串长度为 0 时，一定可以由字符串列表 wordDict 中的单词组成（不需要单词就能组成了）

确定遍历顺序。本题只需确定 s 可否由字符串列表 wordDict 中的单词组成，所以先遍历背包后遍历物品或者先遍历物品后遍历背包都可以。但是由于本题还要确定字符串是否相等，所以先遍历背包后遍历物品更加方便些，不需要重复确定 s 的子字符串与字符串列表 wordDict 中的单词是否相等。

```javascript
var wordBreak = function (s, wordDict) {
  // dp数组,表示前index为能否被拆分
  let dp = new Array(s.length + 1).fill(false)
  // 空子前缀串默认能被拆分
  dp[0] = true
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j <= i - 1; j++) {
      //存在一个字串能被拆分,并且剩余的字符串能在单词表中找到就表示当前单词能被拆分
      if (dp[j] && wordDict.indexOf(s.substring(j, i)) !== -1) dp[i] = true
    }
  }
  return dp[s.length]
}
```

## 91. 解码方法

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220831162617.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220831162621.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220831225749.png)

```javascript
var numDecodings = function (s) {
  const n = s.length
  const f = new Array(n + 1).fill(0)
  f[0] = 1
  for (let i = 1; i <= n; ++i) {
    if (s[i - 1] !== '0') {
      f[i] += f[i - 1]
    }
    if (
      i > 1 &&
      s[i - 2] != '0' &&
      (s[i - 2] - '0') * 10 + (s[i - 1] - '0') <= 26
    ) {
      f[i] += f[i - 2]
    }
  }
  return f[n]
}

numDecodings('1113312014')
```

## 98. 验证二叉搜索树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220901002133.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220901002153.png)

注意下面这种坑
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220901002237.png)

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
 * @return {boolean}
 */
var isValidBST = function (root) {
  return helper(root, -Infinity, Infinity)
}

const helper = (root, lower, upper) => {
  if (root === null) {
    return true
  }
  if (root.val <= lower || root.val >= upper) {
    return false
  }
  return (
    helper(root.left, lower, root.val) && helper(root.right, root.val, upper)
  )
}
```

## 102. 二叉树的层序遍历

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220901160354.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return []
  let res = []
  let levelNodes = [root]
  while (true) {
    let tempNodes = []
    let tempNums = []
    levelNodes.forEach((item) => {
      if (item) {
        tempNums.push(item.val)
      }
      if (item.left) {
        tempNodes.push(item.left)
      }
      if (item.right) {
        tempNodes.push(item.right)
      }
    })
    if (tempNums.length > 0) {
      res.push(tempNums)
      levelNodes = tempNodes
    }
    if (tempNodes.length === 0 || tempNums.length === 0) return res
  }
}
```

## 103. 二叉树的锯齿形层序遍历

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220901182019.png)

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
 * @return {number[][]}
 */
var zigzagLevelOrder = function (root) {
  if (!root) return []
  let res = []
  let levelNodes = [root]
  isFromLeft = true
  while (true) {
    let tempNodes = []
    let tempNums = []
    levelNodes.forEach((item) => {
      if (item) {
        tempNums.push(item.val)
      }
    })
    if (!isFromLeft) levelNodes.reverse()
    levelNodes.forEach((item) => {
      if (item.left) {
        tempNodes.push(item.left)
      }
      if (item.right) {
        tempNodes.push(item.right)
      }
    })
    if (tempNums.length > 0) {
      res.push(tempNums)
      levelNodes = tempNodes
    }
    if (isFromLeft) {
      levelNodes.reverse()
    }
    isFromLeft = !isFromLeft
    if (tempNodes.length === 0 || tempNums.length === 0) return res
  }
}
```

## 105. 从前序与中序遍历序列构造二叉树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220901233923.png)

思路:
preorder 第一个元素为 root，在 inorder 里面找到 root，在它之前的为左子树（长 l1），之后为右子树（长 l2）。preorder[1]到 preorder[l1]为左子树,之后为右子树，分别递归。

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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  if (preorder.length === 0) return null
  if (preorder.length === 1) {
    return new TreeNode(preorder[0])
  }
  let rootNum = preorder[0]
  let rootIndex = inorder.findIndex((item) => item === rootNum)
  let root = new TreeNode(preorder[0])
  root.left = buildTree(
    preorder.slice(1, 1 + rootIndex),
    inorder.slice(0, rootIndex)
  )
  root.right = buildTree(
    preorder.slice(1 + rootIndex),
    inorder.slice(rootIndex + 1)
  )
  return root
}
```

## 116. 填充每个节点的下一个右侧节点指针

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220902161742.png)
![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220902161750.png)

```javascript
/**
 * @param {Node} root
 * @return {Node}
 */
var connect = function (root) {
  if (!root) return null
  let levelNodes = [root]
  while (true) {
    for (let i = 0; i < levelNodes.length; i++) {
      if (i < levelNodes.length - 1) {
        levelNodes[i].next = levelNodes[i + 1]
      } else {
        levelNodes[i].next = null
      }
    }
    let tempNodes = []
    levelNodes.forEach((item) => {
      if (item.left) {
        tempNodes.push(item.left)
      }
      if (item.right) {
        tempNodes.push(item.right)
      }
    })
    levelNodes = tempNodes
    if (levelNodes.length === 0) return root
  }
}
```

## 122. 买卖股票的最佳时机 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220902171543.png)

[7, 1, 5, 6] 第二天买入，第四天卖出，收益最大（6-1），所以一般人可能会想，怎么判断不是第三天就卖出了呢? 这里就把问题复杂化了，根据题目的意思，当天卖出以后，当天还可以买入，所以其实可以第三天卖出，第三天买入，第四天又卖出（（5-1）+ （6-5） === 6 - 1）。所以算法可以直接简化为只要今天比昨天大，就卖出。

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let res = 0
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      res += prices[i] - prices[i - 1]
    }
  }
  return res
}
```

### 动态规划

```javascript
// 状态：持有现金dp[i][0]、持有股票dp[i][1]；
// 如果持有现金，则可能昨天也持有现金dp[i-1][0]或者昨天持有股票并卖出，取得收益dp[i-1][1]+prices[i];
// 如果持有股票，则可能昨天也持有股票dp[i-1][1]或者昨天花掉现金，买入股票dp[i-1][0]-prices[i];

var maxProfit = function (prices) {
  let len = prices.length
  if (len === 1) return 0
  const dp = new Array(len).fill().map(() => new Array(2))
  dp[0][0] = 0 // 持有现金
  dp[0][1] = -prices[0] // 持有股票
  for (let i = 1; i < len; i++) {
    dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i])
    dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i])
  }
  return dp[len - 1][0]
}

maxProfit([7, 1, 5, 3, 6, 4])
// dp
// [ [ 0, -7 ], [ 0, -1 ], [ 4, -1 ], [ 4, 1 ], [ 7, 1 ], [ 7, 3 ] ]
```

## 128. 最长连续序列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220902224721.png)

```javascript
var longestConsecutive = function (nums) {
  let map = {}
  let res = 0
  nums = new Set(nums)
  for (let value of nums) {
    // 从最小的开始查找
    // 从没有比自己小1的数开始查找连续序列
    if (nums.has(value - 1)) continue
    let curr = value
    while (nums.has(curr + 1)) {
      nums.delete(curr + 1)
      curr++
    }
    res = Math.max(res, curr - value + 1)
  }
  return res
}
```

## 131. 分割回文串

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220903011934.png)

```javascript
/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function (s) {
  let resArr = [[s[0]]]
  let len = s.length
  let allArr = [[[s[0]]]]
  for (let i = 1; i < len; i++) {
    let temp = []
    resArr.forEach((item) => {
      temp.push([...item, s[i]])
    })
    for (let j = i - 1; j >= 0; j--) {
      let str = s.substring(j, i + 1)
      if (isValid(str)) {
        if (j === 0) {
          temp.push([s.slice(0, i + 1)])
          break
        }
        for (let k = 0; k < allArr[j - 1].length; k++) {
          temp.push([...allArr[j - 1][k], str])
        }
      }
    }
    allArr.push(temp)
    resArr = temp
  }
  return resArr
  // console.log(allArr)
}
var isValid = function (s) {
  let left = 0
  let right = s.length - 1
  while (left < right) {
    if (s[left] === s[right]) {
      left++
      right--
    } else {
      return false
    }
  }
  return true
}
```

## 130. 被围绕的区域

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220903163823.png)

```javascript
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solve = function (board) {
  if (board.length < 3) return
  let mlen = board.length
  let nlen = board[0].length

  for (let i = 1; i < nlen - 1; i++) {
    //上下边
    if (board[0][i] === 'O') {
      check(board, 0, i)
    }
    if (board[mlen - 1][i] === 'O') {
      check(board, mlen - 1, i)
    }
  }
  for (let i = 1; i < mlen - 1; i++) {
    //左右边
    if (board[i][0] === 'O') {
      check(board, i, 0)
    }
    if (board[i][nlen - 1] === 'O') {
      check(board, i, nlen - 1)
    }
  }

  for (let i = 0; i < mlen; i++) {
    for (let j = 0; j < nlen; j++) {
      if (isNotEdge(board, i, j)) board[i][j] = 'X'
      if (board[i][j] === 'B') board[i][j] = 'O' // B表示与边界线连通 所以不会被置为X
    }
  }
}
var check = function (board, m, n) {
  // 检查每个格子的上下左右 如果与边界联通就置为B
  if (isNotEdge(board, m, n)) board[m][n] = 'B'
  if (m - 1 >= 0 && isNotEdge(board, m - 1, n)) {
    check(board, m - 1, n)
  }
  if (m + 1 < board.length && isNotEdge(board, m + 1, n)) {
    check(board, m + 1, n)
  }
  if (n - 1 >= 0 && isNotEdge(board, m, n - 1)) {
    check(board, m, n - 1)
  }
  if (n + 1 < board[0].length && isNotEdge(board, m, n + 1)) {
    check(board, m, n + 1)
  }
}

var isNotEdge = function (board, m, n) {
  return (
    board[m][n] === 'O' &&
    m !== 0 &&
    m < board.length - 1 &&
    n !== 0 &&
    n < board[0].length - 1
  )
}
```

## 148. 排序链表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220903165632.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220903165659.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var sortList = function (head) {
  if (!head) return null
  let current = head
  let nodeArr = [current]
  while (current.next) {
    current = current.next
    nodeArr.push(current)
  }
  nodeArr.sort((a, b) => {
    return a.val - b.val
  })
  let root = nodeArr[0]
  current = root
  for (let i = 1; i < nodeArr.length; i++) {
    current.next = nodeArr[i]
    current = nodeArr[i]
  }
  current.next = null
  return root
}

sortList(root)
```

## 134. 加油站

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220903223952.png)

```javascript
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function (gas, cost) {
  let len = gas.length
  for (let i = 0; i < len; i++) {
    if (gas[i] >= cost[i]) {
      let tank = gas[i] - cost[i]
      let j = i + 1 > len - 1 ? 0 : i + 1
      while (j !== i) {
        tank += gas[j]
        tank -= cost[j]
        if (tank < 0) break
        j = j + 1 > len - 1 ? 0 : j + 1
      }
      if (i === j) return i
    }
  }
  return -1
}
```

优化

```javascript
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function (gas, cost) {
  let len = gas.length
  let temp = []
  for (let i = 0; i < len; i++) {
    if (gas[i] >= cost[i]) temp.push(i)
  }
  temp.sort((a, b) => {
    return gas[b] - cost[b] - (gas[a] - cost[a])
  })
  for (const i of temp) {
    let tank = gas[i] - cost[i]
    let j = i + 1 > len - 1 ? 0 : i + 1
    while (j !== i) {
      tank += gas[j]
      tank -= cost[j]
      if (tank < 0) break
      j = j + 1 > len - 1 ? 0 : j + 1
    }
    if (i === j) return i
  }
  return -1
}
```

## 138. 复制带随机指针的链表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220904130227.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220904130237.png)

```javascript
/**
 * @param {Node} head
 * @return {Node}
 */
var copyRandomList = function (head) {
  if (!head) return null
  let arr = [head]
  let current = head
  while (current.next) {
    current = current.next
    arr.push(current)
  }
  let root = new Node(head.val)
  current = root
  let resArr = [root]
  for (let i = 1; i < arr.length; i++) {
    let node = new Node(arr[i].val)
    current.next = node
    current = node
    resArr.push(node)
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].random === null) {
      resArr[i].random = null
    } else {
      let index = arr.findIndex((node) => node === arr[i].random)
      resArr[i].random = resArr[index]
    }
  }
  return root
}
```

## 146. LRU 缓存

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220904154544.png)

注意取一次后 这个数也要排到最近使用过

```javascript
/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
  this.cache = new Array()
  this.len = capacity
}

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
  let index = this.cache.findIndex((item) => {
    return item.key === key
  })
  if (index > -1) {
    let item = this.cache[index]
    this.cache.splice(index, 1)
    this.cache.push(item)
    return item.value
  } else {
    return -1
  }
}

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
  let index = this.cache.findIndex((item) => {
    return item.key === key
  })
  if (index > -1) {
    this.cache[index].value = value
    let item = this.cache[index]
    this.cache.splice(index, 1)
    this.cache.push(item)
  } else {
    this.cache.push({ key, value })
    if (this.cache.length > this.len) {
      this.cache.shift()
    }
  }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
```

## 150. 逆波兰表达式求值

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905105249.png)

```javascript
/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function (tokens) {
  let operator = ['+', '-', '*', '/']
  let i = 0
  while (tokens.length > 1) {
    if (operator.includes(tokens[i])) {
      tokens = calculate(tokens, i)
      i -= 2
    } else {
      i++
    }
  }
  return tokens[0]
}

var calculate = function (tokens, i) {
  let operator = tokens[i]
  let num1 = tokens[i - 2]
  let num2 = tokens[i - 1]
  let num = parseInt(eval(num1 + ' ' + operator + ' ' + num2))
  tokens.splice(i - 2, 3, String(num))
  return tokens
}
```

## 152. 乘积最大子数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905112452.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function (nums) {
  if (nums.length === 1) return nums[0]
  let len = nums.length
  let i = 0
  let max = -Infinity
  while (i < len) {
    let temp = nums[i]
    max = Math.max(max, temp)
    let j = i + 1
    while (j < len) {
      temp *= nums[j]
      max = Math.max(max, temp)
      j++
    }
    i++
  }
  return max
}
```

## 162. 寻找峰值

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905134540.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905134152.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905134524.png)

```javascript
var findPeakElement = function (nums) {
  const n = nums.length
  let left = 0,
    right = n - 1,
    ans = -1
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (compare(nums, mid - 1, mid) < 0 && compare(nums, mid, mid + 1) > 0) {
      ans = mid
      break
    }
    if (compare(nums, mid, mid + 1) < 0) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return ans
}

// 辅助函数，输入下标 i，返回一个二元组 (0/1, nums[i])
// 方便处理 nums[-1] 以及 nums[n] 的边界情况
const get = (nums, idx) => {
  if (idx === -1 || idx === nums.length) {
    return [0, 0]
  }
  return [1, nums[idx]]
}

const compare = (nums, idx1, idx2) => {
  const num1 = get(nums, idx1)
  const num2 = get(nums, idx2)
  if (num1[0] !== num2[0]) {
    return num1[0] > num2[0] ? 1 : -1
  }
  if (num1[1] === num2[1]) {
    return 0
  }
  return num1[1] > num2[1] ? 1 : -1
}
```

## 172. 阶乘后的零

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905144351.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905144424.png)

说白了就是统计 5 的个数

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var trailingZeroes = function (n) {
  let count = 0
  while (n >= 5) {
    let num = parseInt(n / 5)
    count += num
    n = num
  }
  return count
}
```

## 179. 最大数

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905202450.png)

```javascript
/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function (nums) {
  let len = nums.length
  for (let i = 0; i < len; i++) {
    nums[i] = String(nums[i])
  }
  nums.sort((a, b) => {
    return b + a - (a + b) // 谁放前面大 谁就排前面
  })
  let res = nums.join('')
  while (res[0] === '0' && res.length > 1) {
    //去掉先导0
    res = res.substring(1)
  }
  return res
}
```

优化

```javascript
/**
 * @param {number[]} nums
 * @return {string}
 */
var largestNumber = function (nums) {
  nums.sort((a, b) => {
    return b + '' + a - (a + '' + b) // 谁放前面大 谁就排前面
  })
  let res = nums.join('')
  while (res[0] === '0' && res.length > 1) {
    //去掉先导0
    res = res.substring(1)
  }
  return res
}
```

## 166. 分数到小数

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220905204940.png)

```javascript
/**
 * @param {number} numerator
 * @param {number} denominator
 * @return {string}
 */
var fractionToDecimal = function (numerator, denominator) {
  if (!numerator) return '0'
  // 归一整数
  let sign = Math.sign(numerator) * Math.sign(denominator) > 0 ? '' : '-'
  numerator = Math.abs(numerator)
  denominator = Math.abs(denominator)
  // 处理整除情况
  let str = ''
  let reset = Math.floor(numerator / denominator)
  numerator %= denominator
  if (!numerator) return sign + reset + '' // 除尽了
  // 寻找重复的循环
  let index = 0
  let map = {}
  let result = reset + '.'
  while (map[numerator] === undefined) {
    // 没找到之前的除式
    map[numerator] = index++ // 记录除数位置
    numerator *= 10
    str += Math.floor(numerator / denominator)
    numerator %= denominator
    if (!numerator) return sign + result + str // 除尽了
  }
  let pos = map[numerator]
  return `${sign}${result}${str.slice(0, pos)}(${str.slice(pos)})`
}
```

## 189. 轮转数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906161605.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
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

## 198. 打家劫舍

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906175238.png)

根据题意, 每个小屋只有偷或者不偷两种互斥状态
所以状态转移方程为

```shell
dp[i] = Math.max(dp[i-2]+ nums[i], dp[i-1])

```

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
  let len = nums.length
  if (len === 1) return nums[0]
  let dp = new Array(len)
  dp[0] = nums[0]
  dp[1] = Math.max(nums[0], nums[1])
  for (let i = 2; i < len; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1])
  }
  return dp[len - 1]
}
```

## 200. 岛屿数量

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906205621.png)

```javascript
/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
  let mlen = grid.length
  let nlen = grid[0].length
  let count = 0
  for (let i = 0; i < mlen; i++) {
    for (let j = 0; j < nlen; j++) {
      if (grid[i][j] === '1') {
        check(grid, i, j)
        count++
      }
    }
  }
  return count
}

var check = function (grid, m, n) {
  // 检查每个格子的上下左右 将联通的全部置为B
  grid[m][n] = 'B'
  if (m - 1 >= 0 && grid[m - 1][n] === '1') {
    check(grid, m - 1, n)
  }
  if (m + 1 < grid.length && grid[m + 1][n] === '1') {
    check(grid, m + 1, n)
  }
  if (n - 1 >= 0 && grid[m][n - 1] === '1') {
    check(grid, m, n - 1)
  }
  if (n + 1 < grid[0].length && grid[m][n + 1] === '1') {
    check(grid, m, n + 1)
  }
}
```

## 202. 快乐数

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220906211454.png)

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function (n) {
  let mySet = new Set()
  while (n !== 1 && !mySet.has(n)) {
    mySet.add(n)
    n = happy(n)
  }
  return n === 1
}

var happy = function (n) {
  let str = n + ''
  let res = 0
  for (let i = 0; i < str.length; i++) {
    const num = str[i]
    res += Math.pow(num, 2)
  }
  return res
}
```

## 207. 课程表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220907154911.png)

```javascript
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
  // 课程表问题，是一种拓扑排序问题。可参考210题目，但此题只需要返回是否可以修完的布尔值
  //  BFS遍历，关键是构造邻接表和找到初始未依赖的课程编号
  const graph = {}
  const degree = new Array(numCourses).fill(0)
  // 采用邻接表来保存课程的依赖关系，并且记录被依赖课程的先导次数
  for (const it of prerequisites) {
    if (graph[it[0]] === undefined) graph[it[0]] = [it[1]]
    else graph[it[0]].push(it[1])
    degree[it[1]]++
  }
  //degree[i]为0，表示该课程不属于任何课程的先导课
  // 则需要将这些课程编号入栈
  const stack = []
  for (let i = 0; i < numCourses; i++) {
    if (degree[i] === 0) stack.push(i)
  }
  let cnt = 0
  while (stack.length) {
    const c = stack.pop()
    cnt++
    for (const pre of graph[c] || [c]) {
      // 注意下面degree[pre]可能为负数，但是不影响结果
      degree[pre]--
      if (degree[pre] === 0) {
        stack.push(pre)
      }
    }
  }
  return cnt === numCourses
}
```

## 215. 数组中的第 K 个最大元素

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220907171438.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  let resArr = new Array(k).fill(-Infinity)
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > resArr[k - 1]) {
      let insetIndex = resArr.findIndex((num) => {
        return nums[i] > num
      })
      resArr.splice(insetIndex, 0, nums[i])
      resArr.pop()
    }
  }
  return resArr[k - 1]
}
```

## 204. 计数质数

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220907174727.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220907174739.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function (n) {
  const isPrime = new Array(n).fill(1)
  let ans = 0
  for (let i = 2; i < n; ++i) {
    if (isPrime[i]) {
      ans += 1
      for (let j = i * i; j < n; j += i) {
        isPrime[j] = 0
      }
    }
  }
  return ans
}
```

## 210. 课程表 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908001927.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908001938.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908001946.png)

```javascript
var findOrder = (numCourses, prerequisites) => {
  let inDegree = new Array(numCourses).fill(0) // 初始化入度数组
  let graph = {} // 哈希表
  for (let i = 0; i < prerequisites.length; i++) {
    inDegree[prerequisites[i][0]]++ // 构建入度数组
    if (graph[prerequisites[i][1]]) {
      // 构建哈希表
      graph[prerequisites[i][1]].push(prerequisites[i][0])
    } else {
      let list = []
      list.push(prerequisites[i][0])
      graph[prerequisites[i][1]] = list
    }
  }
  let res = [] // 结果数组
  let queue = [] // 存放 入度为0的课
  for (let i = 0; i < numCourses; i++) {
    // 起初推入所有入度为0的课
    if (inDegree[i] === 0) queue.push(i)
  }
  while (queue.length) {
    // 没有了入度为0的课，没课可选，结束循环
    let cur = queue.shift() // 出栈，代表选这门课
    res.push(cur) // 推入结果数组
    let toEnQueue = graph[cur] // 查看哈希表，获取对应的后续课程
    if (toEnQueue && toEnQueue.length) {
      // 确保有后续课程
      for (let i = 0; i < toEnQueue.length; i++) {
        // 遍历后续课程
        inDegree[toEnQueue[i]]-- // 将后续课程的入度 -1
        if (inDegree[toEnQueue[i]] == 0) {
          // 一旦减到0，让该课入列
          queue.push(toEnQueue[i])
        }
      }
    }
  }
  return res.length === numCourses ? res : [] // 选齐了就返回res，否则返回[]
}
```

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908002008.png)

## 230. 二叉搜索树中第 K 小的元素

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908150125.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908150136.png)

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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
  let arr = check(root, k)
  return arr[k - 1]
}

// 中序遍历
var check = function (node, k) {
  let res = []
  if (node.left) {
    res = [...check(node.left, k)]
  }
  if (res.length >= k) return res // 如果元素个数大于K 就return
  res = [...res, node.val]
  if (node.right) {
    res = [...res, ...check(node.right, k)]
  }
  return res
}
```

## 227. 基本计算器 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908164337.png)

```javascript
var calculate = function (s) {
  let stack = [],
    n = 0,
    sign = '+'
  for (let i = 0; i <= s.length; i++) {
    const ch = s[i]
    if (ch === ' ') continue
    if (ch >= '0' && ch <= '9') {
      n = 10 * n + parseInt(ch)
      continue
    }
    // 先把乘除法给计算了，stack 中只要相加就是最终结果了
    // 还用 ~~ 替代 Math.floor
    switch (sign) {
      case '+':
        stack.push(n)
        break
      case '-':
        stack.push(-n)
        break
      case '*':
        stack.push(n * stack.pop())
        break
      case '/':
        stack.push(parseInt(stack.pop() / n))
        break
    }
    n = 0
    sign = ch
  }
  // 最后 stack 中的元素只要加起来就行了
  return stack.reduce((pre, cur) => pre + cur, 0)
}
```

## 236. 二叉树的最近公共祖先

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908172129.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908172138.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  let current = root
  while (current && findNode(current, p) && findNode(current, q)) {
    if (
      current.left &&
      findNode(current.left, p) &&
      findNode(current.left, q)
    ) {
      current = current.left
    } else if (
      current.right &&
      findNode(current.right, p) &&
      findNode(current.right, q)
    ) {
      current = current.right
    } else {
      return current
    }
  }
}

var findNode = function (root, node) {
  let flag = false
  if (root === node) return true
  if (root.left) flag = findNode(root.left, node)
  if (root.right) flag = flag || findNode(root.right, node)
  return flag
}
```

## 237. 删除链表中的节点

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908184105.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908184114.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} node
 * @return {void} Do not return anything, modify node in-place instead.
 */
var deleteNode = function (node) {
  let current = node
  while (current.next) {
    current.val = current.next.val
    current = current.next
  }
  current.next = null
}
```

## 238. 除自身以外数组的乘积

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908201622.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function (nums) {
  const res = Array(nums.length).fill(1)
  let temp = 1
  for (let i = 0; i < nums.length; i++) {
    res[i] = temp * res[i]
    temp = temp * nums[i]
  }

  // 此时res = [1,2,4,12]   res[i] 为前 i-1 位的乘积

  temp = 1 // temp为 后 i位的乘积
  for (let i = nums.length - 1; i >= 0; i--) {
    res[i] = temp * res[i]
    temp = temp * nums[i]
  }
  return res
}

productExceptSelf([2, 2, 3, 4])
```

## 240. 搜索二维矩阵 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908222256.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908222304.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220908222322.png)

## 279. 完全平方数

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220909112904.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220909113520.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var numSquares = function (n) {
  let dp = new Array(n)
  dp[0] = 0
  dp[1] = 1
  for (let i = 2; i <= n; i++) {
    dp[i] = i // 最坏的情况就是每次+1
    for (let j = 1; i - j * j >= 0; j++) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1) // 状态转移方程
    }
  }
  return dp[n]
}
```

## 287. 寻找重复数

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220909154054.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function (nums) {
  let l = 1
  let r = nums.length - 1
  while (l < r) {
    let mid = (l + r) >> 1
    let cnt = 0
    for (let i = 0; i < nums.length; i++) {
      cnt += nums[i] <= mid //‘nums <= mid’ 返回布尔值，经过‘+=’自动类型转换返回数字1，实现判断的同时实现计数
    }
    if (cnt <= mid) {
      l = mid + 1
    } else {
      r = mid
    }
  }
  return r
}
```

## 289. 生命游戏

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220909161419.png)

```javascript
/**
 * @param {number[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var gameOfLife = function (board) {
  let changArr = []
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === 0) {
        if (!live(board, i, j, false)) changArr.push([i, j, 1])
      } else {
        if (!live(board, i, j, true)) changArr.push([i, j, 0])
      }
    }
  }
  for (let i = 0; i < changArr.length; i++) {
    let item = changArr[i]
    board[item[0]][item[1]] = item[2]
  }
}

// 检测是否能保持当前状态 能则返回true
var live = function (board, m, n, isAlive) {
  // 检查每个格子的上下左右对角线 活细胞数量
  let count = 0
  if (m - 1 >= 0) {
    if (board[m - 1][n] === 1) count++
  }
  if (m + 1 < board.length) {
    if (board[m + 1][n] === 1) count++
  }
  if (n - 1 >= 0) {
    if (board[m][n - 1] === 1) count++
  }
  if (n + 1 < board[0].length) {
    if (board[m][n + 1] === 1) count++
  }
  if (m - 1 >= 0 && n - 1 >= 0) {
    if (board[m - 1][n - 1] === 1) count++
  }
  if (m + 1 < board.length && n - 1 >= 0) {
    if (board[m + 1][n - 1] === 1) count++
  }
  if (m - 1 >= 0 && n + 1 < board[0].length) {
    if (board[m - 1][n + 1] === 1) count++
  }
  if (m + 1 < board.length && n + 1 < board[0].length) {
    if (board[m + 1][n + 1] === 1) count++
  }
  return isAlive ? [2, 3].includes(count) : count !== 3
}
```

## 300. 最长递增子序列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220909182755.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220909182810.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  let res = 1
  let dp = new Array(nums.length).fill(1)
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j] + 1)
    }
    if (dp[i] > res) res = dp[i] // 取长的子序列
  }
  return res
}
```

## 328. 奇偶链表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220910152915.png)

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var oddEvenList = function (head) {
  if (!head || !head.next || !head.next.next) return head //如果节点数为0 1或 2
  let evenHead = head.next // 偶数节点头
  let current = head
  let tail = head // 奇数节点的尾巴
  let isEven = false
  while (current.next) {
    let nextNode = current.next
    current.next = current.next.next
    tail = isEven ? nextNode : current
    current = nextNode
    isEven = !isEven
  }
  tail.next = evenHead
  return head
}
```

## 322. 零钱兑换

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220910161212.png)

动态规划 `dp[i]` 表示 i 金额 需要的最少金币数

```javascript
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  if (amount === 0) return 0
  let dp = new Array(amount + 1).fill(Infinity)
  for (let i = 1; i <= amount; i++) {
    if (coins.includes(i)) dp[i] = 1
    for (let j = 1; j <= i - 1; j++) {
      dp[i] = Math.min(dp[i], dp[j] + dp[i - j])
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount]
}
```

## 347. 前 K 个高频元素

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220911173448.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function (nums, k) {
  nums.sort((a, b) => a - b)
  const map = new Map()
  const resArr = []
  let i = 0
  while (i < nums.length) {
    let temp = nums[i]
    let j = i + 1
    while (nums[j] === temp) {
      j++
    }
    let frequent = j - i
    if (resArr.length < k) {
      insetNum(resArr, map, temp, frequent, false)
    } else {
      if (frequent > map.get(resArr[resArr.length - 1])) {
        insetNum(resArr, map, temp, frequent, true)
      }
    }
    i = j
  }
  return resArr
}

var insetNum = function (resArr, map, num, frequent, deleteNum) {
  let index = resArr.findIndex((n) => {
    return frequent > map.get(n)
  })
  if (index === -1) {
    resArr.push(num)
  } else {
    resArr.splice(index, 0, num)
    if (deleteNum) resArr.pop()
  }
  map.set(num, frequent)
}
```

## 371. 两整数之和

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220911174143.png)

两个整数 a, b; `a ^ b` 是无进位的相加； `a & b` 得到每一位的进位；让无进位相加的结果与进位不断的异或， 直到进位为 0；

```javascript
var getSum = function (a, b) {
  while (b != 0) {
    const carry = (a & b) << 1
    a = a ^ b
    b = carry
  }
  return a
}
```

## 378. 有序矩阵中第 K 小的元素

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220911181652.png)

内存复杂度 O(n2) 不满足题意, 先放着, 等想到更好的办法再回头做

```javascript
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (matrix, k) {
  return matrix.flat().sort((a, b) => a - b)[k - 1]
}
```

## 380. O(1) 时间插入、删除和获取随机元素

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220911182927.png)

```javascript
var RandomizedSet = function () {
  this.set = new Set()
}

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function (val) {
  if (this.set.has(val)) return false
  this.set.add(val)
  return true
}

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function (val) {
  if (!this.set.has(val)) return false
  this.set.delete(val)
  return true
}

/**
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function () {
  let arr = [...this.set.values()]
  let index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
```

## 384. 打乱数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220911200559.png)

```javascript
/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
  this.copy = [...nums]
  this.list = nums
}

/**
 * @return {number[]}
 */
Solution.prototype.reset = function () {
  this.list = [...this.copy]
  return this.list
}

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function () {
  const shuffled = new Array(this.list.length).fill(0)
  const nums = []
  this.list.forEach((num) => nums.push(num))
  for (let i = 0; i < this.list.length; ++i) {
    const j = Math.random() * nums.length
    shuffled[i] = nums.splice(j, 1)
  }
  this.list = shuffled.slice()
  return this.list
}

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */
```

## 395. 至少有 K 个重复字符的最长子串

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220912114020.png)

```javascript
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var longestSubstring = function (s, k) {
  let map = {}
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = map[s[i]] ? map[s[i]] + 1 : 1
  }
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]] < k) {
      let l = longestSubstring(s.substring(0, i), k)
      let r = longestSubstring(s.substring(i + 1), k)
      return Math.max(l, r)
    }
  }
  return s.length
}
```

## 454. 四数相加 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220912134816.png)

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number[]} nums3
 * @param {number[]} nums4
 * @return {number}
 */
var fourSumCount = function (nums1, nums2, nums3, nums4) {
  let map12 = {} // 记录nums1和nums2的和的map
  let map34 = {} // 记录nums3和nums4的和的map
  let len = nums1.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      let num12 = nums1[i] + nums2[j]
      map12[num12] = map12[num12] ? map12[num12] + 1 : 1
      let num34 = nums3[i] + nums4[j]
      map34[num34] = map34[num34] ? map34[num34] + 1 : 1
    }
  }
  let res = 0
  let keys12 = Object.keys(map12)
  let keys34 = Object.keys(map34)
  for (let i = 0; i < keys12.length; i++) {
    for (let j = 0; j < keys34.length; j++) {
      // 如果两组的和加起来正好为0 则将两组的组合数量计入结果
      if (Number(keys12[i]) + Number(keys34[j]) === 0) {
        res += map12[keys12[i]] * map34[keys34[j]]
      }
    }
  }
  return res
}
```

## 334. 递增的三元子序列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220912142915.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220912142933.png)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var increasingTriplet = function (nums) {
  let a = Infinity
  let b = Infinity
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < a) {
      a = nums[i]
    } else if (nums[i] <= b) {
      b = nums[i]
    } else {
      return true
    }
  }
  return false
}
```

## 324. 摆动排序 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220912184133.png)

```javascript
var wiggleSort = function (nums) {
  nums.sort((a, b) => b - a)
  const mid = nums.length >> 1
  for (let i = 0; i < mid; i++) {
    nums.splice(2 * i, 0, nums.splice(mid + i, 1)[0])
  }
}
```

## 114. 二叉树展开为链表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220913173801.png)

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
 * @return {void} Do not return anything, modify root in-place instead.
 */
var flatten = function (root) {
  let arr = []
  search(root, arr)
  for (let i = 0; i < arr.length; i++) {
    arr[i].left = null
    if (i !== arr.length - 1) {
      arr[i].right = arr[i + 1]
    } else {
      arr[i].right = null
    }
  }
}

var search = function (root, arr) {
  if (!root) return
  arr.push(root)
  search(root.left, arr)
  search(root.right, arr)
}
```

## 221. 最大正方形

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220914121411.png)

```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function (matrix) {
  let m = matrix.length
  let n = matrix[0].length
  // left[i][j]表示在这个点的左边有多少个连续1
  let left = new Array(m).fill().map(() => {
    return new Array(n).fill(0)
  })
  let isAllZero = true
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === '0') {
        left[i][j] = 0
      } else {
        isAllZero = false
        left[i][j] = (left[i][j - 1] || 0) + parseInt(matrix[i][j])
      }
    }
  }
  if (isAllZero) return 0 //如果全是 ‘0’ 返回0
  let ans = 1
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === '1') {
        let k = i
        let min = 1
        let temp = [left[i][j]]
        // 以这个点为矩形右下角 满足以下条件的话 向上累加边长
        // 可以往上累加1的条件是
        // 边界内 值为 ‘1’ 向上几步 left对应的值就必须大于几  下面的也要能满足大余步数
        while (
          k - 1 > -1 &&
          matrix[k - 1][j] === '1' &&
          left[k - 1][j] > i - k + 1 &&
          temp.every((num) => num > min)
        ) {
          k--
          min++
          temp.push(left[k][j])
        }

        if (i - k + 1 >= 2) {
          // 如果正方形边大于等于2
          ans = Math.max(ans, Math.pow(i - k + 1, 2))
        }
      }
    }
  }
  return ans
}
```

## 337. 打家劫舍 III

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220914215540.png)

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
 * @return {number}
 */
var rob = function (root) {
  changeTree(root)
  return root.val
}

// 遍历树
var changeTree = function (root) {
  let l = 0
  let lside = 0
  let r = 0
  let rside = 0
  if (root.left) {
    changeTree(root.left)
    l = root.left.val
    lside = root.left.side
  }
  if (root.right) {
    changeTree(root.right)
    r = root.right.val
    rside = root.right.side
  }
  root.side = l + r
  root.val = Math.max(lside + rside + root.val, root.side)
}
```

## 394. 字符串解码

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220915111139.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function (s) {
  let nums = []
  let i = 0
  while (i < s.length) {
    if (/[0-9]/.test(s[i])) {
      let temp = [i]
      while (s[i] !== '[') {
        i++
      }
      temp.push(i)
      nums.push(temp)
    }
    i++
  }
  while (nums.length) {
    let [start, end] = nums.pop()
    let count = s.substring(start, end)
    let letterEnd = end
    while (s[letterEnd] !== ']') {
      letterEnd++
    }
    let temp = ''
    while (count > 0) {
      temp += s.substring(end + 1, letterEnd)
      count--
    }
    s = s.substring(0, start) + temp + s.substring(letterEnd + 1)
  }
  return s
}
```

## 406. 根据身高重建队列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220915144405.png)

```javascript
/**
 * @param {number[][]} people
 * @return {number[][]}
 */
var reconstructQueue = function (people) {
  people.sort((a, b) => {
    return b[0] - a[0] || a[1] - b[1] // 按照高度降序排 如果高度一样 按前面的数量升序排
  })

  // 遍历 如果当前人高度和前面不一致 裁切下来 插入到people[i][1] 的位置
  for (let i = 1; i < people.length; i++) {
    if (people[i][0] !== people[i - 1][0]) {
      let item = people.splice(i, 1)[0]
      people.splice(item[1], 0, item)
    }
  }

  return people
}
```

## 647. 回文子串

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220915160332.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function (s) {
  let dp = new Array(s.length).fill(1)

  for (let i = 1; i < s.length; i++) {
    // 当前子串等于 dp[i - 1] 加 本身 也就是1
    dp[i] = dp[i - 1] + 1

    // 检查包含s[i]的子串 如果有效就+1
    for (let j = i - 1; j >= 0; j--) {
      if (isValid(s.substring(j, i + 1))) {
        dp[i] += 1
      }
    }
  }
  return dp[s.length - 1]
}

var isValid = function (s) {
  if (s.length === 0) return true
  let left = 0
  let right = s.length - 1
  while (left < right) {
    if (s[left] !== s[right]) return false
    left++
    right--
  }
  return true
}
```

## 438. 找到字符串中所有字母异位词

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220916163113.png)

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  if (s.length < p.length) return []
  let dp = new Array(s.length).fill(false)
  let pLen = p.length
  let i = 0
  while (i < s.length - pLen + 1) {
    // 如果挪动一位的前一位和后一位正好相同 则直接赋值上一位的结果
    if (s[i + pLen - 1] === s[i - 1]) {
      dp[i] = dp[i - 1]
      i++
      continue
    }
    let diff = isMatch(s.substring(i, i + pLen), p)
    // 匹配上了
    if (diff === 0) {
      dp[i] = true
      i++
      // 差一位字母没匹配上
    } else if (diff === 1) {
      i++
      // 差 大于2位至少得挪动 diff >> 1 位
    } else {
      i += diff >> 1
    }
  }

  let ans = []
  for (let i = 0; i < dp.length; i++) {
    if (dp[i]) ans.push(i)
  }
  return ans
}

var isMatch = function (s1, s2) {
  let map1 = new Map()
  let map2 = new Map()
  for (let i = 0; i < s1.length; i++) {
    map1.set(s1[i], map1.has(s1[i]) ? map1.get(s1[i]) + 1 : 1)
  }
  for (let i = 0; i < s2.length; i++) {
    map2.set(s2[i], map2.has(s2[i]) ? map2.get(s2[i]) + 1 : 1)
  }
  let diff = 0
  for (const [key, value] of map1) {
    if (!map2.has(key)) {
      diff += value
    } else {
      if (map2.get(key) !== value) {
        diff += Math.abs(value - map2.get(key))
      }
    }
  }
  return diff
}
```

## 560. 和为 K 的子数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220917144810.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  let left = 0
  let right = 0
  let ans = 0
  while (left < nums.length) {
    if (nums[left] === k) {
      ans++
    }
    right = left + 1
    let temp = nums[left]
    while (right < nums.length) {
      temp += nums[right]
      if (temp === k) ans++
      right++
    }
    left++
  }
  return ans
}
```

## 581. 最短无序连续子数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220917151502.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findUnsortedSubarray = function (nums) {
  let sorted = nums.slice().sort((a, b) => a - b)
  let left = 0
  let right = nums.length
  while (left < nums.length) {
    if (sorted[left] !== nums[left]) break
    left++
  }
  while (right >= 0) {
    if (sorted[right] !== nums[right]) break
    right--
  }
  if (left >= right) return 0
  return right - left + 1
}
```

## 59. 螺旋矩阵 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220917233031.png)

```javascript
var generateMatrix = function (n) {
  if (n === 1) return [[1]]
  let rowLen = n
  let colLen = n
  let row = 0
  let col = 0
  let matrix = new Array(n).fill().map(() => {
    return new Array(n)
  })
  let count = 1
  while (row < rowLen && col < colLen) {
    count = traversal(matrix, count, row, rowLen, col, colLen)
    row++
    col++
    colLen--
    rowLen--
  }
  console.log(matrix)
  return matrix
}

var traversal = function (matrix, count, row, rowLen, col, colLen) {
  let i = row
  while (i < rowLen) {
    if (i === row) {
      let j = col
      while (j < colLen) {
        matrix[i][j] = count++
        j++
      }
    } else if (i === rowLen - 1) {
      let j = colLen - 1
      while (j >= col) {
        matrix[i][j] = count++
        j--
      }
    } else {
      matrix[i][colLen - 1] = count++
    }
    i++
  }
  if (col < colLen - 1) {
    i = i - 2
    while (i > row) {
      matrix[i][col] = count++
      i--
    }
  }
  return count
}
```

## 235. 二叉搜索树的最近公共祖先

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220918114529.png)

```javascript
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  return handle(root, p, q)
}

var handle = function (root, p, q) {
  let bigger = p.val > q.val ? p.val : q.val
  let smaller = p.val < q.val ? p.val : q.val
  if (root.val > bigger) {
    return handle(root.left, p, q)
  }
  if (root.val < smaller) {
    return handle(root.right, p, q)
  }
  if (
    root.val === bigger ||
    root.val === smaller ||
    (root.val > smaller && root.val < bigger)
  )
    return root
}
```

## 43. 字符串相乘

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220918183404.png)

```javascript
var multiply = function (num1, num2) {
  if (num1 === '0' || num2 === '0') return '0'
  let len1 = num1.length,
    len2 = num2.length,
    res = new Array(len1 + len2).fill(0)
  // 结果最多为 m + n 位数
  for (let i = len1 - 1; i >= 0; i--) {
    for (let j = len2 - 1; j >= 0; j--) {
      // 从个位数开始，逐步相乘
      const mul = num1[i] * num2[j]
      // 乘积在结果数组中对应的位置
      const p1 = i + j,
        p2 = i + j + 1
      // 对结果进行累加
      const sum = mul + res[p2]
      res[p1] += Math.floor(sum / 10)
      res[p2] = sum % 10
    }
  }
  if (res[0] === 0) res.shift()
  return res.join('')
}
```

## 47. 全排列 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220920110656.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function (nums) {
  let ans = [[nums[0]]]
  // 相邻位置插入法 找出所有排列方式
  for (let i = 1; i < nums.length; i++) {
    let num = nums[i]
    let newAns = []
    for (let j = 0; j < ans.length; j++) {
      let tempArr = ans[j]
      for (let k = 0; k <= ans[j].length; k++) {
        let arr = tempArr.slice()
        arr.splice(k, 0, num)
        newAns.push(arr)
      }
    }
    ans = newAns
  }
  // 转化为字符串 利用set去重 这里注意有 -10 这种情况
  ans = ans.map((item) => {
    return item.join('#')
  })
  ans = [...new Set(ans)].map((item) => {
    return item.split('#').map((str) => parseInt(str))
  })
  return ans
}
```

## 40. 组合总和 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220920163914.png)

```javascript
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
  candidates.sort((a, b) => a - b)
  let ans = []
  let dfs = (idx, target, temp) => {
    if (idx > candidates.length) return
    if (target < 0) return
    // 满足条件 加入结果
    if (target === 0) {
      ans.push(temp)
      return
    }
    // 如果第一个数都比target大 证明不满足条件 直接return
    if (target < candidates[idx]) return

    // 用当前数字
    let arr = temp.slice()
    arr.push(candidates[idx])
    dfs(idx + 1, target - candidates[idx], arr)

    // 不用当前数字 直接跳过 如果后面的与当前数字相同也跳过
    let tempIdx = idx + 1
    while (
      tempIdx < candidates.length &&
      candidates[tempIdx] === candidates[idx]
    ) {
      tempIdx++
    }
    dfs(tempIdx, target, temp)
  }

  dfs(0, target, [])
  // 转化为字符串 利用set去重
  ans = ans.map((item) => {
    return item.join('#')
  })
  ans = [...new Set(ans)].map((item) => {
    return item.split('#').map((str) => parseInt(str))
  })
  return ans
}
```

## 45. 跳跃游戏 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220920224548.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function (nums) {
  let dp = new Array(nums.length).fill(Infinity)
  dp[0] = 0
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] >= i - j && dp[j] + 1 < dp[i]) {
        dp[i] = dp[j] + 1
      }
    }
  }
  return dp[nums.length - 1]
}
```

## 18. 四数之和

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220921224900.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  nums.sort((a, b) => a - b)
  let len = nums.length
  // 如果目标比头4倍还小 或者比尾四倍还大 证明不会有解 直接返回
  if (target > nums[len - 1] * 4 || target < nums[0] * 4) return []
  const ans = []
  let dfs = (idx, temp, target) => {
    if (temp.length === 4 && target === 0) {
      ans.push(temp)
      return
    }
    if (idx === len || temp.length === 4) return
    // nums是递增的 所以如果target比当前nums[idx]小 证明后面都不符合
    if (nums[idx] > 0 && target < nums[idx]) return

    // 不取当前数字
    let j = idx + 1
    while (nums[j] === nums[idx]) {
      j++
    }
    dfs(j, [...temp], target)
    // 取当前数字
    dfs(idx + 1, [...temp, nums[idx]], target - nums[idx])
  }

  dfs(0, [], target)

  // 利用 set 去重
  let set = new Set()
  let res = []
  for (let i = 0; i < ans.length; i++) {
    let str = ans[i].join('')
    if (!set.has(str)) {
      res.push(ans[i])
      set.add(str)
    }
  }
  return res
}
```

## 57. 插入区间

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220921231708.png)

```javascript
var insert = function (intervals, newInterval) {
  let n = intervals.length
  let res = []
  let i = 0
  //1.处理在newInterval区间左边的intervals，比如示例二中的[1,2]
  while (i < n && intervals[i][1] < newInterval[0]) {
    res.push(intervals[i]) //由于未与newInterval重叠，直接加入到结果
    i++ //看下一个intervals
  }
  //2.处理与newInterval区间有重叠的intervals，比如示例二中的[3,5],[6,7],[8,10]
  while (i < n && intervals[i][0] <= newInterval[1]) {
    //更新
    newInterval[0] = Math.min(newInterval[0], intervals[i][0])
    newInterval[1] = Math.max(newInterval[1], intervals[i][1])
    i++ //看下一个intervals
  }
  //注：这个地方把newInterval为空的情况处理了，示例3
  //while一直处理完重叠，找到最后的最长容纳区间 再放到res中
  res.push(newInterval)

  //3.处理在newInterval区间右边的intervals，比如示例二中的[12,16]
  while (i < n) {
    res.push(intervals[i]) //同1，直接放到res中去
    i++
  }
  return res
}
```

## 63. 不同路径 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220922115600.png)

```javascript
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function (obstacleGrid) {
  let m = obstacleGrid.length
  let n = obstacleGrid[0].length
  if (obstacleGrid[0][0] === 1) return 0 // 如果第一格为障碍物 不可能到达终点
  // dp[m][n] 表示到达该点的路径条数
  let dp = new Array(m).fill().map(() => {
    return new Array(n).fill(0)
  })
  dp[0][0] = 1
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue
      if (obstacleGrid[i][j] === 1) {
        dp[i][j] = 0 // 如果是障碍物 直接置为0
      } else {
        // 如果不是障碍物 到达此点的路径等于相邻的 上面 + 左边 路径之和 注意边界⚠️
        let top = i - 1 > -1 ? dp[i - 1][j] : 0
        let left = j - 1 > -1 ? dp[i][j - 1] : 0
        dp[i][j] = top + left
      }
    }
  }
  return dp[m - 1][n - 1]
}
```

## 74. 搜索二维矩阵

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220922173951.png)

```javascript
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function (matrix, target) {
  let m = matrix.length
  let n = matrix[0].length

  let top = 0
  let bottom = m
  // 二分搜索第一列 确定搜索第几行
  // 这里搜索的是插入的位置 比如target为 11 列表为 [1 10 23]  索引就应该是 1
  // 如果target为 24 索引就应该是 3  如果是 -1  索引就是 0
  // 如果target为10 索引就是 1
  while (top < bottom) {
    let middle = (top + bottom) >> 1
    if (target <= matrix[middle][0]) {
      bottom = middle
    } else {
      top = middle + 1
    }
  }
  if (top > m - 1) top = m - 1 // 如果超出了边界
  if (matrix[top][0] === target) return true // 如果刚好等于搜索数
  if (matrix[top][0] > target && top > 0) top--

  // 同上
  let left = 0
  let right = n
  while (left < right) {
    let middle = (left + right) >> 1
    if (target <= matrix[top][middle]) {
      right = middle
    } else {
      left = middle + 1
    }
  }

  if (matrix[top][left] === target) return true
  return false
}
```

## 77. 组合

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220922181526.png)

```javascript
/**
 * @param {number} n
 * @param {number} k
 * @return {number[][]}
 */
var combine = function (n, k) {
  let ans = []
  const dfs = (idx, temp) => {
    // 获取到K个元素后直接返回
    if (temp.length === k) {
      ans.push(temp)
      return
    }

    // 如果下标大于n-1或者 剩余备选个数小于需要的个数 直接返回
    if (idx > n || n - idx + 1 < k - temp.length) return

    // 取当前数
    dfs(idx + 1, [...temp, idx])
    // 不取当前数
    dfs(idx + 1, [...temp])
  }

  dfs(1, [])
  // console.log(ans)
  return ans
}
```

## 82. 删除排序链表中的重复元素 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220923113454.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
  if (!head) return null
  let current = head
  let arr = [] // 遍历存储所有节点
  while (current) {
    arr.push(current)
    current = current.next
  }
  let i = 0
  while (i < arr.length - 1) {
    let node = arr[i]
    let j = i
    while (j + 1 < arr.length && arr[j + 1].val === node.val) {
      j++
    }
    // 如果大于0 表示有重复 都删除
    if (j - i > 0) {
      arr.splice(i, j - i + 1)
    } else {
      i++
    }
  }

  if (arr.length === 0) return null // 如果为空直接返回null

  // 剩下的节点都是不重复的 直接连起来
  let ans = arr[0]
  i = 0
  while (i < arr.length - 1) {
    arr[i].next = arr[i + 1]
    i++
  }
  arr[arr.length - 1].next = null // 最后一个节点next置null
  return ans
}
```

## 86. 分隔链表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220923145439.png)

```javascript
/**
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function (head, x) {
  if (!head) return null
  let current = head
  // 分三种节点
  let smallerNodes = []
  let biggerNodes = []
  let xNodes = []
  while (current) {
    if (current.val < x) {
      smallerNodes.push(current)
    } else {
      biggerNodes.push(current)
    }
    current = current.next
  }

  // 把排好的节点连起来
  let allNodes = smallerNodes.concat(xNodes).concat(biggerNodes)
  for (let i = 0; i < allNodes.length - 1; i++) {
    allNodes[i].next = allNodes[i + 1]
  }
  allNodes[allNodes.length - 1].next = null
  return allNodes[0]
}
```

## 92. 反转链表 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220923154456.png)

```javascript
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  if (!head.next) return head
  let current = head
  let nodes = []
  while (current) {
    nodes.push(current)
    current = current.next
  }

  // 反转 left 到 right 位置的链表
  let reNodes = nodes.slice(left - 1, right)
  for (let i = reNodes.length - 1; i > 0; i--) {
    reNodes[i].next = reNodes[i - 1]
  }

  let ans
  // 如果翻转链表前面有节点 就接起来
  if (left - 2 >= 0) {
    nodes[left - 2].next = reNodes[reNodes.length - 1]
    ans = nodes[0]
  } else {
    // 如果前面没有节点 反转列表的头就是返回的节点
    ans = reNodes[reNodes.length - 1]
  }
  reNodes[0].next = nodes[right] || null
  // traverseList(ans)
  return ans
}
```

## 93. 复原 IP 地址

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220923164002.png)

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var restoreIpAddresses = function (s) {
  let len = s.length
  let ans = []
  const dfs = (idx, temp) => {
    if (idx >= len) {
      if (temp.length === 4) {
        ans.push(temp)
      }
      return
    }

    // 1位
    dfs(idx + 1, [...temp, s[idx]])
    // 2位
    if (idx + 2 <= len && s[idx] !== '0') {
      dfs(idx + 2, [...temp, s.slice(idx, idx + 2)])
    }
    // 3位
    if (idx + 3 <= len && s[idx] !== '0' && s.slice(idx, idx + 3) <= 255) {
      dfs(idx + 3, [...temp, s.slice(idx, idx + 3)])
    }
  }

  dfs(0, [])
  ans = ans.map((item) => {
    return item.join('.')
  })
  return ans
}
```

## 99. 恢复二叉搜索树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220924112555.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
var recoverTree = function (root) {
  let nodes = []
  search(root, nodes)
  // 获取正确的数字排列方式
  let sortedNums = nodes.map((node) => node.val).sort((a, b) => a - b)
  // 遍历 如果和正确的顺序值不同 则替换
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].val !== sortedNums[i]) {
      nodes[i].val = sortedNums[i]
    }
  }
}
// 中序遍历 从小到大搜索出所有节点
var search = function (root, arr) {
  if (root.left) {
    search(root.left, arr)
  }
  arr.push(root)
  if (root.right) {
    search(root.right, arr)
  }
}
```

## 106. 从中序与后序遍历序列构造二叉树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220924171229.png)

```javascript
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
  if (inorder.length === 0) return null
  let rootVal = postorder[postorder.length - 1] // 后序遍历的最后一个数是树的根
  let root = new TreeNode(rootVal)
  let idx = inorder.indexOf(rootVal) // 找到先序遍历根的位置
  let leftInorder = inorder.slice(0, idx) // 根左边的为左子树 右边为右子树
  let rightInorder = inorder.slice(idx + 1)
  let leftPostorder = postorder.slice(0, leftInorder.length) // 根据前面获得的左右子树长度信息获取后序遍历的序列
  let rightPostorder = postorder.slice(
    leftInorder.length,
    rightInorder.length + leftInorder.length
  )
  // 递归构建左右子树
  root.left = buildTree(leftInorder, leftPostorder)
  root.right = buildTree(rightInorder, rightPostorder)
  return root
}
```

## 107. 二叉树的层序遍历 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220924171956.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function (root) {
  if (!root) return []
  let res = []
  let levelNodes = [root]
  while (true) {
    let tempNodes = []
    let tempNums = []
    levelNodes.forEach((item) => {
      if (item) {
        tempNums.push(item.val)
      }
      if (item.left) {
        tempNodes.push(item.left)
      }
      if (item.right) {
        tempNodes.push(item.right)
      }
    })
    if (tempNums.length > 0) {
      res.push(tempNums)
      levelNodes = tempNodes
    }
    // res 是从上到下的值 最后reverse一下 即为从下到上
    if (tempNodes.length === 0 || tempNums.length === 0) return res.reverse()
  }
}
```

## 109. 有序链表转换二叉搜索树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220924173332.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function (head) {
  if (!head) return null
  let current = head
  let nums = []
  // 先取出所有的链表节点的数字
  while (current) {
    nums.push(current.val)
    current = current.next
  }
  return buildTree(nums)
}

var buildTree = function (nums) {
  if (nums.length === 0) return null
  let rootIdx = nums.length >> 1 // 取数组中点作为root节点
  let root = new TreeNode(nums[rootIdx])
  // 递归构建左右子树
  root.left = buildTree(nums.slice(0, rootIdx))
  root.right = buildTree(nums.slice(rootIdx + 1))
  return root
}
```

## 117. 填充每个节点的下一个右侧节点指针 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220925161248.png)

```javascript
/**
 * @param {Node} root
 * @return {Node}
 */
var connect = function (root) {
  if (!root) return null
  handle([root])
  return root
}

var handle = function (roots) {
  if (roots.length === 0) return
  let next = []
  for (let i = 0; i < roots.length; i++) {
    if (i + 1 < roots.length) {
      roots[i].next = roots[i + 1]
    } else {
      roots[i].next = null
    }
    if (roots[i].left) next.push(roots[i].left)
    if (roots[i].right) next.push(roots[i].right)
  }
  handle(next)
}
```

## 120. 三角形最小路径和

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220925172928.png)

```javascript
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function (triangle) {
  const dp = new Array(triangle.length).fill().map(() => [])
  dp[0][0] = triangle[0][0]
  for (let i = 1; i < triangle.length; i++) {
    for (let j = 0; j < i + 1; j++) {
      let n1 = dp[i - 1][j] !== undefined ? dp[i - 1][j] : Infinity
      let n2 = dp[i - 1][j - 1] !== undefined ? dp[i - 1][j - 1] : Infinity
      dp[i][j] = Math.min(n1, n2) + triangle[i][j]
    }
  }
  return Math.min(...dp[triangle.length - 1])
}
```

## 129. 求根节点到叶节点数字之和

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220925175921.png)

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
 * @return {number}
 */
var sumNumbers = function (root) {
  let ans = []
  handle(root, '', ans)
  // 将所有分支的数字加起来
  return ans.reduce((pre, cur) => {
    return parseInt(cur) + pre
  }, 0)
}

var handle = function (root, sum, arr) {
  // 如果没有左右分支 记录结果 return
  if (!root.left && !root.right) {
    arr.push(sum + root.val)
    return
  }
  if (root.left) {
    handle(root.left, sum + root.val, arr)
  }
  if (root.right) {
    handle(root.right, sum + root.val, arr)
  }
}
```

## 143. 重排链表

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220925220241.png)

```javascript
/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  let current = head
  let arr = []
  while (current) {
    arr.push(current)
    current = current.next
  }

  let middle = arr.length >> 1
  current = arr[0]
  // 从arr尾部pop出节点 依次交错插入
  // pop到中点即停止
  while (arr.length > middle + 1) {
    let nextNode = current.next
    let node = arr.pop()
    node.next = nextNode
    current.next = node
    current = nextNode
  }
  // 将最后一个节点置null
  arr[middle].next = null
}
```

## 147. 对链表进行插入排序

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220926182904.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var insertionSortList = function (head) {
  if (!head) return
  let current = head
  let nodes = []
  while (current) {
    nodes.push(current)
    current = current.next
  }

  nodes.sort((a, b) => a.val - b.val)

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].next = nodes[i + 1] || null
  }
  return nodes[0]
}
```

## 151. 反转字符串中的单词

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220926221123.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  let arr = s.split(' ').filter((item) => item !== '')
  let left = 0
  let right = arr.length - 1
  while (left < right) {
    let temp = arr[left]
    arr[left] = arr[right]
    arr[right] = temp
    left++
    right--
  }
  return arr.join(' ')
}
```

## 167. 两数之和 II - 输入有序数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220926230502.png)

```javascript
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let len = numbers.length
  let left = 0
  let right = len - 1
  while (true) {
    let sum = numbers[left] + numbers[right]
    // numbers为升序 根据 sum情况 移动left right指针
    if (sum === target) {
      return [left + 1, right + 1]
    } else if (sum > target) {
      right--
    } else {
      left++
    }
  }
}
```

## 213. 打家劫舍 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220927120055.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function (nums) {
  let len = nums.length
  let dp = new Array(len) // 偷第一家
  let dp1 = new Array(len) // 不偷第一家
  dp[0] = nums[0]
  dp[1] = nums[0]
  dp1[0] = 0
  dp1[1] = nums[1]

  for (let i = 2; i < len; i++) {
    if (i === len - 1) {
      dp[i] = dp[i - 1] // 如果偷第一家 最后一家不能偷
    } else {
      dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1])
    }
    dp1[i] = Math.max(dp1[i - 2] + nums[i], dp1[i - 1])
  }
  return Math.max(dp[len - 1], dp1[len - 1])
}
```

## 199. 二叉树的右视图

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220927153828.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function (root) {
  if (!root) return []
  let ans = []
  handle([root], ans)
  return ans
}

// 层次遍历
var handle = function (nodes, ans) {
  if (nodes.length === 0) return
  let nextLevel = []
  for (let i = 0; i < nodes.length; i++) {
    // 记录左右节点 下一层遍历用
    if (nodes[i].left) nextLevel.push(nodes[i].left)
    if (nodes[i].right) nextLevel.push(nodes[i].right)
    // 如果是该层最后一个 记录结果
    if (i === nodes.length - 1) ans.push(nodes[i].val)
  }
  // 递归遍历下一层
  handle(nextLevel, ans)
}
```

## 211. 添加与搜索单词 - 数据结构设计

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220928152303.png)

```javascript
var WordDictionary = function () {
  this.words = []
}

/**
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function (word) {
  this.words.push(word)
}

/**
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function (word) {
  if (word.includes('.')) {
    for (let i = 0; i < this.words.length; i++) {
      // 长度相等的才进行匹配
      if (word.length === this.words[i].length) {
        for (let j = 0; j < word.length; j++) {
          // 如果 为 . 或者字符相等
          if (word[j] === '.' || word[j] === this.words[i][j]) {
            if (j === word.length - 1) return true // 如果是最后一位证明匹配成功 返回true
            continue
          }
          if (word[j] !== this.words[i][j]) break
        }
      }
    }
    return false // 遍历完成还没匹配到 返回false
  } else {
    return this.words.includes(word)
  }
}

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */
```

## 216. 组合总和 III

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220928154437.png)

```javascript
/**
 * @param {number} k
 * @param {number} n
 * @return {number[][]}
 */
var combinationSum3 = function (k, n) {
  let ans = []
  const dfs = (num, target, temp) => {
    // 找到目标
    if (target === 0 && temp.length === k) {
      ans.push(temp)
      return
    }
    // 超过 9 return
    if (num > 9) return
    // 选当前数字
    dfs(num + 1, target - num, [...temp, num])
    // 不选当前数字
    dfs(num + 1, target, [...temp])
  }

  dfs(1, n, [])
  return ans
}
```

## 229. 多数元素 II

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20220928164936.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var majorityElement = function (nums) {
  let count = nums.length / 3
  let map = {}
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = map[nums[i]] ? map[nums[i]] + 1 : 1
  }
  let ans = []
  for (const key in map) {
    if (map[key] > count) ans.push(parseInt(key))
  }
  return ans
}
```

## 318. 最大单词长度乘积

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221002193220.png)

```javascript
/**
 * @param {string[]} words
 * @return {number}
 */
var maxProduct = function (words) {
  // 暴力法 遍历每一种可能 取最大值
  let ans = 0
  for (let i = 0; i < words.length; i++) {
    let set = new Set()
    for (let j = 0; j < words[i].length; j++) {
      set.add(words[i][j])
    }
    let first = words[i].length
    for (let k = i + 1; k < words.length; k++) {
      let flag = true
      for (let j = 0; j < words[k].length; j++) {
        if (set.has(words[k][j])) {
          flag = false
          break
        }
      }
      if (flag) ans = Math.max(first * words[k].length, ans)
    }
  }
  return ans
}
```

## 398. 随机数索引

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221008180956.png)

```javascript
/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
  this.map = {}
  for (let i = 0; i < nums.length; i++) {
    this.map[nums[i]] = this.map[nums[i]] ? [...this.map[nums[i]], i] : [i]
  }
}

/**
 * @param {number} target
 * @return {number}
 */
Solution.prototype.pick = function (target) {
  let list = this.map[target]
  return list[Math.floor(list.length * Math.random())]
}

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.pick(target)
 */
```

## 402. 移掉 K 位数字

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221009153333.png)

```javascript
/**
 * @param {string} num
 * @param {number} k
 * @return {string}
 */
var removeKdigits = function (num, k) {
  // 数字越小的排前面总的就越小, 题意可以理解为去掉波峰
  // 例:  12534 中, 5比3大证明5为波峰 去掉后 1234 为最小
  // 如果没有波峰 例: 12345  直接裁掉最后的数字即可 1234
  // 遍历num 把波峰一个个去掉
  let i = 0
  while (k > 0) {
    while (i < num.length) {
      if (i + 1 < num.length && num[i] > num[i + 1]) break
      i++
    }
    // 如果是最后一个, 证明整个数组升序排列 没有波峰 直接从掉尾部裁切k个
    if (i === num.length) {
      num = num.slice(0, num.length - k)
      break
    } else {
      num = num.slice(0, i) + num.slice(i + 1)
    }
    // 去掉先导 ‘0’
    while (num[0] === '0') {
      num = num.slice(1)
    }
    k--
    i--
  }
  // 如果为 ‘’ 返回 0
  return num === '' ? '0' : num
}
```

## 413. 等差数列划分

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221010113226.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var numberOfArithmeticSlices = function (nums) {
  let len = nums.length
  if (len < 3) return 0
  // 表示前i个数字能组成多少个等差数组 默认都为0
  let dp = new Array(len).fill(0)
  for (let i = 2; i < len; i++) {
    dp[i] = dp[i - 1]
    let j = i
    // 新增的数字如果和前面的数字组成等差数列 dp[i] 加一
    while (j > 0 && nums[j] - nums[j - 1] === nums[j - 1] - nums[j - 2]) {
      dp[i] += 1
      j--
    }
  }
  return dp[len - 1]
}
```

## 429. N 叉树的层序遍历

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221012113355.png)

```javascript
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return []
  let ans = []
  search([root], ans)
  return ans
}

var search = function (nodes, list) {
  if (nodes.length === 0) return
  let level = []
  let nextLevel = []
  for (let i = 0; i < nodes.length; i++) {
    level.push(nodes[i].val)
    nextLevel = nextLevel.concat(nodes[i].children)
  }
  list.push(level)
  search(nextLevel, list)
}
```

## 433. 最小基因变化

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221012151853.png)

```javascript
/**
 * @param {string} start
 * @param {string} end
 * @param {string[]} bank
 * @return {number}
 */
var minMutation = function (start, end, bank) {
  let ans = Infinity
  // 深度优先搜索 为了防止重复搜索 用visited记录搜索过的DNA
  const dfs = (current, count, visited = []) => {
    if (current === end) {
      ans = Math.min(ans, count)
      return
    }
    if (count >= ans) return
    count++
    for (let i = 0; i < bank.length; i++) {
      if (!visited.includes(bank[i]) && handle(current, bank[i])) {
        dfs(bank[i], count, [...visited, bank[i]])
      }
    }
  }
  dfs(start, 0)
  // 如果为 Infinity 证明没找到 直接返回-1
  return ans === Infinity ? -1 : ans
}

// 判断两个序列是否正好差1
var handle = function (str1, str2) {
  let i = 0
  let diff = 0
  while (i < str1.length) {
    if (str1[i] !== str2[i]) diff++
    if (diff > 1) return false
    i++
  }
  return diff === 1
}
```

## 435. 无重叠区间

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221012162258.png)

```javascript
var eraseOverlapIntervals = function (intervals) {
  if (!intervals.length) {
    return 0
  }

  intervals.sort((a, b) => a[1] - b[1])

  const n = intervals.length
  let right = intervals[0][1]
  let ans = 1
  for (let i = 1; i < n; ++i) {
    if (intervals[i][0] >= right) {
      ++ans
      right = intervals[i][1]
    }
  }
  return n - ans
}
```

## 442. 数组中重复的数据

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221012165344.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDuplicates = function (nums) {
  let ans = []
  for (let i = 0; i < nums.length; i++) {
    let num = Math.abs(nums[i])
    // 如果当前数作为下标位置的数字为负数 证明被标记过一次了 这是第二次出现
    // 所以这是重复的数字
    if (nums[num - 1] < 0) {
      ans.push(num)
    } else {
      // 第一次出现 将数字的位置标记为负数
      nums[num - 1] = -nums[num - 1]
    }
  }
  return ans
}
```

## 451. 根据字符出现频率排序

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221013143240.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var frequencySort = function (s) {
  // 记录单词频率
  let map = {}
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = map[s[i]] ? map[s[i]] + 1 : 1
  }

  // 按照出现频率排序
  let list = []
  for (const key in map) {
    list.push([key, map[key]])
  }
  list.sort((a, b) => b[1] - a[1])

  // 组装
  let ans = ''
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i][1]; j++) {
      ans += list[i][0]
    }
  }
  return ans
}
```

## 540. 有序数组中的单一元素

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221014172405.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNonDuplicate = function (nums) {
  let ans = 0
  for (let i = 0; i < nums.length; i++) {
    ans ^= nums[i]
  }
  return ans
}
```

## 498. 对角线遍历

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221015171638.png)

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221015171612.png)

```javascript
var findDiagonalOrder = function (mat) {
  const m = mat.length
  const n = mat[0].length
  const res = new Array(m * n).fill(0)
  let pos = 0
  for (let i = 0; i < m + n - 1; i++) {
    if (i % 2 === 1) {
      let x = i < n ? 0 : i - n + 1
      let y = i < n ? i : n - 1
      while (x < m && y >= 0) {
        res[pos] = mat[x][y]
        pos++
        x++
        y--
      }
    } else {
      let x = i < m ? i : m - 1
      let y = i < m ? 0 : i - m + 1
      while (x >= 0 && y < n) {
        res[pos] = mat[x][y]
        pos++
        x--
        y++
      }
    }
  }
  return res
}
```

## 513. 找树左下角的值

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221015183056.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var findBottomLeftValue = function (root) {
  return handle([root])
}

// 层次遍历
var handle = function (nodes) {
  let nextLevel = []
  for (let i = 0; i < nodes.length; i++) {
    // 记录左右节点 下一层遍历用
    if (nodes[i].left) nextLevel.push(nodes[i].left)
    if (nodes[i].right) nextLevel.push(nodes[i].right)
  }
  if (nextLevel.length === 0) {
    return nodes[0].val
  } else {
    return handle(nextLevel)
  }
  // 递归遍历下一层
}
```

## 491. 递增子序列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221016131558.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var findSubsequences = function (nums) {
  const ans = []
  const set = new Set()
  const dfs = (idx, temp) => {
    if (temp.length > 1) {
      let str = temp.join(',')
      if (!set.has(str)) {
        ans.push(temp)
        set.add(str)
      }
    }
    if (idx > nums.length) {
      return
    }

    // 取当前数字
    if (temp.length === 0 || nums[idx] >= temp[temp.length - 1]) {
      dfs(idx + 1, [...temp, nums[idx]])
    }

    // 不取当前数字
    dfs(idx + 1, [...temp])
  }
  dfs(0, [])
  return ans
}
```

## 524. 通过删除字母匹配到字典里最长单词

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221016223544.png)

```javascript
/**
 * @param {string} s
 * @param {string[]} dictionary
 * @return {string}
 */
var findLongestWord = function (s, dictionary) {
  let ans = '' // 初始状态 没匹配到直接返回 ''
  for (let i = 0; i < dictionary.length; i++) {
    let word = dictionary[i]
    // 如果比当前结果的字符数大 或者相同且字母序较小 就进行匹配
    if (
      word.length > ans.length ||
      (word.length === ans.length && word < ans)
    ) {
      if (isMatch(s, word)) ans = word
    }
  }
  return ans
}

// 该字符串是否可以通过删除 s 中的某些字符得到。
var isMatch = function (s, target) {
  let i = 0
  let j = 0
  while (i < s.length) {
    // 从头到尾 匹配target中的字符
    let idx = s.indexOf(target[j], i)
    // 匹配到了就移动双指针
    if (idx > -1) {
      i = idx + 1
      j++
      // j 到尾部了证明匹配成功
      if (j === target.length) return true
    } else {
      return false
    }
  }
  return false
}
```

## 539. 最小时间差

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221017232813.png)

```javascript
/**
 * @param {string[]} timePoints
 * @return {number}
 */
var findMinDifference = function (timePoints) {
  timePoints.sort((a, b) => {
    let m1 = a.slice(0, 2)
    let m2 = b.slice(0, 2)
    if (m1 !== m2) return m1 - m2
    let s1 = a.slice(3)
    let s2 = b.slice(3)
    return s1 - s2
  })
  let ans = Infinity
  for (let i = 0; i < timePoints.length; i++) {
    let time1 = new Date('1996-10-22T' + timePoints[i] + ':00')
    let time2 = new Date('1996-10-22T' + timePoints[i - 1] + ':00')
    if (i === 0) {
      time1.setDate(23)
      time2 = new Date(
        '1996-10-22T' + timePoints[timePoints.length - 1] + ':00'
      )
    }
    let diff = Math.round((time1.getTime() - time2.getTime()) / 1000 / 60)
    if (diff === 0) return 0
    ans = Math.min(diff, ans)
  }
  return ans
}
```

## 567. 字符串的排列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221020181629.png)

```javascript
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
  let len1 = s1.length
  let len2 = s2.length
  if (len1 > len2) return false
  let i = 0
  while (i <= len2 - len1) {
    let diff = isMatch(s1, s2.slice(i, i + len1))
    // 完全相同 返回true
    if (diff === 0) return true
    // 根据两个字符串有多少个字母不同 每次移动一步或者多步
    i += diff >> 1 || 1
  }
  return false
}

// 检测s1和s2包含的字母个数有多少个不同
var isMatch = function (s1, s2) {
  let list = Array.from(s2)
  for (let i = 0; i < s1.length; i++) {
    let idx = list.indexOf(s1[i])
    if (idx > -1) {
      list.splice(idx, 1)
    }
  }
  return list.length
}
```

## 622. 设计循环队列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221022160921.png)

```javascript
/**
 * @param {number} k
 */
var MyCircularQueue = function (k) {
  this.list = []
  this.capacity = k
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function (value) {
  if (this.isFull()) return false
  this.list.push(value)
  return true
}

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function () {
  if (this.isEmpty()) return false
  this.list.shift()
  return true
}

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function () {
  if (this.isEmpty()) return -1
  return this.list[0]
}

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function () {
  if (this.isEmpty()) return -1
  return this.list[this.list.length - 1]
}

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function () {
  return this.list.length === 0
}

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function () {
  return this.list.length === this.capacity
}

/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * var obj = new MyCircularQueue(k)
 * var param_1 = obj.enQueue(value)
 * var param_2 = obj.deQueue()
 * var param_3 = obj.Front()
 * var param_4 = obj.Rear()
 * var param_5 = obj.isEmpty()
 * var param_6 = obj.isFull()
 */
```

## 623. 在二叉树中增加一行

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221023143415.png)

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
 * @param {number} val
 * @param {number} depth
 * @return {TreeNode}
 */
var addOneRow = function (root, val, depth) {
  // 如果是第一层 直接新建根节点
  if (depth === 1) {
    let ans = new TreeNode(val)
    ans.left = root
    return ans
  }
  handle([root], 1, val, depth)
  return root
}

// 层次遍历
var handle = function (nodes, level, val, depth) {
  let nextLevel = []
  for (let i = 0; i < nodes.length; i++) {
    // 如果是目标层次 插入左右节点
    if (level + 1 === depth) {
      let leftNode = new TreeNode(val)
      leftNode.left = nodes[i].left
      nodes[i].left = leftNode
      let rightNode = new TreeNode(val)
      rightNode.right = nodes[i].right
      nodes[i].right = rightNode
    } else {
      // 不是目标层次 记录左右孩 递归遍历下一层
      if (nodes[i].left) nextLevel.push(nodes[i].left)
      if (nodes[i].right) nextLevel.push(nodes[i].right)
    }
  }
  if (nextLevel.length) handle(nextLevel, level + 1, val, depth)
}
```

## 641. 设计循环双端队列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221024141507.png)

```javascript
/**
 * @param {number} k
 */
var MyCircularDeque = function (k) {
  this.list = []
  this.capacity = k
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertFront = function (value) {
  if (this.isFull()) return false
  this.list.unshift(value)
  return true
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertLast = function (value) {
  if (this.isFull()) return false
  this.list.push(value)
  return true
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteFront = function () {
  if (this.isEmpty()) return false
  this.list.shift()
  return true
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteLast = function () {
  if (this.isEmpty()) return false
  this.list.pop()
  return true
}

/**
 * @return {number}
 */
MyCircularDeque.prototype.getFront = function () {
  if (this.isEmpty()) return -1
  return this.list[0]
}

/**
 * @return {number}
 */
MyCircularDeque.prototype.getRear = function () {
  if (this.isEmpty()) return -1
  return this.list[this.list.length - 1]
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.isEmpty = function () {
  return this.list.length === 0
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.isFull = function () {
  return this.list.length >= this.capacity
}

/**
 * Your MyCircularDeque object will be instantiated and called as such:
 * var obj = new MyCircularDeque(k)
 * var param_1 = obj.insertFront(value)
 * var param_2 = obj.insertLast(value)
 * var param_3 = obj.deleteFront()
 * var param_4 = obj.deleteLast()
 * var param_5 = obj.getFront()
 * var param_6 = obj.getRear()
 * var param_7 = obj.isEmpty()
 * var param_8 = obj.isFull()
 */
```

## 650. 只有两个键的键盘

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221024144357.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var minSteps = function (n) {
  const dp = new Array(n + 1).fill(0)
  for (let i = 2; i <= n; i++) {
    dp[i] = i
  }

  for (let i = 4; i <= n; i++) {
    for (let j = 2; j < i; j++) {
      if (i % j === 0) {
        dp[i] = Math.min(dp[j] + i / j, dp[i])
      }
    }
  }
  // console.log(dp)
  return dp[n]
}
```

## 654. 最大二叉树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221025144714.png)

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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums) {
  if (nums.length === 0) return null
  if (nums.length === 1) {
    return new TreeNode(nums[0])
  }
  // 寻找最大值
  let maxIdx = 0
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[maxIdx]) maxIdx = i
  }
  let root = new TreeNode(nums[maxIdx])
  // 根据最大值左右构建子树
  root.left = constructMaximumBinaryTree(nums.slice(0, maxIdx))
  root.right = constructMaximumBinaryTree(nums.slice(maxIdx + 1))
  return root
}
```

## 692. 前 K 个高频单词

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221026160559.png)

```javascript
/**
 * @param {string[]} words
 * @param {number} k
 * @return {string[]}
 */
var topKFrequent = function (words, k) {
  let map = {}
  for (let i = 0; i < words.length; i++) {
    map[words[i]] = map[words[i]] ? map[words[i]] + 1 : 1
  }
  // 获取频率列表
  // 例: [ [ 'the', 4 ], [ 'is', 3 ], [ 'sunny', 2 ], [ 'day', 1 ] ]
  const list = []
  for (const key in map) {
    list.push([key, map[key]])
  }
  list.sort((a, b) => {
    // 按照出现频率排序
    if (b[1] !== a[1]) return b[1] - a[1]
    // 频率相同 按照字典序排序
    return a[0] > b[0] ? 1 : -1
  })
  // 返回按照出现频率排序前K个单词
  return list.slice(0, k).map((item) => item[0])
}
```

## 718. 最长重复子数组

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221027222232.png)

```javascript
const findLength = (A, B) => {
  // A、B数组的长度
  const [m, n] = [A.length, B.length]
  // dp数组初始化，都初始化为0
  const dp = new Array(m + 1).fill(0).map((x) => new Array(n + 1).fill(0))
  // 初始化最大长度为0
  let res = 0
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // 遇到A[i - 1] === B[j - 1]，则更新dp数组
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      }
      // 更新res
      res = dp[i][j] > res ? dp[i][j] : res
    }
  }
  // 遍历完成，返回res
  return res
}
```

## 662. 二叉树最大宽度

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221028155210.png)

```javascript
var widthOfBinaryTree = function (root) {
  /** JS 存在计数溢出的问题，使用 BigInt，BigInt 不能调用 Math 中的方法。 */
  let maxWidth = 1n
  const leftIds = []
  const dfs = (root, level, currIdx) => {
    if (leftIds[level] === undefined) {
      leftIds[level] = currIdx
    } else {
      const width = currIdx - leftIds[level] + 1n
      maxWidth = maxWidth > width ? maxWidth : width
    }
    if (root.left !== null) {
      dfs(root.left, level + 1, currIdx * 2n - 1n)
    }
    if (root.right !== null) {
      dfs(root.right, level + 1, currIdx * 2n)
    }
  }
  dfs(root, 0, 1n)
  return maxWidth
}
```

## 817. 链表组件

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221101162935.png)

```javascript
/**
 * @param {ListNode} head
 * @param {number[]} nums
 * @return {number}
 */
var numComponents = function (head, nums) {
  // 可以理解为搜索 nums 在链表上有几段
  let current = head
  let ans = 0
  while (current) {
    // 如果nums包含当前值
    if (nums.includes(current.val)) {
      let temp = current
      // 搜索连续段
      while (temp.next && nums.includes(temp.next.val)) {
        temp = temp.next
      }
      ans++
      current = temp.next
    } else {
      // nums不包含当前值 直接跳过
      current = current.next
    }
  }
  return ans
}
```

## 865. 具有所有最深节点的最小子树

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221107160046.png)

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
 * @return {TreeNode}
 */
var subtreeWithAllDeepest = function (root) {
  // 找出 最深 深度
  let deep = getDeepest(root)
  if (deep === 1) return root
  let paths = []
  // 搜索出所有最长路径
  searchPath(root, paths, [], deep)
  // 如果只有一条路径 直接返回最后一个节点
  if (paths.length === 1) return paths[0][paths[0].length - 1]

  // 寻找最长公共前缀
  for (let i = 0; i < paths[0].length; i++) {
    let current = paths[0][i]
    for (let j = 1; j < paths.length; j++) {
      if (paths[j][i] !== current) {
        return paths[j][i - 1]
      }
    }
  }
}

var searchPath = function (root, paths, temp, deep) {
  if (!root) return
  if (!root.left && !root.right) {
    if (temp.length + 1 >= deep) {
      paths.push([...temp, root])
    }
  }
  if (root.left) searchPath(root.left, paths, [...temp, root], deep)
  if (root.right) searchPath(root.right, paths, [...temp, root], deep)
}

var getDeepest = function (root) {
  if (!root) return 0
  return Math.max(getDeepest(root.left), getDeepest(root.right)) + 1
}
```

## 946. 验证栈序列

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221113161131.png)

```javascript
/**
 * @param {number[]} pushed
 * @param {number[]} popped
 * @return {boolean}
 */
var validateStackSequences = function (pushed, popped) {
  let stack = [pushed.shift()]
  while (stack.length > 0 || pushed.length > 0 || popped.length > 0) {
    // 如果栈顶元素和 popped 相同 表示两者位置匹配 都消除
    if (popped[0] === stack[0]) {
      stack.shift()
      popped.shift()
    } else {
      // 如果栈顶元素和 popped 不相同 继续入栈
      if (pushed.length > 0) {
        stack.unshift(pushed.shift())
      } else {
        // 入栈完了还不能和popped[0]匹配 返回false
        return false
      }
    }
    console.log(stack)
  }
  return true
}
```

## 958. 二叉树的完全性检验

![](https://raw.gitmirror.com/GanChuanYin/picture/main/blog/20221119221924.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isCompleteTree = function (root) {
  return handle([root], 0)
}

var handle = function (nodes = [], level) {
  // 检查是否还有下层子节点
  const hasChild = nodes.some((node) => {
    if (!node) return false
    return node.left || node.right
  })
  // 没有下层了直接返回true
  if (!hasChild) return true
  // 有下层 那么这一层必须是 ‘满的’
  if (nodes.length !== Math.pow(2, level)) return false
  // 检测下层是否满足
  let nextLevel = []
  for (let i = 0; i < nodes.length; i++) {
    nextLevel.push(nodes[i].left, nodes[i].right)
  }
  // 检测是否所有节点都是尽可能靠左的
  let flag = false
  for (let i = 0; i < nextLevel.length; i++) {
    if (!nextLevel[i]) flag = true
    if (nextLevel[i] && flag) return false
  }
  // 去掉空节点
  nextLevel = nextLevel.filter((node) => node)
  return handle(nextLevel, level + 1)
}
```
