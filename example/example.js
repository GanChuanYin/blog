const testArr = require('./testArr')

function generateTestArr(num) {
  const arr = []
  for (let index = 0; index < num; index++) {
    arr.push(Math.round(Math.random() * num))
  }
  return arr
}

// 计算排序算法运行时间
function getProcessTime(algoFunc) {
  console.time('排序耗时')
  const res = algoFunc(testArr)
  console.timeEnd('排序耗时')
  return res
}

// 冒泡排序
function bubbleSort(arr) {
  const len = arr.length
  for (let index = 0; index < len; index++) {
    for (let i = 0; i < len - index - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        const temp = arr[i]
        arr[i] = arr[i + 1]
        arr[i + 1] = temp
        // ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
      }
    }
  }
  return arr
}

// console.log(bubbleSort([22,-1,19,1, 4, 3, 2, 12, 5]))

// 插入排序
function selectionSort(arr) {
  const len = arr.length
  for (let index = 0; index < len; index++) {
    let maxIndex = index
    for (let i = index + 1; i < len; i++) {
      if (arr[i] > arr[maxIndex]) {
        const temp = arr[i]
        arr[i] = arr[maxIndex]
        arr[maxIndex] = temp
      }
    }
  }
  return arr
}

// console.log(selectionSort([22, -1, 19, 1, 4, 3, 2, 12, 5]))

// 归并排序
/**
 * 解题思路：
 * 双指针 从头到尾比较 两个数组的第一个值，根据值的大小依次插入到新的数组中
 * 空间复杂度：O(m + n)
 * 时间复杂度：O(m + n)
 * @param {Array} arr1
 * @param {Array} arr2
 */

function merge(arr1, arr2) {
  var result = []
  while (arr1.length > 0 && arr2.length > 0) {
    if (arr1[0] > arr2[0]) {
      /*shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。*/
      result.push(arr1.shift())
    } else {
      result.push(arr2.shift())
    }
  }
  return result.concat(arr1).concat(arr2)
}

function mergeSort(arr) {
  let len = arr.length
  if (len < 2) {
    return arr
  }
  let middle = Math.floor(len / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))
}

// console.log(mergeSort([14, -1, 19, 1, 4, 3, 2, 12, 5]))

// 插入排序
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let max = array[i]
    let j = i - 1
    while (j >= 0 && array[j] > max) {
      array[j + 1] = array[j]
      j--
    }
    array[j + 1] = max
  }
  return array
}

// 希尔排序 (缩小增量排序)
function shellSort(arr) {
  var len = arr.length,
    temp,
    gap = 1
  while (gap < len / 5) {
    //动态定义间隔序列
    gap = gap * 5 + 1
  }
  for (gap; gap > 0; gap = Math.floor(gap / 5)) {
    for (var i = gap; i < len; i++) {
      temp = arr[i]
      for (var j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j]
      }
      arr[j + gap] = temp
    }
  }
  return arr
}

// 快速排序
function quickSort(array, left = 0, right = array.length - 1) {
  if (left < right) {
    let x = array[right],
      i = left - 1,
      temp
    for (let j = left; j <= right; j++) {
      if (array[j] <= x) {
        i++
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
    quickSort(array, left, i - 1)
    quickSort(array, i + 1, right)
  }
  return array
}

// console.log(getProcessTime(quickSort)) // 排序耗时 5.805ms
// console.log(getProcessTime(shellSort)) // 排序耗时:  6.728ms
// console.log(getProcessTime(mergeSort)) // 排序耗时: 22.491ms
// console.log(getProcessTime(insertionSort)) // 排序耗时: 43.305ms
// console.log(getProcessTime(bubbleSort)) // 排序耗时: 144.391ms
// console.log(getProcessTime(selectionSort)) // 排序耗时: 179.81ms



// 快速排序
function quickSort(array, left = 0, right = array.length - 1) {
  if (left < right) {
    let x = array[right],
      i = left - 1,
      temp
    for (let j = left; j <= right; j++) {
      if (array[j] <= x) {
        i++
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
    quickSort(array, left, i - 1)
    quickSort(array, i + 1, right)
  }
  return array
}


function arrayUnique(target) {
  var result = [target[0]]
  var temp = {}
  temp[target[0]] = true
  for (var i = 1, targetLen = target.length; i < targetLen; i++) {
    if (typeof temp[target[i]] === 'undefined') {
      result.push(target[i])
      temp[target[i]] = true
    }
  }
  return result
}

console.log(arrayUnique([1,14,2,54,54,3,2,4,25,14]))