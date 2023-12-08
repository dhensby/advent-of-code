/**
 *
 * @param {Array<string>} input
 */
function parseInput (input) {
  const instructions = input.shift().trim().split('')
  input.shift()
  const elements = input.reduce((els, next) => {
    const parsed = next.trim().match(/([A-Z]+)\s+=\s+\(([A-Z]+),\s+([A-Z]+)\)/)
    return {
      ...els,
      [parsed[1]]: [parsed[2], parsed[3]]
    }
  }, {})
  return {
    instructions,
    elements,
    traverse () {
      let i = 0
      let currentPos = 'AAA'
      do {
        const side = this.instructions[i % this.instructions.length] === 'L' ? 0 : 1
        currentPos = this.elements[currentPos][side]
        i += 1
      } while (currentPos !== 'ZZZ')
      return i
    }
  }
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.traverse()
  },
  part2: (data) => {
  }
}
