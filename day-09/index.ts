function prepData (data: string[]): Array<'.' | number> {
  return data.join('').trim().split('').reduce<Array<'.' | number>>((accum, next, i) => {
    const val = i % 2 === 0 ? i / 2 : '.'
    accum.push(...new Array(parseInt(next, 10)).fill(val))
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

function findClosesSize (spaces: number[][], size: number): number | undefined {
  let candidate: number[] = []
  for (let i = size; i < spaces.length; i += 1) {
    const length = spaces[i]?.length
    if (length !== undefined) {
      if (candidate.length === 0) {
        candidate = [i, spaces[i][length - 1]]
      } else if (candidate[1] > spaces[i][length - 1]) {
        candidate = [i, spaces[i][length - 1]]
      }
    }
  }
  return candidate[0]
}

export async function part2 (raw: string[]): Promise<string> {
  const diskmap = prepData(raw)
  // a lookup of spaces size => start location
  const spaces: number[][] = []
  let start = 0
  let inSpace = false
  for (let i = 0; i < diskmap.length; i += 1) {
    if (diskmap[i] === '.') {
      if (!inSpace) {
        start = i
      }
      inSpace = true
    } else {
      if (inSpace) {
        spaces[i - start] ??= []
        spaces[i - start].unshift(start)
      }
      inSpace = false
    }
  }
  // read from the end of the diskmap looking for complete files
  for (let readPointer = diskmap.length - 1; readPointer > 0; readPointer -= 1) {
    const data = diskmap[readPointer]
    // skip if current position is empty space
    if (data === '.') {
      continue
    }
    // we have found a file of at least length 1
    let fileLength = 1
    // look at the next piece and see if it is the same file
    // moving the read pointer along if it is the same
    while (diskmap[readPointer - 1] === data) {
      readPointer -= 1
      fileLength += 1
    }
    // find the closest space of appropriate size
    const spaceSize = findClosesSize(spaces, fileLength)
    const writePointer = spaceSize !== undefined ? spaces[spaceSize]?.pop() : undefined
    // if there is no appropriate space to write to *or* we would be writing behind the current file
    // skip this file (there is nowhere ahead of it to write to)
    if (spaceSize === undefined || writePointer === undefined) {
      continue
    }
    if (writePointer > readPointer) {
      // put the space back
      spaces[spaceSize].push(writePointer)
      continue
    }
    for (let i = 0; i < fileLength; i += 1) {
      diskmap[writePointer + i] = data
      diskmap[readPointer + fileLength - 1 - i] = '.'
    }
    if (fileLength < spaceSize) {
      spaces[spaceSize - fileLength] ??= []
      spaces[spaceSize - fileLength].push(writePointer + fileLength)
      spaces[spaceSize - fileLength].sort((a, b) => b - a)
    }
  }
  return checkSum(diskmap).toString(10)
}
