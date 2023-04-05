function jump() {
  let level = 10

  let res = [1, 2, 4]
  for (let index = 3; index <= 10; index++) {
    res[index] = res[index - 1] + res[index - 2] + res[index - 3]
  }
  console.log(res)
}


jump()