import { Coordinate, Grid, Line, Step } from '../utils'

function prepData (lines: string[]): Grid {
  return new Grid(lines.map((line) => line.split('')))
}

function filterObstacles (obstacles: Coordinate[], start: Coordinate, direction: Step): Coordinate[] {
  // filter out any irrelevant destinations
  return obstacles.filter(([row, col]) => {
    // if we aren't traversing rows, then filter out points on other rows
    if (direction[0] === 0 && row !== start[0]) {
      return false
    }
    // if we aren't traversing cols, then filter out points that are in other cols
    if (direction[1] === 0 && col !== start[1]) {
      return false
    }
    // filter out any points that aren't "ahead" of us
    if (direction[0] > 0 && row <= start[0]) {
      return false
    }
    if (direction[0] < 0 && row >= start[0]) {
      return false
    }
    if (direction[1] > 0 && col <= start[1]) {
      return false
    }
    if (direction[1] < 0 && col >= start[1]) {
      return false
    }
    return true
  })
}

function walk (grid: Grid, start: Coordinate, obstacles: Coordinate[]): Line[] | undefined {
  const dirs: Step[] = [
    // north
    [-1, 0],
    // east
    [0, 1],
    // south
    [1, 0],
    // west
    [0, -1]
  ]
  const journeys: Line[] = []
  let from = start
  let direction = 0
  // if we have started on this spot before, we must be in a loop
  while (!journeys.some(([begin]) => begin[0] === from[0] && begin[1] === from[1])) {
    // filter out any irrelevant destinations
    const filteredObstacles = filterObstacles(obstacles, from, dirs[direction])
    let end = grid.travelFrom(from, dirs[direction], filteredObstacles)
    // did we hit an obstacle or did we go off the map
    if (filteredObstacles.some(([row, col]) => end[0] === row && end[1] === col)) {
      end = grid.step(end, dirs[direction], true)
      // don't record us just *turning* and not *travelling*
      if (end[0] !== from[0] || end[1] !== from[1]) {
        journeys.push([from, end])
      }
    } else {
      // off the map
      journeys.push([from, end])
      return journeys
    }
    direction = (direction + 1) % dirs.length
    from = end
  }
  return undefined
}

export async function part1 (raw: string[]): Promise<string> {
  const grid = prepData(raw)
  const obstacles = grid.findAll('#')['#']
  const start = grid.find('^')
  if (start === null) throw new Error()
  console.time('part1')
  const journeys = walk(grid, start, obstacles)
  // generate all points along a line
  const points = journeys?.reduce((set, [start, end]) => {
    set.add(start.join(','))
    const step: Step = [end[0] - start[0], end[1] - start[1]]
    let position = start
    while (position[0] !== end[0] || position[1] !== end[1]) {
      // there's definitely a nicer way to work out the grid increments
      if (step[0] === 0) {
        position = grid.step(position, [0, step[1] > 0 ? 1 : -1])
      } else if (step[1] === 0) {
        position = grid.step(position, [step[0] > 0 ? 1 : -1, 0])
      }
      set.add(position.join(','))
    }
    return set
  }, new Set<string>())
  console.timeEnd('part1')
  // console.log(grid.draw({'X': Array.from(points.values()).map((v) => v.split(',').map((p) => parseInt(p, 10)) as Coordinate)}))
  return points?.size.toString(10) ?? ''
}

export async function part2 (raw: string[]): Promise<string> {
  const grid = prepData(raw)
  const obstacles = grid.findAll('#')['#']
  const start = grid.find('^')
  if (start === null) throw new Error()
  console.time('part2')
  const journeys = walk(grid, start, obstacles)
  const points = journeys?.reduce((set, [start, end]) => {
    set.add(start.join(','))
    const step: Step = [end[0] - start[0], end[1] - start[1]]
    let position = start
    while (position[0] !== end[0] || position[1] !== end[1]) {
      // there's definitely a nicer way to work out the grid increments
      if (step[0] === 0) {
        position = grid.step(position, [0, step[1] > 0 ? 1 : -1])
      } else if (step[1] === 0) {
        position = grid.step(position, [step[0] > 0 ? 1 : -1, 0])
      }
      set.add(position.join(','))
    }
    return set
  }, new Set<string>())
  // most simple solution is to place an obstacle on every visited point and see if that
  // ends up in a loop or not
  const sum = Array.from(points?.values() ?? []).reduce((accum, p) => {
    const point = p.split(',').map((c) => parseInt(c, 10)) as Coordinate
    if (walk(grid, start, [point, ...obstacles]) === undefined) {
      return accum + 1
    }
    return accum
  }, 0)
  console.timeEnd('part2')
  // we want to find all candidate points for an obstacle.
  // candidate points are going to be along the side of a parallel line in the *other* direction to a journey
  // where we have clear line of sight to that line
  return sum.toString(10)
}
