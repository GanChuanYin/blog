/**
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function(words) {
  let keyboards = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
  let ans = []
  for (let i = 0; i < words.length; i++) {
    // 全部转化为小写
    let word = words[i].toLocaleLowerCase()
    // 去除单词中的重复字符
    let temp = [...new Set(word.split(''))].join('')
    // 检测每行能否满足当前单词
    for (let j = 0; j < keyboards.length; j++) {
      let flag = true
      for (let k = 0; k < temp.length; k++) {
        if (!keyboards[j].includes(temp[k])) {
          flag = false
          break
        }
      }
      if (flag) {
        ans.push(words[i])
        break
      }
    }
  }
  return ans
}

console.log(findWords(['Hello', 'Alaska', 'Dad', 'Peace']))
