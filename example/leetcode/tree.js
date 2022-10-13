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
    res.push(current.val)
    current = current.next
  }
  console.log(res)
  return res
}

let linkRoot = array2List([-10, -3, 0, 5, 9])

function TreeNode(val) {
  this.val = val
  this.left = this.right = null
}

var createTree = function(nums) {
  if (!nums.length) return null
  let root = new TreeNode(nums[0])
  let queue = []
  queue.push(root)
  let cur
  let lineNodeNum = 2
  let startIndex = 1
  let restLength = nums.length - 1
  while (restLength > 0) {
    for (let i = startIndex; i < startIndex + lineNodeNum; i = i + 2) {
      if (i == nums.length) return root
      cur = queue.shift()
      if (nums[i] != null) {
        cur.left = new TreeNode(nums[i])
        queue.push(cur.left)
      }
      if (i + 1 == nums.length) return root
      if (nums[i + 1] != null) {
        cur.right = new TreeNode(nums[i + 1])
        queue.push(cur.right)
      }
    }
    startIndex += lineNodeNum
    restLength -= lineNodeNum
    lineNodeNum = queue.length * 2
  }
  return root
}

let root = createTree([3, 1, 4, null, 2])

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
  let ans = handleSerialize(root)
  return JSON.stringify(ans)
}

var handleSerialize = function(root) {
  if (!root) return [null]
  if (!root.left && !root.right) {
    return [root.val]
  }
  return [
    ...handleSerialize(root.left),
    root.val,
    ...handleSerialize(root.right)
  ]
}

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
  let list = JSON.parse(data)
  console.log(list)
  let ans = handleDeserialize(list)
  console.log(ans)
  return ans
}

var handleDeserialize = function(list) {
  if (list.length === 0) return null
  if (list.length === 1) {
    if (list[0] === null) return null
    return new TreeNode(list[0])
  }
  let middle = list.length >> 1
  let root = new TreeNode(list[middle])
  root.left = handleDeserialize(list.slice(0, middle))
  root.right = handleDeserialize(list.slice(middle + 1))
  return root
}

deserialize(serialize(root))

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
