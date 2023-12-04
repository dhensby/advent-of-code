/**
 * Parse the input into "Game" objects, a bit like Day 2
 * @param {Array<string>} input
 */
function parseInput (input) {
  // lots of string bashing - regex would probably have been easier
  return input.map((line) => {
    const [card, info] = line.trim().split(':')
    const id = parseInt(card.split(/\s+/)[1].trim(), 10)
    const [winning, result] = info.trim().split('|').map((nums) => nums.trim().split(/\s+/))
    return {
      id,
      winning: winning.map((num) => parseInt(num, 10)),
      result: result.map((num) => parseInt(num, 10)),
      get matches () {
        return this.result.reduce((matches, num) => {
          if (this.winning.includes(num)) {
            matches.push(num)
          }
          return matches
        }, [])
      },
      get score () {
        return this.matches.reduce((score) => {
          if (!score) {
            score = 1
          } else {
            score *= 2
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
  part2: (input) => {
    const data = parseInput(input)
    // we create a list of all the cards - we will push duplicates onto the end
    // until all duplicates have been dealt with
    const list = [...data]
    // loop over the list until we hit the end (the list will grow as we add duplicates)
    for (let i = 0; i < list.length; i += 1) {
      const game = list[i]
      // find the next N games where N is the current game position + num of matches it has
      for (let j = game.id; j < game.id + game.matches.length && j <= data.length; j += 1) {
        list.push(data[j])
      }
    }
    return list.length
  }
}
