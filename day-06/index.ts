type Coordinate = [number, number]

type CoordinateEntries = [Coordinate | null, Coordinate | null, Coordinate | null, Coordinate | null]

enum Direction {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW,
}

function navigateDirection (direction: Direction, pos: Coordinate): Coordinate {
  let [row, col] = pos
  switch (direction) {
    case Direction.N:
    case Direction.NE:
    case Direction.NW:
      row -= 1
      break
    case Direction.S:
    case Direction.SE:
    case Direction.SW:
      row += 1
      break
  }
  switch (direction) {
    case Direction.E:
    case Direction.NE:
    case Direction.SE:
      col += 1
      break
    case Direction.W:
    case Direction.SW:
    case Direction.NW:
      col -= 1
      break
  }
  return [row, col]
}

function prepData (data: string[]): [Coordinate, Map<Coordinate, CoordinateEntries>, string[][]] {
  const grid = data.map((line) => line.split(''))
  let startPoint: Coordinate | null = null
  // create a graph of all obstructions and the nearest obstruction in each direction
  const graph: Map<Coordinate, CoordinateEntries> = grid.reduce((acc, line, row) => {
    line.forEach((element, col) => {
      const point: Coordinate = [row, col]
      if (element === '^') {
        startPoint = point
      } else if (element === '#') {
        const points: CoordinateEntries = [null, null, null, null]
        let pos = point
        for (let dir = 0; dir < 8; dir += 2) {
          do {
            pos = navigateDirection(dir, pos)
          } while (grid[pos[0]]?.[pos[1]] === '.')
          if (grid[pos[0]]?.[pos[1]] !== undefined) {
            points[dir / 2] = pos
          }
        }
        acc.set([row, col], points)
      }
    })
    return acc
  }, new Map())
  if (startPoint === null) throw new Error()
  return [startPoint, graph, grid]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function render (grid: string[][], position: Coordinate, direction: Direction): void {
  const icon = ['^', '>', 'v', '<'][direction / 2]
  for (let i = 0; i < grid.length; i += 1) {
    let row = ''
    for (let j = 0; j < grid[i].length; j += 1) {
      row += position[0] === i && position[1] === j ? icon : grid[i][j] === '#' ? '#' : '.'
    }
    console.log(row)
  }
  console.log('')
}

export async function part1 (raw: string[]): Promise<string> {
  const [start, graph, grid] = prepData(raw)
  const journeys: Array<[Coordinate, Coordinate]> = []
  const obstacleCoords = Array.from(graph.keys())
  let position = start
  let direction: Direction = Direction.N as Direction
  let end = false
  do {
    // find the obstacle you're going to hit given current direction of travel
    let [hit] = obstacleCoords.filter(([row, col]) => {
      switch (direction) {
        case Direction.N:
          return col === position[1] && row < position[0]
        case Direction.S:
          return col === position[1] && row > position[0]
        case Direction.E:
          return row === position[0] && col > position[1]
        case Direction.W:
          return row === position[0] && col < position[1]
        default:
          return false
      }
    }).sort((a, b) => {
      switch (direction) {
        case Direction.N:
          return b[0] - a[0]
        case Direction.S:
          return a[0] - b[0]
        case Direction.E:
          return a[1] - b[1]
        case Direction.W:
          return b[1] - a[1]
        default:
          return 0
      }
    })
    // we found an obstacle, calculate new position
    if (hit !== undefined) {
      // clone the position so we don't modify it by reference
      hit = [...hit]
      // we will be "next to" the obstacle, but where depends on the direction we travelled
      switch (direction) {
        case Direction.N:
          hit[0] += 1
          break
        case Direction.S:
          hit[0] -= 1
          break
        case Direction.E:
          hit[1] -= 1
          break
        case Direction.W:
          hit[1] += 1
          break
      }
    } else {
      // we hit the edge - so we are finished
      end = true
      // calculate the final position depending on the direction we travelled
      switch (direction) {
        case Direction.N:
          hit = [0, position[1]]
          break
        case Direction.S:
          hit = [grid.length - 1, position[1]]
          break
        case Direction.E:
          hit = [position[0], grid[grid.length - 1].length - 1]
          break
        case Direction.W:
          hit = [position[0], 0]
          break
      }
    }
    // render(grid, hit!, direction)
    // record our start / end position as our current "journey"
    journeys.push([position, hit])
    // update our current position
    position = hit
    // rotate our direction 90 to the right
    direction = (direction + 2) % 8
  } while (!end)
  // calculate all the points we went through for our journeys & add to a set to get the unique coords
  const visited = journeys.reduce((v, [start, end]) => {
    // we are on the same row, so travelling E/W
    if (start[0] === end[0]) {
      // loop from start to end point and add each point to the set
      const from = start[1] > end[1] ? end[1] : start[1]
      const to = start[1] > end[1] ? start[1] : end[1]
      for (let i = from; i <= to; i += 1) {
        v.add(`${start[0]},${i}`)
      }
    } else {
      const from = start[0] > end[0] ? end[0] : start[0]
      const to = start[0] > end[0] ? start[0] : end[0]
      for (let i = from; i <= to; i += 1) {
        v.add(`${i},${start[1]}`)
      }
    }
    return v
  }, new Set<string>())
  return visited.size.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  // const data = prepData(raw)
  return ''
}
