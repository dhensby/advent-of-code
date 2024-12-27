type Register = [number, number, number]

function prepData (data: string[]): [Register, Operations[]] {
  const registers: Register = [0, 0, 0]
  const program: Operations[] = []
  for (const line of data) {
    if (line === '') continue
    if (line.startsWith('Program: ')) {
      program.push(...line.split(': ')[1].split(',').map((v) => parseInt(v)))
    } else if (line.startsWith('Register ')) {
      const match = line.match(/Register ([A-Z]): ([0-9]+)/i)
      if (match != null) {
        switch (match[1]) {
          case 'A':
            registers[0] = parseInt(match[2], 10)
            break
          case 'B':
            registers[1] = parseInt(match[2], 10)
            break
          case 'C':
            registers[2] = parseInt(match[2], 10)
            break
          default:
            throw new Error(`Unknown register ${match[1]}`)
        }
      }
    }
  }
  return [registers, program]
}

enum Operations {
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv,
}

export async function part1 (data: string[]): Promise<string> {
  const [registers, program] = prepData(data)
  const stack: number[] = []
  for (let pointer = 0; pointer < program.length; pointer += 2) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]
    const combo = [4, 5, 6].includes(operand) ? registers[operand - 4] : operand
    switch (opcode) {
      case Operations.adv:
      case Operations.bdv:
      case Operations.cdv:
        stack.push(registers[0], combo)
        break
      case Operations.bxl:
        stack.push(registers[1], operand)
        break
      case Operations.bst:
      case Operations.out:
        stack.push(combo, 8)
        break
      case Operations.jnz:
        if (registers[0] !== 0) {
          pointer = operand - 2
        }
        continue
      case Operations.bxc:
        stack.push(registers[1], registers[2])
        break
    }
    // operate
    const rhs = stack.pop()
    const lhs = stack.pop()
    if (rhs === undefined || lhs === undefined) throw new Error('Not enough operands')
    switch (opcode) {
      case Operations.adv:
        registers[0] = Math.floor(lhs / Math.pow(2, rhs))
        break
      case Operations.bdv:
        registers[1] = Math.floor(lhs / Math.pow(2, rhs))
        break
      case Operations.cdv:
        registers[2] = Math.floor(lhs / Math.pow(2, rhs))
        break
      case Operations.bxl:
      case Operations.bxc:
        registers[1] = lhs ^ rhs
        break
      case Operations.bst:
        registers[1] = lhs % rhs
        break
      case Operations.out:
        stack.push(lhs % rhs)
        break
    }
  }
  return stack.join(',')
}

export async function part2 (data: string[]): Promise<string> {
  return ''
}
