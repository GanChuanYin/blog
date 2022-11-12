/**
 * 将数组转换为链表
 * @param  array  arr    需要转换的数组
 * @param  int    type   转换的类型，0为单链表，1为循环链表
 * @return object        返回链表
 */
function array2List(arr, type = 0) {
  if (!arr.length) return null
  let header = { val: arr[0], next: null }
  let obj = header
  for (let i = 1; i < arr.length; i++) {
    obj.next = { val: arr[i], next: null }
    obj = obj.next
  }
  if (type) obj.next = header
  return header
}

function traverseList(root) {
  let current = root
  let res = []
  while (current) {
    console.log(current.val)
    res.push(current.val)
    current = current.next
  }
  console.log(res)
  return res
}

let root = array2List([1, 2, 0, 4, 3])

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number[]} nums
 * @return {number}
 */
var numComponents = function(head, nums) {
  // 可以理解为搜索 nums 在链表上有几段
  let current = head
  let ans = 0
  while (current) {
    // 如果nums包含当前值
    if (nums.includes(current.val)) {
      let temp = current
      // 搜索连续段
      while (temp.next && nums.includes(temp.next.val)) {
        temp = temp.next
      }
      ans++
      current = temp.next
    } else {
      // nums不包含当前值 直接跳过
      current = current.next
    }
  }
  return ans
}

numComponents(root, [3, 4, 0, 2, 1])
