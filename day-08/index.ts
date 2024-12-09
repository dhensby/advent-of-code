import { Coordinate, Grid, Step } from '../utils'

export async function part1 (data: string[]): Promise<string> {
  const grid = new Grid(data.map((l) => l.split('')))
  const graph = grid.findAll(['.'], true)
  const antinodes = new Set<string>()
  for (const points of Object.values(graph)) {
    for (let i = 0; i < points.length; i += 1) {
      const start = points[i]
      for (const end of points.slice(i + 1)) {
        const delta: Step = [start[0] - end[0], start[1] - end[1]]
        const candidates: Coordinate[] = [grid.step(start, delta), grid.step(end, delta, true)]
        candidates.forEach(([row, col]) => {
          if (grid.inBounds([row, col])) {
            antinodes.add(`${row},${col}`)
          }
        })
      }
    }
  }
  return antinodes.size.toString(10)
}

export async function part2 (data: string[]): Promise<string> {
  const grid = new Grid(data.map((l) => l.split('')))
  const graph = grid.findAll(['.'], true)
  const antinodes = new Set<string>()
  for (const points of Object.values(graph)) {
    for (let i = 0; i < points.length; i += 1) {
      const start = points[i]
      for (const end of points.slice(i + 1)) {
        const delta: Step = [end[0] - start[0], end[1] - start[1]]
        let candidates: [Coordinate, Coordinate] = [start, end]
        while (candidates.some((pos) => grid.inBounds(pos))) {
          candidates.forEach(([row, col]) => {
            if (grid.inBounds([row, col])) {
              antinodes.add(`${row},${col}`)
            }
          })
          candidates = [grid.step(candidates[0], delta, true), grid.step(candidates[1], delta)]
        }
      }
    }
  }
  return antinodes.size.toString(10)
}
