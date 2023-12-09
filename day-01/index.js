module.exports = {
  part1: ([data]) => {
    return data.trim().split('').reduce((pos, next) => {
      return pos + (next === '(' ? 1 : -1)
    }, 0)
  },
  part2: ([data]) => {
    let pos = 0
    for (let i = 0; i < data.length; i += 1) {
      pos += data[i] === '(' ? 1 : -1
      if (pos === -1) {
        return i + 1
      }
    }
  }
}
