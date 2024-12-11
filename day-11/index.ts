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

export async function part2 (raw: string[]): Promise<string> {
  return ''
}
