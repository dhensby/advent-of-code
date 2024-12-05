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
  const [orderingRules, pages] = prepData(raw)
  // optimise by doing a "graph" of the sorting rules
  const graph: Record<number, number[]> = orderingRules.reduce((map, pair) => {
    if (map[pair[0]] === undefined) {
      map[pair[0]] = []
    }
    map[pair[0]].push(pair[1])
    return map
  }, Object.create(null))
  console.log(graph)
  return pages.reduce((accum, page, i) => {
    const ordered = page.every((num, i, arr) => {
      // are all the remaining elements allowed to come next
      return arr.slice(i + 1).every((r) => graph[num]?.includes(r))
    })
    if (!ordered) {
      // reorder them
      page.sort((a, b) => {
        if (a === b) return 0
        // if the graph includes the number, it must come after
        if (graph[b]?.includes(a)) {
          return 1
        }
        // not included in the graph means it comes before
        return -1
      })
      accum += page[Math.floor(page.length / 2)]
    }
    return accum
  }, 0).toString(10)
}
