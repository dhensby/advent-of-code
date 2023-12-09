const { createHash } = require('crypto')

function md5 (data) {
  return createHash('md5').update(data).digest().toString('hex')
}

module.exports = {
  part1: ([data]) => {
    let hash
    let count = 0
    do {
      count++
      hash = md5(`${data}${count}`)
    } while (hash.substring(0, 5) !== '00000')
    return count
  },
  part2: ([data]) => {
    let hash
    let count = 0
    do {
      count++
      hash = md5(`${data}${count}`)
    } while (hash.substring(0, 6) !== '000000')
    return count
  }
}
