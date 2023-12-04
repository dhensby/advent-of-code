/**
 * Parse the input into "Game" objects, a bit like Day 2
 * @param {Array<string>} input
 */
function parseInput (input) {
  // lots of string bashing - regex would probably have been easier
  return input.map((line) => {
    const [card, info] = line.trim().split(':')
    const id = parseInt(card.split(' ')[1].trim(), 10)
    const [winning, result] = info.trim().split('|').map((nums) => nums.trim().split(' '))
    return {
      id,
      winning: winning.filter((v) => v !== '').map((num) => parseInt(num, 10)),
      result: result.filter((v) => v !== '').map((num) => parseInt(num, 10)),
      get score () {
        return this.result.reduce((score, num) => {
          if (this.winning.includes(num)) {
            if (!score) {
              score = 1
            } else {
              score *= 2
            }
          }
          return score
        }, 0)
      }
    }
  })
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.reduce((sum, { score }) => sum + score, 0)
  },
  part2: (data) => {
  }
}
