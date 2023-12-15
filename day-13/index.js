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

function checkReflection (data, col) {
  // check this reflection goes all the way to the extremes
  let left = col
  let right = col + 1
  if (left < 0 || right >= data.length) {
    return false
  }
  while (left >= 0 && right < data.length) {
    if (data[left] !== data[right]) {
      return false
    }
    left -= 1
    right += 1
  }
  return true
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

function findReflectionCol (grid) {
  // find two rows next to each other that are the same (this is the start of a reflection)
  // start in the middle and perform an "inside-out" check
  const halfPoint = Math.ceil(grid.length / 2)
  for (let i = 0; i <= halfPoint; i += 1) {
    const pos = halfPoint - i
    const opposite = halfPoint + i + 1
    if (pos >= 0 && checkReflection(grid, pos)) {
      // we have a reflection point
      return pos + 1
    } else if (opposite < grid.length && checkReflection(grid, opposite)) {
      // we have a reflection point
      return opposite + 1
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
  part2: (data) => {
  }
}
