var removeDuplicates = function(s) {
  const stk = []
  for (const ch of s) {
    if (stk.length && stk[stk.length - 1] === ch) {
      stk.pop()
    } else {
      stk.push(ch)
    }
  }
  return stk.join('')
}
