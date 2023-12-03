/**
 * Parse raw input lines into a 2-dimensional array, we can then address each
 * element using "coordinates", which is helpful for finding "adjacent" points.
 *
 * @param {Array<string>} lines
 * @returns {Array<(string | number)[]>}
 */
function parseInput (lines) {
  return lines.map((line) => line.trim().split('').map((char) => {
    const numVal = parseInt(char, 10)
    if (Number.isNaN(numVal)) {
      return char
    }
    return numVal
  }))
}

/**
 * Find all the adjacent points and filter out those that are not numbers.
 * Further, remove points that are immediately next to a number. This returns
 * the minimum set of adjacent points.
 *
 * @param {Array<(string | number)[]>} lines
 * @param {number} line
 * @param {number} col
 * @returns {Array<[number, number]>}
 */
function findAdjacentPoints (lines, line, col) {
  // these are all potential adjacent points
  return [
    [line - 1, col - 1],
    [line - 1, col],
    [line - 1, col + 1],
    [line, col - 1],
    [line, col + 1],
    [line + 1, col - 1],
    [line + 1, col],
    [line + 1, col + 1]
  ].filter(([l, c]) => {
    // filter out out-of-bounds values and those that aren't numbers
    return l >= 0 && c >= 0 && l < lines.length && c < lines[l].length && typeof lines[l][c] === 'number'
  }).filter(([l, c], i, adjacent) => {
    // keep a point if there is no item immediately to the right
    // this means that a number like `35` will only take one apparent adjacent point
    return !adjacent.find((point) => point[0] === l && point[1] === c + 1)
  })
}

/**
 * Given a specific point in the input, we return the number that occupies that
 * point. Also, provide the points that have been inspected to produce the value.
 *
 * @param {Array<(string | number)[]>} lines
 * @param {number} line
 * @param {number} col
 * @returns {[number, Array<[number, number]>]}
 */
function getNumFromPoint (lines, line, col) {
  let char = lines[line][col]
  if (typeof char !== 'number') {
    throw new Error('Point does not represent a number')
  }
  // find the left-most digit for this number
  let start = col
  while (start > 0 && typeof lines[line][start - 1] === 'number') {
    start -= 1
  }
  // compose the number from its composite digits and record which points
  // were used
  const checked = []
  let num = ''
  do {
    checked.push([line, start])
    char = lines[line][start]
    num = `${num}${char}`
    start += 1
  } while (typeof lines[line][start] === 'number')
  return [parseInt(num, 10), checked]
}

module.exports = {
  part1: (input) => {
    const lines = parseInput(input)
    const checked = []
    let total = 0
    // run through until we hit a symbol then work out the indexes we need
    // to check for values.
    // keep track of seen coordinates so none are double counted
    for (let i = 0; i < lines.length; i += 1) {
      const row = lines[i]
      for (let j = 0; j < row.length; j += 1) {
        const char = row[j]
        if (char === '.') {
          // eslint-disable-next-line no-continue
          continue
        }
        if (typeof char !== 'number') {
          // symbol - what positions are "adjacent"
          const adjacent = findAdjacentPoints(lines, i, j)
          total += adjacent.reduce((sum, [rowNum, colNum]) => {
            // if we have checked the point before, don't check again
            if (checked.some((point) => {
              return rowNum === point[0] && colNum === point[1]
            })) {
              return sum
            }
            const [num, seen] = getNumFromPoint(lines, rowNum, colNum)
            checked.push(...seen)
            return sum + num
          }, 0)
        }
      }
    }
    return total
  },
  part2: (data) => {
    const lines = parseInput(data)
    let total = 0
    for (let i = 0; i < lines.length; i += 1) {
      const row = lines[i]
      for (let j = 0; j < row.length; j += 1) {
        const char = row[j]
        if (char === '*') {
          // find adjacent values and multiply
          const adjacent = findAdjacentPoints(lines, i, j)
          // only those with exactly 2 adjacent points are "gears"
          if (adjacent.length !== 2) {
            continue
          }
          total += adjacent.reduce((product, [rowNum, colNum]) => {
            // if we have checked the point before, don't check again
            const [num] = getNumFromPoint(lines, rowNum, colNum)
            return product * num
          }, 1)
        }
      }
    }
    return total
  }
}
