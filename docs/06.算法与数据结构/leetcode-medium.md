## 两数相加

![](https://qiniu.espe.work/blog/20220810002250.png)
![](https://qiniu.espe.work/blog/20220810002328.png)

类似大数相加

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  if (!l1 && !l2) return null
  const arr1 = []
  const arr2 = []
  while (l1) {
    arr1.push(l1.val)
    l1 = l1.next
  }
  while (l2) {
    arr2.push(l2.val)
    l2 = l2.next
  }

  const res = []
  let = carryBit = 0
  while (arr1.length && arr2.length) {
    let num = arr1.shift() + arr2.shift() + carryBit
    carryBit = 0
    if (num > 9) {
      carryBit = 1
      num -= 10
    }
    res.push(num)
  }

  while (arr1.length) {
    let num = arr1.shift() + carryBit
    carryBit = 0
    if (num > 9) {
      carryBit = 1
      num -= 10
    }
    res.push(num)
  }
  while (arr2.length) {
    let num = arr2.shift() + carryBit
    carryBit = 0
    if (num > 9) {
      carryBit = 1
      num -= 10
    }
    res.push(num)
  }

  if (carryBit) {
    res.push(1)
  }

  const root = new ListNode(res[0])
  let current = root
  for (let index = 1; index < res.length; index++) {
    current.next = new ListNode(res[index])
    current = current.next
  }
  return root
}
```

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  const dummy = new ListNode()
  let carry = 0
  let cur = dummy
  while (l1 || l2 || carry) {
    const s = (l1?.val || 0) + (l2?.val || 0) + carry
    carry = Math.floor(s / 10)
    cur.next = new ListNode(s % 10)
    cur = cur.next
    l1 = l1?.next
    l2 = l2?.next
  }
  return dummy.next
}
```

## 盛最多水的容器

![](https://qiniu.espe.work/blog/20220811214008.png)
![](https://qiniu.espe.work/blog/20220811214022.png)

双指针解决。

一开始，我们考虑相距最远的两个柱子所能容纳水的面积。水的宽度是两根柱子之间的距离，而水的高度取决于两根柱子之间较短的那个。

- 当前柱子是最两侧的柱子，水的宽度最大，其他的组合，水的宽度都比这个小；
- 当前左侧柱子较短，决定了水的高度。如果移动左侧的柱子，新的水面高度不确定，但一定不会超过右侧的柱子高度；
- <font color=#dd0000 size=4>`如果移动右侧的柱子，新的水面高度一定不会超过左侧的柱子高度，也就是不会超过当前的水面高度。`</font>

可见，如果固定左侧的柱子，向内移动右侧的柱子，水的高度一定不会增加，且宽度一定减少，所以水的面积一定减少。所以左侧的柱子跟右侧其他柱子的组合，都可以排除了。也就是代码中的 i++。

移动左侧的柱子中，重复进行上面的操作。

在此过程中，我们不断排除掉无法成为构成最大值的柱子组合，而每一次都获取到可能为最大值的面积 t。那么遍历结束之后，我们就可以得到最大值。

```javascript
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
  let i = 0,
    j = height.length - 1
  let res = 0
  while (i < j) {
    const t = (j - i) * Math.min(height[i], height[j])
    res = Math.max(res, t)
    if (height[i] < height[j]) ++i
    else --j
  }
  return res
}
```

## 括号生成

![](https://qiniu.espe.work/blog/20220813213804.png)

![](https://qiniu.espe.work/blog/20220813215622.png)

画图以后，可以分析出的结论：

- 当前左右括号都有大于 00 个可以使用的时候，才产生分支；
- 产生左分支的时候，只看当前是否还有左括号可以使用；
- 产生右分支的时候，还受到左分支的限制，右边剩余可以使用的括号数量一定得在严格大于左边剩余的数量的时候，才可以产生分支；
- 在左边和右边剩余的括号数都等于 00 的时候结算。

```javascript
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  const generateOne = (list, str, left, right) => {
    if (left == 0 && right == 0) {
      list.push(str)
      return
    }
    if (left > 0) {
      generateOne(list, str + '(', left - 1, right)
    }
    // 可用的括号 右括号大于左括号时，说明有 左括号先放置，才会是有效的括号组合
    if (right > left) {
      generateOne(list, str + ')', left, right - 1)
    }
  }
  const res = []
  generateOne(res, '', n, n)
  return res
}
```

进阶: 组合法

比如 n=1 时为“（）”，那么 n=2 时，“0（1）2”，有 0,1,2 三个位置可以插入一个完整的“（）”，分别得到“（）（）”，“（（））”，以及“（）（）”，去除重复的就得到了 n=2 时的结果。

![](https://qiniu.espe.work/blog/20220813215158.png)
