import { Coordinate, createGridFromDimensions, Step } from '../utils'

const directions: [Step, Step, Step, Step] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1]
]

function prepData (data: string[]): Coordinate[] {
  return data.map((v) => v.split(',').reverse().map((v) => parseInt(v, 10)) as Coordinate)
}

export async function part1 (raw: string[]): Promise<number> {
  const obstacles = prepData(raw).slice(0, 1024)
  const grid = createGridFromDimensions(71, 71)
  obstacles.forEach((coord) => {
    grid.replaceAt(coord, '#')
  })
  const start: Coordinate = [0, 0]
  const end: Coordinate = [70, 70]
  const distances: Record<string, number> = {}
  const points = grid.findAll('.')['.']
  // start heading east
  distances[start.toString()] = 0
  while (points.length > 0) {
    points.sort((a, b) => {
      return (distances[b.toString()] ?? Infinity) - (distances[a.toString()] ?? Infinity)
    })
    const closest = points.pop()
    if (closest === undefined) throw new Error()
    const prevDistance = distances[closest.toString()]
    if (prevDistance === undefined) {
      break
    }
    const neighbours = Array.from(Array(4), (v, i) => {
      const coord = grid.step(closest, directions[i])
      const val = grid.valueAt(coord) ?? '#'
      return val === '#' ? null : coord
    })
    for (const neighbour of neighbours) {
      if (neighbour !== null) {
        const distance = prevDistance + 1
        // if this neighbour requires a turn left/right, it actually costs an additional 1000
        // did we have to *turn* to get from here to the other neighbor, which means we need an
        // intermediary set of distances (ie: from x to z via y)
        if (distance < (distances[neighbour.toString()] ?? Infinity)) {
          distances[neighbour.toString()] = distance
        }
      }
    }
  }
  return distances[end.toString()] ?? Infinity
}

export async function part2 (data: string[]): Promise<number> {
  return 0
}
