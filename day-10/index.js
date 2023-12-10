function findStartPoint (data) {
  for (let y = 0; y < data.length; y += 1) {
    const row = data[y]
    for (let x = 0; x < row.length; x += 1) {
      const point = row[x]
      if (point === 'S') {
        return [x, y]
      }
    }
  }
}

function symbolFromNeighbours (neighbours) {
  if (neighbours.length !== 2) {
    throw new Error('There must be 2 neighbours')
  }
  const [dx, dy] = [neighbours[1][0] - neighbours[0][0], neighbours[1][1] - neighbours[0][1]]
  // vertical movement only
  if (dy === 2) {
    return '|'
  }
  // horizontal movement only
  if (dx === 2) {
    return '-'
  }
  // gone left and down
  if (dx === -1 && dy === -1) {
    return '7'
  }
  // gone right and down
  if (dx === 1 && dy === -1) {
    return 'F'
  }
  // gone left and up
  if (dx === -1 && dy === 1) {
    return 'J'
  }
  // gone right and up
  if (dx === 1 && dy === -1) {
    return 'L'
  }
}

function potentialNeighbours (data, [x, y]) {
  const symbol = data[y][x]
  switch (symbol) {
    case '|':
      return [
        [x, y - 1],
        [x, y + 1]
      ]
    case '-':
      return [
        [x - 1, y],
        [x + 1, y]
      ]
    case 'L':
      return [
        [x, y - 1],
        [x + 1, y]
      ]
    case 'J':
      return [
        [x, y - 1],
        [x - 1, y]
      ]
    case '7':
      return [
        [x - 1, y],
        [x, y + 1]
      ]
    case 'F':
      return [
        [x + 1, y],
        [x, y + 1]
      ]
    case '.':
      return []
    case 'S':
      return [
        [x, y - 1],
        [x, y + 1],
        [x - 1, y],
        [x + 1, y]
      ]
  }
}

module.exports = {
  part1: (data) => {
    const startingPoint = findStartPoint(data)
    if (!startingPoint) {
      throw new Error('No start point found')
    }
    // from the starting point, find values that we can reach
    // essentially we're creating a graph of all the points and their
    // valid neighbours - this is actually overkill but I thought it would be fun
    // and potentially help with the unknown part 2 (it didn't)
    const neighbours = new Map()
    // create a list of points that we will visit (we'll add to this as we progress
    // through the route)
    const list = [startingPoint]
    while (list.length) {
      const point = list.shift()
      // if we've seen this point before, we can skip over it
      if (neighbours.has(point.join(','))) {
        // we have returned to a point we have seen before so can skip
        continue
      }
      // for all the potential neighbouring points, we need to filter them to
      // the actual valid neighbouring points
      const neighbouringPoints = potentialNeighbours(data, point).filter(([x, y]) => {
        // check the points are logically in bounds of the grid
        if (x >= 0 && y >= 0 && y < data.length && x < data[y].length) {
          const candidatePoint = data[y][x]
          // S is always a valid point to move to
          if (candidatePoint === 'S') {
            return true
          }
          // . is never a valid point to move to
          if (candidatePoint === '.') {
            return false
          }
          // work out our net direction and then make sure the next point is
          // one that we can actually move towards
          const [dx, dy] = [point[0] - x, point[1] - y]
          // if moving north
          if (dy === 1) {
            return ['|', '7', 'F'].includes(candidatePoint)
          }
          // if moving east
          if (dx === 1) {
            return ['-', 'L', 'F'].includes(candidatePoint)
          }
          // if moving south
          if (dy === -1) {
            return ['|', 'J', 'L'].includes(candidatePoint)
          }
          // if moving west
          if (dx === -1) {
            return ['-', '7', 'J'].includes(candidatePoint)
          }
        }
        return false
      })
      // skip the point if it has no neighbours (can't actually happen as the point
      // we come from will always be a valid neighbour)
      if (neighbouringPoints.length === 0) {
        continue
      }
      list.push(...neighbouringPoints)
      neighbours.set(point.join(','), neighbouringPoints)
    }
    // using the graph, we can build the valid route from the starting point
    const route = [startingPoint.join(',')]
    // we have to track the last point we saw and the next point we are going to
    // that allows us to not track back by accident
    let lastPoint = startingPoint
    let point = neighbours.get(startingPoint.join(','))[0]
    do {
      route.push(point)
      // find the next point (the one that is not the one we just came from)
      const nextPoint = neighbours.get(point.join(',')).find(([x, y]) => {
        return x !== lastPoint[0] || y !== lastPoint[1]
      })
      lastPoint = point
      point = nextPoint
    } while (point[0] !== startingPoint[0] || point[1] !== startingPoint[1])
    return route.length / 2
  },
  part2: (data) => {
    const startingPoint = findStartPoint(data)
    if (!startingPoint) {
      throw new Error('No start point found')
    }
    // for fun, I'll solve the route a different way
    const route = [startingPoint.join(',')]
    // find a candidate point for the next point to visit from start
    const startingNeighbours = potentialNeighbours(data, startingPoint).filter(([x, y]) => {
      if (x >= 0 && y >= 0 && y < data.length && x < data[y].length && data[y][x] !== '.') {
        const [dx, dy] = [startingPoint[0] - x, startingPoint[1] - y]
        const candidatePoint = data[y][x]
        // if moving north
        if (dy === 1) {
          return ['|', '7', 'F'].includes(candidatePoint)
        }
        // if moving east
        if (dx === 1) {
          return ['-', 'L', 'F'].includes(candidatePoint)
        }
        // if moving south
        if (dy === -1) {
          return ['|', 'J', 'L'].includes(candidatePoint)
        }
        // if moving west
        if (dx === -1) {
          return ['-', '7', 'J'].includes(candidatePoint)
        }
      }
      return false
    })
    let curPoint = startingNeighbours[0]
    let [dx, dy] = [curPoint[0] - startingPoint[0], curPoint[1] - startingPoint[1]]
    do {
      const symbol = data[curPoint[1]][curPoint[0]]
      route.push(curPoint.join(','))
      // work out our direction change based on our symbol
      switch (symbol) {
        case 'F':
          dx = dx === -1 ? 0 : 1
          dy = dy === -1 ? 0 : 1
          break
        case 'L':
          dx = dx === -1 ? 0 : 1
          dy = dy === 1 ? 0 : -1
          break
        case 'J':
          dx = dx === 1 ? 0 : -1
          dy = dy === 1 ? 0 : -1
          break
        case '7':
          dx = dx === 1 ? 0 : -1
          dy = dy === -1 ? 0 : 1
          break
      }
      curPoint = [curPoint[0] + dx, curPoint[1] + dy]
    } while (startingPoint[0] !== curPoint[0] || startingPoint[1] !== curPoint[1])

    // we can conceptually simplify our map by replacing every point that is not
    // on the perimeter with a '.' - we can then replace useless points in our data
    // eg: a `-` is meaningless in terms of marking out if a point is next to it or not
    // likewise, pairs of turns that bring you straight back (a U-bend) can be removed
    // lastly, a pair of turns that takes you up/down (an S-bend) can be simplified to a |
    const simplifiedData = []
    const startingSymbol = symbolFromNeighbours(startingNeighbours)
    for (let y = 0; y < data.length; y += 1) {
      let row = ''
      for (let x = 0; x < data[y].length; x += 1) {
        if (!route.includes(`${x},${y}`)) {
          row += '.'
        } else if (data[y][x] === 'S') {
          row += startingSymbol
        } else if (data[y][x] !== '-') {
          row += data[y][x]
        }
      }
      simplifiedData.push(row
        // trim `.` - they can't be enclosed
        .replace(/^\.+/, '')
        .replace(/\.+$/, '')
        // U bends
        .replaceAll('F7', '')
        .replaceAll('LJ', '')
        // S bends
        .replaceAll('L7', '|')
        .replaceAll('FJ', '|')
      )
    }
    // the enclosed dots must be ones between an *odd* number of vertical pipes
    return simplifiedData.reduce((sum, line) => {
      // we don't start counting until we are inside a boundary
      let counting = false
      let count = 0
      for (let i = 0; i < line.length; i += 1) {
        // if we cross a boundary, then we start/stop counting
        if (line[i] === '|') {
          counting = !counting
        } else if (counting && line[i] === '.') {
          // count the dots
          count += 1
        }
      }
      return sum + count
    }, 0)
  }
}
