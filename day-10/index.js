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
    let startingPoint
    // find the starting point
    for (let y = 0; y < data.length; y += 1) {
      const row = data[y]
      for (let x = 0; x < row.length; x += 1) {
        const point = row[x]
        if (point === 'S') {
          startingPoint = [x, y]
          break
        }
      }
    }
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
    const route = [startingPoint]
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
  }
}
