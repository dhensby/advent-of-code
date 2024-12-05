function prepData (raw: string[]): string[][] {
  return raw.map((d) => d.split(''))
}

enum Direction {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW,
}

function navigateDirection (direction: Direction, pos: [number, number]): [number, number] {
  let [row, col] = pos
  switch (direction) {
    case Direction.N:
    case Direction.NE:
    case Direction.NW:
      row -= 1
      break
    case Direction.S:
    case Direction.SE:
    case Direction.SW:
      row += 1
      break
  }
  switch (direction) {
    case Direction.E:
    case Direction.NE:
    case Direction.SE:
      col += 1
      break
    case Direction.W:
    case Direction.SW:
    case Direction.NW:
      col -= 1
      break
  }
  return [row, col]
}

function checkDirection (data: string[][], sequence: string[], direction: Direction, start: [number, number]): false | Array<[number, number]> {
  let pos = start
  const checked: Array<[number, number]> = []
  for (const letter of sequence) {
    const [row, col] = pos
    if (letter === data[row]?.[col]) {
      checked.push(pos)
      pos = navigateDirection(direction, pos)
      continue
    }
    return false
  }
  return checked
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function render (data: string[][], points: Array<[number, number]>): void {
  for (let i = 0; i < data.length; i += 1) {
    let row = ''
    for (let j = 0; j < data[i].length; j += 1) {
      if (points.find(([row, col]) => row === i && col === j) != null) {
        row += data[i][j]
      } else {
        row += '.'
      }
    }
    console.log(row)
  }
}

export async function part1 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const startingPoints: Array<[number, number]> = []
  const sequence = ['X', 'M', 'A', 'S']
  // find all starting coordinates
  for (let row = 0; row < data.length; row += 1) {
    for (let col = 0; col < data[row].length; col += 1) {
      if (data[row][col] === sequence[0]) {
        startingPoints.push([row, col])
      }
    }
  }
  return startingPoints.reduce((sum, next) => {
    for (let dir = 0; dir < 8; dir += 1) {
      sum += checkDirection(data, sequence, dir, next) !== false ? 1 : 0
    }
    return sum
  }, 0).toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const startingPoints: Array<[number, number]> = []
  const sequence = ['M', 'A', 'S']
  // find all starting coordinates
  for (let row = 0; row < data.length; row += 1) {
    for (let col = 0; col < data[row].length; col += 1) {
      if (data[row][col] === sequence[0]) {
        startingPoints.push([row, col])
      }
    }
  }
  const candidates: Array<Array<[number, number]>> = startingPoints.reduce<Array<Array<[number, number]>>>((diagonals, next) => {
    // only check our "odd" directions (diagonals)
    for (let dir = 1; dir < 8; dir += 2) {
      const res = checkDirection(data, sequence, dir, next)
      if (res !== false) {
        diagonals.push(res)
      }
    }
    return diagonals
  }, [])
  const centrePoints = candidates.map(([, p]) => p)
  // render(data, centrePoints)
  // the answer is how many duplicate points there are
  return (centrePoints.length - new Set(centrePoints.map((s) => s.toString())).size).toString(10)
}
