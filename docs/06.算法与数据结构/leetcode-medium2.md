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
