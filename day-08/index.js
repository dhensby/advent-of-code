const gcd = (a, b) => a ? gcd(b % a, a) : b

const lcm = (a, b) => a * b / gcd(a, b)

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
      return Object.keys(this.elements).filter((el) => {
        return el[2] === 'A'
      }).map((currentPos) => {
        let i = 0
        do {
          const side = this.instructions[i % this.instructions.length] === 'L' ? 0 : 1
          currentPos = this.elements[currentPos][side]
          i += 1
        } while (currentPos[2] !== 'Z')
        return i
      })
    }
  }
}

module.exports = {
  part1: (input) => {
    const data = parseInput([...input])
    return data.traverse()
  },
  part2: (input) => {
    const data = parseInput([...input])
    return data.parallelTraverse().reduce((acc, next) => {
      return lcm(Math.min(next, acc), Math.max(next, acc))
    }, 1)
  }
}
