function prepData (raw: string[]): [number[][], number[][]] {
  let i = 0
  return raw.reduce<[number[][], number[][]]>((data, line) => {
    if (data[i] === undefined) {
      data[i] = []
    }
    if (line === '') {
      i += 1
      return data
    }
    data[i].push(line.split(/[|,]/).map((n) => parseInt(n, 10)))
    return data
  }, [[], []])
}

export async function part1 (raw: string[]): Promise<string> {
  const [orderingRules, pages] = prepData(raw)
  const res = pages.reduce((sum, page, i) => {
    const remaining = [...page]
    let next
    while ((next = remaining.shift()) !== undefined) {
      const rules = orderingRules.filter(([cur, others]) => {
        return cur === next && remaining.includes(others)
      })
      if (rules.length !== remaining.length) {
        return sum
      }
    }
    return sum + page[Math.floor(page.length / 2)]
  }, 0)
  return res.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  return ''
}
