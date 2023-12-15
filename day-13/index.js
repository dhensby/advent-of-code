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

function isSingleDiff (a, b) {
  if (a.length !== b.length) throw new Error('only diff same length')
  let count = 0
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

function checkReflection (data, col, fuzzy = false) {
  // check this reflection goes all the way to the extremes
  let left = col
  let right = col + 1
  if (left < 0 || right >= data.length) {
    return false
  }
  while (left >= 0 && right < data.length) {
    if (data[left] !== data[right]) {
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

function rotateGrid (data) {
  const newGrid = []
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
  return newGrid.map((row) => row.join(''))
}

function findReflectionCol (grid, fuzzy = false) {
  for (let i = 0; i <= grid.length; i += 1) {
    if (checkReflection(grid, i, fuzzy)) {
      return i + 1
    }
  }
  return false
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.reduce((sum, grid) => {
      let num = findReflectionCol(grid)
      if (num === false) {
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
