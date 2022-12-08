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


