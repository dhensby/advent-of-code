/**
 * Iterate through an array of rows and duplicate any that are "empty"
 * @param {Array<string>} data
 * @return {Array<string>}
 */
function expandEmptyRows (data) {
  return data.reduce((expanded, next, i) => {
    // row doesn't have any galaxies so expand it
    if (next.indexOf('#') === -1) {
      expanded.push(next)
    }
    expanded.push(next)
    return expanded
  }, [])
}

/**
 * Iterate through an array of rows and duplicate any columns that are "empty"
 * @param {Array<string>} data
 */
function expandEmptyCols (data) {
  const expanded = data.map(() => [])
  let emptyCol = true
  let emptyCols = 0
  // assume all rows / cols are the same length
  const numSquares = data.length * data[0].length
  for (let i = 0; i < numSquares; i += 1) {
    // a bit of maths here lets us traverse columns instead of rows
    const y = i % data.length
    const x = Math.floor(i / data.length)
    // emptyCols acts as a column offset for our expanded data
    expanded[y][x + emptyCols] = data[y][x]
    // track if this column is empty or not
    emptyCol = emptyCol && data[y][x] !== '#'
    // if we are in the last row of the col
    if (y === data.length - 1) {
      // we found an empty col, so expand it
      if (emptyCol) {
        // increase our emptyCol offset
        emptyCols += 1
        // duplicate the column
        for (let j = 0; j < data.length; j += 1) {
          expanded[j][x + emptyCols] = '.'
        }
      }
      // reset empty col tracking for next column
      emptyCol = true
    }
  }
  return expanded.map((row) => row.join(''))
}

module.exports = {
  part1: (data) => {
    // expand the galaxy map
    const expanded = expandEmptyCols(expandEmptyRows(data))
    const galaxies = []
    // find all the galaxies
    for (let y = 0; y < expanded.length; y += 1) {
      for (let x = 0; x < expanded[y].length; x += 1) {
        if (expanded[y][x] === '#') {
          galaxies.push([x, y])
        }
      }
    }
    const distances = []
    // find the distance between every distinct pair of galaxies
    for (let i = 0; i < galaxies.length; i += 1) {
      const from = galaxies[i]
      for (let j = i + 1; j < galaxies.length; j += 1) {
        const to = galaxies[j]
        // work out the differences between the x and y coords of the two galaxies
        const [dx, dy] = [Math.abs(from[0] - to[0]), Math.abs(from[1] - to[1])]
        // because we have to go in adjacent steps (ie: diagonals are not allowed)
        // it's just the same as doing two straight lines (ie: the sum of the sides)
        distances.push(dx + dy)
      }
    }
    return distances.reduce((sum, next) => {
      return sum + next
    }, 0)
  },
  part2: (data) => {
  }
}
