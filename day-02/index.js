/**
 *
 * @param {Array<string>} data
 * @returns {Array<{[key: string]: number}>}
 */
function parseInput (data) {
  return data.map((line) => {
    const [game, rawSets] = line.split(':')
    const id = parseInt(game.trim().split(' ')[1], 10)
    const sets = rawSets.trim().split(';')
    return {
      id,
      sets: sets.map((set) => set.trim().split(',').reduce((result, next) => {
        const [num, colour] = next.trim().split(' ', 2)
        return {
          ...result,
          [colour]: parseInt(num, 10)
        }
      }, {})),
      possible (limits) {
        // find a set where any single quantity is higher than we have
        return !this.sets.find((set) => Object.entries(limits).some(([colour, max]) => {
          const num = set[colour] ?? 0
          return num > max
        }))
      },
      minimumContents () {
        return this.sets.reduce((bag, set) => {
          Object.entries(set).forEach(([colour, num]) => {
            if (num > (bag[colour] ?? 0)) {
              // eslint-disable-next-line no-param-reassign
              bag[colour] = num
            }
          })
          return bag
        }, {})
      }
    }
  })
}

module.exports = {
  part1: (data) => {
    const games = parseInput(data)
    return games.reduce((sum, game) => {
      if (game.possible({
        red: 12,
        green: 13,
        blue: 14
      })) {
        return sum + game.id
      }
      return sum
    }, 0)
  },
  part2: (data) => {
    const games = parseInput(data)
    return games.reduce((sum, game) => {
      const power = Object.values(game.minimumContents())
        .reduce((product, next) => product * next, 1)
      return sum + power
    }, 0)
  }
}
