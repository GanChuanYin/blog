const data = {
  name: '小明',
  age: 25,
  info: {
    address: '上海'
  }
}

function renderView(name, newVal) {
  console.log(name + ' 更新为了 ' + newVal + ' ，视图正在更新。。。')
}

function observerObject(target, name, value) {
  if (typeof value === 'object' || Array.isArray(target)) {
    observer(value)
  }
  Object.defineProperty(target, name, {
    get() {
      return value
    },
    set(newVal) {
      if (newVal !== value) {
        if (typeof value === 'object' || Array.isArray(value)) {
          observer(value)
        }
        value = newVal
      }
      renderView(name, newVal)
    }
  })
}
function observer(target) {
  if (typeof target !== 'object' || !target) {
    return target
  }
  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      const value = target[key]
      observerObject(target, key, value)
    }
  }
}
observer(data)

data.name = '帅锅'
data.info.address = '成都'

// 控制台输出
// name 更新为了 帅锅 ，视图正在更新。。。
// address 更新为了 成都 ，视图正在更新。。。
