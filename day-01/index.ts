function prepData (data: string[]) {
  return data.map((line) => {
    return line.trim().split(/\s+/)
  })
}

export async function part1 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const [l, r]: [number[], number[]] = data.reduce<[number[], number[]]>((list, [left, right]) => {
    list[0].push(parseInt(left, 10))
    list[1].push(parseInt(right, 10))
    return list
  }, [[], []])
  l.sort((a: any, b: any) => a - b)
  r.sort((a: any, b: any) => a - b)
  let sum = 0
  for (let i = 0; i < l.length; i += 1) {
    sum += Math.abs(l[i] - r[i])
  }
  return sum.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  return ''
}
