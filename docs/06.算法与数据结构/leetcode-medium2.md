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
