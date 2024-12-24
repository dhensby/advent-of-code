import { Coordinate, Grid, Step } from '../utils'

function prepData (data: string[], wide = false): [Grid, Step[]] {
  let i = 0
  const [map, moves] = data.reduce<string[][]>((accum, line) => {
    if (line === '') {
      i += 1
    }
    accum[i] ??= []
    accum[i].push(line)
    return accum
  }, [])
  const grid = new Grid(map.map((l) => l.split('').map((v) => {
    if (wide) {
      switch (v) {
        case 'O':
          return '[]'
        case '.':
        case '@':
          return `${v}.`
        default:
          return v.repeat(2)
      }
    }
    return v
  }).join('').split('')))
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

export async function part2 (data: string[]): Promise<number> {
  const [grid, moves] = prepData(data, true)
  let pos = grid.find('@') as Coordinate
  moves.forEach((step, i) => {
    // create a list of all points "ahead" of us until we hit an obstacle or
    // there's a space
    const start = pos
    let cur = start
    let val = grid.valueAt(cur)
    const items = new Set<string>()
    const stack: Coordinate[] = [start]
    do {
      cur = stack.pop() as Coordinate
      cur = grid.step(cur, step)
      val = grid.valueAt(cur)
      // have we hit a box?
      // we must spread out the items we're looking at that have been hit or not
      if (val === '[') {
        const neighbour = grid.step(cur, [0, 1])
        stack.unshift(neighbour)
        // N/S
        if (step[1] === 0 && !items.has([cur, val].toString())) stack.push(cur)
        items.add([neighbour, ']'].toString())
      } else if (val === ']') {
        const neighbour = grid.step(cur, [0, -1])
        stack.unshift(neighbour)
        // N/S
        if (step[1] === 0 && !items.has([cur, val].toString())) stack.push(cur)
        items.add([neighbour, '['].toString())
      }
      items.add([cur, val].toString())
    } while (stack.length > 0 && val !== '#')
    // we hit a dead end, so don't do anything
    if (val === '#') return
    const uniqueItems = Array.from(items).map<[Coordinate, string]>((v) => {
      const [row, col, val] = v.split(',')
      return [[parseInt(row, 10), parseInt(col, 10)], val]
    }).sort(([a], [b]) => {
      // we want to sort so that we go from the head to the tail
      // if step[0] === 1 we are going south, so we want to have the largest
      // row first ie: descending order by row
      // N/S
      if (step[1] === 0) {
        // multiplying by the sign of the step means we reverse the order when
        // heading north
        return (a[0] - b[0]) * Math.sign(step[0])
      }
      return 0
    })
    let next = uniqueItems.pop()
    // there must be boxes and space ahead, so we can just
    // fill all the spaces with boxes, and we can adjust the robot
    // position after
    while (next !== undefined) {
      // E/W
      if (step[0] === 0) {
        // E
        if (step[1] === 1) {
          grid.replaceAt(next[0], next[1] === '.' ? ']' : next[1] === '[' ? ']' : '[')
        } else {
          grid.replaceAt(next[0], next[1] === '.' ? '[' : next[1] === '[' ? ']' : '[')
        }
      } else if (next[1] !== '.') {
        // move the current value into the direction ahead
        grid.replaceAt(grid.step(next[0], step), next[1])
        // replace this item with an empty space (we will fill it later)
        grid.replaceAt(next[0], '.')
        // if (next[1] === ']') {
        //     grid.replaceAt(grid.step(next[0], [1, step[1]]), '.')
        // } else if (next[1] === '[') {
        //     grid.replaceAt(grid.step(next[0], [-1, step[1]]), '.')
        // }
      }
      next = uniqueItems.pop()
    }
    // finish up by move the robot one step
    grid.replaceAt(start, '.')
    pos = grid.step(start, step)
    grid.replaceAt(pos, '@')
  })
  return grid.findAll('[')['['].reduce((sum, [row, col]) => {
    return sum + (100 * row + col)
  }, 0)
}
