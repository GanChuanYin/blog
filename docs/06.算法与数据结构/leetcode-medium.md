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
