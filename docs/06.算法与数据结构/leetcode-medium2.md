---
title: leetcode-medium2
date: 2022-11-23 11:38:32
permalink: /pages/7d42bd/
categories:
  - 算法与数据结构
tags:
  -
---

## 1008. 前序遍历构造二叉搜索树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221123113841.png)

```javascript
/**
 * @param {number[]} preorder
 * @return {TreeNode}
 */
var bstFromPreorder = function (preorder) {
  if (preorder.length === 0) return null
  let left = []
  let right = []
  // 找出左右子树节点
  for (let i = 1; i < preorder.length; i++) {
    if (preorder[i] < preorder[0]) left.push(preorder[i])
    if (preorder[i] > preorder[0]) right.push(preorder[i])
  }
  // 构造根节点
  const root = new TreeNode(preorder[0])
  // 递归构建左右子树
  root.left = bstFromPreorder(left)
  root.right = bstFromPreorder(right)
  return root
}
```

## 1049. 最后一块石头的重量 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221124110516.png)

```javascript
var lastStoneWeightII = function (stones) {
  let sum = 0
  for (const weight of stones) {
    sum += weight
  }
  const n = stones.length
  const m = Math.floor(sum / 2)
  const dp = new Array(n + 1).fill(0).map(() => new Array(m + 1).fill(false))
  dp[0][0] = true
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j <= m; ++j) {
      if (j < stones[i]) {
        dp[i + 1][j] = dp[i][j]
      } else {
        dp[i + 1][j] = dp[i][j] || dp[i][j - stones[i]]
      }
    }
  }
  for (let j = m; ; --j) {
    if (dp[n][j]) {
      return sum - 2 * j
    }
  }
}
```

## 877. 石子游戏

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221207152504.png)

动态规划

```javascript
/**
 * @param {number[]} piles
 * @return {boolean}
 */
var stoneGame = function (piles) {
  const len = piles.length
  const dp = new Array(len).fill(0).map(() => {
    return new Array(len).fill(0)
  })
  for (let i = 0; i < len; i++) {
    dp[i][i] = piles[i]
  }
  for (let i = len - 2; i >= 0; i--) {
    for (let j = i + 1; j < len; j++) {
      dp[i][j] = Math.max(piles[i] - dp[i + 1][j], piles[j] - dp[i][j - 1])
    }
  }
  return dp[0][len - 1] > 0
}

stoneGame([5, 3, 4, 5])

// [5, 2, 4, 1],
// [0, 3, 1, 4],
// [0, 0, 4, 1],
// [0, 0, 0, 5]
```

## 861. 翻转矩阵后的得分

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221207154904.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221207154948.png)

```javascript
var matrixScore = function (grid) {
  const m = grid.length
  const n = grid[0].length
  let ret = m * (1 << (n - 1))
  for (let j = 1; j < n; j++) {
    let nOnes = 0
    for (let i = 0; i < m; i++) {
      if (grid[i][0] === 1) {
        nOnes += grid[i][j]
      } else {
        nOnes += 1 - grid[i][j] // 如果这一行进行了行反转，则该元素的实际取值为 1 - grid[i][j]
      }
    }
    const k = Math.max(nOnes, m - nOnes)
    ret += k * (1 << (n - j - 1))
  }
  return ret
}
```

## 1043. 分隔数组以得到最大和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221208174658.png)

```javascript
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var maxSumAfterPartitioning = function (arr, k) {
  const len = arr.length
  const dp = new Array(len).fill(0) // dp[i] 表示前 i 个元素的最大和
  dp[0] = arr[0]
  for (let i = 1; i < len; i++) {
    let max = arr[i]
    dp[i] = dp[i - 1] + arr[i] // 初始化当前 dp[i]
    // 从当前 i 往前推k步 计算每一步的最大值
    for (let j = i - 1; i - j < k && j >= 0; j--) {
      max = Math.max(max, arr[j])
      let current = max * (i + 1 - j)
      dp[i] = Math.max(dp[i], current + (dp[j - 1] || 0))
    }
  }
  return dp[len - 1]
}
```

## 1038. 从二叉搜索树到更大和树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221210213625.png)

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
var bstToGst = function (root) {
  const nodeList = []
  search(root, nodeList)
  // 从小到大 计算节点的更大和
  for (let i = 0; i < nodeList.length; i++) {
    let sum = 0
    for (let j = i; j < nodeList.length; j++) {
      sum += parseInt(nodeList[j].val)
    }
    nodeList[i].val = sum
  }
  return root
}

// 从小到大搜索出所有节点
var search = function (node, list) {
  if (!node) return
  search(node.left, list)
  list.push(node)
  search(node.right, list)
}
```

## 973. 最接近原点的 K 个点

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/202212131428854.png)

```javascript
/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function (points, k) {
  // 按最接近原点排序
  points.sort((a, b) => {
    let distanceA = Math.log(a[0] * a[0] + a[1] * a[1])
    let distanceB = Math.log(b[0] * b[0] + b[1] * b[1])
    return distanceA - distanceB
  })
  // 返回排序好的前k个
  return points.slice(0, k)
}
```

## 1109. 航班预订统计

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/202212141701017.png)

```javascript
/**
 * @param {number[][]} bookings
 * @param {number} n
 * @return {number[]}
 */
var corpFlightBookings = function (bookings, n) {
  const ans = new Array(n).fill(0)

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i]
    for (let j = booking[0]; j <= booking[1]; j++) {
      ans[j - 1] = ans[j - 1] + booking[2]
    }
  }

  return ans
}
```

## 1094. 拼车

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221215214554.png)

```javascript
/**
 * @param {number[][]} trips
 * @param {number} capacity
 * @return {boolean}
 */
var carPooling = function (trips, capacity) {
  let start = Infinity // 开始位置
  let end = -Infinity // 结束位置
  for (let i = 0; i < trips.length; i++) {
    if (trips[i][1] < start) start = trips[i][1]
    if (trips[i][2] > end) end = trips[i][2]
  }

  for (let i = start; i <= end; i++) {
    let temp = 0
    for (let j = 0; j < trips.length; j++) {
      // 刚好在trips[j][2] 时, 乘客下车了 所以不算
      if (i >= trips[j][1] && i < trips[j][2]) temp += trips[j][0]
    }
    if (temp > capacity) return false
  }

  return true
}
```

## 1190. 反转每对括号间的子串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221220135621.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseParentheses = function (s) {
  let idx = 0
  let stack = []
  while (idx < s.length) {
    if (s[idx] !== ')') {
      stack.push(s[idx])
    } else {
      let temp = []
      while (stack.length > 0) {
        let char = stack.pop()
        if (char === '(') {
          // 当前括号反转完成 将反转后的结果推入栈
          stack.push(...temp)
          break
        } else {
          temp.push(char)
        }
      }
    }
    idx++
  }
  return stack.join('')
}
```

## 1282. 用户分组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221220153832.png)

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
 * @return {number}
 */
var getDecimalValue = function (head) {
  let num = ''
  let current = head
  while (current) {
    num += current.val
    current = current.next
  }
  return parseInt(num, 2)
}
```

## 1302. 层数最深叶子节点的和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221221112714.png)

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
var deepestLeavesSum = function (root) {
  const deepest = getDepth(root) // 找出最深深度
  const res = []
  search(root, 1, deepest, res) // 搜索出最深深度的所有节点
  return res.reduce((pre, cur) => pre + cur) // 求和
}

var search = function (node, level, deepest, list) {
  if (!node) return
  if (level === deepest) {
    list.push(node.val)
    return
  }
  search(node.left, level + 1, deepest, list)
  search(node.right, level + 1, deepest, list)
}

var getDepth = function (node) {
  if (!node) return 0
  return Math.max(getDepth(node.left), getDepth(node.right)) + 1
}
```

## 1305. 两棵二叉搜索树中的所有元素

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221221151902.png)

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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {number[]}
 */
var getAllElements = function (root1, root2) {
  let ans = []
  search(root1, ans)
  search(root2, ans)
  ans.sort((a, b) => a - b)
  return ans
}

var search = function (node, list) {
  if (!node) return
  search(node.left, list)
  list.push(node.val)
  search(node.right, list)
}
```

## 1409. 查询带键的排列

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221224174124.png)

```javascript
/**
 * @param {number[]} queries
 * @param {number} m
 * @return {number[]}
 */
var processQueries = function (queries, m) {
  const p = new Array(m)
  for (let i = 0; i < m; i++) {
    p[i] = i + 1
  }

  let ans = new Array(queries.length)
  for (let i = 0; i < queries.length; i++) {
    let num = queries[i]
    let idx = p.indexOf(num)
    ans[i] = idx // 记录结果
    p.splice(idx, 1) // 删除当前
    p.unshift(num) // 将当前数字提到头部
  }

  return ans
}
```

## 1441. 用栈操作构建数组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221225134026.png)

```javascript
/**
 * @param {number[]} target
 * @param {number} n
 * @return {string[]}
 */
var buildArray = function (target, n) {
  let list = []
  for (let i = n; i >= 1; i--) {
    list.push(i)
  }

  let ans = []
  let idx = 0
  while (idx < target.length) {
    console.log(idx, ans)
    let num = list.pop()
    ans.push('Push')
    if (target[idx] !== num) {
      ans.push('Pop')
    } else {
      idx++
    }
  }
  return ans
}

buildArray([1, 3], 3)
```

## 1448. 统计二叉树中好节点的数目

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221225135801.png)

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
var goodNodes = function (root) {
  return search(root, -Infinity)
}

var search = function (node, max) {
  if (!node) return 0
  max = Math.max(node.val, max)
  return (
    search(node.left, max) +
    search(node.right, max) +
    (node.val === max ? 1 : 0)
  )
}
```

## 1525. 字符串的好分割数目

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221230171053.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var numSplits = function (s) {
  let ans = 0
  let left = new Map()
  let right = new Map()
  // 初始化 将所有元素添加进right
  for (let i = 0; i < s.length; i++) {
    if (right.has(s[i])) {
      right.set(s[i], right.get(s[i]) + 1)
    } else {
      right.set(s[i], 1)
    }
  }
  // 从第一个开始分割
  for (let i = 0; i < s.length - 1; i++) {
    // 去除右边的当前字母
    right.set(s[i], right.get(s[i]) - 1)
    if (right.get(s[i]) === 0) right.delete(s[i])
    // 往左边添加当前字母
    if (left.has(s[i])) {
      left.set(s[i], left.get(s[i]) + 1)
    } else {
      left.set(s[i], 1)
    }
    // 比较两边类型个数是否相同
    if (left.size === right.size) ans++
  }
  return ans
}
```

## 1630. 等差子数组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230102102739.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number[]} l
 * @param {number[]} r
 * @return {boolean[]}
 */
var checkArithmeticSubarrays = function (nums, l, r) {
  let ans = []
  for (let i = 0; i < l.length; i++) {
    let arr = nums.slice(l[i], r[i] + 1)
    arr.sort((a, b) => a - b)
    ans.push(check(arr))
  }
  return ans
}

// 检测是否为等差数列
var check = function (arr) {
  if (arr.length <= 2) return true
  const gap = arr[1] - arr[0]
  for (let i = 2; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] !== gap) return false
  }
  return true
}
```

## 1669. 合并两个链表

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230102180821.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {number} a
 * @param {number} b
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeInBetween = function (list1, a, b, list2) {
  let nodes1 = []
  let current = list1
  while (current) {
    nodes1.push(current)
    current = current.next
  }

  // 连接链表2
  nodes1[a - 1].next = list2
  current = list2
  while (current.next) {
    current = current.next
  }
  current.next = nodes1[b].next
  return list1
}
```

## 1689. 十-二进制数的最少数目

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230103154505.png)

```javascript
/**
 * @param {string} n
 * @return {number}
 */
var minPartitions = function (n) {
  // 可以看成求n中的最大数字
  let ans = 0
  for (let i = 0; i < n.length; i++) {
    ans = Math.max(ans, parseInt(n[i]))
  }
  return ans
}
```

## 1753. 移除石子的最大得分

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230105105538.png)

```javascript
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 */
var maximumScore = function (a, b, c) {
  let list = [a, b, c]
  list.sort((a, b) => a - b)
  let ans = 0
  while (list[0] > 0) {
    list[0] = list[0] - 1
    // 比较剩余两堆中较大的石子数量 从较大堆中取
    // 保持剩下的堆数量尽量接近
    if (list[1] > list[2]) {
      list[1] = list[1] - 1
    } else {
      list[2] = list[2] - 1
    }
    ans++
  }
  // 此时最小的堆已经取完了
  // 继续取剩下的堆 直到某个为0
  while (list[1] > 0 && list[2] > 0) {
    list[1] = list[1] - 1
    list[2] = list[2] - 1
    ans++
  }
  return ans
}
```

## 2087. 网格图中机器人回家的最小代价

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230526161155.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230526161210.png)

```javascript
/**
 * @param {number[]} startPos
 * @param {number[]} homePos
 * @param {number[]} rowCosts
 * @param {number[]} colCosts
 * @return {number}
 */
var minCost = function (startPos, homePos, rowCosts, colCosts) {
  let res = 0
  if (startPos[0] === homePos[0] && startPos[1] === homePos[1]) {
    return 0
  }
  let row = homePos[0] - startPos[0] // 行差
  let col = homePos[1] - startPos[1] // 列差
  if (row >= 0 && col >= 0) {
    for (let i = 0; i < row; i++) {
      res += rowCosts[startPos[0] + i + 1]
    }
    for (let j = 0; j < col; j++) {
      res += colCosts[startPos[1] + j + 1]
    }
  } else if (row >= 0 && col < 0) {
    for (let i = 0; i < row; i++) {
      res += rowCosts[startPos[0] + i + 1]
    }
    for (let j = 0; j < Math.abs(col); j++) {
      res += colCosts[startPos[1] - j - 1]
    }
  } else if (row < 0 && col >= 0) {
    for (let i = 0; i < Math.abs(row); i++) {
      res += rowCosts[startPos[0] - i - 1]
    }
    for (let j = 0; j < col; j++) {
      res += colCosts[startPos[1] + j + 1]
    }
  } else {
    for (let i = 0; i < Math.abs(row); i++) {
      res += rowCosts[startPos[0] - i - 1]
    }
    for (let j = 0; j < Math.abs(col); j++) {
      res += colCosts[startPos[1] - j - 1]
    }
  }
  return res
}
```

### 725. 分隔链表

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230528210926.png)

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
 * @return {ListNode[]}
 */
var splitListToParts = function (head, k) {
  let current = head
  let count = 0
  // 计算总共有多少个节点
  while (current) {
    count++
    current = current.next
  }
  // 计算链表个数列表
  let countlist = new Array(k).fill(0)
  let idx = 0
  while (count > 0) {
    countlist[idx] += 1
    idx++
    if (idx === k) {
      idx = 0
    }
    count--
  }

  // 按照个数链表裁切链表 并把每段的头放入结果列表中
  let res = new Array(k).fill(null)
  current = head
  for (let i = 0; i < countlist.length; i++) {
    res[i] = current
    let count = countlist[i]
    while (count > 1) {
      current = current.next
      count--
    }
    let temp = current
    if (current) {
      current = current.next
      temp.next = null
    } else {
      break
    }
  }
  return res
}
```

### 969. 煎饼排序

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230601182841.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230601182909.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230601182848.png)

### 443. 压缩字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230609154026.png)

```javascript
/**
 * @param {character[]} chars
 * @return {number}
 */
var compress = function (chars) {
  let idx = 0
  while (idx < chars.length) {
    let tail = idx
    while (chars[idx] === chars[tail + 1]) {
      tail++
    }
    if (tail !== idx) {
      // 有重复字符 需要压缩
      let countStr = tail - idx + 1 + '' // 如果个数超过10 需要 压缩成 [ 'a', 'b', '1', '2' ]
      chars.splice(idx + 1, tail - idx, ...countStr.split(''))
      idx += countStr.length + 1 // 指针挪到下一组char
    } else {
      // 只有一个字符 不需要压缩
      idx++
    }
  }
  return chars.length
}
```

### 1530. 好叶子节点对的数量

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230611181448.png)

```javascript
var countPairs = function (root, distance) {
  let ret = 0
  const dfs = (root) => {
    if (!root) return []
    if (!root.left && !root.right) return [0] // 叶子节点
    // 求出叶子节点到当前节点的距离
    const left = dfs(root.left).map((i) => i + 1)
    const right = dfs(root.right).map((i) => i + 1)
    // 然后找出所有小于 dis 的节点对
    for (let l of left) {
      for (let r of right) {
        if (l + r <= distance) ret++
      }
    }
    // 将叶子节点合起来返回回去
    return [...left, ...right]
  }
  dfs(root)
  return ret
}
```

## 2625. 扁平化嵌套数组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230617172006.png)

```javascript
var flat = function (arr, n) {
  if (n <= 0) return arr
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // 如果是数组 递归flat
      if (n > 1) {
        res = res.concat(flat(arr[i], n - 1))
      } else {
        res.push(...arr[i])
      }
    } else {
      res.push(arr[i])
    }
  }
  return res
}
```

优化版本

```javascript
var flat = function (arr, n) {
  while (arr.some((item) => Array.isArray(item)) && n > 0) {
    arr = [].concat(...arr)
    n--
  }
  return arr
}
```

## 1110. 删点成林

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230617185944.png)

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
 * @param {number[]} to_delete
 * @return {TreeNode[]}
 */
var delNodes = function (root, to_delete) {
  let nodes = search(root)
  let res = []
  nodes.forEach((node, idx) => {
    // 当前节点子节点如果应该删除 就去掉指针
    if (node.left && to_delete.includes(node.left.val)) node.left = null
    if (node.right && to_delete.includes(node.right.val)) node.right = null
    // 如果当前节点应该被删除 处理左右节点且去掉其指针
    if (to_delete.includes(node.val)) {
      // 节点存在且不在to_delete 证明是新子树 计入结果
      if (node.left && !to_delete.includes(node.left.val)) {
        res.push(node.left)
      }
      if (node.right && !to_delete.includes(node.right.val)) {
        res.push(node.right)
      }
      node.left = null
      node.right = null
    } else if (idx === 0) {
      // 根节点 且不在to_delete中
      res.push(node)
    }
  })
  return res
}

var search = function (root, list) {
  if (!root) return []
  return [root, ...search(root.left), ...search(root.right)]
}
```

## 971. 翻转二叉树以匹配先序遍历

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230618153820.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230618153832.png)

```javascript
var flipMatchVoyage = function (root, voyage) {
  let ans = []
  let i = 0
  function dfs(node) {
    if (!node) return true
    const val = voyage[i]
    i++
    // 判断当前节点的值是否和先序顺序一样
    if (val !== node.val) return false
    // 左子节点的值和先序的值不相同，说明需要进行反转
    if (node.left && node.left.val !== voyage[i]) {
      // 记录反转点
      ans.push(val)
      // 模拟反转
      return dfs(node.right) && dfs(node.left)
    } else {
      // 无反转
      return dfs(node.left) && dfs(node.right)
    }
  }
  // 返回结果为false的话，说明不匹配，返回[-1]
  return dfs(root) ? ans : [-1]
}
```

### 剑指 Offer II 021. 删除链表的倒数第 n 个结点

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230708152714.png)

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
  let nodes = []
  let current = head
  while (current) {
    nodes.push(current)
    current = current.next
  }
  // 如果删除的是第一个节点
  if (n === nodes.length) return nodes[0].next
  // 删除其它节点
  let len = nodes.length
  let front = len - n - 1
  let end = len - n + 1
  nodes[front].next = nodes[end] || null
  return head
}
```

### 1701. 平均等待时间

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230708154757.png)

%

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230708154652.png)

## 剑指 Offer II 054. 所有大于等于节点的值之和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230709141543.png)

%

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230709141528.png)

### 153. 寻找旋转排序数组中的最小值

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230709141936.png)

%

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let low = 0
  let high = nums.length - 1
  while (low < high) {
    const pivot = low + Math.floor((high - low) / 2)
    if (nums[pivot] < nums[high]) {
      high = pivot
    } else {
      low = pivot + 1
    }
  }
  return nums[low]
}
```

## 剑指 Offer II 059. 数据流的第 K 大数值

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230709154128.png)

%

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20230709154106.png)
