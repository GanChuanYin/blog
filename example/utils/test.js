var arr = [
  {
    key: '01',
    value: '乐乐'
  },
  {
    key: '02',
    value: '博博'
  },
  {
    key: '03',
    value: '淘淘'
  },
  {
    key: '04',
    value: '哈哈'
  },
  {
    key: '01',
    value: '乐乐'
  }
]

var obj = {}
arr = arr.reduce(function(item, next) {
  obj[next.key] ? '' : (obj[next.key] = true && item.push(next))
  return item
}, [])
console.log(arr) // [{key: “01”, value: “乐乐”},{key: “02”, value: “博博”},{key: “03”, value: “淘淘”},{key: “04”, value: “哈哈”}]
