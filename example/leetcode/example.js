/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParity = function(nums) {
  let left = 0
  let right = nums.length - 1
  while (left < right) {
    // 遇到奇数 就和right位置互换 right--
    if (nums[left] % 2 !== 0) {
      let temp = nums[left]
      nums[left] = nums[right]
      nums[right] = temp
      right--
    } else {
    // 遇到偶数跳过
      left++
    }
  }
  return nums
}
