import { Coordinate, createGridFromDimensions, Step } from '../utils'

function prepData (raw: string[]): Array<[Coordinate, Step]> {
  return raw.reduce<Array<[Coordinate, Step]>>((robots, line) => {
    const match = line.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)
    if (match != null) {
      robots.push([[parseInt(match[2], 10), parseInt(match[1], 10)], [parseInt(match[4], 10), parseInt(match[3], 10)]])
    }
    return robots
  }, [])
}

export async function part1 (raw: string[]): Promise<number> {
  const robots = prepData(raw)
  const grid = createGridFromDimensions(7, 11)
  // move all the robots 100 steps - I suspect they probably retrace their steps
  // after a certain number of iterations so eventually these loops are not needed
  // as their steps become predicatable
  for (let i = 0; i < 100; i += 1) {
    robots.forEach((robot) => {
      robot[0] = grid.step(robot[0], robot[1], false, true)
    })
  }
  // sort into quadrants - represented by top left and bottom right points
  const quardrants: Array<[Coordinate, Coordinate]> = [
    // row, col
    [[0, 0], [Math.floor((grid.maxRow + 1) / 2) - 1, Math.floor((grid.maxCol + 1) / 2) - 1]],
    [[0, Math.ceil((grid.maxCol + 1) / 2)], [Math.floor((grid.maxRow + 1) / 2) - 1, grid.maxCol]],
    [[Math.ceil((grid.maxRow + 1) / 2), 0], [grid.maxRow, Math.floor((grid.maxCol + 1) / 2) - 1]],
    [[Math.ceil((grid.maxRow + 1) / 2), Math.ceil((grid.maxCol + 1) / 2)], [grid.maxRow, grid.maxCol]]
  ]
  const counts = robots.reduce<number[]>((quadCounts, [pos]) => {
    for (let i = 0; i < quardrants.length; i += 1) {
      if (grid.inBounds(pos, quardrants[i])) {
        quadCounts[i] ??= 0
        quadCounts[i] += 1
      }
    }
    return quadCounts
  }, [])
  return counts.reduce((prod, next) => prod * next, 1)
}

export async function part2 (raw: string[]): Promise<number> {
  const robots = prepData(raw)
  const grid = createGridFromDimensions(103, 101)
  // it seems that we can narrow down the xmas tree pattern by checking when the
  // "danger" level is lowest. Iterate for a reasonable number of tries looking
  // for whenever the danger becomes "low"
  let minDanger = Infinity
  for (let i = 0; i < 100000; i += 1) {
    robots.forEach((robot) => {
      robot[0] = grid.step(robot[0], robot[1], false, true)
    })
    // sort into quadrants - represented by top left and bottom right points
    const quardrants: Array<[Coordinate, Coordinate]> = [
      // row, col
      [[0, 0], [Math.floor((grid.maxRow + 1) / 2) - 1, Math.floor((grid.maxCol + 1) / 2) - 1]],
      [[0, Math.ceil((grid.maxCol + 1) / 2)], [Math.floor((grid.maxRow + 1) / 2) - 1, grid.maxCol]],
      [[Math.ceil((grid.maxRow + 1) / 2), 0], [grid.maxRow, Math.floor((grid.maxCol + 1) / 2) - 1]],
      [[Math.ceil((grid.maxRow + 1) / 2), Math.ceil((grid.maxCol + 1) / 2)], [grid.maxRow, grid.maxCol]]
    ]
    const counts = robots.reduce<number[]>((quadCounts, [pos]) => {
      for (let i = 0; i < quardrants.length; i += 1) {
        if (grid.inBounds(pos, quardrants[i])) {
          quadCounts[i] += 1
        }
      }
      return quadCounts
    }, [0, 0, 0, 0])
    const danger = counts.reduce((prod, next) => prod * next, 1)
    if (danger < minDanger) {
      minDanger = danger
      // this is a pretty gross hack to determine if the xmas tree has been rendered
      // it would be nicer to look through the points for a clean "box"
      // but I'm too lazy for that (and it would solve it without relying on the "danger"
      // value too
      if (grid.draw({ '#': robots.map(([p]) => p) }).includes('###############################')) {
        return i + 1
      }
    }
  }
  return 0
}
