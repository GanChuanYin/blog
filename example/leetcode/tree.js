class TreeNode {
  constructor(data) {
    this.val = data //数据
    this.left = null //左孩
    this.right = null //右孩
  }
}

/**
创建树的结点：根据二叉树的性质递归来创建
第 index 个结点的左子节点的位置 = index *2
第 index 个结点的右子节点的位置 = index *2 +1
我们使用数组的下标来表示位置，从0开始，就得到： index *2 +1 ; index *2 +2
 */
function createTree(arr, index = 0) {
  if (index > arr.length) {
    return null
  }
  if (arr[index] == null) {
    return null
  }
  const node = new TreeNode(arr[index])
  node.left = createTreeNode(arr, index * 2 + 1)
  node.right = createTreeNode(arr, index * 2 + 2)
  return node
}
