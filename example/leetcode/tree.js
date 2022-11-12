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

let root = createTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4])

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
var subtreeWithAllDeepest = function(root) {
  // 找出 最深 深度
  let deep = getDeepest(root)
  if (deep === 1) return root
  let paths = []
  // 搜索出所有最长路径
  searchPath(root, paths, [], deep)
  // 如果只有一条路径 直接返回最后一个节点
  if (paths.length === 1) return paths[0][paths[0].length - 1]

  // 寻找最长公共前缀
  for (let i = 0; i < paths[0].length; i++) {
    let current = paths[0][i]
    for (let j = 1; j < paths.length; j++) {
      if (paths[j][i] !== current) {
        return paths[j][i - 1]
      }
    }
  }
}

var searchPath = function(root, paths, temp, deep) {
  if (!root) return
  if (!root.left && !root.right) {
    if (temp.length + 1 >= deep) {
      paths.push([...temp, root])
    }
  }
  if (root.left) searchPath(root.left, paths, [...temp, root], deep)
  if (root.right) searchPath(root.right, paths, [...temp, root], deep)
}

var getDeepest = function(root) {
  if (!root) return 0
  return Math.max(getDeepest(root.left), getDeepest(root.right)) + 1
}

subtreeWithAllDeepest(root)
