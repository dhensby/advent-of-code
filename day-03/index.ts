export async function part1 (data: string[]): Promise<string> {
  const matches = Array.from(data.join('').trim().matchAll(/mul\((\d+),(\d+)\)/g))
  return matches.reduce((sum, [, a, b]) => {
    return sum + (parseInt(a, 10) * parseInt(b, 10))
  }, 0).toString(10)
}

export async function part2 (data: string[]): Promise<string> {
  const matches = Array.from(data.join('').trim().matchAll(/mul\((\d+),(\d+)\)|do(?:n't)?\(\)/g))
  let enabled = true
  return matches.reduce((sum, [command, a, b]) => {
    console.log(command)
    if (command === 'do()') {
      enabled = true
      return sum
    } else if (command === 'don\'t()') {
      enabled = false
      return sum
    }
    return sum + (enabled ? parseInt(a, 10) * parseInt(b, 10) : 0)
  }, 0).toString(10)
}
