/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (strs.length === 1) return strs[0]

  const compare = (arr1, arr2) => {
    let res = []
    while (arr1.length && arr2.length) {
      let str1 = arr1.shift()
      let str2 = arr2.shift()
      if (str1 === str2) {
        res.push(str1)
      } else {
        return res
      }
    }
    return res
  }

  let res = strs[0].split('')
  for (let index = 1; index < strs.length; index++) {
    let itemArr = strs[index].split('')
    res = compare(res, itemArr)
  }

  return res.length ? res.join('') : ''
}

console.log(longestCommonPrefix(['flower']))
