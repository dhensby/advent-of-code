function hash (string) {
  let val = 0
  for (let i = 0; i < string.length; i += 1) {
    val += string.charCodeAt(i)
    val *= 17
    val %= 256
  }
  return val
}

module.exports = {
  part1: ([data]) => {
    return data.split(',').reduce((sum, str) => sum + hash(str), 0)
  },
  part2: (data) => {
  }
}
