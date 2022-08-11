---
title: leetcode
date: 2022-08-03 11:18:59
permalink: /pages/17e7a7/
categories:
  - 算法与数据结构
tags:
  -
---

> `leetcode` 刷题记录

## 只出现一次的数字

`136` `简单`

![](https://qiniu.espe.work/blog/20220804100714.png)

这里限制线性时间且不能申请额外空间，因此最佳方法是 <font color=#3498db size=4>`异或运算`</font> 求解。首先，<font color=#3498db size=4>`两个相同的数异或之后的结果为 0`</font>。对该数组所有元素进行异或运算，结果就是那个只出现一次的数字。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
  let res = 0
  for (let num of nums) {
    res ^= num
  }
  return res
}
```

## 买卖股票的最佳时机

`121` `简单`

![](https://qiniu.espe.work/blog/20220803141839.png)

根据题意本质上是 <font color=#3498db size=4>`在数组当中寻找最大值与最小值，但存在一个限制条件，最大值必须在最小值的后面（相对数组中的存储位置）`</font> 。

暴力解法:

最简单的方法是双层 for 循环直接暴力求解, 这样时间复杂度为 O(n^2)

```javascript
var maxProfit = function(prices) {
  let profit = 0
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      profit = Math.max(profit, prices[j] - prices[i])
    }
  }
  return profit
}
```

### 动态规划:

考虑性能的话用动态规划思想:

1. 记录今天之前买入的最小值
2. 计算今天之前最小值买入，今天卖出的获利，也即【今天卖出的最大获利】
3. 比较每天的最大获利，取最大值即可

```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  let profit = 0
  let min = prices[0]
  for (let i = 1; i < prices.length; i++) {
    profit = Math.max(profit, prices[i] - min)
    min = Math.min(min, prices[i])
  }
  return profit
}
```

## 二叉树的中序遍历

`94` `简单`

![](https://qiniu.espe.work/blog/20220803170126.png)

二叉树的遍历方式主要有：先序遍历、中序遍历、后序遍历、层次遍历。

<font color=#3498db size=4>`先序、中序、后序其实指的是父节点被访问的次序。`</font>

若在遍历过程中，父节点先于它的子节点被访问，就是先序遍历；父节点被访问的次序位于左右孩子节点之间，就是中序遍历；访问完左右孩子节点之后再访问父节点，就是后序遍历。

![](https://qiniu.espe.work/blog/20220803171954.png)

### 递归遍历实现:

先递归左子树，再访问根节点，接着递归右子树。

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
 * @return {number[]}
 */
var inorderTraversal = function(root) {
  if (!root) return []
  const res = []
  const parseNode = (node) => {
    if (!node) return
    parseNode(node.left)
    res.push(node.val)
    parseNode(node.right)
  }
  parseNode(root)
  return res
}
```

### 非递归栈实现：

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
  let ans = [],
    stk = []
  while (root || stk.length > 0) {
    if (root) {
      stk.push(root)
      root = root.left
    } else {
      root = stk.pop()
      ans.push(root.val)
      root = root.right
    }
  }
  return ans
}
```

## 二叉树的最大深度

![](https://qiniu.espe.work/blog/20220804215038.png)

递归遍历左右子树，求左右子树的最大深度 +1 即可。

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
var maxDepth = function(root) {
  if (!root) return 0
  const l = maxDepth(root.left)
  const r = maxDepth(root.right)
  return 1 + Math.max(l, r)
}
```

## 环形链表

![](https://qiniu.espe.work/blog/20220804235002.png)

![](https://qiniu.espe.work/blog/20220804235013.png)

定义快慢指针 slow、fast，初始指向 head。

快指针每次走两步，慢指针每次走一步，不断循环。当相遇时，说明链表存在环。如果循环结束依然没有相遇，说明链表不存在环。

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
  let slow = head
  let fast = head
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow == fast) {
      return true
    }
  }
  return false
}
```

## 多数元素

![](https://qiniu.espe.work/blog/20220805221539.png)

### 用对象记录每个数字出现的次数

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  const obj = {}
  const Threshold = Math.ceil(nums.length / 2)
  for (let index = 0; index < nums.length; index++) {
    const element = nums[index]
    obj[element] = obj[element] ? obj[element] + 1 : 1
    if (obj[element] === Threshold) {
      return element
    }
  }
}
```

### 摩尔投票法

![](https://qiniu.espe.work/blog/20220805222035.png)

![](https://qiniu.espe.work/blog/20220805222035.png)

## 反转链表

![](https://qiniu.espe.work/blog/20220805224551.png)

![](https://qiniu.espe.work/blog/20220805224618.png)

### 递归法

递归反转链表的第二个节点到尾部的所有节点，然后 插在反转后的链表的尾部。

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
var reverseList = function(head) {
  if (head === null || head.next === null) {
    return head
  }
  let antHead = reverseList(head.next)
  head.next.next = head
  head.next = null
  return antHead
}
```

### 虚拟节点迭代法

创建虚拟头节点 ，遍历链表，将每个节点依次插入 的下一个节点。遍历结束，返回 。

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
var reverseList = function(head) {
  let dummy = new ListNode()
  let curr = head
  while (curr) {
    let next = curr.next
    curr.next = dummy.next
    dummy.next = curr
    curr = next
  }
  return dummy.next
}
```

## 翻转二叉树

![](https://qiniu.espe.work/blog/20220806144420.png)

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
var invertTree = function(root) {
  if (!root) return null
  const temp = root.left
  root.left = root.right
  root.right = temp
  invertTree(root.right)
  invertTree(root.left)
  return root
}
```

## 回文链表

![](https://qiniu.espe.work/blog/20220806151820.png)

分三步:

1. 先用快慢指针找到链表的中点
2. 接着反转右半部分的链表。
3. 然后同时遍历前后两段链表，若前后两段链表节点对应的值不等，说明不是回文链表，否则说明是回文链表。

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
 * @return {boolean}
 */
var isPalindrome = function(head) {
  if (!head || !head.next) {
    return true
  }
  let slow = head
  let fast = head.next
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }
  let cur = slow.next
  slow.next = null
  let pre = null
  while (cur) {
    let t = cur.next
    cur.next = pre
    pre = cur
    cur = t
  }
  while (pre) {
    if (pre.val !== head.val) {
      return false
    }
    pre = pre.next
    head = head.next
  }
  return true
}
```

## 移动零

![](https://qiniu.espe.work/blog/20220807110201.png)

### 先去掉所有 0 再在数组尾部 push 进 0

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  if (nums.length < 2) return
  let zeroCount = 0
  while (nums.findIndex((num) => num === 0) > -1) {
    let index = nums.findIndex((num) => num === 0)
    nums.splice(index, 1)
    zeroCount++
  }
  while (zeroCount > 0) {
    nums.push(0)
    zeroCount--
  }
}
```

### 双指针交换数字

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  let left = 0,
    n = nums.length
  for (let right = 0; right < n; ++right) {
    if (nums[right]) {
      ;[nums[left], nums[right]] = [nums[right], nums[left]]
      ++left
    }
  }
}
```

## 找到所有数组中消失的数字

![](https://qiniu.espe.work/blog/20220807113107.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function(nums) {
  const max = nums.length
  const res = []
  for (let index = 1; index < max + 1; index++) {
    if (!nums.includes(index)) {
      res.push(index)
    }
  }
  return res
}
```

### 标记法

1. 遍历输入数组的每个元素一次。
2. 把 abs(nums[i]) - 1 索引位置的元素标记为负数。即

```shell
nums[abs(nums[i]) - 1] *= -1。
```

3. 然后遍历数组，若当前数组元素 nums[i] 为负数，说明我们在数组中存在数字 i+1。否则，说明数组不存在数字 i+1，添加到结果列表中。

```javascript
function findDisappearedNumbers(nums) {
  for (let i = 0; i < nums.length; i++) {
    let idx = Math.abs(nums[i]) - 1
    if (nums[idx] > 0) {
      nums[idx] *= -1
    }
  }
  let ans = []
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      ans.push(i + 1)
    }
  }
  return ans
}
```

## 汉明距离

![](https://qiniu.espe.work/blog/20220808231522.png)

利用异或运算的规律找出不同的位

```shell
0 ^ 0 = 0
1 ^ 1 = 0
0 ^ 1 = 1
1 ^ 0 = 1
```

```javascript
/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
var hammingDistance = function(x, y) {
  let distance = x ^ y
  let count = 0
  while (distance != 0) {
    count++
    distance &= distance - 1
  }
  return count
}
```

## 二叉树的直径

![](https://qiniu.espe.work/blog/20220809222312.png)

解法

![](https://qiniu.espe.work/blog/20220809222203.png)

## 合并二叉树

![](https://qiniu.espe.work/blog/20220809222226.png)

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
 * @return {TreeNode}
 */
var mergeTrees = function(root1, root2) {
  if (!root1 && !root2) return null
  if (!root1) return root2
  if (!root2) return root1
  let root = new TreeNode()
  root.left = mergeTrees(root1.left, root2.left)
  root.right = mergeTrees(root1.right, root2.right)
  root.val = root1.val + root2.val
  return root
}
```


