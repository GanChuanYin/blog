---
title: leetcode-hard
date: 2022-08-22 16:13:00
permalink: /pages/aafc3b/
categories:
  - 算法与数据结构
tags:
  -
---

## 合并 K 个升序链表

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220822161310.png)

重点是转数组,排序, 再按照排好序的数组重组链表

```javascript
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
  if (lists.length === 0) return null
  if (lists.length === 1 && lists[0] === null) return null
  let i = 0
  let arr = []
  while (i < lists.length) {
    let current = lists[i]
    while (current) {
      arr.push(current)
      current = current.next
    }
    i++
  }
  if (arr.length === 0) return null //如果都是空 代表输入是 [[],[], ...]
  arr = arr.sort((a, b) => {
    // 排序
    return a.val - b.val
  })
  i = 0
  while (i < arr.length - 1) {
    arr[i].next = arr[i + 1] // 按照排序后的数组重组链表
    i++
  }
  return arr[0]
}
```

## 寻找两个正序数组的中位数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220822173048.png)

```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  let numArr = [...nums1, ...nums2]
  numArr.sort((a, b) => a - b)
  let len = numArr.length
  let middle = len >> 1
  if (numArr.length % 2 === 0) {
    return (numArr[middle] + numArr[middle - 1]) / 2 // 整数个 取中间两个的平均数
  } else {
    return numArr[middle] // 奇数个 取中位数
  }
}
```

## 接雨水

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220824115736.png)

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
  let res = 0

  let len = height.length
  let leftMax = [height[0]]
  for (let i = i; i < len; i++) {
    leftMax[i] = Math.max(leftMax, leftMax[i - 1])
  }
  console.log()
  for (let i = 0; i < height.length; i++) {
    res += getVolume(height, i) // 求出每个横坐标上方能接的雨水
  }
  return res
}

var getVolume = function(arr, index) {
  let len = arr.length
  if (index === 0 || index === len - 1) return 0
  let selfHeigh = arr[index]
  let leftHeigh = 0
  let rightHeigh = 0
  let left = index - 1
  let right = index + 1
  while (left > -1) {
    leftHeigh = Math.max(arr[left], leftHeigh)
    left--
  }
  while (right < len) {
    rightHeigh = Math.max(arr[right], rightHeigh)
    right++
  }
  let edgeHeight = Math.min(leftHeigh, rightHeigh)
  if (edgeHeight < selfHeigh) return 0
  return edgeHeight - selfHeigh
}
```

## 缺失的第一个正数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220826145349.png)

总共遍历三次

第一次将负数和 0 置为 null
第二次将 `nums[i]`这个位置的数 `num = Math.abs(num) * -1` 标记
第三次遍历数组找出第一个为正数或者 null 的位置 这个位置即为第二轮没标记的位置 即要找的数

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  let len = nums.length
  for (let i = 0; i < len; i++) {
    if (nums[i] < 1) {
      nums[i] = null
    }
  }
  for (let i = 0; i < len; i++) {
    if (nums[i] === null || nums[i] === 0) continue
    let num = Math.abs(nums[i])
    if (num <= len) {
      nums[num - 1] = nums[num - 1] === null ? 0 : Math.abs(nums[num - 1]) * -1
    }
  }
  let j = 0
  while (j < len) {
    if (nums[j] > 0 || nums[j] === null) {
      return j + 1
    }
    j++
  }
  return j + 1
}
```

## 正则表达式匹配

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220826183935.png)

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
  return handleMatch(s, p)
}

let handleMatch = (s, p) => {
  //判断，如果传入p的长度为0，那么，必须s的长度也为0才会返回true
  if (p.length === 0) {
    return !s.length
  }
  //判断第一个字符是否相等
  let match = false
  if (s.length > 0 && (s[0] === p[0] || p[0] === '.')) {
    match = true
  }
  //p 带 * 的
  if (p.length > 1 && p[1] === '*') {
    //第一种：s*匹配0个字符 // 第二种：s*匹配1个字符，递归下去，用来表示s*匹配n个s*
    return handleMatch(s, p.slice(2)) || (match && handleMatch(s.slice(1), p))
  } else {
    return match && handleMatch(s.slice(1), p.slice(1))
  }
}
```

##

思路:

1. 创建左指针，右指针
2. 将输入 t 的所有字符存入，map 中
3. 建立循环，直到右指针到 s 字符串长度结束
4. 逐位移动右指针
5. 如果 map 中有当前右指针的字符，map 中当前右指针字符对应的 value - 1
6. 如果当前右指针字符对应的 value === 0 map -= 1
7. 当 map === 0 时候说明已经找到符合要求的子串开始处理左指针

## 84. 柱状图中最大的矩形

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220828225545.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220828225601.png)

可以把这个想象成锯木板，如果木板都是递增的那我很开心，如果突然遇到一块木板 i 矮了一截，那我就先找之前最戳出来的一块（其实就是第 i-1 块），计算一下这个木板单独的面积，然后把它锯成次高的，这是因为我之后的计算都再也用不着这块木板本身的高度了。再然后如果发觉次高的仍然比现在这个 i 木板高，那我继续单独计算这个次高木板的面积（应该是第 i-1 和 i-2 块），再把它俩锯短。直到发觉不需要锯就比第 i 块矮了，那我继续开开心心往右找更高的。当然为了避免到了最后一直都是递增的，所以可以在最后加一块高度为 0 的木板。

这个算法的关键点是把那些戳出来的木板早点单独拎出来计算，然后就用不着这个值了。说实话真的很佩服第一个想出来的人……

```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
  let len = heights.length
  let i = 1
  let resArea = heights[0]
  while (i <= len) {
    let num = i === len ? 0 : heights[i]
    if (num < heights[i - 1]) {
      let j = i - 1
      for (; j >= 0; j--) {
        if (heights[j] >= num) {
          resArea = Math.max(resArea, heights[j] * (i - j))
        } else {
          break
        }
      }
      for (let k = j + 1; k < i; k++) {
        heights[k] = num // 将全部高于num的 削平
      }
    }
    i++
  }
  return resArea
}
```

## 44. 通配符匹配

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220901105852.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220901105910.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220901105921.png)

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
  s = ' ' + s
  p = ' ' + p
  const sLen = s.length
  const pLen = p.length
  const dp = new Array(pLen).fill(false).map(() => new Array(sLen).fill(false))
  dp[0][0] = true
  {
    let j = 0
    while (p[++j] === '*') {
      dp[j][0] = true
    }
  }

  for (let i = 1; i < pLen; i++) {
    for (let j = 1; j < sLen; j++) {
      if (p[i] === s[j]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else if (p[i] === '?') {
        dp[i][j] = dp[i - 1][j - 1]
      } else if (p[i] === '*') {
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j] || dp[i - 1][j - 1]
      }
    }
  }

  return dp[pLen - 1][sLen - 1]
}
```

## 124. 二叉树中的最大路径和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220902182523.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220902182529.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function(root) {
  if (!root) return []
  let levelNodes = [root]
  let allNodes = [levelNodes]
  while (true) {
    //先层次遍历
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
    if (tempNodes.length === 0) break
    allNodes.push(levelNodes)
  }
  let len = allNodes.length
  let res = -Infinity
  for (let i = len - 1; i >= 0; i--) {
    // 反向遍历所有节点
    for (let j = 0; j < allNodes[i].length; j++) {
      const node = allNodes[i][j]
      if (i === 0) {
        node.sum = node.val
        node.line = node.val
      }
      let left = node.left ? node.left.line : 0
      let right = node.right ? node.right.line : 0
      node.sum = Math.max(
        node.val,
        node.val + left,
        node.val + right,
        node.val + left + right
      )
      node.line = Math.max(node.val, node.val + left, node.val + right)
      res = Math.max(res, node.sum)
    }
  }
  return res
}
```

## 140. 单词拆分 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220904211351.png)

用 map 存储每个可以被拆分的子串
注意去重

```javascript
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {string[]}
 */
var wordBreak = function(s, wordDict) {
  // dp数组,表示前index为能否被拆分
  let dp = new Array(s.length).fill(false)
  dp[-1] = true
  let resMap = {}
  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j <= i; j++) {
      //存在一个字串能被拆分,并且剩余的字符串能在单词表中找到就表示当前单词能被拆分
      let str = s.substring(j, i + 1)
      if (dp[j - 1] && wordDict.indexOf(str) !== -1) {
        dp[i] = true
        resMap[str] = resMap[str] ? [...new Set([str, ...resMap[str]])] : [str] //去重
        if (j > 0) {
          let newArr = getStr(resMap, s.substring(0, j), s.substring(j, i + 1))
          let old = resMap[s.substring(0, i + 1)] || []
          resMap[s.substring(0, i + 1)] = [...new Set(old.concat(newArr))] //去重
        }
      }
    }
  }
  return resMap[s] || []
}

var getStr = function(resMap, s1, s2) {
  let arr1 = resMap[s1]
  let arr2 = resMap[s2]
  let res = []
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      res.push([arr1[i], arr2[j]].join(' '))
    }
  }
  return res
}
```

## 127. 单词接龙

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220904221927.png)

```javascript
/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
  // 创建集合数组 -> 后续使用集合数组的方法
  let wordSet = new Set(wordList)
  // 若数组中无最终字符串 -> 返回0
  if (!wordSet.has(endWord)) return 0
  // 初始化放入队列
  let queue = [[beginWord, 1]]
  // 当队列不为空
  while (queue.length) {
    // 提取队首
    let [word, sum] = queue.pop()
    // 如果当前字符串就是最终字符串 -> 返回步数
    if (word === endWord) return sum
    // 遍历当前字符串和集合数组所有相差1字符的情况
    for (let str of wordSet) {
      if (strDiff(word, str) === 1) {
        // 放入队尾
        queue.unshift([str, sum + 1])
        // 避免重复放入
        wordSet.delete(str)
      }
    }
  }
  // 当不需要转换时
  return 0
}
// 判断字符串不同
const strDiff = (str1, str2) => {
  let changes = 0
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] != str2[i]) changes += 1
  }
  return changes
}
```

## 212. 单词搜索 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220907165054.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220907165103.png)

```javascript
/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function(board, words) {
  let res = new Set()
  words.forEach((word) => {
    let flag = false
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === word[0]) {
          let arr = []
          check(board, i, j, word, 0, arr)
          if (arr.length) {
            res.add(word)
            flag = true
            break
          }
        }
      }
      if (flag) break // 如果这个单词匹配到了 跳出循环
    }
  })
  return [...res]
}

var check = function(board, m, n, word, index, resArr) {
  if (index + 1 === word.length) {
    resArr.push(word) // 当index + 1等于 word.length 证明已经匹配到单词
    return
  }
  let temp = board[m][n]
  board[m][n] = '-1' // 同一个单元格内的字母在一个单词中不允许被重复使用
  if (m - 1 >= 0 && board[m - 1][n] === word[index + 1]) {
    check(board, m - 1, n, word, index + 1, resArr)
  }
  if (m + 1 < board.length && board[m + 1][n] === word[index + 1]) {
    check(board, m + 1, n, word, index + 1, resArr)
  }
  if (n - 1 >= 0 && board[m][n - 1] === word[index + 1]) {
    check(board, m, n - 1, word, index + 1, resArr)
  }
  if (n + 1 < board[0].length && board[m][n + 1] === word[index + 1]) {
    check(board, m, n + 1, word, index + 1, resArr)
  }
  board[m][n] = temp // 恢复被用过的词
}
```

## 297. 二叉树的序列化与反序列化

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220909171404.png)

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
  if (!root) return []
  let level = [root]
  let res = [root.val]
  while (level.length > 0) {
    let tempLevel = []
    let tempNodes = []
    for (let i = 0; i < level.length; i++) {
      let node = level[i]
      if (node.left) {
        tempLevel.push(node.left)
        tempNodes.push(node.left.val)
      } else {
        tempNodes.push(null)
      }
      if (node.right) {
        tempLevel.push(node.right)
        tempNodes.push(node.right.val)
      } else {
        tempNodes.push(null)
      }
    }
    if (tempLevel.length) res = res.concat(tempNodes)
    level = tempLevel
  }
  return res
}

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
  if (!data.length) return null
  let root = new TreeNode(data[0])
  let queue = []
  queue.push(root)
  let cur
  let lineNodeNum = 2
  let startIndex = 1
  let restLength = data.length - 1
  while (restLength > 0) {
    for (let i = startIndex; i < startIndex + lineNodeNum; i = i + 2) {
      if (i == data.length) return root
      cur = queue.shift()
      if (data[i] != null) {
        cur.left = new TreeNode(data[i])
        queue.push(cur.left)
      }
      if (i + 1 == data.length) return root
      if (data[i + 1] != null) {
        cur.right = new TreeNode(data[i + 1])
        queue.push(cur.right)
      }
    }
    startIndex += lineNodeNum
    restLength -= lineNodeNum
    lineNodeNum = queue.length * 2
  }
  return root
}

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
```

## 329. 矩阵中的最长递增路径

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220910210414.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220910210423.png)

```javascript
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var longestIncreasingPath = function(matrix) {
  let max = 1
  let mLen = matrix.length
  let nLen = matrix[0].length
  // visited[m][n] 表示  matrix[m][n] 位置的最长路径
  let visited = new Array(mLen).fill().map(() => {
    return new Array(nLen).fill(0)
  })
  for (let m = 0; m < mLen; m++) {
    for (let n = 0; n < nLen; n++) {
      let num = matrix[m][n]
      // 和四周比较, 最小的数字才需要搜索
      if (m - 1 >= 0 && matrix[m - 1][n] < num) continue
      if (m + 1 < mLen && matrix[m + 1][n] < num) continue
      if (n - 1 >= 0 && matrix[m][n - 1] < num) continue
      if (n + 1 < nLen && matrix[m][n + 1] < num) continue
      max = Math.max(search(matrix, m, n, visited), max)
    }
  }
  return max
}

// 检测路径 并把最长路径记录到 visited 中
var search = function(matrix, m, n, visited) {
  if (visited[m][n] > 0) return visited[m][n] // 搜索过的位置直接返回值
  let num = matrix[m][n]
  let left = 1
  let right = 1
  let top = 1
  let bottom = 1
  if (m - 1 >= 0 && matrix[m - 1][n] > num) {
    left = search(matrix, m - 1, n, visited) + 1
  }
  if (m + 1 < matrix.length && matrix[m + 1][n] > num) {
    right = search(matrix, m + 1, n, visited) + 1
  }
  if (n - 1 >= 0 && matrix[m][n - 1] > num) {
    top = search(matrix, m, n - 1, visited) + 1
  }
  if (n + 1 < matrix[0].length && matrix[m][n + 1] > num) {
    bottom = search(matrix, m, n + 1, visited) + 1
  }
  let res = Math.max(left, right, bottom, top)
  visited[m][n] = res // 将搜索完的信息记录到visited中
  return res
}
```

## 295. 数据流的中位数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220910213859.png)

```javascript
var MedianFinder = function() {
  this.list = []
}

/**
 * @param {number} num
 * @return {void}
 */
MedianFinder.prototype.addNum = function(num) {
  let index = this.list.findIndex((v) => {
    return num < v
  })
  if (index == -1) index = this.list.length
  this.list.splice(index, 0, num)
}

/**
 * @return {number}
 */
MedianFinder.prototype.findMedian = function() {
  let len = this.list.length
  let middle = len >> 1
  if (len % 2 === 0) {
    return (this.list[middle - 1] + this.list[middle]) / 2
  } else {
    return this.list[middle]
  }
}
```

## 315. 计算右侧小于当前元素的个数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220910223612.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220910223618.png)

```javascript
var countSmaller = function(nums) {
  // 求i对应二进制最小位开始的连续0个数
  function lowbit(i) {
    return i & -i
  }
  // 树状数组更新
  function update(bit, list, i, k) {
    list[i] += k
    while (i < bit.length) {
      bit[i] += k
      i += lowbit(i)
    }
    return bit, list
  }
  // 求前缀和
  function getsum(bit, list, i) {
    let sum = 0
    sum -= list[i]
    while (i > 0) {
      sum += bit[i]
      i -= lowbit(i)
    }
    return sum
  }
  // 使用map离散化数组
  let map = new Map()
  nums.map((item) => {
    map.set(item, map.get(item) ? map.get(item) + 1 : 1)
  })
  // map转数组list，key->Array[0];value->Array[1],针对Array[0]排序
  let list = Array.from(map).sort((a, b) => a[0] - b[0])
  // 建立树状数组
  let bit = new Array(list.length + 1).fill(0)
  for (let i = 1; i < bit.length; i++) {
    let sum = 0
    list.slice(i - lowbit(i), i).map((item) => (sum += item[1]))
    bit[i] = sum
  }
  // list拆分成两个数组(这里主要是针对前缀和会把自己本身算进去来做的操作，
  // 比如对[1, 1]计算右侧小于当前元素的个数，前缀和会得到[1, 0]
  // 所以要在前缀和的基础上减去当前元素的个数
  // 当前各个元素用list表示，对应的各个元素的数量用list2表示
  list2 = list.map((item) => item[1])
  list = list.map((item) => item[0])
  // 树状数组从1开始计数比较好操作，所以补了一个数字，但不能补0(踩坑成功），
  // 因为如果本身nums列表中有0的话，就会多数一次0
  list.unshift(Number.MAX_VALUE)
  list2.unshift(Number.MAX_VALUE)
  // 树状数组求前缀和数组
  nums = nums.map((item) => {
    bit, (list2 = update(bit, list2, list.indexOf(item), -1))
    return getsum(bit, list2, list.indexOf(item))
  })
  return nums
}
```

## 218. 天际线问题

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220912171451.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220912171457.png)

```javascript
/**
 * @param {number[][]} buildings
 * @return {number[][]}
 */
var getSkyline = function(buildings) {
  const arr = [],
    ans = [],
    n = buildings.length
  // 记录点，用负数标记右点
  for (let [l, r, h] of buildings) arr.push([l, h], [r, -h])
  // 在x轴排序，x相同按y大的排
  arr.sort((a, b) => a[0] - b[0] || b[1] - a[1])
  const m = arr.length,
    heights = [0]
  // 记录前一个最高高度
  // 用于过滤出在x点最高的点
  // 和过滤两点在x处有相同高度的情况
  let preH = 0
  for (let [l, h] of arr) {
    // 通过二分插入该左点高度
    if (h > 0) heights.splice(search(heights, h), 0, h)
    // 通过二分移除右点高度
    else heights.splice(search(heights, -h), 1)
    // 前高度和当前最高高度不相等，说明出现了关键点
    if (preH !== heights[0]) {
      ans.push([l, heights[0]])
      preH = heights[0]
    }
  }
  return ans
}

// 二分
function search(arr, tar) {
  let l = 0,
    r = arr.length - 1
  while (l < r) {
    const mid = l + ((r - l) >> 1)
    if (arr[mid] === tar) return mid
    else if (arr[mid] < tar) r = mid
    else l = mid + 1
  }
  return l
}
```

## 239. 滑动窗口最大值

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220912214552.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220912214613.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
  const queue = []
  for (let i = 0; i < k; i++) {
    while (queue.length && nums[queue[queue.length - 1]] <= nums[i]) {
      queue.pop()
    }
    queue.push(i)
  }
  ans = [nums[queue[0]]]
  for (let i = k; i < nums.length; i++) {
    while (queue[0] <= i - k) {
      queue.shift()
    }
    while (queue.length && nums[queue[queue.length - 1]] <= nums[i]) {
      queue.pop()
    }
    queue.push(i)
    ans.push(nums[queue[0]])
  }
  return ans
}
```

## 301. 删除无效的括号

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220914175916.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220914175922.png)

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var removeInvalidParentheses = function(s) {
  let maxLen = 0
  let set = new Set()

  let dfs = (str, start, lremove, rremove) => {
    if (str.length < maxLen) return
    if (lremove === 0 && rremove === 0) {
      if (isValid(str)) {
        if (str.length > maxLen) {
          set.clear()
          maxLen = str.length
        }
        set.add(str)
        return
      }
    }
    for (let i = start; i < s.length; i++) {
      // 我们在每次进行搜索时，如果遇到连续相同的括号我们只需要搜索一次即可，比如当前遇到的字符串为
      // texttt{"(((())"}"(((())"，去掉前四个左括号中的任意一个，生成的字符串是一样的，均为
      // texttt{"((())"}"((())"，因此我们在尝试搜索时，只需去掉一个左括号进行下一轮搜索，
      // 不需要将前四个左括号都   尝试一遍。
      if (i !== start && str[i] === str[i - 1]) {
        continue
      }
      // 如果剩余的字符无法满足去掉的数量要求，直接返回
      if (lremove + rremove > str.length - i) {
        return
      }
      // 尝试去掉一个左括号
      if (lremove > 0 && str[i] === '(') {
        dfs(str.substr(0, i) + str.substr(i + 1), i, lremove - 1, rremove)
      }
      // 尝试去掉一个右括号
      if (rremove > 0 && str[i] === ')') {
        dfs(str.substr(0, i) + str.substr(i + 1), i, lremove, rremove - 1)
      }
    }
  }

  let lremove = 0
  let rremove = 0

  for (const c of s) {
    if (c === '(') {
      lremove++
    } else if (c === ')') {
      if (lremove === 0) {
        rremove++
      } else {
        lremove--
      }
    }
  }

  dfs(s, 0, lremove, rremove)
  return [...set]
}

var isValid = function(s) {
  if (s.length === 0) return true
  let left = []
  let right = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') left.push(i)
    if (s[i] === ')') right.push(i)
  }
  while (left.length && right.length) {
    let l = left.pop()
    let r = right.pop()
    if (l > r) return false
  }
  return left.length === 0 && right.length === 0
}
```

## 25. K 个一组翻转链表

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220919230002.png)

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
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
  if (k === 1) return head
  let current = head
  let count = 0
  let tempArr = []
  let ans = null
  let currentTail = null
  while (current) {
    count++
    tempArr.push(current)
    current = current.next
    // 每K个为一组 反转
    if (count === k) {
      let [head, tail] = handle(tempArr)
      if (!ans) ans = head
      if (currentTail) currentTail.next = head // 翻转后的头与上一个尾巴相连
      tail.next = current // 翻转后的尾巴与下一个节点相连
      currentTail = tail // 记录反转后的尾巴 为当前尾巴
      count = 0
      tempArr = []
    }
  }
  return ans
}

var handle = function(nodes) {
  for (let i = nodes.length - 1; i > 0; i--) {
    nodes[i].next = nodes[i - 1]
  }
  return [nodes[nodes.length - 1], nodes[0]]
}
```

## 30. 串联所有单词的子串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220920222726.png)

```javascript
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
var findSubstring = function(s, words = []) {
  let wordsLen = words[0].length
  let strLen = words[0].length * words.length
  let ans = []
  for (let i = 0; i <= s.length - strLen; i++) {
    let j = i
    let tempWords = words.slice()
    while (
      tempWords.findIndex((item) => item === s.substring(j, j + wordsLen)) > -1
    ) {
      let index = tempWords.findIndex(
        (item) => item === s.substring(j, j + wordsLen)
      )
      tempWords.splice(index, 1)
      j += wordsLen
      if (tempWords.length === 0) {
        ans.push(i)
      }
    }
  }
  // console.log(ans)
  return ans
}
```

## 37. 解数独

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220921172216.png)

```javascript
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
  // 统计每行
  let rows = board.map((row) => {
    return row.filter((item) => item !== '.')
  })
  // 统计每列
  let cols = new Array(9).fill().map(() => {
    return new Array()
  })
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== '.') cols[j].push(board[i][j])
    }
  }

  // 统计九宫格每块
  let i = 0
  let blocks = new Array(9).fill().map(() => {
    return new Array()
  })
  let count = 0
  while (i <= 6) {
    let j = 0
    while (j <= 6) {
      for (let k = i; k < i + 3; k++) {
        for (let l = j; l < j + 3; l++) {
          if (board[k][l] !== '.') blocks[count].push(board[k][l])
        }
      }
      count++
      j += 3
    }
    i += 3
  }

  // totalEmpty记录有多少个空缺的位置
  let totalEmpty = 9 * 9
  blocks.forEach((item) => {
    totalEmpty -= item.length
  })

  let template = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  let fillBoard = () => {
    for (let m = 0; m < 9; m++) {
      for (let n = 0; n < 9; n++) {
        if (board[m][n] === '.') {
          let bIdx = Math.floor(m / 3) * 3 + Math.floor(n / 3)
          let arr = [...new Set(blocks[bIdx].concat(rows[m].concat(cols[n])))]
          let difference = arr.concat(template).filter((v) => !arr.includes(v)) //取差集也就是当前位置的备选数字
          if (difference.length === 1) {
            board[m][n] = difference[0]
            blocks[bIdx].push(difference[0])
            rows[m].push(difference[0])
            cols[n].push(difference[0])
            totalEmpty--
            if (totalEmpty === 0) return
          }
        }
      }
    }
  }

  let flag = false // 解出整个棋盘的标志
  let traceback = (m, n) => {
    if (flag || m > 8) return
    if (board[m][n] === '.') {
      let bIdx = Math.floor(m / 3) * 3 + Math.floor(n / 3)
      let arr = [...new Set(blocks[bIdx].concat(rows[m].concat(cols[n])))]
      let difference = arr.concat(template).filter((v) => !arr.includes(v)) //取差集也就是当前位置的备选数字
      for (let i = 0; i < difference.length; i++) {
        if (flag) return // 如果前面的循环完成了 直接return
        board[m][n] = difference[i]
        blocks[bIdx].push(difference[i])
        rows[m].push(difference[i])
        cols[n].push(difference[i])
        if (m === 8 && n === 8) {
          flag = true
          return
        }
        if (n < 8) {
          traceback(m, n + 1)
        } else {
          traceback(m + 1, 0)
        }
        //  如果上个数字没找到答案 就回溯
        if (!flag) {
          board[m][n] = '.'
          blocks[bIdx].pop()
          rows[m].pop()
          cols[n].pop()
        }
      }
    } else if (m == 8 && n == 8) {
      flag = true
      return
    } else {
      if (n < 8) {
        traceback(m, n + 1)
      } else {
        traceback(m + 1, 0)
      }
    }
  }

  // 第一步先把只有唯一数字的位置赋值
  while (totalEmpty > 0) {
    let temp = totalEmpty
    fillBoard()
    if (temp === totalEmpty) break
  }

  // 第一步完成后如果还有空缺 回溯算法尝试去解
  if (totalEmpty !== 0) traceback(0, 0)
  // console.log(board)
}
```

这里重点注意回溯的终止条件
![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220921172233.png)

## 51. N 皇后

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220921204128.png)

```javascript
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {
  if (n === 1) return [['Q']]
  if (n === 2) return []

  let template = ''
  for (let i = 0; i < n; i++) {
    template += '.'
  }
  let arr = []
  for (let i = 0; i < n; i++) {
    arr.push(template.substring(0, i) + 'Q' + template.substring(i + 1))
  }

  // 获取棋盘全排列 检测每个棋盘排布
  let allList = fullpermutate(arr)
  let ans = []
  for (let i = 0; i < allList.length; i++) {
    if (check(allList[i])) {
      ans.push(allList[i])
    }
  }
  return ans
}

var check = function(board) {
  let len = board.length
  let count = 0
  // 检查行
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (board[i][j] === 'Q') {
        if (count === 0) {
          count++
        } else if (count > 0) {
          return false
        }
      }
    }
    count = 0
  }
  // 检查每列
  let cols = new Array(9).fill(false)
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (board[i][j] === 'Q') {
        if (cols[j]) return false
        cols[j] = true
      }
    }
  }
  // 检查对角线
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (board[i][j] === 'Q') {
        let k = i
        let l = j
        // 检查左上
        while (k - 1 >= 0 && l - 1 >= 0) {
          k--
          l--
          if (board[k][l] === 'Q') return false
        }
        k = i
        l = j
        // 检查右下
        while (k + 1 < len && l + 1 < len) {
          k++
          l++
          if (board[k][l] === 'Q') return false
        }
        k = i
        l = j
        // 检查右上
        while (k + 1 < len && l - 1 >= 0) {
          k++
          l--
          if (board[k][l] === 'Q') return false
        }
        k = i
        l = j
        // 检查左下
        while (k - 1 >= 0 && l + 1 < len) {
          k--
          l++
          if (board[k][l] === 'Q') return false
        }
      }
    }
  }
  return true
}

// 获取全排列
function fullpermutate(strList) {
  var result = []
  if (strList.length > 1) {
    //遍历每一项
    for (var m = 0; m < strList.length; m++) {
      //拿到当前的元素
      var left = strList[m]
      //除当前元素的其他元素组合
      var rest = strList.slice()
      rest.splice(m, 1)
      //上一次递归返回的全排列
      var preResult = fullpermutate(rest)
      //组合在一起
      for (var i = 0; i < preResult.length; i++) {
        var tmp = [left, ...preResult[i]]
        result.push(tmp)
      }
    }
  } else if (strList.length == 1) {
    result.push(strList)
  }
  return result
}
```

## 60. 排列序列

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220922104311.png)

```javascript
/**
 * @param {number} n
 * @param {number} k
 * @return {string}
 */
var getPermutation = function(n, k) {
  let str = ''
  for (let i = 1; i < n + 1; i++) {
    str += i
  }
  let list = fullpermutate(str, k)
  // console.log(list[k - 1])
  return list[k - 1]
}

getPermutation(4, 9)

// 获取全排列
function fullpermutate(str, k) {
  if (str.length == 1) return [str]
  let flag = false // 获取前 K 个排列,
  let result = []
  //遍历每一项
  for (let m = 0; m < str.length; m++) {
    if (flag) break
    //拿到当前的元素
    let left = str[m]
    //除当前元素的其他元素组合
    let rest = str.slice(0, m) + str.slice(m + 1, str.length)
    //上一次递归返回的全排列
    let preResult = fullpermutate(rest, Infinity)
    //组合在一起
    for (let i = 0; i < preResult.length; i++) {
      let tmp = left + preResult[i]
      result.push(tmp)
      // 获取到k个就直接终止循环
      if (result.length === k) {
        flag = true
        break
      }
    }
  }
  return result
}
```

## 132. 分割回文串 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220926151410.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var minCut = function(s) {
  let len = s.length
  let dp = new Array(len).fill(0)
  // 最多分割字符串长度减1次
  for (let i = 1; i < len; i++) {
    dp[i] = i
  }
  dp[-1] = -1 // 特殊处理

  for (let i = 1; i < len; i++) {
    dp[i] = Math.min(dp[i], dp[i - 1] + 1)
    for (let j = 0; j < i; j++) {
      if (isValid(s.slice(j, i + 1))) {
        // 如果 j等于0 整个子串都是回文 这时dp[-1]为-1  正好dp[i] 等于0
        dp[i] = Math.min(dp[i], dp[j - 1] + 1)
      }
    }
  }
  return dp[len - 1]
}

var isValid = function(str) {
  let left = 0
  let right = str.length - 1
  while (left < right) {
    if (str[left] !== str[right]) {
      return false
    }
    left++
    right--
  }
  return true
}
```

## 135. 分发糖果

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220926165728.png)

```javascript
/**
 * @param {number[]} ratings
 * @return {number}
 */
var candy = function(ratings) {
  let len = ratings.length
  let ans = new Array(len).fill(1) // 初始化每人一颗糖
  const temp = [] // 存放连续子序列 第三个参数表示是否为升序 true升序
  let idx = 0
  while (idx < len) {
    // 处理升序序列
    let j = idx
    while (j + 1 < len && ratings[j + 1] > ratings[j]) {
      j++
    }
    if (j > idx) {
      temp.push([idx, j, true])
    }
    // 处理降序序列
    let k = idx
    while (k + 1 < len && ratings[k + 1] < ratings[k]) {
      k++
    }
    if (k > idx) {
      temp.push([idx, k, false])
    }

    if (j > idx) {
      idx = j
    } else if (k > idx) {
      idx = k
    } else {
      idx++
    }
  }

  // 区间较长的序列排前面 先处理
  temp.sort((a, b) => {
    return b[1] - b[0] - (a[1] - a[0])
  })

  for (let i = 0; i < temp.length; i++) {
    let candy = 1
    if (temp[i][2]) {
      // 升序
      let start = temp[i][0]
      for (let j = start; j <= temp[i][1]; j++) {
        // 如果前面处理过了 直接跳过
        if (ans[j] !== 1) {
          candy++
          continue
        }
        ans[j] = candy
        candy++
      }
    } else {
      // 降序
      let end = temp[i][1]
      for (let j = end; j >= temp[i][0]; j--) {
        if (ans[j] !== 1) {
          // 如果前面处理过了 直接跳过
          candy++
          continue
        }
        ans[j] = candy
        candy++
      }
    }
  }
  // 求和
  return ans.reduce((pre, cur) => {
    return pre + cur
  })
}
```

## 164. 最大间距

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220927142846.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumGap = function(nums) {
  nums.sort((a, b) => a - b)
  let ans = 0
  for (let i = 1; i < nums.length; i++) {
    ans = Math.max(ans, nums[i] - nums[i - 1])
  }
  return ans
}
```

## 214. 最短回文串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220928160801.png)

例子中:
aacecaaa 从头往后可以找到的最长子串为 aacecaa
只有最右边的 a 字母不匹配, 所以只需要在左侧添加一个 a 即能构成回文串
例子 abcd 没有长度超过 2 的子串为, 所以用 a 为中心, 最短子串为 dcbabcd

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var shortestPalindrome = function(s) {
  let len = s.length
  // 寻找从左侧到右侧最长的回文子串
  let idx = 0 // 最长回文串的右下标
  for (let i = len - 1; i >= 0; i--) {
    if (isValid(s.slice(0, i + 1))) {
      idx = i
      break
    }
  }
  // s头部添加非子串的部分
  let ans = s.slice()
  for (let i = idx + 1; i < len; i++) {
    ans = s[i] + ans
  }
  return ans
}

// 判断是否为回文串
var isValid = function(s) {
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

## 220. 存在重复元素 III

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220928162212.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} indexDiff
 * @param {number} valueDiff
 * @return {boolean}
 */
var containsNearbyAlmostDuplicate = function(nums, indexDiff, valueDiff) {
  let len = nums.length
  for (let i = 0; i < len; i++) {
    let j = i + 1
    while (j - i <= indexDiff && j < len) {
      if (Math.abs(nums[j] - nums[i]) <= valueDiff) return true
      j++
    }
  }
  return false
}
```
