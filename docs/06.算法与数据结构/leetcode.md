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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220804100714.png)

这里限制线性时间且不能申请额外空间，因此最佳方法是 <font color=#3498db size=4>`异或运算`</font> 求解。首先，<font color=#3498db size=4>`两个相同的数异或之后的结果为 0`</font>。对该数组所有元素进行异或运算，结果就是那个只出现一次的数字。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let res = 0
  for (let num of nums) {
    res ^= num
  }
  return res
}
```

## 买卖股票的最佳时机

`121` `简单`

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220803141839.png)

根据题意本质上是 <font color=#3498db size=4>`在数组当中寻找最大值与最小值，但存在一个限制条件，最大值必须在最小值的后面（相对数组中的存储位置）`</font> 。

暴力解法:

最简单的方法是双层 for 循环直接暴力求解, 这样时间复杂度为 O(n^2)

```javascript
var maxProfit = function (prices) {
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
var maxProfit = function (prices) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220803170126.png)

二叉树的遍历方式主要有：先序遍历、中序遍历、后序遍历、层次遍历。

<font color=#3498db size=4>`先序、中序、后序其实指的是父节点被访问的次序。`</font>

若在遍历过程中，父节点先于它的子节点被访问，就是先序遍历；父节点被访问的次序位于左右孩子节点之间，就是中序遍历；访问完左右孩子节点之后再访问父节点，就是后序遍历。

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220803171954.png)

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
var inorderTraversal = function (root) {
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
var inorderTraversal = function (root) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220804215038.png)

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
var maxDepth = function (root) {
  if (!root) return 0
  const l = maxDepth(root.left)
  const r = maxDepth(root.right)
  return 1 + Math.max(l, r)
}
```

## 环形链表

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220804235002.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220804235013.png)

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
var hasCycle = function (head) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220805221539.png)

### 用对象记录每个数字出现的次数

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220805222035.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220805222035.png)

## 反转链表

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220805224551.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220805224618.png)

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
var reverseList = function (head) {
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
var reverseList = function (head) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220806144420.png)

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
var invertTree = function (root) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220806151820.png)

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
var isPalindrome = function (head) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220807110201.png)

### 先去掉所有 0 再在数组尾部 push 进 0

```javascript
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
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
var moveZeroes = function (nums) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220807113107.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function (nums) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220808231522.png)

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
var hammingDistance = function (x, y) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220809222312.png)

解法

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220809222203.png)

## 合并二叉树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220809222226.png)

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
var mergeTrees = function (root1, root2) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220813222006.png)

数字转字符串数组
然 pop 尾 shift 头 比较 如果不相同就 return false
如果直到数组长度小于 2 证明符合 return true

```javascript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220814105906.png)
![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220814105946.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220814114034.png)

```javascript
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220815150240.png)

1. 标记法

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
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
var removeDuplicates = function (nums) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220815221813.png)

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220816175935.png)

二分查找

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220817225311.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220817225330.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
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
var removeElement = function (nums, val) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220818231311.png)

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
var isBalanced = function (root) {
  if (!root) return true
  let left = getHeight(root.left)
  let right = getHeight(root.right)
  if (Math.abs(left - right) > 1) return false
  return isBalanced(root.left) && isBalanced(root.right)
}

var getHeight = function (node) {
  if (!node) return 0
  return Math.max(getHeight(node.left), getHeight(node.right)) + 1
}
```

重点是获取到每个节点的`高度`, 通过`递归`的方式检测每个节点是否满足条件

## 加一

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220819233715.png)

重点是处理好进位

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220820180147.png)

```javascript
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function (x) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220823170624.png)

```javascript
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220827212130.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220827212136.png)

```javascript
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function (nums) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220830215935.png)

```javascript
/**
 * @param {number} numRows
 * @return {number[][]}
 */
var generate = function (numRows) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220901155213.png)

注意题目中说的是字母+数字

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220904222825.png)

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220904222846.png)

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
var getIntersectionNode = function (headA, headB) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220905141536.png)

```javascript
/**
 * @param {string} columnTitle
 * @return {number}
 */
var titleToNumber = function (columnTitle) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220905222738.png)

```javascript
/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */

var reverseBits = function (n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220906114135.png)

```javascript
/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function (n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220907172307.png)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function (nums) {
  return new Set(nums).size < nums.length
}
```

## 242. 有效的字母异位词

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220909103741.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220910143048.png)

```javascript
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function (s) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220911201943.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220912001914.png)

```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function (n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220912144840.png)

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfThree = function (n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220918011802.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  let ans = ''
  let arr = s.split(' ')
  for (let i = 0; i < arr.length; i++) {
    ans += handle(arr[i]) + ' '
  }
  return ans.trim()
}

var handle = function (str) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220918161152.png)

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isPowerOfTwo = function (n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220918171656.png)

```javascript
var canWinNim = function (n) {
  return n % 4 !== 0
}
```

## 58. 最后一个单词的长度

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220921225434.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function (s) {
  let arr = s.split(' ').filter((str) => str !== '')
  return arr[arr.length - 1].length
}
```

## 67. 二进制求和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220922141808.png)

```javascript
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220923143230.png)

```javascript
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function (head) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220924114237.png)

```javascript
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function (p, q) {
  if (!p && !q) return true // 两个节点都为null 返回 true
  if (!p || !q) return false // 一个为空一个不为空 返回 false
  if (p.val !== q.val) return false // 两者值不同 返回false
  //前面条件都符合则检查左右子树
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}
```

## 111. 二叉树的最小深度

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220924221621.png)

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
var minDepth = function (root) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220924233659.png)

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
var hasPathSum = function (root, targetSum) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220925162230.png)

```javascript
/**
 * @param {number} rowIndex
 * @return {number[]}
 */
var getRow = function (rowIndex) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220926174445.png)

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
var postorderTraversal = function (root) {
  if (!root) return []
  return [
    ...postorderTraversal(root.left),
    ...postorderTraversal(root.right),
    root.val
  ]
}
```

## 145. 二叉树的后序遍历

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220926174849.png)

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
var postorderTraversal = function (root) {
  if (!root) return []
  return [
    ...postorderTraversal(root.left),
    ...postorderTraversal(root.right),
    root.val
  ]
}
```

## 205. 同构字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220927215604.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isIsomorphic = function (s, t) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220928161648.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function (nums, k) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220929105754.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function (root) {
  let ans = []
  search(root, [], ans)
  return ans
}

var search = function (root, temp, ans) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220929111111.png)

```javascript
/**
 * @param {number} num
 * @return {number}
 */
var addDigits = function (num) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220929111128.png)

```javascript
var addDigits = function (num) {
  return ((num - 1) % 9) + 1
}
```

## 290. 单词规律

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220930154122.png)

```javascript
/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function (pattern, s) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20220930160607.png)

```javascript
/**
 * @param {number[]} nums
 */
var NumArray = function (nums) {
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
NumArray.prototype.sumRange = function (left, right) {
  // left 到 right的区间和就等于总和减去两边的数
  return this.sum - this.l[left - 1] - this.r[right + 1]
}
```

## 404. 左叶子之和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221003172435.png)

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
var sumOfLeftLeaves = function (root) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221003175148.png)

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
var guessNumber = function (n) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221006190444.png)

```javascript
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function (ransomNote, magazine) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221008175455.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isSubsequence = function (s, t) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221010161429.png)

```javascript
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function (num1, num2) {
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

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221010163050.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function (nums) {
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

## 441. 排列硬币

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221014144537.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function (n) {
  let ans = 1
  n = n - 1
  // 减去每层数量
  for (let i = 2; i <= n; i++) {
    ans++
    n -= i
  }
  return ans
}
```

## 459. 重复的子字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221014151435.png)

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var repeatedSubstringPattern = function (s) {
  let len = s.length
  let middle = len >> 1
  // 从 0 到中点 检测是否可以满足条件
  // 满足则直接返回true
  for (let i = 0; i < middle; i++) {
    let subStr = s.slice(0, i + 1)
    let subLen = subStr.length
    let j = i + 1
    while (true) {
      if (subStr === s.slice(j, subLen + j)) {
        j += subLen
        if (j === len) return true
      } else {
        break
      }
    }
  }
  return false
}
```

## 463. 岛屿的周长

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221015165647.png)

```javascript
var islandPerimeter = function (grid) {
  const dx = [0, 1, 0, -1]
  const dy = [1, 0, -1, 0]
  const n = grid.length,
    m = grid[0].length
  let ans = 0
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < m; ++j) {
      if (grid[i][j]) {
        let cnt = 0
        for (let k = 0; k < 4; ++k) {
          let tx = i + dx[k]
          let ty = j + dy[k]
          if (tx < 0 || tx >= n || ty < 0 || ty >= m || !grid[tx][ty]) {
            cnt += 1
          }
        }
        ans += cnt
      }
    }
  }
  return ans
}
```

## 500. 键盘行

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221015173256.png)

```javascript
/**
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function (words) {
  let keyboards = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  let ans = []
  for (let i = 0; i < words.length; i++) {
    // 全部转化为小写
    let word = words[i].toLocaleLowerCase()
    // 去除单词中的重复字符
    let temp = [...new Set(word.split(''))].join('')
    // 检测每行能否满足当前单词
    for (let j = 0; j < keyboards.length; j++) {
      let flag = true
      for (let k = 0; k < temp.length; k++) {
        if (!keyboards[j].includes(temp[k])) {
          flag = false
          break
        }
      }
      //   如果某行满足了 计入结果后break
      if (flag) {
        ans.push(words[i])
        break
      }
    }
  }
  return ans
}
```

## 501. 二叉搜索树中的众数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221015185135.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var findMode = function (root) {
  let map = {}
  search(root, map)
  let max = 0
  let ans = []
  // 找出众数出现的次数
  for (const key in map) {
    max = Math.max(map[key], max)
  }
  // 找出众数 (可能有多个)
  for (const key in map) {
    if (map[key] === max) ans.push(parseInt(key))
  }
  return ans
}

// 遍历每个节点
var search = function (node, map) {
  if (!node) return
  map[node.val] = map[node.val] ? map[node.val] + 1 : 1
  search(node.left, map)
  search(node.right, map)
}
```

## 561. 数组拆分

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221019141520.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var arrayPairSum = function (nums) {
  // 从小到大排序
  nums.sort((a, b) => a - b)
  let ans = 0
  // 取出每对最小值
  for (let i = 0; i < nums.length; i += 2) {
    ans += nums[i]
  }
  return ans
}
```

## 572. 另一棵树的子树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221019142946.png)

```javascript
/**
 * @param {TreeNode} root
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function (root, subRoot) {
  // 递归搜索root树中的每个节点
  if (isMatch(root, subRoot)) return true
  let left = root.left ? isSubtree(root.left, subRoot) : false
  let right = root.right ? isSubtree(root.right, subRoot) : false
  return left || right
}

// 递归比较树是否相同
var isMatch = function (root1, root2) {
  if (!root1 && !root2) return true
  if (!root1 || !root2) return false
  if (root1.val !== root2.val) return false
  return isMatch(root1.left, root2.left) && isMatch(root1.right, root2.right)
}
```

## 637. 二叉树的层平均值

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221022233138.png)

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
var averageOfLevels = function (root) {
  let ans = []
  handle([root], ans)
  return ans
}

// 层次遍历 求每层平均值
var handle = function (nodes, ans) {
  if (nodes.length === 0) return
  let sum = 0
  let nextLevel = []
  for (let i = 0; i < nodes.length; i++) {
    sum += nodes[i].val
    if (nodes[i].left) nextLevel.push(nodes[i].left)
    if (nodes[i].right) nextLevel.push(nodes[i].right)
  }
  ans.push(sum / nodes.length)
  handle(nextLevel, ans)
}
```

## 643. 子数组最大平均数 I

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221023144248.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function (nums, k) {
  let i = 0
  let ans = -Infinity
  while (i <= nums.length - k) {
    let temp = 0
    for (let j = i; j < i + k; j++) {
      temp += nums[j]
    }
    ans = Math.max(ans, temp / k)
    i++
  }
  return ans
}
```

## 606. 根据二叉树创建字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221023151555.png)

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
 * @return {string}
 */
var tree2str = function (root) {
  if (!root) return '()'
  let ans = root.val + ''
  // 如果左孩没有 右孩有 需要一个括号占位
  if (!root.left && root.right) {
    ans += '()'
  }
  // 递归处理左右孩
  if (root.left) {
    ans = ans + '(' + tree2str(root.left) + ')'
  }
  if (root.right) {
    ans = ans + '(' + tree2str(root.right) + ')'
  }
  return ans
}
```

## 680. 验证回文串 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221026153400.png)

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var validPalindrome = function (s) {
  // 初始删除标志为false
  return handle(s, false)
}

var handle = function (s, isDeleted) {
  if (s.length <= 1) return true
  let left = 0
  let right = s.length - 1
  // 左右两端一一比较
  while (left < right) {
    // 如果出现左右字符不同
    if (s[left] !== s[right]) {
      // 已经删除过了
      if (isDeleted) return false
      // 没删除过 删除左边或者右边字符 再比较
      return (
        handle(s.slice(0, left) + s.slice(left + 1), true) ||
        handle(s.slice(0, right) + s.slice(right + 1), true)
      )
    } else {
      left++
      right--
    }
  }
  return true
}
```

## 704. 二分查找

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221027173443.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  let left = 0
  let right = nums.length - 1
  while (left < right) {
    let middle = (left + right) >> 1
    if (nums[middle] < target) {
      left = middle + 1
    } else if (nums[middle] > target) {
      right = middle - 1
    } else {
      // 恰好是target 直接返回
      return middle
    }
  }
  // 循环结束 left 等于 right 检测一下nums[left]是否为目标值
  return nums[left] === target ? left : -1
}
```

## 697. 数组的度

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221028161842.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findShortestSubArray = function (nums) {
  // 找出数组的众数 注意可能有多个
  // 找出众数在数组中第一次出现和最后一次出现的位置，两个位置组成区间长度就是答案,
  // 如果众数不止一个，那么要取区间长度最短那个
  let map = {}
  for (let i = 0; i < nums.length; i++) {
    map[nums[i]] = map[nums[i]] ? map[nums[i]] + 1 : 1
  }
  let frequency = 0
  let list = [] // 存放所有众数
  for (const key in map) {
    if (map[key] > frequency) {
      frequency = map[key]
      list = [parseInt(key)]
    } else if (map[key] === frequency) {
      list.push(parseInt(key))
    }
  }
  // 最大值为数组长
  let ans = nums.length
  // 双指针从两边往中间靠拢 直到找到目标数
  for (let i = 0; i < list.length; i++) {
    let target = list[i]
    let left = 0
    let right = nums.length - 1
    while (nums[left] !== target) {
      left++
    }
    while (nums[right] !== target) {
      right--
    }
    // 取最短长度
    ans = Math.min(right - left + 1, ans)
  }
  return ans
}
```

## 746. 使用最小花费爬楼梯

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221029171434.png)

```javascript
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function (cost) {
  let len = cost.length
  // dp[i] 表示前 i 步楼梯的最小花费
  const dp = new Array(len + 1).fill(0)
  for (let i = 2; i <= len; i++) {
    // 有两种情况可以走到当前步 取两种情况的较小花费
    // 1. 从前一步走过来的 那花费是 dp[i - 1] + cost[i - 1]
    // 2. 从前二步走过来的 那花费是 dp[i - 2] + cost[i - 2]
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
  }
  return dp[len]
}
```

## 783. 二叉搜索树节点最小距离

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221031171856.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDiffInBST = function (root) {
  let nodes = []
  search(root, nodes)
  // 找出最小间距
  let ans = Infinity
  for (let i = 1; i < nodes.length; i++) {
    ans = Math.min(nodes[i] - nodes[i - 1], ans)
  }
  return ans
}

// 中序遍历 按照从小到大搜索出所有节点值
var search = function (root, list) {
  if (!root) return
  search(root.left, list)
  list.push(root.val)
  search(root.right, list)
}
```

## 796. 旋转字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221031173155.png)

```javascript
/**
 * @param {string} s
 * @param {string} goal
 * @return {boolean}
 */
var rotateString = function (s, goal) {
  // 每次旋转一步 直到旋转一个圈
  for (let i = 0; i < s.length; i++) {
    if (s.slice(i) + s.slice(0, i) === goal) {
      return true
    }
  }
  // 旋转一圈都不能满足条件 返回false
  return false
}
```

## 821. 字符的最短距离

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221101154257.png)

```javascript
/**
 * @param {string} s
 * @param {character} c
 * @return {number[]}
 */
var shortestToChar = function (s, c) {
  let ans = new Array(s.length)
  for (let i = 0; i < s.length; i++) {
    if (s[i] === c) {
      // 刚好是目标字符
      ans[i] = 0
    } else {
      // 往左右找最近的目标字母
      let left = i - 1
      let right = i + 1
      while (s[left] !== c && left > -1) {
        left--
      }
      while (s[right] !== c && right < s.length) {
        right++
      }
      if (left < 0) left = -Infinity // 处理左边界
      if (right >= s.length) right = Infinity // 处理右边界
      ans[i] = Math.min(i - left, right - i)
    }
  }
  return ans
}
```

## 844. 比较含退格的字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221102213728.png)

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var backspaceCompare = function (s, t) {
  let arr1 = [] // s 去掉退格后的数组
  let arr2 = [] // t 去掉退格后的数组
  for (let i = 0; i < s.length; i++) {
    // 如果是 ‘#’ 删除一个字符
    if (s[i] === '#') {
      arr1.pop()
    } else {
      // 是非 ‘#’
      arr1.push(s[i])
    }
  }
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '#') {
      arr2.pop()
    } else {
      arr2.push(t[i])
    }
  }
  return arr1.join() === arr2.join()
}

backspaceCompare('ab#c', 'ad#c')
```

## 860. 柠檬水找零

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221102215825.png)

```javascript
/**
 * @param {number[]} bills
 * @return {boolean}
 */
var lemonadeChange = function (bills) {
  let count5 = 0 // 表示5的张数
  let count10 = 0 // 表示5的张数
  for (let i = 0; i < bills.length; i++) {
    if (bills[i] === 5) {
      count5++
    } else if (bills[i] === 10) {
      count5--
      count10++
    } else {
      // 如果是20 优先找给顾客10块 再找5块
      let temp = 15
      if (count10 > 0) {
        count10--
        temp -= 10
      }
      count5 -= Math.round(temp / 5)
    }
    if (count5 < 0) return false
  }
  return true
}
```

## 872. 叶子相似的树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221103222030.png)

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
 * @return {boolean}
 */
var leafSimilar = function (root1, root2) {
  let list1 = []
  let list2 = []
  search(root1, list1)
  search(root2, list2)
  return list1.toString() === list2.toString()
}

var search = function (root, list) {
  if (!root) return
  if (root && !root.left && !root.right) {
    list.push(root.val)
    return
  }
  search(root.left, list)
  search(root.right, list)
}
```

## 868. 二进制间距

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221103222630.png)

```javascript
var binaryGap = function (n) {
  let last = -1,
    ans = 0
  for (let i = 0; n != 0; ++i) {
    // 获取n的最后一位
    if ((n & 1) === 1) {
      if (last !== -1) {
        ans = Math.max(ans, i - last)
      }
      last = i
    }
    // 移位运算 丢弃最后一位
    n >>= 1
  }
  return ans
}
```

## 897. 递增顺序搜索树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221104214123.png)

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
var increasingBST = function (root) {
  let list = []
  search(root, list)
  for (let i = 0; i < list.length; i++) {
    list[i].left = null
    list[i].right = list[i + 1] || null
  }
  return list[0]
}

var search = function (root, list) {
  if (!root) return
  search(root.left, list)
  list.push(root)
  search(root.right, list)
}
```

## 884. 两句话中的不常见单词

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221105161544.png)

```javascript
/**
 * @param {string} s1
 * @param {string} s2
 * @return {string[]}
 */
var uncommonFromSentences = function (s1, s2) {
  // 根据题意 可以先把s1和s2的单词全部找出来连起来 然后找出出现一次的单词即可
  // words 存放所有的单词
  let words = s1.split(' ').concat(s2.split(' '))
  let map = {} //记录单词频率
  for (let i = 0; i < words.length; i++) {
    map[words[i]] = map[words[i]] ? map[words[i]] + 1 : 1
  }
  let ans = []
  for (const key in map) {
    // 如果是出现一次
    if (map[key] === 1) ans.push(key)
  }
  return ans
}
```

## 896. 单调数列

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221105165710.png)

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var isMonotonic = function (nums) {
  if (nums.length < 3) return true
  let isIncrease = true // 是否递增
  let isDecrease = true // 是否递减
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) isDecrease = false
    if (nums[i] < nums[i - 1]) isIncrease = false
    // 如果非递增也非递减 返回false
    if (!isDecrease && !isIncrease) return false
  }
  return true
}
```

## 867. 转置矩阵

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221112221440.png)

```javascript
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function (matrix) {
  const m = matrix.length,
    n = matrix[0].length
  const transposed = new Array(n).fill(0).map(() => new Array(m).fill(0))
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      transposed[j][i] = matrix[i][j]
    }
  }
  return transposed
}
```

## 922. 按奇偶排序数组 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221113155052.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParityII = function (nums) {
  let odd = [] // 奇数
  let even = [] // 偶数

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 === 0) {
      even.push(nums[i])
    } else {
      odd.push(nums[i])
    }
  }

  let flag = true
  for (let i = 0; i < nums.length; i++) {
    // 根据当前位置i填充奇数偶数
    if (flag) {
      nums[i] = even.shift()
    } else {
      nums[i] = odd.shift()
    }
    flag = !flag
  }
  return nums
}
```

## 925. 长按键入

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221113162112.png)

```javascript
/**
 * @param {string} name
 * @param {string} typed
 * @return {boolean}
 */
var isLongPressedName = function (name, typed) {
  let left = 0
  for (let i = 0; i < name.length; i++) {
    // 匹配不上直接返回false
    if (name[i] !== typed[left]) return false
    // 如果name下个字母与当前相同
    if (name[i + 1] === name[i]) {
      left++
    } else {
      // 如果name下个字母与当前不同 删除typed后面的与当前相同的字母
      let temp = left + 1
      while (typed[temp] === typed[left]) {
        temp++
      }
      left = temp
    }
  }
  return left === typed.length
}
```

## 917. 仅仅反转字母

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221116221539.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var reverseOnlyLetters = function (s) {
  let position = [] //记录所有字母的位置
  for (let i = 0; i < s.length; i++) {
    if (/[a-zA-Z]/.test(s[i])) {
      position.push(i)
    }
  }
  let arr = s.split('')
  let left = 0
  let right = position.length - 1
  // 交换字母的位置
  while (left < right) {
    let temp = arr[position[left]]
    arr[position[left]] = arr[position[right]]
    arr[position[right]] = temp
    left++
    right--
  }
  return arr.join('')
}
```

## 977. 有序数组的平方

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221116222248.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortedSquares = function (nums) {
  nums.sort((a, b) => {
    return Math.abs(a) - Math.abs(b)
  })
  return nums.map((num) => num * num)
}
```

## 965. 单值二叉树

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221116222843.png)

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
var isUnivalTree = function (root) {
  return search(root, root.val)
}

var search = function (root, val) {
  if (!root) return true // 空 不用检测 直接返回true
  if (root.val !== val) return false // 值不同返回false
  // 值相同  检测左右子树
  return search(root.left, val) && search(root.right, val)
}
```

## 961. 在长度 2N 的数组中找出重复 N 次的元素

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221117105315.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var repeatedNTimes = function (nums) {
  // 哈希表记录出现的频率 超过一半就 return
  const map = {}
  let len = nums.length
  for (let i = 0; i < len; i++) {
    map[nums[i]] = map[nums[i]] ? map[nums[i]] + 1 : 1
    if (map[nums[i]] === len / 2) return nums[i]
  }
}
```

## 989. 数组形式的整数加法

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221118112551.png)

```javascript
/**
 * @param {number[]} num
 * @param {number} k
 * @return {number[]}
 */
var addToArrayForm = function (num, k) {
  let num1 = []
  while (k > 0) {
    num1.unshift(k % 10)
    k = Math.floor(k / 10)
  }
  const ans = []
  let carry = 0
  while (num.length || num1.length || carry) {
    let n1 = num.pop() || 0
    let n2 = num1.pop() || 0
    // 求当前和
    let sum = n1 + n2 + carry
    // 重置进位
    carry = sum > 9 ? 1 : 0
    // 推入当前位
    ans.unshift(sum % 10)
  }
  return ans
}
```

## 1002. 查找共用字符

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221119221824.png)

```javascript
/**
 * @param {string[]} words
 * @return {string[]}
 */
var commonChars = function (words) {
  let ans = Array.from(words[0])
  for (let i = 1; i < words.length; i++) {
    let j = 0
    let temp = Array.from(words[i])
    while (j < ans.length) {
      let index = temp.indexOf(ans[j])
      // 当前单词中不包含这个字符 从结果中删除
      if (index < 0) {
        ans.splice(j, 1)
      } else {
        // 当前单词中包含这个字符 从temp中删除这个字符(避免重复)
        temp.splice(index, 1)
        j++
      }
    }
  }
  return ans
}
```

## 1022. 从根到叶的二进制数之和

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221120141557.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var sumRootToLeaf = function (root) {
  const paths = []
  // 搜索所有路径
  handle(root, '', paths)
  let ans = 0
  // 计算所有路径和
  for (let i = 0; i < paths.length; i++) {
    ans += parseInt(paths[i], 2) // 二进制转十进制
  }
  return ans
}

var handle = function (node, current, paths) {
  if (!node.left && !node.right) {
    paths.push(current + node.val)
    return
  }
  if (node.left) handle(node.left, current + node.val, paths)
  if (node.right) handle(node.right, current + node.val, paths)
}
```

## 1047. 删除字符串中的所有相邻重复项

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221121222047.png)

```javascript
var removeDuplicates = function (s) {
  const stk = []
  for (const ch of s) {
    if (stk.length && stk[stk.length - 1] === ch) {
      stk.pop()
    } else {
      stk.push(ch)
    }
  }
  return stk.join('')
}
```

## 1051. 高度检查器

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221122175148.png)

```javascript
/**
 * @param {number[]} heights
 * @return {number}
 */
var heightChecker = function (heights) {
  // 复制数组并排序
  let temp = [...heights]
  temp.sort((a, b) => a - b)
  let ans = 0
  // 检测排序好的和原来的  如果不同ans+1
  for (let i = 0; i < temp.length; i++) {
    if (temp[i] !== heights[i]) ans++
  }
  return ans
}
```

## 883. 三维形体投影面积

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221126225148.png)

```javascript
var projectionArea = function (grid) {
  const n = grid.length
  let xyArea = 0,
    yzArea = 0,
    zxArea = 0
  for (let i = 0; i < n; i++) {
    let yzHeight = 0,
      zxHeight = 0
    for (let j = 0; j < n; j++) {
      xyArea += grid[i][j] > 0 ? 1 : 0
      yzHeight = Math.max(yzHeight, grid[j][i])
      zxHeight = Math.max(zxHeight, grid[i][j])
    }
    yzArea += yzHeight
    zxArea += zxHeight
  }
  return xyArea + yzArea + zxArea
}
```

## 1103. 分糖果 II

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221214165238.png)

```javascript
/**
 * @param {number} candies
 * @param {number} num_people
 * @return {number[]}
 */
var distributeCandies = function (candies, num_people) {
  let ans = new Array(num_people).fill(0)

  let count = 1 // 当前应该发的糖果
  let position = 0 // 当前该给哪个小朋友发
  while (candies > 0) {
    // 如果剩余充足就发count 不足就发剩余的全部
    let temp = candies >= count ? count : candies
    ans[position] = ans[position] + temp
    candies -= count
    count++
    position++
    // 如果发完一圈 重置位置为第一个小朋友
    if (position === num_people) position = 0
  }
  return ans
}
```

## 1122. 数组的相对排序

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/202212151529994.png)

```javascript
/**
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @return {number[]}
 */
var relativeSortArray = function (arr1, arr2) {
  let rest = []
  const map = {}
  // 分开包含的和不包含的
  for (let i = 0; i < arr1.length; i++) {
    let idx = arr2.indexOf(arr1[i])
    if (idx === -1) {
      rest.push(arr1[i])
    } else {
      if (map[arr1[i]]) {
        map[arr1[i]].count += 1
      } else {
        map[arr1[i]] = { count: 1, idx }
      }
    }
  }
  rest.sort((a, b) => a - b)
  let res = new Array(arr2.length)
  // 按照数字个数生成二维数组
  for (const key in map) {
    res[map[key].idx] = new Array(map[key].count).fill(parseInt(key))
  }
  res = res.concat(rest) // 接上剩余的
  return res.flat(2) // 拍平二维数组
}
```

## 1160. 拼写单词

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221217231428.png)

```javascript
/**
 * @param {string[]} words
 * @param {string} chars
 * @return {number}
 */
var countCharacters = function (words, chars) {
  let ans = ''
  for (let i = 0; i < words.length; i++) {
    let temp = chars
    let word = words[i]
    for (let j = 0; j < word.length; j++) {
      let idx = temp.indexOf(word[j])
      if (idx === -1) break // 没匹配到 直接break
      if (j === word.length - 1) ans += word // 最后一个字母匹配成功 计入结果
      temp = temp.slice(0, idx) + temp.slice(idx + 1)
    }
  }
  return ans.length
}
```

## 1189. “气球” 的最大数量

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221219112055.png)

```javascript
/**
 * @param {string} text
 * @return {number}
 */
var maxNumberOfBalloons = function (text) {
  const balloon = 'balloon'
  let flag = true
  let ans = 0
  while (flag) {
    for (let i = 0; i < balloon.length; i++) {
      let idx = text.indexOf(balloon[i])
      if (idx === -1) {
        // 找不到 直接退出
        flag = false
        break
      } else {
        text = text.slice(0, idx) + text.slice(idx + 1)
        // 如果是最后一个字母 结果++
        if (i === balloon.length - 1) ans++
      }
    }
  }
  return ans
}
```

## 1221. 分割平衡字符串

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/202212191819198.png)

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var balancedStringSplit = function (s) {
  let ans = 0
  let l = 0
  let r = 0
  for (let i = 0; i < s.length; i++) {
    if (s[i] === 'L') {
      l++
    } else {
      r++
    }
    // 如果左右相等且都不为0 则为一组达到平衡
    if (l !== 0 && l === r) {
      ans++
      l = 0
      r = 0
    }
  }
  return ans
}
```

## 1200. 最小绝对差

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221220150357.png)

```javascript
/**
 * @param {number[]} arr
 * @return {number[][]}
 */
var minimumAbsDifference = function (arr) {
  arr.sort((a, b) => a - b)
  let min = Infinity
  // 先找出最小差值
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] < min) min = arr[i] - arr[i - 1]
  }
  let ans = []
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] === min) ans.push([arr[i - 1], arr[i]])
  }
  return ans
}
```

## 1295. 统计位数为偶数的数字

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221221114318.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var findNumbers = function (nums) {
  let ans = 0
  for (let i = 0; i < nums.length; i++) {
    if (nums[i].toString().length % 2 === 0) asn++
  }
  return ans
}
```

## 1309. 解码字母到整数映射

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221221153947.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var freqAlphabets = function (s) {
  let letters = 'abcdefghijklmnopqrstuvwxyz'
  let stack = Array.from(s)
  let ans = ''
  while (stack.length > 0) {
    if (stack[stack.length - 1] === '#') {
      stack.pop()
      let l1 = stack.pop()
      let l2 = stack.pop()
      ans = letters[l2 + l1 - 1] + ans
    } else {
      ans = letters[stack.pop() - 1] + ans
    }
  }
  return ans
}
```

## 1342. 将数字变成 0 的操作次数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221221160058.png)

```javascript
/**
 * @param {number} num
 * @return {number}
 */
var numberOfSteps = function (num) {
  let ans = 0
  while (num !== 0) {
    if (num % 2 === 0) {
      num = num / 2
    } else {
      num -= 1
    }
    ans++
  }
  return ans
}

numberOfSteps(14)
```

## 1365. 有多少小于当前数字的数字

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221222144853.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var smallerNumbersThanCurrent = function (nums) {
  const len = nums.length
  let ans = new Array(len)
  for (let i = 0; i < len; i++) {
    let count = 0
    for (let j = 0; j < len; j++) {
      if (nums[j] < nums[i]) count++
    }
    ans[i] = count
  }
  return ans
}
```

## 1304. 和为零的 N 个不同整数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221222211931.png)

```javascript
/**
 * @param {number} n
 * @return {number[]}
 */
var sumZero = function (n) {
  const ans = []
  let temp = 1
  while (n > 1) {
    ans.push(temp)
    ans.push(-temp)
    n -= 2
    temp++
  }
  if (n === 1) ans.push(0)
  return ans
}
```

## 1331. 数组序号转换

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221222214101.png)

```javascript
var arrayRankTransform = function (arr) {
  const sortedArr = new Array(arr.length).fill(0)
  sortedArr.splice(0, arr.length, ...arr)
  sortedArr.sort((a, b) => a - b)
  const ranks = new Map()
  const ans = new Array(arr.length).fill(0)
  for (const a of sortedArr) {
    if (!ranks.has(a)) {
      ranks.set(a, ranks.size + 1)
    }
  }
  for (let i = 0; i < arr.length; i++) {
    ans[i] = ranks.get(arr[i])
  }
  return ans
}
```

## 1351. 统计有序矩阵中的负数

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221222224643.png)

```javascript
/**
 * @param {number[][]} grid
 * @return {number}
 */
var countNegatives = function (grid) {
  let m = grid.length
  let n = grid[0].length
  let ans = 0
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (grid[i][j] < 0) {
        ans++
      } else {
        break
      }
    }
  }
  return ans
}
```

## 1389. 按既定顺序创建目标数组

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221224170219.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number[]} index
 * @return {number[]}
 */
var createTargetArray = function (nums, index) {
  let target = []
  for (let i = 0; i < nums.length; i++) {
    target.splice(index[i], nums[i])
  }
  return target
}
```

## 1408. 数组中的字符串匹配

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221224210837.png)

```javascript
/**
 * @param {string[]} words
 * @return {string[]}
 */
var stringMatching = function (words) {
  const ans = []
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      // 如果是本身 或者长度不匹配 continue
      if (i === j || words[i].length > words[j].length) continue
      if (words[j].includes(words[i])) {
        ans.push(words[i])
        break
      }
    }
  }
  return ans
}
```

## 1431. 拥有最多糖果的孩子

![](https://gcy-1306312261.cos.ap-chengdu.myqcloud.com/blog/20221224211701.png)

```javascript
/**
 * @param {number[]} candies
 * @param {number} extraCandies
 * @return {boolean[]}
 */
var kidsWithCandies = function (candies, extraCandies) {
  let max = Math.max(...candies)
  const ans = []
  for (let i = 0; i < candies.length; i++) {
    // 如果当前糖果加备选大于等于max 则为true
    ans.push(candies[i] + extraCandies >= max)
  }
  return ans
}
```

