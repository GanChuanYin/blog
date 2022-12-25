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
