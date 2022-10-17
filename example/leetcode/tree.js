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

let root = createTree([4, 2, 6, 1, 3])

/**
 * @param {TreeNode} root
 * @return {number}
 */
var getMinimumDifference = function(root) {
  let list = []
  search(root, list)
  // 找出最小间距
  let ans = Infinity
  for (let i = 1; i < list.length; i++) {
    ans = Math.min(list[i] - list[i - 1], ans)
  }
  return ans
}

// 中序遍历 从小到大 找出所有数字 
var search = function(node, list) {
  if (!node) return
  search(node.left, list)
  list.push(node.val)
  search(node.right, list)
}

console.log(getMinimumDifference(root))
