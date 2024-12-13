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

type Neighbours = [string | null, string | null, string | null, string | null, string | null, string | null, string | null, string | null]

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
      graph[val] ??= []
      graph[val].push([[row, col], neighbours as Neighbours])
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
          if (dir % 2 === 0 && neighbour !== null) {
            const pos = grid.step([row, col], directions[dir])
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
          return sum + entry[1].filter((v, i) => i % 2 === 0 && v === null).length
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
  const [grid, graph, plots] = prepData(data)
  // price is now number of sides * area
  const totalPrice = Object.entries(plots).reduce((price, [veg, sections]) => {
    return sections.reduce((plotPrice, plot) => {
      const area = plot.length
      // the number of sides is going to involve
      // all the corner points - so find those
      const corners = plot.reduce<Array<[Coordinate, Neighbours]>>((cornerPoints, point) => {
        const entry = graph[veg].find(([[row, col]]) => row === point[0] && col === point[1])
        if (entry == null) throw new Error()
        const [, neighbours] = entry
        if (neighbours.every((n, i) => i % 2 !== 0 || n === null)) {
          cornerPoints.push(entry)
          return cornerPoints
        }
        if (neighbours.every((n, i) => n !== null)) {
          return cornerPoints
        }
        for (let i = 0; i < 8; i += 2) {
          // are we on a corner? Can we come from the opposite direction and have a turn left or right
          if (neighbours[(i + 4) % 8] !== null && ((neighbours[(i + 2) % 8] !== null && neighbours[(i + 3) % 8] === null) || (neighbours[(i + 6) % 8] !== null && neighbours[(i + 5) % 8] === null))) {
            cornerPoints.push(entry)
            break
          } else if (neighbours[i] === null && neighbours[(i + 4) % 8] !== null && (neighbours[(i + 2) % 8] === null || neighbours[(i + 6) % 8] === null)) {
            // dead end ahead
            cornerPoints.push(entry)
            break
          }
        }
        return cornerPoints
      }, []).sort((a, b) => {
        const diff = a[1].filter((n) => n !== null).length - b[1].filter((n) => n !== null).length
        if (diff === 0) {
          return grid.coord2point(a[0]) - grid.coord2point(b[0])
        }
        return diff
      })
      let edges = 0
      // paths is a LIFO queue - which allows us to process a single path, then move onto
      // potential other paths to process (which may have been covered or not by the first one)
      const paths: Array<[Coordinate, number]> = []
      // store a list of points that we have entered (and the direction we entered from)
      const visited = new Set<string>()
      const visitedCorners = new Set()
      do {
        // find a starting point. We need a corner point *and* a direction to "enter" in
        const corner = corners.find(([c, n]) => !visitedCorners.has(c.toString()) && n.some((n, i) => i % 2 === 0 && n !== null)) ?? corners[0]
        const lastIndex = corner[1].filter((v, i) => i % 2 === 0).lastIndexOf(veg) * 2
        const rotation = corner[1].filter((v, i) => i % 2 === 0 && v !== null).length === 1 ? 0 : 2
        const initialDir = ((lastIndex < 0 ? 0 : lastIndex) + rotation) % 8
        paths.push([corner[0], initialDir])
        do {
          const pos = paths.pop()
          if (pos === undefined || visited.has(pos.toString())) {
            continue
          }
          // we want to record all "exits" from a point
          visited.add(pos.toString())
          const [coord, dir] = pos
          const [, neighbours] = corners.find(([c]) => c[0] === coord[0] && c[1] === coord[1]) ?? [coord, [null, null, null, null, null, null, null, null].map((v, i) => i === dir ? veg : null)]
          let currentDir = dir
          // do we have a split? ie: is there an option to turn left *ahead*
          if (neighbours[(currentDir + 6) % 8] !== null && neighbours[(currentDir + 7) % 8] === null) {
            // we put this point on the front of the queue so that it is processed *last*
            paths.unshift([grid.step(coord, directions[(currentDir + 6) % 8]), (currentDir + 6) % 8])
          }
          // try to turn right
          if (neighbours[(currentDir + 2) % 8] !== null && neighbours[(currentDir + 3) % 8] === null) {
            edges += 1
            // turn right
            currentDir += 2
            currentDir %= 8
          } else if (neighbours[currentDir] === null) {
            edges += 1
            currentDir += 6
            currentDir %= 8
          }
          // now we have turned do we have a split before we travel? ie: is there an option to turn left *ahead*
          if (neighbours[(currentDir + 6) % 8] !== null && neighbours[(currentDir + 7) % 8] === null) {
            // we put this point on the front of the queue so that it is processed *last*
            paths.unshift([grid.step(coord, directions[(currentDir + 6) % 8]), (currentDir + 6) % 8])
          }
          // continue along the current path (if we can)
          const point = neighbours[currentDir] === null ? coord : grid.travelFrom(coord, directions[currentDir], corners.map(([c]) => c))
          const next = corners.find(([c]) => point[0] === c[0] && point[1] === c[1]) ?? corner
          paths.push([next[0], currentDir])
        } while (paths.length > 0)
        visited.forEach((v) => {
          visitedCorners.add(v.split(',', 2).toString())
        })
      } while (!corners.every(([c]) => visitedCorners.has(c.toString())))
      // console.log(veg, {area, edges})
      return plotPrice + (area * edges)
    }, price)
  }, 0)
  return totalPrice.toString(10)
}
