export type Coordinate = [number, number]

export type Line = [Coordinate, Coordinate]

export type Step = [number, number]

export class Grid {
  private readonly rowLength: number
  private readonly colLength: number
  private readonly grid: string[]
  constructor (grid: string[][]) {
    this.colLength = grid.length
    this.rowLength = grid[0].length
    this.grid = grid.flat()
  }

  coord2point ([row, col]: Coordinate): number {
    return row * this.rowLength + col
  }

  point2coord (i: number): Coordinate | null {
    if (i < 0 || i >= this.grid.length) return null
    return [Math.floor(i / this.rowLength), i % this.rowLength]
  }

  inBounds (position: Coordinate, bounds?: [Coordinate, Coordinate]): boolean {
    // if no bounds provided, assume the whole grid
    bounds ??= [[0, 0], [this.maxRow, this.maxCol]]
    return position[0] >= Math.min(bounds[0][0], bounds[1][0]) &&
    position[0] <= Math.max(bounds[0][0], bounds[1][0]) &&
    position[1] >= Math.min(bounds[0][1], bounds[1][1]) &&
    position[1] <= Math.max(bounds[0][1], bounds[1][1])
  }

  get maxRow (): number {
    return this.rowLength - 1
  }

  get maxCol (): number {
    return this.colLength - 1
  }

  valueAt (coord: Coordinate): string {
    return this.grid[this.coord2point(coord)]
  }

  find (char: string): Coordinate | null {
    const i = this.grid.flat().indexOf(char)
    return this.point2coord(i)
  }

  findAll (char: string | string[], negate = false): Record<string, Coordinate[]> {
    char = Array.isArray(char) ? char : [char]
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

  travelFrom (start: Coordinate, direction: Step, destinations?: Coordinate[]): Coordinate {
    destinations ??= []
    // we are being naive here and assuming that directions are only along one axis
    if (destinations.length === 0 && direction.every((axis) => axis === 0 || Math.abs(axis) === 1)) {
      return [
        direction[0] === 0 ? start[0] : direction[0] > 0 ? this.maxRow : 0,
        direction[1] === 0 ? start[1] : direction[1] > 0 ? this.maxCol : 0
      ]
    }

    let currentPosition = start

    while (!destinations.some(([row, col]) => row === currentPosition[0] && col === currentPosition[1])) {
      const candidate = this.step(currentPosition, direction)
      if (!this.inBounds(candidate)) {
        break
      }
      currentPosition = candidate
    }
    return currentPosition
  }

  step (start: Coordinate, step: Step, backwards = false): Coordinate {
    const increment = backwards ? [-step[0], -step[1]] : step
    return [start[0] + increment[0], start[1] + increment[1]]
  }

  draw (points?: Record<string, Coordinate[]>): string {
    const grid: string[][] = []
    // place all our known points, then fill the rest
    Object.entries(points ?? {}).forEach(([val, coordinates]) => {
      coordinates.forEach(([row, col]) => {
        grid[row] ??= []
        grid[row][col] ??= val
      })
    })
    this.grid.forEach((val, i) => {
      const [row, col] = [Math.floor(i / this.colLength), i % this.rowLength]
      grid[row] ??= []
      grid[row][col] ??= val
    })
    return grid.map((row) => row.join('')).join('\n')
  }
}
