/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {boolean}
 */
var canBeEqual = function (target, arr) {
  // 只需要判断target和arr的元素是否全部相等
  if (target.length !== arr.length) return false
  for (let i = 0; i < target.length; i++) {
    let idx = arr.indexOf(target[i])
    if (idx === -1) return false
    arr.splice(idx, 1)
  }
  return true
}
