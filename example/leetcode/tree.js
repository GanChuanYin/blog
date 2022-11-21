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

let root = createTree([1, 0, 1, 0, 1, 0, 1])

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
var sumRootToLeaf = function(root) {
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

var handle = function(node, current, paths) {
  if (!node.left && !node.right) {
    paths.push(current + node.val)
    return
  }
  if (node.left) handle(node.left, current + node.val, paths)
  if (node.right) handle(node.right, current + node.val, paths)
}

sumRootToLeaf(root)
