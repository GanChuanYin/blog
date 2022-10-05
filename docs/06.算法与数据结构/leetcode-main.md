> 记录我的 leetcode 薄弱题目

## 39. 组合总和

![](https://qiniu.espe.work/blog/20220913143726.png)

![](https://qiniu.espe.work/blog/20220913143734.png)

```javascript
var combinationSum = function(candidates, target) {
  const ans = []

  const dfs = (target, combine, idx) => {
    if (idx === candidates.length) {
      return
    }
    if (target === 0) {
      ans.push(combine)
      return
    }
    // 直接跳过
    dfs(target, combine, idx + 1)
    // 选择当前数
    if (target - candidates[idx] >= 0) {
      dfs(target - candidates[idx], [...combine, candidates[idx]], idx)
    }
  }

  dfs(target, [], 0)
  return ans
}
```

![](https://qiniu.espe.work/blog/20220913143801.png)

## 96. 不同的二叉搜索树

![](https://qiniu.espe.work/blog/20220913154258.png)

![](https://qiniu.espe.work/blog/20220913154304.png)

![](https://qiniu.espe.work/blog/20220913154314.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var numTrees = function(n) {
  const dp = new Array(n + 1).fill(0)
  dp[0] = 1
  dp[1] = 1

  for (let i = 2; i <= n; ++i) {
    for (let j = 1; j <= i; ++j) {
      dp[i] += dp[j - 1] * dp[i - j]
    }
  }

  return dp[n]
}
```

## 72. 编辑距离

![](https://qiniu.espe.work/blog/20220913172120.png)

![](https://qiniu.espe.work/blog/20220913172129.png)

```javascript
var minDistance = function(word1, word2) {
  let m = word1.length
  let n = word2.length
  let dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  // 初始化
  for (let i = 1; i <= m; i++) {
    dp[i][0] = i
  }
  for (let j = 1; j <= n; j++) {
    dp[0][j] = j
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        // 最后一位字符一样，不需要任何操作
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        // 插入、删除、替换
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
      }
    }
  }
  return dp[m][n]
}
```

## 85. 最大矩形

![](https://qiniu.espe.work/blog/20220914101300.png)

![](https://qiniu.espe.work/blog/20220914101309.png)

![](https://qiniu.espe.work/blog/20220914101319.png)

```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalRectangle = function(matrix) {
  const m = matrix.length
  if (m === 0) {
    return 0
  }
  const n = matrix[0].length
  const left = new Array(m).fill(0).map(() => new Array(n).fill(0))

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === '1') {
        left[i][j] = (j === 0 ? 0 : left[i][j - 1]) + 1
      }
    }
  }

  let ret = 0
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (matrix[i][j] === '0') {
        continue
      }
      let width = left[i][j]
      let area = width
      for (let k = i - 1; k >= 0; k--) {
        width = Math.min(width, left[k][j])
        area = Math.max(area, (i - k + 1) * width)
      }
      ret = Math.max(ret, area)
    }
  }
  return ret
}
```

## 338. 比特位计数

![](https://qiniu.espe.work/blog/20220914224017.png)

![](https://qiniu.espe.work/blog/20220914224006.png)

```javascript
var countBits = function(n) {
  const bits = new Array(n + 1).fill(0)
  let highBit = 0
  for (let i = 1; i <= n; i++) {
    if ((i & (i - 1)) == 0) {
      highBit = i
    }
    bits[i] = bits[i - highBit] + 1
  }
  return bits
}
```

## 312. 戳气球

![](https://qiniu.espe.work/blog/20220915170349.png)

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxCoins = function(nums) {
  let n = nums.length
  // 添加两侧的虚拟气球
  let points = new Array(n + 2)
  points[0] = points[n + 1] = 1
  for (let i = 1; i <= n; i++) {
    points[i] = nums[i - 1]
  }
  // base case 已经都被初始化为 0
  let dp = new Array(n + 2).fill(0).map(() => new Array(n + 2).fill(0))
  // 开始状态转移
  // i 应该从下往上
  for (let i = n; i >= 0; i--) {
    // j 应该从左往右
    for (let j = i + 1; j < n + 2; j++) {
      // 最后戳破的气球是哪个？
      for (let k = i + 1; k < j; k++) {
        // 择优做选择
        dp[i][j] = Math.max(
          dp[i][j],
          dp[i][k] + dp[k][j] + points[i] * points[j] * points[k]
        )
      }
    }
  }
  return dp[0][n + 1]
}
```

## 416. 分割等和子集

![](https://qiniu.espe.work/blog/20220915180215.png)

https://leetcode.cn/problems/partition-equal-subset-sum/solution/fen-ge-deng-he-zi-ji-by-leetcode-solution/

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
  const n = nums.length
  if (n < 2) {
    return false
  }
  let sum = 0,
    maxNum = 0
  for (const num of nums) {
    sum += num
    maxNum = maxNum > num ? maxNum : num
  }
  if (sum & 1) {
    return false
  }
  const target = Math.floor(sum / 2)
  if (maxNum > target) {
    return false
  }
  const dp = new Array(target + 1).fill(false)
  dp[0] = true
  for (const num of nums) {
    for (let j = target; j >= num; --j) {
      dp[j] |= dp[j - num]
    }
  }
  return dp[target]
}
```

## 621. 任务调度器

![](https://qiniu.espe.work/blog/20220915184345.png)

![](https://qiniu.espe.work/blog/20220915184339.png)

```javascript
var leastInterval = function(tasks, n) {
  if (n < 1) return tasks.length
  let map = new Map()
  for (let task of tasks) {
    map.set(task, map.has(task) ? map.get(task) + 1 : 1)
  }
  let counts = Array.from(map)
    .map((item) => item[1])
    .sort((a, b) => b - a)
  let maxCount = 0
  for (let count of counts) {
    if (count === counts[0]) maxCount++
    else break
  }
  let sum = (counts[0] - 1) * (n + 1) + maxCount
  return sum > tasks.length ? sum : tasks.length
}
```

## 32. 最长有效括号

![](https://qiniu.espe.work/blog/20220917174211.png)

- 用栈模拟一遍，将所有无法匹配的括号的位置全部置 false
- 例如: "()(()"的 mark 为[true, true, false, true, true]
- 再例如: ")()((())"的 mark 为[false, true, true, false, true, true, true, true]
- 经过这样的处理后, 此题就变成了寻找最长的连续的 true 的长度

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  if (s.length < 2) return 0
  let arr = new Array(s.length).fill(true)
  let notMatch = isValid(s)
  for (let i = 0; i < notMatch.length; i++) {
    arr[notMatch[i]] = false
  }
  let ans = 0
  let i = 0
  while (i < s.length) {
    if (arr[i]) {
      let j = i + 1
      while (arr[j]) {
        j++
      }
      ans = Math.max(ans, j - i)
      i = j
    } else {
      i++
    }
  }
  return ans
}

var isValid = function(s) {
  let stack = []
  let res = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i)
    } else {
      if (stack.length === 0) {
        res.push(i)
      } else {
        stack.pop()
      }
    }
  }
  while (stack.length) {
    res.push(stack.pop())
  }
  return res
}
```

## 89. 格雷编码

![](https://qiniu.espe.work/blog/20220918163947.png)

![](https://qiniu.espe.work/blog/20220918164010.png)

```javascript
var grayCode = function(n) {
  const ret = [0]
  for (let i = 1; i <= n; i++) {
    const m = ret.length
    for (let j = m - 1; j >= 0; j--) {
      ret.push(ret[j] | (1 << (i - 1)))
    }
  }
  return ret
}
```

## 16. 最接近的三数之和

![](https://qiniu.espe.work/blog/20220918231349.png)

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
  // 升序排序
  nums.sort((a, b) => a - b)
  // 初始化一个最小值
  let min = Infinity
  const len = nums.length
  for (let i = 0; i < len - 2; i++) {
    // 定义左右指针
    let left = i + 1,
      right = len - 1
    while (left < right) {
      // 当前三数之和
      const sum = nums[i] + nums[left] + nums[right]
      // 如果当前和更接近，更新最小值
      if (Math.abs(sum - target) < Math.abs(min - target)) {
        min = sum
      }
      // 根据sum和target的关系，移动指针
      if (sum < target) {
        left++
      } else if (sum > target) {
        right--
      } else {
        // sum和target相等，直接返回sum，肯定是最小的了
        return sum
      }
    }
  }
  // 遍历结束，返回最接近的和
  return min
}
```

## 12. 整数转罗马数字

![](https://qiniu.espe.work/blog/20220919171624.png)

```javascript
/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
  const valueSymbols = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ]
  const roman = []
  for (const [value, symbol] of valueSymbols) {
    while (num >= value) {
      num -= value
      roman.push(symbol)
    }
    if (num == 0) {
      break
    }
  }
  return roman.join('')
}
```

## 71. 简化路径

![](https://qiniu.espe.work/blog/20220922155335.png)

重点是利用栈和 根据 / 切割

```javascript
var simplifyPath = function(path) {
  const names = path.split('/') // 所有路径都是以 / 分割
  const stack = []
  for (const name of names) {
    if (name === '..') {
      if (stack.length) {
        stack.pop() // 遇到 .. pop上一个
      }
    } else if (name.length && name !== '.') {
      stack.push(name) // 如果等于 . 直接跳过  如果是其它直接入栈
    }
  }
  return '/' + stack.join('/')
}
```

## 95. 不同的二叉搜索树 II

![](https://qiniu.espe.work/blog/20220923182843.png)

```javascript
/**
 * @param {number} n
 * @return {TreeNode[]}
 */
var generateTrees = function(n) {
  let nums = []
  for (let i = 1; i <= n; i++) {
    nums.push(i)
  }
  return handle(nums)
}

var handle = function(nums) {
  if (nums.length === 0) return [null] // 如果nums长度为0 直接返回null
  let allNodes = []
  for (let i = 0; i < nums.length; i++) {
    let leftNodes = handle(nums.slice(0, i)) // 返回左树列表
    let rightNodes = handle(nums.slice(i + 1)) // 返回右树列表
    // 如果左右树都为空 则循环赋值时也会刚好生成一个节点 左右为null
    for (let j = 0; j < leftNodes.length; j++) {
      for (let k = 0; k < rightNodes.length; k++) {
        let node = new TreeNode(nums[i])
        node.right = rightNodes[k]
        node.left = leftNodes[j]
        allNodes.push(node)
      }
    }
  }
  return allNodes
}
```

## 65. 有效数字

![](https://qiniu.espe.work/blog/20220924120436.png)

```javascript
var isNumber = function(s) {
  // blank 表示空格
  // sign 表示正负号
  // digit 表示数字
  // . 就是小数点
  // e 就是 e
  const graph = {
    0: { blank: 0, sign: 1, '.': 2, digit: 6 },
    1: { digit: 6, '.': 2 },
    2: { digit: 3 },
    3: { digit: 3, e: 4, E: 4 },
    4: { digit: 5, sign: 7 },
    5: { digit: 5 },
    6: { digit: 6, '.': 3, e: 4, E: 4 },
    7: { digit: 5 }
  }

  let state = 0
  let char
  s = s.trim()
  for (char of s) {
    if (char >= '0' && char <= '9') {
      char = 'digit'
    } else if (char == ' ') {
      char = 'blank'
    } else if (char == '+' || char == '-') {
      char = 'sign'
    }
    state = graph[state][char]
    if (state == undefined) {
      return false
    }
  }
  // 3 是小数，5是科学计数法，6是整数
  return state == 3 || state == 5 || state == 6
}
```

## 97. 交错字符串

![](https://qiniu.espe.work/blog/20220925153609.png)

```javascript
var isInterleave = function(s1, s2, s3) {
  const m = s1.length + 1,
    n = s2.length + 1
  if (s3.length !== m + n - 2) return false
  const dp = []
  for (let i = 0; i < m; ++i) {
    const temp = new Array(n)
    dp.push(temp)
  }
  dp[0][0] = true
  for (let i = 1; i < m; ++i) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1]
  }
  for (let j = 1; j < n; ++j) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1]
  }
  for (let i = 1; i < m; ++i) {
    for (let j = 1; j < n; ++j) {
      dp[i][j] =
        (dp[i - 1][j] && s1[i - 1] === s3[i + j - 1]) ||
        (dp[i][j - 1] && s2[j - 1] === s3[i + j - 1])
    }
  }
  return dp[m - 1][n - 1]
}
```

## 115. 不同的子序列

![](https://qiniu.espe.work/blog/20220925153702.png)

![](https://qiniu.espe.work/blog/20220925153732.png)

```javascript
var numDistinct = function(s, t) {
  const m = s.length
  const n = t.length
  if (m < n) return 0
  const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) {
    dp[i][n] = 1
  }
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (s[i] == t[j]) {
        dp[i][j] = dp[i + 1][j + 1] + dp[i + 1][j]
      } else {
        dp[i][j] = dp[i + 1][j]
      }
    }
  }
  return dp[0][0]
}
```

## 123. 买卖股票的最佳时机 III

![](https://qiniu.espe.work/blog/20220925194911.png)

```javascript
/**
       对于任意一天考虑四个变量:
       fstBuy: 在该天第一次买入股票可获得的最大收益 
       fstSell: 在该天第一次卖出股票可获得的最大收益
       secBuy: 在该天第二次买入股票可获得的最大收益
       secSell: 在该天第二次卖出股票可获得的最大收益
       分别对四个变量进行相应的更新, 最后secSell就是最大
       收益值(secSell >= fstSell)
       **/

var maxProfit = function(prices) {
  const n = prices.length
  let fstBuy = -prices[0],
    secBuy = -prices[0]
  let fstSell = 0,
    secSell = 0
  for (let i = 1; i < n; i++) {
    fstBuy = Math.max(fstBuy, -prices[i])
    fstSell = Math.max(fstSell, fstBuy + prices[i])
    secBuy = Math.max(secBuy, fstSell - prices[i])
    secSell = Math.max(secSell, secBuy + prices[i])
  }
  return secSell
}
```

## 201. 数字范围按位与

![](https://qiniu.espe.work/blog/20220927182445.png)

![](https://qiniu.espe.work/blog/20220927182520.png)

```javascript
var rangeBitwiseAnd = function(m, n) {
  let shift = 0
  // 找到公共前缀
  while (m < n) {
    m >>= 1
    n >>= 1
    ++shift
  }
  return m << shift
}
```

## 203. 移除链表元素

![](https://qiniu.espe.work/blog/20220927212056.png)

```javascript
var removeElements = function(head, val) {
  if (head === null) {
    return head
  }
  head.next = removeElements(head.next, val)
  return head.val === val ? head.next : head
}
```

## 209. 长度最小的子数组

![](https://qiniu.espe.work/blog/20220928130852.png)

```javascript
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
  // 求出总和
  let allSums = nums.reduce((pre, cur) => {
    return pre + cur
  })
  if (allSums < target) return 0 //总和比目标小直接return
  let len = nums.length
  let ans = len // 最长子序列为len
  let currentSum = allSums // 当前总和
  for (let i = 0; i < len; i++) {
    if (nums[i] >= target) return 1
    // 从最后一个数开始 一个一个减去当前总和 直到当前总和小于target
    let j = len - 1
    let sum = currentSum
    while (sum >= target) {
      sum -= nums[j]
      j--
    }
    ans = Math.min(ans, j - i + 2) // 取较小结果
    currentSum -= nums[i]
    if (currentSum < target) break
  }
  return ans
}
```

## 222. 完全二叉树的节点个数

![](https://qiniu.espe.work/blog/20220928164051.png)

```javascript
/**
 * @param {TreeNode} root
 * @return {number}
 */
var countNodes = function(root) {
  if (!root) return 0
  let count = 1
  count += countNodes(root.left)
  count += countNodes(root.right)
  return count
}
```

## 241. 为运算表达式设计优先级

![](https://qiniu.espe.work/blog/20220929152520.png)

不断分割直到是数字字符串，然后返回包含该数字的数组，然后对左右两侧的递归结果进行组合

```javascript
var diffWaysToCompute = function(expression) {
  let results = []
  // 如果为纯数字 直接返回
  if (!isNaN(expression - 0)) {
    results.push(expression - 0)
    return results
  }

  for (let i = 0; i < expression.length; i++) {
    // 遇到操作符
    if (isNaN(expression[i])) {
      const operator = expression[i]
      // 分治法 分别计算操作符左右子串的结果集
      const left = diffWaysToCompute(expression.slice(0, i))
      const right = diffWaysToCompute(expression.slice(i + 1))
      // 组合左右子集的结果
      for (const l of left) {
        for (const r of right) {
          if (operator === '+') {
            results.push(l + r)
          } else if (operator === '-') {
            results.push(l - r)
          } else {
            results.push(l * r)
          }
        }
      }
    }
  }
  return results
}
```

![](https://qiniu.espe.work/blog/20220929154240.png)

## 260. 只出现一次的数字 III

![](https://qiniu.espe.work/blog/20220929155903.png)

![](https://qiniu.espe.work/blog/20220929155920.png)

```javascript
const singleNumber = (nums) => {
  let temp = 0
  const len = nums.length
  for (let i = 0; i < len; i++) {
    temp = temp ^ nums[i]
  }
  // 此时temp是两个不同的数异或的结果
  // 寻找k，k是temp最低位为1、其余位是0的二进制数
  let k = 1
  while ((temp & k) === 0) k = k << 1
  let [num1, num2] = [0, 0]
  for (let i = 0; i < len; i++) {
    // 分组，目的是将两个不同的数分开
    if (nums[i] & k) {
      num1 = num1 ^ nums[i]
    } else {
      num2 = num2 ^ nums[i]
    }
  }
  return [num1, num2]
}
```

## 263. 丑数

![](https://qiniu.espe.work/blog/20220930151738.png)

```javascript
/**
 * @param {number} n
 * @return {boolean}
 */
var isUgly = function(n) {
  while (n % 5 === 0) {
    n = n / 5
  }
  while (n % 3 === 0) {
    n = n / 3
  }
  while (n % 2 === 0) {
    n = n / 2
  }
  return n == 1
}
```

## 264. 丑数 II

![](https://qiniu.espe.work/blog/20220930151801.png)

![](https://qiniu.espe.work/blog/20220930151815.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function(n) {
  if (n <= 5) return n
  let ans = [1, 2, 3, 4, 5]
  let i = 6
  while (ans.length < n) {
    let num = i
    while (num % 5 === 0) {
      num = num / 5
    }
    while (num % 3 === 0) {
      num = num / 3
    }
    while (num % 2 === 0) {
      num = num / 2
    }
    if (num == 1) {
      ans.push(i)
    }
    i++
  }
  return ans[ans.length - 1]
}
```

## 316. 去除重复字母

![](https://qiniu.espe.work/blog/20220930175156.png)

```javascript
/**
 * @param {string} s
 * @return {string}
 */
var removeDuplicateLetters = function(s) {
  // 字典序，换成数字更好理解一点 a:1,b:2,c:3, d:4 那么：acdb => 1342 dcab => 4312
  //  4312 > 1342 所以 dcab > acdb 也可以想象在英语词典里，acdb会比dcab出现得更早，所以acdb的字典序更小
  let stack = []
  let set = new Set() //记录是否为新字符
  for (let i = 0; i < s.length; i++) {
    if (stack.length === 0) {
      stack.push(s[i])
      set.add(s[i])
      continue
    }
    // 遇到一个新字符 如果比栈顶小 并且在新字符后面还有和栈顶一样的 就把栈顶的字符抛弃了
    while (
      !set.has(s[i]) &&
      s[i] < stack[stack.length - 1] && // JS字母比较大小会自动转换
      s.slice(i + 1).includes(stack[stack.length - 1])
    ) {
      let letter = stack.pop()
      set.delete(letter)
    }
    if (!set.has(s[i])) {
      stack.push(s[i])
      set.add(s[i])
    }
  }
  return stack.join('')
}
```

## 306. 累加数

![](https://qiniu.espe.work/blog/20221001175352.png)

```javascript
var isAdditiveNumber = function(num) {
  const add = (l, r) => {
    let temp = parseInt(l) + parseInt(r)
    return temp.toString()
  }
  //只要确定前两个数，就可以判断了，那么就遍历所有的可能性
  if (num.length < 3) return false
  for (let i = 1; i < num.length; ++i) {
    if (num[0] == 0) {
      if (i > 1) break
    }
    for (let j = i + 1; j < num.length; ++j) {
      let l = num.slice(0, i)
      if (num[i] == 0) {
        if (j > i + 1) break
      }
      let r = num.slice(i, j)
      //从j开始验证
      let now = j
      while (now < num.length) {
        let temp = add(l, r)
        let k = 0
        for (k = 0; k < temp.length; ++k) {
          if (temp[k] != num[now + k]) break
        }
        if (k >= temp.length) {
          l = r
          r = temp
          now += temp.length
        } else break
      }
      if (now >= num.length) return true
    }
  }
  return false
}
```

## 368. 最大整除子集

![](https://qiniu.espe.work/blog/20221001193825.png)

```javascript
var largestDivisibleSubset = function(nums) {
  const len = nums.length
  nums.sort((a, b) => a - b)

  // 第 1 步：动态规划找出最大子集的个数、最大子集中的最大整数
  const dp = new Array(len).fill(1)
  let maxSize = 1
  let maxVal = dp[0]
  for (let i = 1; i < len; i++) {
    for (let j = 0; j < i; j++) {
      // 题目中说「没有重复元素」很重要
      if (nums[i] % nums[j] === 0) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }

    if (dp[i] > maxSize) {
      maxSize = dp[i]
      maxVal = nums[i]
    }
  }

  // 第 2 步：倒推获得最大子集
  const res = []
  if (maxSize === 1) {
    res.push(nums[0])
    return res
  }

  for (let i = len - 1; i >= 0 && maxSize > 0; i--) {
    if (dp[i] === maxSize && maxVal % nums[i] === 0) {
      res.push(nums[i])
      maxVal = nums[i]
      maxSize--
    }
  }
  return res
}
```

## 376. 摆动序列

![](https://qiniu.espe.work/blog/20221002191520.png)

![](https://qiniu.espe.work/blog/20221002191529.png)

![](https://qiniu.espe.work/blog/20221002191539.png)

![](https://qiniu.espe.work/blog/20221002191450.png)

```javascript
var wiggleMaxLength = function(nums) {
  const n = nums.length
  if (n < 2) return n
  const up = new Array(n).fill(0)
  const down = new Array(n).fill(0)
  up[0] = down[0] = 1
  for (let i = 1; i < n; i++) {
    if (nums[i] > nums[i - 1]) {
      up[i] = Math.max(up[i - 1], down[i - 1] + 1)
      down[i] = down[i - 1]
    } else if (nums[i] < nums[i - 1]) {
      up[i] = up[i - 1]
      down[i] = Math.max(up[i - 1] + 1, down[i - 1])
    } else {
      up[i] = up[i - 1]
      down[i] = down[i - 1]
    }
  }
  return Math.max(up[n - 1], down[n - 1])
}
```

## 319. 灯泡开关

![](https://qiniu.espe.work/blog/20221002195124.png)

![](https://qiniu.espe.work/blog/20221002195248.png)

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var bulbSwitch = function(n) {
  let i = 1
  let cnt = 0
  let ans = 0
  while (cnt < n) {
    cnt += i
    i += 2
    if (cnt <= n) ans++
  }
  return ans
}
```

## 377. 组合总和 Ⅳ

![](https://qiniu.espe.work/blog/20221004222546.png)

![](https://qiniu.espe.work/blog/20221004222554.png)

```javascript
var combinationSum4 = function(nums, target) {
  const dp = new Array(target + 1).fill(0)
  dp[0] = 1
  for (let i = 1; i <= target; i++) {
    for (const num of nums) {
      if (num <= i) {
        dp[i] += dp[i - num]
      }
    }
  }
  return dp[target]
}
```

## 336. 回文对

![](https://qiniu.espe.work/blog/20221005212826.png)

```javascript
/**
 * @param {string[]} words
 * @return {number[][]}
 */
var palindromePairs = function(words) {
  // 用Map存每个字符串的翻转
  const map = new Map()
  // 用Set存回文对的索引，以避免重复
  const set = new Set()
  // map的key为字符串的翻转，value为字符串的索引
  words.forEach((word, i) => {
    map.set(
      word
        .split('')
        .reverse()
        .join(''),
      i
    )
  })
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    for (let j = 0; j <= word.length; j++) {
      // 将字符串分为左右两个字串
      const left = word.slice(0, j),
        right = word.slice(j)
      // 如果左字符串是回文的
      if (isPalindrom(left)) {
        // 如果map里存有右字符串且索引不是i（题目写着要不同的索引对）
        if (map.has(right) && map.get(right) !== i) {
          // 满足前面条件的字符串为  右字符串的翻转 + 本身是回文的左字符串 + 右字符串
          // 这是一个回文字符串，其索引对为[map.get(right),i]
          // 因为数组没办法去重，所以用字符串表示并存入set
          const temp = `${map.get(right)},${i}`
          set.add(temp)
        }
      }
      // 如果右字符串是回文的
      if (isPalindrom(right)) {
        // 如果map里存有左字符串且索引不是i（题目写着要不同的索引对）
        if (map.has(left) && map.get(left) !== i) {
          // 满足前面条件的字符串为  左字符串 + 本身是回文的右字符串 + 左字符串的翻转
          const temp = `${i},${map.get(left)}`
          set.add(temp)
        }
      }
    }
  }
  // 将set中表示索引对的字符串转化为数组存到ans里
  const ans = [...set].map((v) => v.split(','))
  return ans
}
// 判断是否是回文字符串
function isPalindrom(str) {
  let i = 0,
    j = str.length - 1
  while (i < j) {
    if (str[i] !== str[j]) {
      return false
    }
    i++
    j--
  }
  return true
}
```
