function prepData (data: string[]): Array<'.' | number> {
  return data.join('').trim().split('').reduce<Array<'.' | number>>((accum, next, i) => {
    const length = parseInt(next, 10)
    const val = i % 2 === 0 ? i / 2 : '.'
    for (let j = 0; j < length; j += 1) {
      accum.push(val)
    }
    return accum
  }, [])
}

function checkSum (diskmap: Array<'.' | number>): number {
  return diskmap.reduce<number>((sum, next, pos) => {
    if (next === '.') return sum
    return sum + (next * pos)
  }, 0)
}

export async function part1 (raw: string[]): Promise<string> {
  const diskmap = prepData(raw)
  let readPointer = diskmap.length
  for (let writePointer = 0; writePointer < readPointer; writePointer += 1) {
    if (diskmap[writePointer] !== '.') {
      continue
    }
    // find next readable char
    do {
      readPointer -= 1
    } while (diskmap[readPointer] === '.' && readPointer > writePointer)
    if (writePointer < readPointer) {
      diskmap[writePointer] = diskmap[readPointer]
      diskmap[readPointer] = '.'
    }
  }
  return checkSum(diskmap).toString(10)
}

export async function part2 (data: string[]): Promise<string> {
  return ''
}
