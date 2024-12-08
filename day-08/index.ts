import { Coordinate, Grid } from '../utils'

export async function part1 (data: string[]): Promise<string> {
  const grid = new Grid(data.map((l) => l.split('')))
  const graph = grid.findAll(['.'], true)
  const antinodes = new Set<string>()
  for (const points of Object.values(graph)) {
    for (let i = 0; i < points.length; i += 1) {
      const start = points[i]
      for (const end of points.slice(i + 1)) {
        const delta: [number, number] = [start[0] - end[0], start[1] - end[1]]
        const candidates: Coordinate[] = [[end[0] - delta[0], end[1] - delta[1]] as Coordinate, [start[0] + delta[0], start[1] + delta[1]] as Coordinate]
        candidates.forEach(([row, col]) => {
          if (row >= 0 && col >= 0 && row <= grid.maxRow && col <= grid.maxCol) {
            antinodes.add(`${row},${col}`)
          }
        })
      }
    }
  }
  return antinodes.size.toString(10)
}

export async function part2 (data: string[]): Promise<string> {
  return ''
}
