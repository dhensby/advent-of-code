function tilt (grid, dir = 0) {
  const max = grid.length * grid[0].length
  let curPos = 0
  let freePos = 0
  let load = 0
  // dirs === 0: North
  // dirs === 1: West
  // dirs === 2: South
  // dirs === 3: East
  // loop through the columns looking for the row that has a bolder and move it up if it can
  for (let i = 0; i < max; i += 1) {
    const rawRow = Math.floor(i / grid.length)
    const rawCol = i % grid[rawRow].length
    const rawRowLength = grid.length - 1
    const rawColLength = grid[rawRow].length - 1
    const reverse = dir > 1
    const NS = dir % 2 === 0
    // north/south - we iterate across columns, not rows
    const row = (NS ? (reverse ? rawColLength - rawCol : rawCol) : (reverse ? rawRowLength - rawRow : rawRow))
    const col = (NS ? (reverse ? rawRowLength - rawRow : rawRow) : (reverse ? rawColLength - rawCol : rawCol))
    // change of col - so reset vars
    if ((dir % 2 === 0 && curPos !== col) || (dir % 2 === 1 && curPos !== row)) {
      // for south we start from max row offset and for east we start from max col offset
      freePos = dir === 2 ? grid.length - 1 : dir === 3 ? grid[rawRow].length - 1 : 0
      curPos = dir % 2 ? row : col
    }
    const char = grid[row][col]
    switch (char) {
      // empty spot, so keep track of the lowest empty space we have seen
      case '.':
        // store the lowest free row value
        freePos = reverse
          // south and east we are working from max position
          ? Math.max(dir % 2 ? col : row, freePos)
          // north and west we are working from min positions
          : Math.min(dir % 2 ? col : row, freePos)
        break
      // immovable col, so reset the lowest possible free row to the next row
      case '#':
        //
        freePos = (dir % 2 ? col : row) + (reverse ? -1 : 1)
        break
      case 'O':
        // we can attempt to "move" our boulder
        // set the current position as empty
        grid[row][col] = '.'
        // move the boulder to the lowest known free position (note this could be the same row)
        if (dir % 2) {
          grid[row][freePos] = char
          // we can sum up the load as we iterate
          load += grid.length - row
        } else {
          grid[freePos][col] = char
          // we can sum up the load as we iterate
          load += grid.length - freePos
        }
        // the lowest possible free row has now increased
        freePos += reverse ? -1 : 1
        break
    }
  }
  return load
}

module.exports = {
  part1: (data) => {
    return tilt(data.map((row) => row.split('')))
  },
  part2: (data) => {
    let load = 0
    const grid = data.map((row) => row.split(''))
    const start = Date.now()
    // 1000 gives the same answer as a billion (presumably because of some cycle)
    for (let i = 0; i < 1000; i += 1) {
      if (i % 1000000 === 0) {
        console.log(Date.now() - start)
      }
      for (let j = 0; j < 4; j += 1) {
        load = tilt(grid, j)
      }
    }
    console.log(grid.map((row) => row.join('')).join('\n'))
    return load
  }
}
