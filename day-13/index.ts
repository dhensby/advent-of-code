import { Coordinate, Step } from '../utils'

interface Config {
  A: Step
  B: Step
  prize: Coordinate
}

// use "cramer's rule" to solve the equation we'll have of nX + mY = Z where X, Y, Z are known
function solve (config: Config, offset = 0): [number, number] {
  const denominator = (config.A[1] * config.B[0] - config.A[0] * config.B[1])
  const aMoves = ((config.prize[1] + offset) * config.B[0] - (config.prize[0] + offset) * config.B[1]) / denominator
  const bMoves = (config.A[1] * (config.prize[0] + offset) - config.A[0] * (config.prize[1] + offset)) / denominator
  return [aMoves, bMoves]
}

function prepData (lines: string[]): Config[] {
  let partial: Partial<Config> = {}
  lines.push('')
  return lines.reduce<Config[]>((configs, line) => {
    if (line === '') {
      configs.push(partial as Config)
      partial = {}
    } else if (line.startsWith('Button ')) {
      const match = line.match(/Button ([A-Z]): X([+-][0-9]+), Y([+-][0-9]+)/)
      if (match != null) {
        partial[match[1]] = [parseInt(match[3], 10), parseInt(match[2], 10)]
      }
    } else if (line.startsWith('Prize:')) {
      const match = line.match(/X=([0-9]+), Y=([0-9]+)/)
      if (match != null) {
        partial.prize = [parseInt(match[2], 10), parseInt(match[1], 10)]
      }
    }
    return configs
  }, [])
}

export async function part1 (raw: string[]): Promise<number> {
  const configs = prepData([...raw])
  const cost = configs.reduce((spent, config) => {
    const [aCount, bCount] = solve(config)
    if (aCount * 10 % 10 === 0 && bCount * 10 % 10 === 0) {
      return spent + (aCount * 3) + bCount
    }
    return spent
  }, 0)
  return cost
}

export async function part2 (raw: string[]): Promise<number> {
  const configs = prepData([...raw])
  const cost = configs.reduce((spent, config) => {
    const [aCount, bCount] = solve(config, 10000000000000)
    if (aCount * 10 % 10 === 0 && bCount * 10 % 10 === 0) {
      return spent + (aCount * 3) + bCount
    }
    return spent
  }, 0)
  return cost
}
