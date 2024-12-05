function prepData (raw: string[]): [Record<number, number[]>, number[][]] {
  let i = 0
  const parsed = raw.reduce<[number[][], number[][]]>((data, line) => {
    data[i] ??= []
    if (line === '') {
      i += 1
      return data
    }
    data[i].push(line.split(/[|,]/).map((n) => parseInt(n, 10)))
    return data
  }, [[], []])
  const graph: Record<number, number[]> = parsed[0].reduce((map, pair) => {
    if (map[pair[0]] === undefined) {
      map[pair[0]] = []
    }
    map[pair[0]].push(pair[1])
    return map
  }, Object.create(null))
  return [graph, parsed[1]]
}

export async function part1 (raw: string[]): Promise<string> {
  const [graph, pages] = prepData(raw)
  const res = pages.reduce((sum, page) => {
    const ordered = page.every((num, i, arr) => {
      // are all the remaining elements allowed to come next
      return arr.slice(i + 1).every((r) => graph[num]?.includes(r))
    })
    if (ordered) {
      return sum + page[Math.floor(page.length / 2)]
    }
    return sum
  }, 0)
  return res.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  const [graph, pages] = prepData(raw)
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
