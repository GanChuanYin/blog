/**
 * 获取指定区间内的随机整数，区间：[a, b)
 * @param a 区间下限(包含)
 * @param b 区间上限(不包含)
 * @return 一个随机整数
 */
function getRandomBetween(a, b) {
  return Math.floor(a + Math.random() * (b - a))
}

/**
 * 模拟抢红包，使用二倍均值法
 * @param money 总金额，单位：分
 * @param person 抢红包人数
 * @return 生成的红包金额数组
 */
function clickRedPacket(money, person) {
  let amountArr = new Array(person)
  console.log(`${money} 分钱 分给 ${person} 人`)
  for (let i = 0; i < amountArr.length - 1; i++) {
    let avgAmount = money / person
    let doubleAvgAmount = avgAmount * 2
    person--
    let min = 0.01
    let max = doubleAvgAmount
    let currentAmount = getRandomBetween(min, max)
    amountArr[i] = currentAmount
    money = money - currentAmount
    console.log(
      `剩余人数：${person}\t抢到：${currentAmount} \t剩余金额：${money}\t本次均值的二倍：${doubleAvgAmount}\t金额随机范围：[${min}, ${max}]`
    )
  }
  amountArr[amountArr.length - 1] = money
  return amountArr
}



clickRedPacket(100, 5)