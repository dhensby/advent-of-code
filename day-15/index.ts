import { Coordinate, Grid, Step } from '../utils'

function prepData (data: string[]): [Grid, Step[]] {
  let i = 0
  const [map, moves] = data.reduce<string[][]>((accum, line) => {
    if (line === '') {
      i += 1
    }
    accum[i] ??= []
    accum[i].push(line)
    return accum
  }, [])
  const grid = new Grid(map.map((l) => l.split('')))
  return [grid, moves.join('').trim().split('').map((dir) => {
    switch (dir) {
      case '^':
        return [-1, 0]
      case '>':
        return [0, 1]
      case 'v':
        return [1, 0]
      case '<':
        return [0, -1]
      default:
        throw new Error()
    }
  })]
}

export async function part1 (data: string[]): Promise<number> {
  const [grid, moves] = prepData(data)
  let pos = grid.find('@') as Coordinate
  moves.forEach((step, i) => {
    // create a list of all points "ahead" of us until we hit an obstacle or
    // there's a space
    const start = pos
    let cur = start
    let val = grid.valueAt(cur)
    const items: Array<[Coordinate, string]> = []
    do {
      cur = grid.step(cur, step)
      val = grid.valueAt(cur)
      items.push([cur, val])
    } while (val !== '.' && val !== '#')
    let next = items.pop()
    // we hit a dead end, so dont do anything
    if (next?.[1] === '#') return
    // there must be boxes and space ahead, so we can just
    // fill all the spaces with boxes, and we can adjust the robot
    // position after
    while (next !== undefined) {
      grid.replaceAt(next[0], 'O')
      next = items.pop()
    }
    // move the robot one step
    grid.replaceAt(start, '.')
    pos = grid.step(start, step)
    grid.replaceAt(pos, '@')
  })
  return grid.findAll('O').O.reduce((sum, [row, col]) => {
    return sum + (100 * row + col)
  }, 0)
}

export async function part2 (data: string[]): Promise<string> {
  // const grid = prepData(data)
  return ''
}
