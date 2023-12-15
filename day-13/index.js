/**
 *
 * @param {Array<string>} input
 * @return {Array<string[]>}
 */
function parseInput (input) {
  const data = []
  let collector = []
  input.forEach((row) => {
    if (!row.trim()) {
      data.push(collector)
      collector = []
    } else {
      collector.push(row)
    }
  })
  data.push(collector)
  return data
}

/**
 * Determine if two strings have exactly one different character. It is assumed that
 * the strings are not identical when passed to the function.
 *
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
function isSingleDiff (a, b) {
  if (a.length !== b.length) throw new Error('only diff same length')
  let count = 0
  // iterate over both strings, comparing each char with its partner. If there
  // is more than 1 char that is different, then return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      count += 1
    }
    if (count > 1) {
      return false
    }
  }
  return true
}

/**
 *
 * @param {Array<string>} data
 * @param {number} col
 * @param {boolean} fuzzy Run in fuzzy mode - ie: we allow *one* pair of lines to differ by one char
 * @return {boolean}
 */
function checkReflection (data, col, fuzzy = false) {
  // check this reflection goes all the way to the extremes
  let left = col
  let right = col + 1
  // validate the initial input - if the col is out of bounds, we just return false
  if (left < 0 || right >= data.length) {
    return false
  }
  // iterate out from the initial positions, while the rows are the same/reflected
  while (left >= 0 && right < data.length) {
    // if each line is different, then either perform fuzzy match, or return false
    if (data[left] !== data[right]) {
      // if we are fuzzy matching, we check for a single diff. If there is only 1 diff, then we no
      // longer accept fuzzy matches... if we aren't fuzzy, then we don't have a reflection
      if (fuzzy && isSingleDiff(data[left], data[right])) {
        fuzzy = false
      } else {
        return false
      }
    }
    left -= 1
    right += 1
  }
  // in fuzzy mode, we *have* to have seen a fuzzy row, so we only have a reflection
  // line if fuzzy has been switched
  return fuzzy === false
}

/**
 * Rotate a 2d array clockwise
 *
 * @param {Array<string>} data
 * @return {Array<string>}
 */
function rotateGrid (data) {
  const newGrid = []
  // we can just iterate through the entire grid and transform the row/col positions
  for (let i = 0; i < data.length * data[0].length; i += 1) {
    const col = i % data[0].length
    const row = Math.floor(i / data[0].length)
    // end of row moves to end of col
    const newCol = data.length - row - 1
    const newRow = col
    if (!newGrid[newRow]) {
      newGrid[newRow] = []
    }
    newGrid[newRow][newCol] = data[row][col]
  }
  // we built this as a 2d array, but really we want and array of strings
  return newGrid.map((row) => row.join(''))
}

/**
 * Find the column number of a reflection (it's actually the row number, whoops)
 *
 * @param {Array<string>} grid
 * @param {boolean} fuzzy
 * @return {number|boolean}
 */
function findReflectionCol (grid, fuzzy = false) {
  // iterate over all the rows of the grid, looking for a reflection. If we have one, return the
  // row number (+1) for the number of rows above us
  for (let i = 0; i <= grid.length; i += 1) {
    if (checkReflection(grid, i, fuzzy)) {
      return i + 1
    }
  }
  // no reflection
  return false
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.reduce((sum, grid) => {
      // initially look for a reflection in the original orientation
      let num = findReflectionCol(grid)
      if (num === false) {
        // we didn't find a reflection in the rows, so we search by column.
        // however, instead of actually searching columns, we just rotated the
        // grid and then search for rows
        num = findReflectionCol(rotateGrid(grid))
      } else {
        num *= 100
      }
      return sum + num
    }, 0)
  },
  part2: (input) => {
    const data = parseInput(input)
    return data.reduce((sum, grid) => {
      const num = findReflectionCol(grid, true)
      if (num === false) {
        return sum + findReflectionCol(rotateGrid(grid), true)
      }
      return sum + (num * 100)
    }, 0)
  }
}
