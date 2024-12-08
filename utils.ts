export type Coordinate = [number, number]

export type Line = [Coordinate, Coordinate]

export class Grid {
  private readonly rowLength: number
  private readonly colLength: number
  private readonly grid: string[]
  constructor (grid: string[][]) {
    this.colLength = grid.length
    this.rowLength = grid[0].length
    this.grid = grid.flat()
  }

  private point2coord (i: number): Coordinate | null {
    if (i < 0 || i >= this.grid.length) return null
    return [Math.floor(i / this.rowLength), i % this.rowLength]
  }

  get maxRow (): number {
    return this.rowLength - 1
  }

  get maxCol (): number {
    return this.colLength - 1
  }

  find (char: string): Coordinate | null {
    const i = this.grid.flat().indexOf(char)
    return this.point2coord(i)
  }

  findAll (char: string[], negate = false): Record<string, Coordinate[]> {
    return this.grid.reduce((points, point, i) => {
      if ((!negate && char.includes(point)) || (negate && !char.includes(point))) {
        const p = this.point2coord(i)
        if (p != null) {
          points[point] ??= []
          points[point].push(p)
        }
      }
      return points
    }, Object.create(null))
  }
}
