import { Coordinate, Grid, Step } from '../utils'

const directions: [Step, Step, Step, Step] = [
  [-1, 0], // N
  [0, 1], // E
  [1, 0], // S
  [0, -1] // W
]

// the values of the neighbours N/E/S/W - index is the "point" on the graph
type Graph = Array<[number | null, number | null, number | null, number | null]>

function prepData (raw: string[]): [Grid, Graph] {
  const grid = new Grid(raw.map((r) => r.split('')))
  const graph: Graph = []
  for (let row = 0; row <= grid.maxRow; row += 1) {
    for (let col = 0; col <= grid.maxCol; col += 1) {
      const point = grid.coord2point([row, col])
      const value = parseInt(grid.valueAt([row, col]), 10)
      graph[point] = [null, null, null, null]
      for (let dir = 0; dir < directions.length; dir += 1) {
        const coord = grid.step([row, col], directions[dir])
        if (grid.inBounds(coord)) {
          const neighbour = grid.valueAt(coord)
          // we actually only want to record values that are +1 from
          // the current point
          if (neighbour !== '.' && parseInt(neighbour, 10) - value === 1) {
            graph[point][dir] = parseInt(grid.valueAt(coord), 10)
          }
        }
      }
    }
  }
  return [grid, graph]
}

export async function part1 (raw: string[]): Promise<string> {
  const [grid, graph] = prepData(raw)
  // it is a valid trail head only if is a 0 on the map and it has a neighbour of 1
  const trailheads = grid.findAll('0')['0'].filter((coord) => {
    return graph[grid.coord2point(coord)].some((n) => n !== null)
  })
  const valid: Coordinate[][] = []
  // track all trailheads. On each step record all the valid next steps
  // at the end, find all the unique final steps
  for (const trail of trailheads) {
    const heads = [trail]
    // a trail can only go from 0 -> 9 but we are starting at 0
    for (let i = 1; i <= 9; i += 1) {
      // a trail could have many heads - we need to step along all of them
      const len = heads.length
      for (let h = 0; h < len; h += 1) {
        const head = heads.shift()
        if (head === undefined) throw new Error()
        const point = grid.coord2point(head)
        for (const dir in directions) {
          // this is a valid next step
          if (graph[point][dir] === i) {
            heads.push(grid.step(head, directions[dir]))
          }
        }
      }
    }
    valid.push(heads)
  }
  const score = valid.reduce((sum, trail) => {
    const unique = new Set(trail.map((t) => t.toString()))
    return sum + unique.size
  }, 0)
  return score.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  const [grid, graph] = prepData(raw)
  // it is a valid trail head only if is a 0 on the map and it has a neighbour of 1
  const trailheads = grid.findAll('0')['0'].filter((coord) => {
    return graph[grid.coord2point(coord)].some((n) => n !== null)
  })
  const valid: Coordinate[][] = []
  // track all trailheads. On each step record all the valid next steps
  // at the end, find all the unique final steps
  for (const trail of trailheads) {
    const heads = [trail]
    // a trail can only go from 0 -> 9 but we are starting at 0
    for (let i = 1; i <= 9; i += 1) {
      // a trail could have many heads - we need to step along all of them
      const len = heads.length
      for (let h = 0; h < len; h += 1) {
        const head = heads.shift()
        if (head === undefined) throw new Error()
        const point = grid.coord2point(head)
        for (const dir in directions) {
          // this is a valid next step
          if (graph[point][dir] === i) {
            heads.push(grid.step(head, directions[dir]))
          }
        }
      }
    }
    valid.push(heads)
  }
  return valid.flat().length.toString(10)
}
