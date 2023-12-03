function parseInput (lines) {
  return lines.map((line) => line.trim().split(''))
}

function parseInputPart2 (lines) {
  return lines.map((line) => line.trim().split('').map((char) => {
    if (char === '*') {
      return char
    }
    if (char === '.' || Number.isNaN(parseInt(char, 10))) {
      return '.'
    }
    return parseInt(char, 10)
  }))
}

function getNumFromPoint (lines, line, col) {
  let char = lines[line][col]
  if (char === '.') {
    return [0, []]
  }
  let start = col
  while (start > 0) {
    char = lines[line][start - 1]
    if (!Number.isNaN(parseInt(char, 10))) {
      start -= 1
    } else {
      break
    }
  }
  const checked = []
  let num = ''
  do {
    checked.push([line, start])
    char = lines[line][start]
    num = `${num}${char}`
    start += 1
  } while (!Number.isNaN(parseInt(lines[line][start], 10)))
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
        const val = parseInt(char, 10)
        if (Number.isNaN(val)) {
          // symbol - what positions are "adjacent"
          const adjacent = [
            [j - 1, i - 1],
            [j - 1, i],
            [j - 1, i + 1],
            [j, i - 1],
            [j, i + 1],
            [j + 1, i - 1],
            [j + 1, i],
            [j + 1, i + 1]
          ].filter(([colNum, rowNum]) => {
            // remove any points where the index is < 0 or > max
            return rowNum >= 0 && rowNum < lines.length && colNum >= 0 && colNum < row.length
          })
          total += adjacent.reduce((sum, [colNum, rowNum]) => {
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
    const lines = parseInputPart2(data)
    let checked = []
    let total = 0
    for (let i = 0; i < lines.length; i += 1) {
      const row = lines[i]
      for (let j = 0; j < row.length; j += 1) {
        const char = row[j]
        if (char === '.') {
          continue
        }
        if (char === '*') {
          checked = []
          // find adjacent values and multiply
          const adjacent = [
            [j - 1, i - 1],
            [j - 1, i],
            [j - 1, i + 1],
            [j, i - 1],
            [j, i + 1],
            [j + 1, i - 1],
            [j + 1, i],
            [j + 1, i + 1]
          ].filter(([colNum, rowNum]) => {
            // remove any points where the index is < 0 or > max
            return rowNum >= 0 && rowNum < lines.length && colNum >= 0 && colNum < row.length && typeof lines[rowNum][colNum] === 'number'
          })
          const gears = adjacent.reduce((soFar, [colNum, rowNum]) => {
            // if we have checked the point before, don't check again
            if (checked.some((point) => {
              return rowNum === point[0] && colNum === point[1]
            })) {
              return soFar
            }
            const [num, seen] = getNumFromPoint(lines, rowNum, colNum)
            checked.push(...seen)
            soFar.push(num)
            return soFar
          }, [])
          if (gears.length === 2) {
            total += gears[0] * gears[1]
          }
        }
      }
    }
    return total
  }
}
