/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var maxSumAfterPartitioning = function (arr, k) {
  const len = arr.length
  const dp = new Array(len).fill(0) // dp[i] 表示前 i 个元素的最大和
  dp[0] = arr[0]
  for (let i = 1; i < len; i++) {
    let max = arr[i]
    dp[i] = dp[i - 1] + arr[i] // 初始化当前 dp[i]
    // 从当前 i 往前推k步 计算每一步的最大值
    for (let j = i - 1; i - j < k && j >= 0; j--) {
      max = Math.max(max, arr[j])
      let current = max * (i + 1 - j)
      dp[i] = Math.max(dp[i], current + (dp[j - 1] || 0))
    }
  }
  return dp[len - 1]
}

// /**
//  * @param {number[]} arr
//  * @param {number} k
//  * @return {number}
//  */
// var maxSumAfterPartitioning = function (arr, k) {
//   let len = arr.length
//   // 技巧：使用ES6语法生成指定长度全为某值的数组
//   let dp = new Array(len + 1).fill(0)
//   for (let i = 1; i <= len; i++) {
//     let max = 0
//     for (let j = i - 1; i - j <= k && j >= 0; j--) {
//       max = Math.max(max, arr[j])
//       dp[i] = Math.max(dp[i], dp[j] + (i - j) * max)
//     }
//   }
//   return dp[len]
// }

console.log(maxSumAfterPartitioning([1, 15, 7, 9, 2, 5, 10], 3))
