import { Coordinate, Grid, Step } from '../utils'

const directions: [Step, Step, Step, Step] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
]

function prepData (data: string[]): [Grid, Array<[Coordinate, Array<[Coordinate, number]>]>] {
  const grid = new Grid(data.map((l) => l.split('')))
  const obstructions = grid.findAll('#')['#']
  // find all corner points - our "neighbours" are actually corners and not just the point
  // get all the valid points we can walk
  const corners = Object.values(grid.findAll(['.', 'S', 'E'])).flat().filter((p) => {
    const neighbours = [
      grid.valueAt(grid.step(p, directions[0])),
      grid.valueAt(grid.step(p, directions[1])),
      grid.valueAt(grid.step(p, directions[2])),
      grid.valueAt(grid.step(p, directions[3]))
    ]
    // it's a turning point as long as the only access is *not* along one plane
    if ((neighbours[0] === '#' && neighbours[2] === '#' && neighbours[1] !== '#' && neighbours[3] !== '#') || (neighbours[0] !== '#' && neighbours[2] !== '#' && neighbours[1] === '#' && neighbours[3] === '#')) {
      return false
    }
    return true
  })
  const stoppingPoints = [...corners, ...obstructions]
  const points = corners.map<[Coordinate, Array<[Coordinate, number]>]>((coord) => {
    // we need to determine if "where we came from" will mandate a turn or not
    // if it does, then we must add 1000 to the distance
    const neighbours: Array<[Coordinate, number]> = []
    for (let dir = 0; dir < 4; dir += 1) {
      let pos = grid.travelFrom(coord, directions[dir], stoppingPoints)
      while (grid.valueAt(pos) !== '#') {
        neighbours.push([pos, dir])
        pos = grid.travelFrom(pos, directions[dir], stoppingPoints)
      }
    }
    return [coord, neighbours]
  })
  return [grid, points]
}

export async function part1 (data: string[]): Promise<number> {
  const [grid, graph] = prepData(data)
  // we now have a grid and points we can travel between - this is our graph which forms the basis of
  // performing a shortest path algorithm
  // store a map of coordinates => [distance, coordinate we came from, direction to get here]
  const distances: Record<string, [number, Coordinate, number]> = {}
  const start = grid.find('S')
  const end = grid.find('E')
  const points = [...graph]
  if (end === null || start === null) throw new Error()
  // start heading east
  distances[start.toString()] = [0, start, 1]
  while (points.length > 0) {
    points.sort(([a], [b]) => {
      return (distances[b.toString()]?.[0] ?? Infinity) - (distances[a.toString()]?.[0] ?? Infinity)
    })
    const closest = points.pop()
    if (closest === undefined) throw new Error()
    const prevDistance = distances[closest[0].toString()]
    if (prevDistance === undefined) {
      break
    }
    for (const neighbour of closest[1]) {
      if (neighbour !== null) {
        const [, dir] = neighbour
        const currentDir = prevDistance[2]
        // work out a penalty for travelling from the neighbour to this point
        // will we have had to turn?
        let penalty = 0
        if (dir !== currentDir) {
          penalty = (4 + currentDir - dir) % 2 === 0 ? 2000 : 1000
        }
        const distance = prevDistance[0] + grid.distance(closest[0], neighbour[0]) + penalty
        // if this neighbour requires a turn left/right, it actually costs an additional 1000
        // did we have to *turn* to get from here to the other neighbor, which means we need an
        // intermediary set of distances (ie: from x to z via y)
        if (distance < (distances[neighbour[0].toString()]?.[0] ?? Infinity)) {
          distances[neighbour[0].toString()] = [distance, closest[0], dir]
        }
      }
    }
  }
  return distances[end.toString()][0]
}

export async function part2 (data: string[]): Promise<number> {
  const [grid, graph] = prepData(data)
  // like part 1, except we want to store all the best paths
  const distances: Record<string, [number, Array<[Coordinate, number]>]> = {}
  const start = grid.find('S')
  const end = grid.find('E')
  const points = [...graph]
  if (end === null || start === null) throw new Error()
  // start heading east
  distances[start.toString()] = [0, [[start, 1]]]
  while (points.length > 0) {
    points.sort(([a], [b]) => {
      return (distances[b.toString()]?.[0] ?? Infinity) - (distances[a.toString()]?.[0] ?? Infinity)
    })
    const closest = points.pop()
    if (closest === undefined) throw new Error()
    const prevDistance = distances[closest[0].toString()]
    if (prevDistance === undefined) {
      break
    }
    for (const neighbour of closest[1]) {
      if (neighbour !== null) {
        const [, dir] = neighbour
        for (const [, currentDir] of prevDistance[1]) {
          // work out a penalty for travelling from the neighbour to this point
          // will we have had to turn?
          let penalty = 0
          if (dir !== currentDir) {
            penalty = (4 + currentDir - dir) % 2 === 0 ? 2000 : 1000
          }
          const distance = prevDistance[0] + grid.distance(closest[0], neighbour[0]) + penalty
          // this is a brand new cheapest way to get there
          if (distance < (distances[neighbour[0].toString()]?.[0] ?? Infinity)) {
            distances[neighbour[0].toString()] = [distance, [[closest[0], dir]]]
          } else if (distance === distances[neighbour[0].toString()][0] && !distances[neighbour[0].toString()][1].some(([c]) => c[0] === closest[0][0] && c[1] === closest[0][1])) {
            distances[neighbour[0].toString()][1].push([closest[0], dir])
          }
        }
      }
    }
  }
  // start from the end, and then find the shortest routes to get here
  const nodes = [end]
  const coordinates = new Set<string>()
  const goneFrom = new Set<string>()
  while (nodes.length > 0) {
    const from = nodes.pop()
    if (from !== undefined && !goneFrom.has(from.toString())) {
      goneFrom.add(from.toString())
      for (const [to, dir] of distances[from.toString()][1]) {
        let pos = from
        coordinates.add(pos.toString())
        while (pos[0] !== to[0] || pos[1] !== to[1]) {
          coordinates.add(pos.toString())
          pos = grid.step(pos, directions[dir], true)
        }
        if ((to[0] !== start[0] || to[1] !== start[1])) {
          nodes.unshift(to)
        } else if (to[0] === start[0] && to[1] === start[1]) {
          coordinates.add(to.toString())
        }
      }
    }
  }
  return coordinates.size
}
