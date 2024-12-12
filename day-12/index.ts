import { Coordinate, Grid, Step } from '../utils'

const directions: [Step, Step, Step, Step, Step, Step, Step, Step] = [
  [-1, 0], // N
  [-1, 1], // NE
  [0, 1], // E
  [1, 1], // SE
  [1, 0], // S
  [1, -1], // SW
  [0, -1], // W
  [-1, -1] // NW
]

type Neighbours = [string | null, string | null, string | null, string | null]

function prepData (raw: string[]): [Grid, Record<string, Array<[Coordinate, Neighbours]>>, Record<string, Coordinate[][]>] {
  const grid = new Grid(raw.map((r) => r.split('')))
  const graph: Record<string, Array<[Coordinate, Neighbours]>> = {}
  for (let row = 0; row < grid.maxRow + 1; row += 1) {
    for (let col = 0; col < grid.maxCol + 1; col += 1) {
      const val = grid.valueAt([row, col])
      const neighbours: Array<string | null> = []
      for (const step of directions) {
        // we only care about neighbours with the same value as we are just
        // collecting "edges"
        const pos = grid.step([row, col], step)
        const neighbour = grid.inBounds(pos) ? grid.valueAt(pos) : null
        neighbours.push(val === neighbour ? val : null)
      }
      // we only care about edges, so if there are more than 2 neighbours,
      // we only care about the 2 on the same plain
      graph[val] ??= []
      graph[val].push([[row, col], neighbours.filter((n, i) => {
        return i % 2 === 0
      }) as Neighbours])
    }
  }
  const visited = new Set<string>()
  // for each of the points, go through them and group them into their "plots"
  const plots: Record<string, Coordinate[][]> = {}
  for (const [val, entries] of Object.entries(graph)) {
    for (const entry of entries) {
      const perimeter: Coordinate[] = []
      // points to walk through start with all the neighbours
      const toCheck = [entry[0]]
      let next = toCheck.pop()
      while (next !== undefined) {
        // we have already visited this point, so it's part of an existing
        // perimeter
        if (visited.has(next.toString())) {
          next = toCheck.pop()
          continue
        }
        // add this point to the perimeter
        perimeter.push(next)
        // record that we have visited this so we don't double count (eg: for corners)
        visited.add(next.toString())
        const [row, col] = next
        const [, neighbours] = graph[val].find(([point]) => {
          return point[0] === row && point[1] === col
        }) ?? [undefined, []]
        // check all of its neighbours
        toCheck.push(...neighbours.reduce<Coordinate[]>((accum, neighbour, dir) => {
          if (neighbour !== null) {
            const pos = grid.step([row, col], directions[dir * 2])
            if (!visited.has(pos.toString())) {
              accum.push(pos)
            }
          }
          return accum
        }, []))
        next = toCheck.pop()
      }
      plots[val] ??= []
      if (perimeter.length > 0) {
        plots[val].push(perimeter)
      }
    }
  }
  return [grid, graph, plots]
}

export async function part1 (data: string[]): Promise<string> {
  const [, graph, plots] = prepData(data)
  const totalPrice = Object.entries(plots).reduce((price, [veg, sections]) => {
    return sections.reduce((plotPrice, plot) => {
      const area = plot.length
      const perimeter = plot.reduce((sum, point) => {
        // find this point in the graph
        // count how many neighbours are *not* the same veg
        const entry = graph[veg].find(([[row, col]]) => point[0] === row && point[1] === col)
        if (entry != null) {
          return sum + entry[1].filter((v) => v === null).length
        }
        return sum
      }, 0)
      // console.log(veg, {area, perimeter})
      return plotPrice + (area * perimeter)
    }, price)
  }, 0)
  return totalPrice.toString(10)
}

export async function part2 (data: string[]): Promise<string> {
  return ''
}
