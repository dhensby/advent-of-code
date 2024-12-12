function prepData (raw: string[]): number[] {
  return raw.join('').split(' ').map((v) => parseInt(v, 10))
}

function blink (pebbles: number[]): number[] {
  return pebbles.reduce<number[]>((accum, next) => {
    if (next === 0) {
      accum.push(1)
    } else {
      const val = next.toString(10)
      if (val.length % 2 === 0) {
        const mid = val.length / 2
        accum.push(parseInt(val.substring(0, mid), 10))
        accum.push(parseInt(val.substring(mid), 10))
      } else {
        accum.push(next * 2024)
      }
    }
    return accum
  }, [])
}

export async function part1 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  let res = data
  for (let i = 0; i < 25; i += 1) {
    res = blink(res)
  }
  return res.length.toString(10)
}

function combine (l1: Array<[number, number]>): Array<[number, number]> {
  return l1.reduce<Array<[number, number]>>((combined, [k, v], i) => {
    const exists = combined.find(([num]) => {
      return num === k
    })
    if (exists === undefined) {
      combined.push([k, v])
    } else {
      exists[1] += v
    }
    return combined
  }, [])
}

function blinkStone (number: number, count: number = 1): Array<[number, number]> {
  if (number === 0) { return [[1, count]] }
  const val = number.toString(10)
  if (val.length % 2 === 0) {
    const s1 = parseInt(val.substring(0, val.length / 2))
    const s2 = parseInt(val.substring(val.length / 2))
    // we could try to combine these two, but it's not really needed
    return [[s1, count], [s2, count]]
  } else {
    return [[number * 2024, count]]
  }
}

export async function part2 (raw: string[]): Promise<string> {
  const data = prepData(raw).map<[number, number]>((num) => [num, 1])
  let res: Array<[number, number]> = [...data]
  for (let i = 0; i < 75; i += 1) {
    const len = res.length
    for (let j = 0; j < len; j += 1) {
      const next = res.shift()
      if (next === undefined) throw new Error()
      res.push(...blinkStone(...next))
    }
    res = combine(res)
  }
  return res.reduce((sum, [, count]) => {
    return sum + count
  }, 0).toString(10)
}
