export async function part1 (data: string[]): Promise<string> {
  const matches = Array.from(data.join('').trim().matchAll(/mul\((\d+),(\d+)\)/g))
  return matches.reduce((sum, [, a, b]) => {
    return sum + (parseInt(a, 10) * parseInt(b, 10))
  }, 0).toString(10)
}

export async function part2 (data: string[]): Promise<string> {
  return ''
}
