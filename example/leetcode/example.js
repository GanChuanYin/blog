/**
 * @param {number[][]} bookings
 * @param {number} n
 * @return {number[]}
 */
var corpFlightBookings = function (bookings, n) {
  const ans = new Array(n).fill(0)

  for (let i = 0; i < bookings.length; i++) {
    const booking = bookings[i]
    for (let j = booking[0]; j <= booking[1]; j++) {
      ans[j - 1] = ans[j - 1] + booking[2]
    }
  }

  return ans
}

console.log(
  corpFlightBookings(
    [
      [1, 2, 10],
      [2, 3, 20],
      [2, 5, 25]
    ],
    5
  )
)
