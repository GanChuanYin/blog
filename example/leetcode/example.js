/**
 * @param {number[][]} grid
 * @return {number}
 */
var countNegatives = function (grid) {
  let m = grid.length
  let n = grid[0].length
  let ans = 0
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (grid[i][j] < 0) {
        ans++
      } else {
        break
      }
    }
  }
  return ans
}

countNegatives([
  [4, 3, 2, -1],
  [3, 2, 1, -1],
  [1, 1, -1, -2],
  [-1, -1, -2, -3]
])
