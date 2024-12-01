function prepData (data: string[]): number[][] {
  const imported = data.map((line) => {
    return line.trim().split(/\s+/)
  })
  const [l, r]: [number[], number[]] = imported.reduce<[number[], number[]]>((list, [left, right]) => {
    list[0].push(parseInt(left, 10))
    list[1].push(parseInt(right, 10))
    return list
  }, [[], []])
  l.sort((a: any, b: any) => a - b)
  r.sort((a: any, b: any) => a - b)
  return [l, r]
}

export async function part1 (raw: string[]): Promise<string> {
  const [l, r] = prepData(raw)
  let sum = 0
  for (let i = 0; i < l.length; i += 1) {
    sum += Math.abs(l[i] - r[i])
  }
  return sum.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  const [l, r] = prepData(raw)
  const counts = r.reduce<Record<number, number>>((buckets, next) => {
    buckets[next] = (buckets[next] ?? 0) + 1
    return buckets
  }, {})

  return l.reduce((sum, next) => {
    return sum + next * (counts[next] ?? 0)
  }, 0).toString(10)
}
