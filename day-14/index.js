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
    // set up variables that we will use for logical mappings depending on the dir value
    const rawRow = Math.floor(i / grid.length)
    const rawCol = i % grid[rawRow].length
    const rawRowLength = grid.length - 1
    const rawColLength = grid[rawRow].length - 1
    // dirs > 1 (South, East) are evaluated in reverse
    const reverse = dir > 1
    // even directions (North, South) are column based evaluations
    const NS = dir % 2 === 0
    // north/south - we iterate across columns, not rows
    const row = (NS ? (reverse ? rawColLength - rawCol : rawCol) : (reverse ? rawRowLength - rawRow : rawRow))
    const col = (NS ? (reverse ? rawRowLength - rawRow : rawRow) : (reverse ? rawColLength - rawCol : rawCol))
    // change of col - so reset vars
    if ((NS && curPos !== col) || (!NS && curPos !== row)) {
      // if we are reverse, we have to start at the ends
      freePos = reverse ? (NS ? rawRowLength : rawColLength) : 0
      curPos = NS ? col : row
    }
    const char = grid[row][col]
    switch (char) {
      // empty spot, so keep track of the lowest empty space we have seen
      case '.':
        // store the lowest free row value
        freePos = reverse
          // south and east we are working from max position
          ? Math.max(NS ? row : col, freePos)
          // north and west we are working from min positions
          : Math.min(NS ? row : col, freePos)
        break
      // immovable col, so reset the lowest possible free row to the next row
      case '#':
        //
        freePos = (NS ? row : col) + (reverse ? -1 : 1)
        break
      case 'O':
        // we can attempt to "move" our boulder
        // set the current position as empty
        grid[row][col] = '.'
        // move the boulder to the lowest known free position (note this could be the same row)
        if (NS) {
          grid[freePos][col] = char
          // we can sum up the load as we iterate
          load += grid.length - freePos
        } else {
          grid[row][freePos] = char
          // we can sum up the load as we iterate
          load += grid.length - row
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
    // 1000 gives the same answer as a billion (presumably because of some cycle)
    for (let i = 0; i < 1000; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        load = tilt(grid, j)
      }
    }
    return load
  }
}
