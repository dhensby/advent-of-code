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

const GOOD: Array<[number, number]> = []

const LETTERS = ['M', 'A', 'S']

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

function checkDirection (data: string[][], direction: Direction, start: [number, number]): boolean {
  let pos = start
  const checked: Array<[number, number]> = [pos]
  for (const letter of LETTERS) {
    pos = navigateDirection(direction, pos)
    const [row, col] = pos
    if (letter === data[row]?.[col]) {
      checked.push(pos)
      continue
    }
    return false
  }
  GOOD.push(...checked)
  return true
}

export async function part1 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const Xs: Array<[number, number]> = []
  // find all starting coordinates
  for (let row = 0; row < data.length; row += 1) {
    for (let col = 0; col < data.length; col += 1) {
      if (data[row][col] === 'X') {
        Xs.push([row, col])
      }
    }
  }
  const answer = Xs.reduce((sum, next) => {
    for (let dir = 0; dir < 8; dir += 1) {
      sum += checkDirection(data, dir, next) ? 1 : 0
    }
    return sum
  }, 0).toString(10)
  // render the plot
  // for (let i = 0; i < data.length; i += 1) {
  //   let row = ''
  //   for (let j = 0; j < data[i].length; j += 1) {
  //     if (GOOD.find(([row, col]) => row === i && col === j) != null) {
  //       row += data[i][j]
  //     } else {
  //       row += '.'
  //     }
  //   }
  //   console.log(row)
  // }
  return answer
}

export async function part2 (raw: string[]): Promise<string> {
  return ''
}
