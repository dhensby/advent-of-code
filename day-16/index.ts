import { Coordinate, Grid, Step } from '../utils'

const directions: [Step, Step, Step, Step] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
]

function prepData (data: string[]): [Grid, Array<[Coordinate, [Coordinate | null, Coordinate | null, Coordinate | null, Coordinate | null]]>] {
  const grid = new Grid(data.map((l) => l.split('')))
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
  const points = corners.map<[Coordinate, [Coordinate | null, Coordinate | null, Coordinate | null, Coordinate | null]]>((coord) => {
    // we need to determine if "where we came from" will mandate a turn or not
    // if it does, then we must add 1000 to the distance
    const neighbours = Array.from(Array(4), (v, i): Coordinate | null => {
      // first take a step in the direction to determine if we can actually travel in that direction.
      if (grid.valueAt(grid.step(coord, directions[i])) === '#') {
        // we are just next to a wall so we can't travel this way
        return null
      }
      // travel to the nearest corner in this direction
      return grid.travelFrom(coord, directions[i], corners)
    }) as [Coordinate | null, Coordinate | null, Coordinate | null, Coordinate | null]
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
    for (let dir = 0; dir < 4; dir += 1) {
      const neighbour = closest[1][dir]
      if (neighbour !== null) {
        const currentDir = prevDistance[2]
        // work out a penalty for travelling from the neighbour to this point
        // will we have had to turn?
        let penalty = 0
        if (dir !== currentDir) {
          penalty = (4 + currentDir - dir) % 2 === 0 ? 2000 : 1000
        }
        const distance = prevDistance[0] + grid.distance(closest[0], neighbour) + penalty
        // if this neighbour requires a turn left/right, it actually costs an additional 1000
        // did we have to *turn* to get from here to the other neighbor, which means we need an
        // intermediary set of distances (ie: from x to z via y)
        if (distance < (distances[neighbour.toString()]?.[0] ?? Infinity)) {
          distances[neighbour.toString()] = [distance, closest[0], dir]
        }
      }
    }
  }
  return distances[end.toString()][0]
}

export async function part2 (data: string[]): Promise<number> {
  return 0
}
