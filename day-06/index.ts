type Coordinate = [number, number]

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

function prepData (data: string[]): [Coordinate, Coordinate[], string[][]] {
  const grid = data.map((line) => line.split(''))
  let startPoint: Coordinate | null = null
  // create a graph of all obstructions and the nearest obstruction in each direction
  const graph: Coordinate[] = grid.reduce<Coordinate[]>((acc, line, row) => {
    line.forEach((element, col) => {
      const point: Coordinate = [row, col]
      if (element === '^') {
        startPoint = point
      } else if (element === '#') {
        acc.push(point)
      }
    })
    return acc
  }, [])
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

type Journey = [Coordinate, Coordinate, Direction]

function walk (grid: string[][], obstacles: Coordinate[], start: Coordinate): Journey[] | null {
  const journeys: Journey[] = []
  let position = start
  let direction: Direction = Direction.N as Direction
  let end = false
  do {
    // find the obstacle you're going to hit given current direction of travel
    // first, find all points on the axis of travel that are "in your way"
    let [hit] = obstacles.filter(([row, col]) => {
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
      // sort the candidate obstacles so that the "closest" one is first
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
    // we found an obstacle in the way, calculate the new position
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
    journeys.push([position, hit, direction])
    // update our current position
    position = hit
    // rotate our direction 90 to the right
    direction = (direction + 2) % 8
    // check if the journey is in a loop or not by seeing if we have ended in a location that is on a previous journey
    const visitedBefore = journeys.find(([start, end, journeyDir]) => {
      // are we going the same direction
      if (journeyDir !== direction) {
        return false
      }
      switch (journeyDir) {
        case Direction.N:
          return position[1] === start[1] && position[1] === end[1] && position[0] <= start[0] && position[0] >= end[0]
        case Direction.S:
          return position[1] === start[1] && position[1] === end[1] && position[0] >= start[0] && position[0] <= end[0]
        case Direction.E:
          return position[0] === start[0] && position[0] === end[0] && position[1] >= start[1] && position[1] <= end[1]
        case Direction.W:
          return position[0] === start[0] && position[0] === end[0] && position[1] <= start[1] && position[1] >= end[1]
        default:
          return false
      }
    })
    if (visitedBefore !== undefined) {
      return null
    }
  } while (!end)
  return journeys
}

export async function part1 (raw: string[]): Promise<string> {
  const [start, obstacles, grid] = prepData(raw)
  console.time('part1')
  const journeys = walk(grid, obstacles, start)
  // calculate all the points we went through for our journeys & add to a set to get the unique coords
  const visited = journeys?.reduce((v, [start, end, direction]) => {
    // we are on the same row, so travelling E/W
    if (start[0] === end[0]) {
      // loop from start to end point and add each point to the set
      const from = direction === Direction.W ? end[1] : start[1]
      const to = direction === Direction.W ? start[1] : end[1]
      for (let i = from; i <= to; i += 1) {
        v.add(`${start[0]},${i}`)
      }
    } else {
      const from = direction === Direction.N ? end[0] : start[0]
      const to = direction === Direction.N ? start[0] : end[0]
      for (let i = from; i <= to; i += 1) {
        v.add(`${i},${start[1]}`)
      }
    }
    return v
  }, new Set<string>())
  console.timeEnd('part1')
  return visited?.size.toString(10) ?? ''
}

export async function part2 (raw: string[]): Promise<string> {
  const [start, obstacles, grid] = prepData(raw)
  // stupid approach is just to add an obstacle to every place there is a '.'
  // better approach is to place obstacles along every visited
  console.time('part2')
  const visited = walk(grid, obstacles, start)?.reduce((v, [start, end, direction]) => {
    // we are on the same row, so travelling E/W
    if (start[0] === end[0]) {
      // loop from start to end point and add each point to the set
      const from = direction === Direction.W ? end[1] : start[1]
      const to = direction === Direction.W ? start[1] : end[1]
      for (let i = from; i <= to; i += 1) {
        v.add(`${start[0]},${i}`)
      }
    } else {
      const from = direction === Direction.N ? end[0] : start[0]
      const to = direction === Direction.N ? start[0] : end[0]
      for (let i = from; i <= to; i += 1) {
        v.add(`${i},${start[1]}`)
      }
    }
    return v
  }, new Set<string>())
  // just replace every visited position with an obstacle
  const count = Array.from(visited?.values() ?? []).reduce((sum, next) => {
    sum += walk(grid, [next.split(',').map((v) => parseInt(v, 10)) as Coordinate, ...obstacles], start) === null ? 1 : 0
    return sum
  }, 0)
  console.timeEnd('part2')
  return count.toString(10)
}
