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

## 回文数

![](https://qiniu.espe.work/blog/20220813222006.png)

数字转字符串数组
然 pop 尾 shift 头 比较 如果不相同就 return false
如果直到数组长度小于 2 证明符合 return true

```javascript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
  if (x < 0) return false
  if (x < 10) return true
  let arr = x.toString().split('')
  let flag = true
  while (arr.length > 1 && flag) {
    flag = arr.pop() === arr.shift()
  }
  return flag
}
```

## 罗马数字转整数

![](https://qiniu.espe.work/blog/20220814105906.png)
![](https://qiniu.espe.work/blog/20220814105946.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
  const getStand = (sign, lastSign) => {
    switch (sign) {
      case 'I':
        return lastSign === 'V' || lastSign === 'X' ? -1 : 1
      case 'V':
        return 5
      case 'X':
        return lastSign === 'L' || lastSign === 'C' ? -10 : 10
      case 'L':
        return 50
      case 'C':
        return lastSign === 'D' || lastSign === 'M' ? -100 : 100
      case 'D':
        return 500
      case 'M':
        return 1000
    }
  }

  let arr = s.split('')
  let sign = ''
  let num = 0
  while (arr.length > 0) {
    let l = arr.pop()
    num += getStand(l, sign)
    sign = l
  }
  return num
}
```

## 最长公共前缀

![](https://qiniu.espe.work/blog/20220814114034.png)

```javascript
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (strs.length === 1) return strs[0]

  const compare = (arr1, arr2) => {
    let res = []
    while (arr1.length && arr2.length) {
      let str1 = arr1.shift()
      let str2 = arr2.shift()
      if (str1 === str2) {
        res.push(str1)
      } else {
        return res
      }
    }
    return res
  }

  let res = strs[0].split('')
  for (let index = 1; index < strs.length; index++) {
    let itemArr = strs[index].split('')
    res = compare(res, itemArr)
  }

  return res.length ? res.join('') : ''
}
```

## 删除有序数组中的重复项

![](https://qiniu.espe.work/blog/20220815150240.png)

1. 标记法

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  let num = nums[0]
  for (let index = 1; index < nums.length; index++) {
    if (nums[index] === num) {
      nums[index] = 'placeholder'
    } else {
      num = nums[index]
    }
  }
  while (nums.indexOf('placeholder') > -1) {
    let index = nums.indexOf('placeholder')
    nums.splice(index, 1)
  }
  console.log(nums)
}
```

2. 保留数字

原问题要求最多相同的数字最多出现 1 次，我们可以扩展至相同的数字最多保留 k 个。

由于相同的数字最多保留 k 个，那么原数组的前 k 个元素我们可以直接保留；
对于后面的数字，能够保留的前提是：当前数字 num 与前面已保留的数字的倒数第 k 个元素比较，不同则保留，相同则跳过。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  let i = 0
  for (const num of nums) {
    if (i < 1 || num != nums[i - 1]) {
      nums[i++] = num
    }
  }
  return i
}
```

## 实现 strStr()

![](https://qiniu.espe.work/blog/20220815221813.png)

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
  if (!needle) return 0
  const compare = (arr1, index, arr2) => {
    for (let i = 0; i < arr2.length; i++) {
      if (arr1[index] && arr1[index] === arr2[i]) {
        index++
      } else {
        return false
      }
    }
    return true
  }
  let sourceArr = haystack.split('')
  let targetArr = needle.split('')
  for (let index = 0; index < sourceArr.length; index++) {
    if (compare(sourceArr, index, targetArr)) {
      return index
    }
  }
  return -1
}
```

## 搜索插入位置

![](https://qiniu.espe.work/blog/20220816175935.png)

二分查找

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  let left = 0
  let right = nums.length
  while (left < right) {
    const mid = (left + right) >> 1
    if (nums[mid] >= target) {
      right = mid
    } else {
      left = mid + 1
    }
  }
  return left
}
```

这里通过移位运算来获取数组的中点

右移一位相当于 除 2 取整

```javascript
0 >> 1 // 0
1 >> 1 // 0
2 >> 1 // 1
3 >> 1 // 1
4 >> 1 // 2

1000 >> 1 // 500
1001 >> 1 // 500
1002 >> 1 // 501

1002 >> 2 // 250
1002 >> 3 // 125
```

## 移除元素

![](https://qiniu.espe.work/blog/20220817225311.png)

![](https://qiniu.espe.work/blog/20220817225330.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
  while (nums.indexOf(val) > -1) {
    let index = nums.indexOf(val)
    nums.splice(index, 1)
  }
  return nums.length
}
```

### 双指针交换 数字数字

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
  let left = 0
  let right = nums.length
  while (left < right) {
    if (nums[left] === val) {
      nums[left] = nums[right - 1]
      right--
    } else {
      left++
    }
  }
  return left
}
```

## 平衡二叉树

![](https://qiniu.espe.work/blog/20220818231311.png)

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
var isBalanced = function(root) {
  if (!root) return true
  let left = getHeight(root.left)
  let right = getHeight(root.right)
  if (Math.abs(left - right) > 1) return false
  return isBalanced(root.left) && isBalanced(root.right)
}

var getHeight = function(node) {
  if (!node) return 0
  return Math.max(getHeight(node.left), getHeight(node.right)) + 1
}
```

重点是获取到每个节点的`高度`, 通过`递归`的方式检测每个节点是否满足条件

## 加一

![](https://qiniu.espe.work/blog/20220819233715.png)

重点是处理好进位

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
  let lastIndex = digits.length - 1
  digits[lastIndex] = digits[lastIndex] + 1
  while (digits[lastIndex] > 9) {
    digits[lastIndex] -= 10
    lastIndex--
    if (lastIndex === -1) {
      digits.unshift(1) // 如果是第一位了 就增加一位 unshift 进1
    } else {
      digits[lastIndex] += 1
    }
  }
  return digits
}
```

## x 的平方根

![](https://qiniu.espe.work/blog/20220820180147.png)

```javascript
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
  let left = 0
  let right = x
  while (left < right) {
    const mid = (left + right + 1) >>> 1
    if (mid <= x / mid) {
      left = mid
    } else {
      right = mid - 1
    }
  }
  return left
}
```

## 合并有序数组

![](https://qiniu.espe.work/blog/20220823170624.png)

```javascript
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
  if (n === 0) return
  let i = 0
  while (i < n) {
    nums1[m + i] = nums2[i]
    i++
  }
  nums1.sort((a, b) => a - b)
}
```

## 108. 将有序数组转换为二叉搜索树

![](https://qiniu.espe.work/blog/20220827212130.png)

![](https://qiniu.espe.work/blog/20220827212136.png)

```javascript
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
  if (nums.length === 0) {
    return null
  }
  return generateTree(nums, 0, nums.length - 1)
}

function generateTree(arr, left, right) {
  let mid = (left + right) >> 1
  let node = new TreeNode(arr[mid])
  if (left === right) return node
  node.right = generateTree(arr, mid + 1, right)
  if (right - left === 1) return node
  node.left = generateTree(arr, left, mid - 1)
  return node
}
```

## 118. 杨辉三角

![](https://qiniu.espe.work/blog/20220830215935.png)

```javascript
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function(numRows) {
  if (numRows === 1) return [[1]]
  let res = [[1], [1, 1]]
  for (let i = 2; i < numRows; i++) {
    res[i] = []
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) {
        res[i][j] = 1
      } else {
        res[i][j] = res[i - 1][j] + res[i - 1][j - 1]
      }
    }
  }
  return res
}
```

## 125. 验证回文串

![](https://qiniu.espe.work/blog/20220901155213.png)

注意题目中说的是字母+数字

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
  let res = s.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase()
  let left = 0
  let right = res.length - 1
  while (left < right) {
    if (res[left] === res[right]) {
      left++
      right--
    } else {
      return false
    }
  }
  return true
}
```

## 160. 相交链表

![](https://qiniu.espe.work/blog/20220904222825.png)

![](https://qiniu.espe.work/blog/20220904222846.png)

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
  let current = headA
  let arrA = [headA]
  while (current.next) {
    current = current.next
    arrA.push(current)
  }
  current = headB
  while (current) {
    if (arrA.includes(current)) return current
    current = current.next
  }
  return null
}
```

## 171. Excel 表列序号

![](https://qiniu.espe.work/blog/20220905141536.png)

```javascript
/**
 * @param {string} columnTitle
 * @return {number}
 */
var titleToNumber = function(columnTitle) {
  let letters = [
    '',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  let len = columnTitle.length
  let res = 0
  for (let i = len - 1; i >= 0; i--) {
    let num = letters.findIndex((letter) => letter === columnTitle[i])
    num = num * Math.pow(26, len - i - 1)
    res += num
  }
  return res
}
```

## 190. 颠倒二进制位

![](https://qiniu.espe.work/blog/20220905222738.png)

```javascript
/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */

var reverseBits = function(n) {
  let result = 0 // 存储结果
  // 32位二进制数，因此需要移动32次
  // 每次将n的左后一位移动到result的第一位
  for (let i = 0; i < 32; i++) {
    // 每次将结果左移一位，将当前数字填入空位
    // 如果将移动放在if语句之后，会导致多移动一位
    result <<= 1

    // 如果当前n的第一个位置为1，则需要将1填入result
    if (n & 1) {
      // 如果是1，才需要填入1
      // 如果是0，无需填入，当前位置左移后自然是0
      result += 1
    }

    // n向右移动一位，判断下一个位置
    n >>= 1
  }

  return result >>> 0
}
```

## 191. 位 1 的个数

![](https://qiniu.espe.work/blog/20220906114135.png)

```javascript
/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function(n) {
  let ret = 0
  for (let i = 0; i < 32; i++) {
    if ((n & (1 << i)) !== 0) {
      ret++
    }
  }
  return ret
}
```

## 217. 存在重复元素

![](https://qiniu.espe.work/blog/20220907172307.png)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
  return new Set(nums).size < nums.length
}
```

## 242. 有效的字母异位词

![](https://qiniu.espe.work/blog/20220909103741.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  if (s.length !== t.length) return false
  let map = {}
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = map[s[i]] ? map[s[i]] + 1 : 1
  }
  for (let i = 0; i < t.length; i++) {
    let letter = t[i]
    if (map[letter] && map[letter] > 0) {
      map[letter] -= 1
    } else {
      return false
    }
  }
  return true
}
```

## 344. 反转字符串

![](https://qiniu.espe.work/blog/20220910143048.png)

```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
  let len = s.length - 1
  let left = 0
  let right = len
  while (left < right) {
    let temp = s[left]
    s[left] = s[right]
    s[right] = temp
    left++
    right--
  }
  console.log(s)
}
```

## 387. 字符串中的第一个唯一字符

![](https://qiniu.espe.work/blog/20220911201943.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function(s) {
  let set = new Set()
  let current = 0
  while (current < s.length) {
    if (!set.has(s[current]) && s.indexOf(s[current], current + 1) === -1)
      return current
    set.add(s[current])
    current++
  }
  return -1
}
```

## 412. Fizz Buzz

![](https://qiniu.espe.work/blog/20220912001914.png)

```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function(n) {
  let res = new Array(n + 1)
  res[1] = '1'
  res[2] = '2'
  res[3] = 'Fizz'
  res[4] = '4'
  res[5] = 'Buzz'
  for (let i = 6; i <= n; i++) {
    let temp = ''
    if (res[i - 3].includes('Fizz')) {
      temp += 'Fizz'
    }
    if (res[i - 5].includes('Buzz')) {
      temp += 'Buzz'
    }
    if (temp === '') temp += i
    res[i] = temp
  }
  return res.slice(1, n + 1)
}
```

## 326. 3 的幂

![](https://qiniu.espe.work/blog/20220912144840.png)

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function(n) {
  if (n <= 0) return false
  let carry = 0
  let num = -Infinity
  while (n > num) {
    num = Math.pow(3, carry)
    carry++
  }
  return num === n
}
```

## 557. 反转字符串中的单词 III

![](https://qiniu.espe.work/blog/20220918011802.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  let ans = ''
  let arr = s.split(' ')
  for (let i = 0; i < arr.length; i++) {
    ans += handle(arr[i]) + ' '
  }
  return ans.trim()
}

var handle = function(str) {
  if (str.length < 2) return str
  let l = 0
  let r = str.length - 1
  let arr = str.split('')
  while (l < r) {
    let temp = arr[l]
    arr[l] = arr[r]
    arr[r] = temp
    l++
    r--
  }
  return arr.join('')
}
```

## 231. 2 的幂

![](https://qiniu.espe.work/blog/20220918161152.png)

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
  if (n <= 0) return false
  let temp = 0
  let carry = 0
  while (n > temp) {
    temp = Math.pow(2, carry)
    carry++
  }
  return temp === n
}
```

## 292. Nim 游戏

![](https://qiniu.espe.work/blog/20220918171656.png)

```javascript
var canWinNim = function(n) {
  return n % 4 !== 0
}
```

## 58. 最后一个单词的长度

![](https://qiniu.espe.work/blog/20220921225434.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
  let arr = s.split(' ').filter((str) => str !== '')
  return arr[arr.length - 1].length
}
```

## 67. 二进制求和

![](https://qiniu.espe.work/blog/20220922141808.png)

```javascript
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
  let aArr = a.split('')
  let bArr = b.split('')
  let ans = ''
  let carry = 0
  // 如果 aArr有值 或 bArr有值 或 还有进位
  while (aArr.length || bArr.length || carry !== 0) {
    let numA = aArr.pop() || '0'
    let numB = bArr.pop() || '0'
    let sum = parseInt(numA) + parseInt(numB) + carry
    // 如果大于等于2 进位1 当前位除2取余
    if (sum >= 2) {
      carry = 1
      sum = sum % 2
    } else {
      carry = 0
    }
    ans = sum + ans
  }
  return ans
}
```

## 83. 删除排序链表中的重复元素

![](https://qiniu.espe.work/blog/20220923143230.png)

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  if (!head) return null
  let current = head
  while (current) {
    let val = current.val
    let temp = current.next
    // 把当前节点后面的 和当前节点值相等的节点 都删除
    while (temp && temp.val === val) {
      temp = temp.next
    }
    current.next = temp
    current = current.next
  }
  return head
}
```

## 100. 相同的树

![](https://qiniu.espe.work/blog/20220924114237.png)

```javascript
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
  if (!p && !q) return true // 两个节点都为null 返回 true
  if (!p || !q) return false // 一个为空一个不为空 返回 false
  if (p.val !== q.val) return false // 两者值不同 返回false
  //前面条件都符合则检查左右子树
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}
```

## 111. 二叉树的最小深度

![](https://qiniu.espe.work/blog/20220924221621.png)

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
var minDepth = function(root) {
  if (!root) return 0
  if (!root.left && !root.right) return 1 // 无左右节点 返回1
  // 如果没左节点,返回右节点高度 + 1
  if (!root.left) return minDepth(root.right) + 1
  if (!root.right) return minDepth(root.left) + 1
  // 如果左右都有  返回较小的子树+1
  return Math.min(minDepth(root.left), minDepth(root.right)) + 1
}
```

## 112. 路径总和

![](https://qiniu.espe.work/blog/20220924233659.png)

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
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function(root, targetSum) {
  if (!root) return false
  // 如果没有子节点 比较当前targetSum 和 root.val
  if (!root.left && !root.right) return root.val === targetSum
  // 有子节点 寻找左右子树
  return (
    hasPathSum(root.left, targetSum - root.val) ||
    hasPathSum(root.right, targetSum - root.val)
  )
}
```

## 119. 杨辉三角 II

![](https://qiniu.espe.work/blog/20220925162230.png)

```javascript
/**
 * @param {number} rowIndex
 * @return {number[]}
 */
var getRow = function(rowIndex) {
  let arr = [[1]]
  for (let i = 1; i <= rowIndex; i++) {
    arr.push([])
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) {
        arr[i][j] = 1
      } else {
        arr[i][j] = arr[i - 1][j] + arr[i - 1][j - 1]
      }
    }
  }
  return arr[rowIndex]
}
```

## 144. 二叉树的前序遍历

![](https://qiniu.espe.work/blog/20220926174445.png)

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
var postorderTraversal = function(root) {
  if (!root) return []
  return [
    ...postorderTraversal(root.left),
    ...postorderTraversal(root.right),
    root.val
  ]
}
```

## 145. 二叉树的后序遍历

![](https://qiniu.espe.work/blog/20220926174849.png)

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
var postorderTraversal = function(root) {
  if (!root) return []
  return [
    ...postorderTraversal(root.left),
    ...postorderTraversal(root.right),
    root.val
  ]
}
```

## 205. 同构字符串

![](https://qiniu.espe.work/blog/20220927215604.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function(s, t) {
  let map = new Map()
  let map1 = new Map()
  for (let i = 0; i < s.length; i++) {
    if (map.has(s[i])) {
      map.set(s[i], [...map.get(s[i]), i])
    } else {
      map.set(s[i], [i])
    }
    if (map1.has(t[i])) {
      map1.set(t[i], [...map1.get(t[i]), i])
    } else {
      map1.set(t[i], [i])
    }
  }
  let arr = []
  let arr1 = []
  map.forEach((val) => {
    if (val.length > 1) {
      arr.push(val.join('#'))
    }
  })
  map1.forEach((val) => {
    if (val.length > 1) {
      arr1.push(val.join('#'))
    }
  })
  return arr.join() === arr1.join()
}
```

## 219. 存在重复元素 II

![](https://qiniu.espe.work/blog/20220928161648.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function(nums, k) {
  let len = nums.length
  for (let i = 0; i < len; i++) {
    let j = i + 1
    while (j - i <= k && j < len) {
      if (nums[j] === nums[i]) return true
      j++
    }
  }
  return false
}
```

## 257. 二叉树的所有路径

![](https://qiniu.espe.work/blog/20220929105754.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function(root) {
  let ans = []
  search(root, [], ans)
  return ans
}

var search = function(root, temp, ans) {
  if (!root) return
  if (!root.left && !root.right) {
    temp.push(root.val)
    ans.push(temp.join('->'))
    return
  }
  search(root.left, [...temp, root.val], ans)
  search(root.right, [...temp, root.val], ans)
}
```

## 258. 各位相加

![](https://qiniu.espe.work/blog/20220929111111.png)

```javascript
/**
 * @param {number} num
 * @return {number}
 */
var addDigits = function(num) {
  let str = num + ''
  while (str > 9) {
    str =
      str.split('').reduce((pre, cur) => {
        return parseInt(pre) + parseInt(cur)
      }) + ''
  }
  return parseInt(str)
}
```

![](https://qiniu.espe.work/blog/20220929111128.png)

```javascript
var addDigits = function(num) {
  return ((num - 1) % 9) + 1
}
```

## 290. 单词规律

![](https://qiniu.espe.work/blog/20220930154122.png)

```javascript
/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function(pattern, s) {
  let words = s.split(' ')
  if (words.length !== pattern.length) return false
  if ([...new Set(words)].length !== [...new Set(pattern.split(''))].length)
    return false // 防止出现  ('abba', 'dog dog dog dog') 的情况
  let pMap = {}
  for (let i = 0; i < pattern.length; i++) {
    let letter = pattern[i]
    pMap[letter] = pMap[letter] ? [...pMap[letter], i] : [i]
  }

  for (const key in pMap) {
    if (pMap[key].length > 1) {
      let list = pMap[key]
      let temp = words[list[0]]
      for (let i = 0; i < list.length; i++) {
        if (temp !== words[list[i]]) return false
      }
    }
  }
  return true
}
```

## 303. 区域和检索 - 数组不可变

![](https://qiniu.espe.work/blog/20220930160607.png)

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function(nums) {
  this.list = nums
  let len = nums.length
  this.l = new Array(len) // l[i] 表示 i左侧的数之和
  this.r = new Array(len) // r[i] 表示 i右侧的数之和
  this.l[-1] = 0 // 边界特殊处理
  this.r[len] = 0

  let temp = 0
  for (let i = 0; i < len; i++) {
    temp += nums[i]
    this.l[i] = temp
  }
  this.sum = temp // sum为总和
  temp = 0
  for (let i = len - 1; i >= 0; i--) {
    temp += nums[i]
    this.r[i] = temp
  }
}

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function(left, right) {
  // left 到 right的区间和就等于总和减去两边的数
  return this.sum - this.l[left - 1] - this.r[right + 1]
}
```

## 404. 左叶子之和

![](https://qiniu.espe.work/blog/20221003172435.png)

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
var sumOfLeftLeaves = function(root) {
  let count = 0
  if (root.left) {
    // 左侧分支 且没有左右孩 证明是左子叶
    if (!root.left.left && !root.left.right) count += root.left.val
    count += sumOfLeftLeaves(root.left)
  }
  if (root.right) count += sumOfLeftLeaves(root.right)
  return count
}
```

## 374. 猜数字大小

![](https://qiniu.espe.work/blog/20221003175148.png)

```javascript
/**
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */

/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
  let left = 1
  let right = n
  while (left < right) {
    // 移位运算超过2的31次方后会出问题
    let middle = Math.floor((left + right) / 2)
    let res = guess(middle)
    if (res === 1) {
      left = middle + 1
    } else if (res === -1) {
      right = middle - 1
    } else {
      return middle
    }
  }
  return left
}
```

## 383. 赎金信

![](https://qiniu.espe.work/blog/20221006190444.png)

```javascript
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function(ransomNote, magazine) {
  for (let i = 0; i < ransomNote.length; i++) {
    let letter = ransomNote[i]
    let idx = magazine.indexOf(letter)
    if (idx > -1) {
      magazine = magazine.slice(0, idx) + magazine.slice(idx + 1)
    } else {
      return false
    }
  }
  return true
}
```

## 392. 判断子序列

![](https://qiniu.espe.work/blog/20221008175455.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function(s, t) {
  if (s === '') return true // s为空表示全都匹配到 返回true
  if (t === '') return false // s不为空而t为空表示备选用完还没匹配到返回false
  let i = 0
  let letter = s[0]
  while (i < t.length) {
    if (t[i] === letter) {
      // 递归 每次匹配一个字母
      return isSubsequence(s.slice(1), t.slice(i + 1))
    }
    i++
  }
  return false
}
```

## 415. 字符串相加

![](https://qiniu.espe.work/blog/20221010161429.png)

```javascript
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function(num1, num2) {
  let l1 = num1.length - 1
  let l2 = num2.length - 1
  let carry = 0
  let ans = ''
  // 取出每一位相加 注意两个数字遍历完, 但是进位为1的情况
  while (l1 >= 0 || l2 >= 0 || carry) {
    let n1 = parseInt(num1[l1] || 0)
    let n2 = parseInt(num2[l2] || 0)
    // 和为 两个数字加上进位
    let sum = n1 + n2 + carry
    carry = sum > 9 ? 1 : 0
    ans = (sum % 10) + ans
    l1--
    l2--
  }
  return ans
}
```

## 414. 第三大的数

![](https://qiniu.espe.work/blog/20221010163050.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function(nums) {
  // 去重
  let arr = [...new Set(nums)]
  // 倒序排序
  arr.sort((a, b) => b - a)
  // 如果大于三个 返回第三大的数
  // 如果小于三个 返回最大的数 也就是第一个数
  if (arr.length < 3) {
    return arr[0]
  } else {
    return arr[2]
  }
}
```
