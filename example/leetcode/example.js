/**
 * @param {string} allowed
 * @param {string[]} words
 * @return {number}
 */
var countConsistentStrings = function (allowed, words) {
  let set = new Set() // 存储allowed的所有字符类型
  for (let i = 0; i < allowed.length; i++) {
    set.add(allowed[i])
  }
  let ans = 0
  for (let i = 0; i < words.length; i++) {
    let flag = true
    for (let j = 0; j < words[i].length; j++) {
      if (!set.has(words[i][j])) {
        flag = false
        break
      }
    }
    if (flag) ans++
  }
  return ans
}
