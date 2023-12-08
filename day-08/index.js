/**
 *
 * @param {Array<string>} input
 */
function parseInput (input) {
  const instructions = input.shift().trim().split('')
  input.shift()
  const elements = input.reduce((els, next) => {
    const parsed = next.trim().match(/([0-9A-Z]+)\s+=\s+\(([0-9A-Z]+),\s+([0-9A-Z]+)\)/)
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
    },
    parallelTraverse () {
      let positions = Object.keys(this.elements).filter((el) => {
        return el[2] === 'A'
      })
      let i = 0
      do {
        const side = this.instructions[i % this.instructions.length] === 'L' ? 0 : 1
        positions = positions.map((pos) => {
          return this.elements[pos][side]
        })
        i += 1
      } while (!positions.every((pos) => pos[2] === 'Z'))
      return i
    }
  }
}

module.exports = {
  part1: (input) => {
    // const data = parseInput([...input])
    // return data.traverse()
  },
  part2: (input) => {
    const data = parseInput([...input])
    return data.parallelTraverse()
  }
}
