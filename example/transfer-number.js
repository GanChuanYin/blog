// function baseConversion(num, base) {
//   let arr = [num]
//   while (arr[0] >= base) {
//     let current = arr[0]
//     arr[0] = num % base
//     arr.unshift(Math.floor(current / base))
//   }
//   return arr.join(',')
// }

// console.log(baseConversion(12, 36)) // 12
// console.log(baseConversion(124, 36)) // 3,16
// console.log(baseConversion(288, 36)) // 8,0
// console.log(baseConversion(46656, 18)) // 8,0,0,0
// console.log(baseConversion(128, 2)) // 8,0,0,0

function defineProp(obj) {
  const watcher = { name: '嘻嘻嘻' }
  Object.defineProperty(obj, 'name', {
    get() {
      return watcher.name
    },
    set(newValue) {
      watcher.name = newValue
    }
  })
}

const obj = { name: 'lili' }

defineProp(obj)

console.log(obj.name)

obj.name = '222'

console.log(obj.name)
