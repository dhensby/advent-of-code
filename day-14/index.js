function tiltNorth (data) {
  const newGrid = data.map((row) => row.split(''))
  let curCol = 0
  let freeRow = 0
  let load = 0
  for (let i = 0; i < data.length * data[0].length; i += 1) {
    // loop through the columns looking for the row that has a bolder and move it up if it can
    const row = i % data[0].length
    const col = Math.floor(i / data.length)
    // change of col - so reset vars
    if (curCol !== col) {
      freeRow = 0
      curCol = col
    }
    const char = data[row][col]
    switch (char) {
      // empty spot, so keep track of the lowest empty space we have seen
      case '.':
        // store the lowest free row value
        freeRow = Math.min(row, freeRow)
        break
      // immovable col, so reset the lowest possible free row to the next row
      case '#':
        freeRow = row + 1
        break
      case 'O':
        // we can attempt to "move" our boulder
        // set the current position as empty
        newGrid[row][col] = '.'
        // move the boulder to the lowest known free position (note this could be the same row)
        newGrid[freeRow][col] = char
        // we can sum up the load as we iterate
        load += data.length - freeRow
        // the lowest possible free row has now increased
        freeRow += 1
        break
    }
  }
  return load
}

module.exports = {
  part1: (data) => {
    return tiltNorth(data)
  },
  part2: (data) => {
  }
}
