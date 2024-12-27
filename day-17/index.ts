type Register = [bigint, bigint, bigint]

enum Operation {
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv,
}

function prepData (data: string[]): [Register, Operation[]] {
  const registers: Register = [0n, 0n, 0n]
  const program: Operation[] = []
  for (const line of data) {
    if (line === '') continue
    if (line.startsWith('Program: ')) {
      program.push(...line.split(': ')[1].split(',').map((v) => parseInt(v, 10)))
    } else if (line.startsWith('Register ')) {
      const match = line.match(/Register ([A-Z]): ([0-9]+)/i)
      if (match != null) {
        switch (match[1]) {
          case 'A':
            registers[0] = BigInt(parseInt(match[2], 10))
            break
          case 'B':
            registers[1] = BigInt(parseInt(match[2], 10))
            break
          case 'C':
            registers[2] = BigInt(parseInt(match[2], 10))
            break
          default:
            throw new Error(`Unknown register ${match[1]}`)
        }
      }
    }
  }
  return [registers, program]
}

function runProgram (program: Operation[], registers: [bigint, bigint, bigint]): number[] {
  const stack: bigint[] = []
  for (let pointer = 0; pointer < program.length; pointer += 2) {
    const opcode = program[pointer]
    const operand = program[pointer + 1]
    // load the operands
    const combo = [4, 5, 6].includes(operand) ? registers[operand - 4] : operand
    switch (opcode) {
      case Operation.adv:
      case Operation.bdv:
      case Operation.cdv:
        stack.push(registers[0], BigInt(combo))
        break
      case Operation.bxl:
        stack.push(registers[1], BigInt(operand))
        break
      case Operation.bst:
      case Operation.out:
        stack.push(BigInt(combo), 8n)
        break
      case Operation.jnz:
        if (registers[0] !== 0n) {
          pointer = operand - 2
        }
        continue
      case Operation.bxc:
        stack.push(registers[1], registers[2])
        break
    }
    // operate
    const rhs = stack.pop()
    const lhs = stack.pop()
    if (rhs === undefined || lhs === undefined) throw new Error('Not enough operands')
    switch (opcode) {
      case Operation.adv:
      case Operation.bdv:
      case Operation.cdv:
        stack.push(lhs >> rhs)
        break
      case Operation.bxl:
      case Operation.bxc:
        stack.push(lhs ^ rhs)
        break
      case Operation.bst:
      case Operation.out:
        stack.push(lhs % rhs)
        break
    }
    // store
    if (opcode === Operation.adv) {
      registers[0] = stack.pop() as bigint
    } else if (opcode === Operation.bxl || opcode === Operation.bst || opcode === Operation.bxc || opcode === Operation.bdv) {
      registers[1] = stack.pop() as bigint
    } else if (opcode === Operation.cdv) {
      registers[2] = stack.pop() as bigint
    }
  }
  return stack.map((v) => Number(v))
}

export async function part1 (data: string[]): Promise<string> {
  const [registers, program] = prepData(data)
  const stack = runProgram(program, registers)
  return stack.join(',')
}

export async function part2 (data: string[]): Promise<string> {
  const [, program] = prepData(data)
  const find = (val: bigint, index: number | null): bigint | null => {
    if (index === null || index < 0) return val
    for (let i = val << 3n; i < (val << 3n) + 8n; i += 1n) {
      const stack = runProgram(program, [i, 0n, 0n])
      if (stack.every((v, i) => program[i + index] === v)) {
        const final = find(i, index - 1)
        if (final !== null) {
          return final
        }
      }
    }
    return null
  }
  return find(0n, program.length - 1)?.toString(10) ?? ''
}
