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

let root = array2List([6, 6, 6])

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
  if (!head) return null
  let ans = head
  let current = head
  while (current) {
    if (current.val === val) {
      ans = current.next
    } else if (current.next) {
      if (current.next.val === val) {
        current.next = current.next.next
      }
    }
    current = current.next
  }
  return ans
}
console.log(removeElements(root, 6))
