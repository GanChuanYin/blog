/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number}
 */
var maximumScore = function (a, b, c) {
  let list = [a, b, c]
  list.sort((a, b) => a - b)
  let ans = 0
  while (list[0] > 0) {
    list[0] = list[0] - 1
    // 比较剩余两堆中较大的石子数量 从较大堆中取
    // 保持剩下的堆数量尽量接近 
    if (list[1] > list[2]) {
      list[1] = list[1] - 1
    } else {
      list[2] = list[2] - 1
    }
    ans++
  }
  // 此时最小的堆已经取完了
  // 继续取剩下的堆 直到某个为0
  while (list[1] > 0 && list[2] > 0) {
    list[1] = list[1] - 1
    list[2] = list[2] - 1
    ans++
  }
  return ans
}
