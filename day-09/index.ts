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

interface FileSystemEntry {
  length: number
}

interface File extends FileSystemEntry {
  id: number
  deleted?: boolean
}

interface Space extends FileSystemEntry {
}

function isFile (val?: FileSystemEntry): val is File {
  return Object.hasOwn(val ?? {}, 'id')
}

export async function part2 (raw: string[]): Promise<string> {
  const filesystem = raw.join('').trim().split('').reduce<Array<File | Space>>((accum, next, i) => {
    if (i % 2 === 0) {
      // it's a file
      accum.push({ id: i / 2, length: parseInt(next, 10) })
    } else {
      accum.push({ length: parseInt(next, 10) })
    }
    return accum
  }, [])
  const movedFileIds = new Set<number>()
  for (let readPointer = filesystem.length; readPointer > 0; readPointer -= 1) {
    const file = filesystem[readPointer]
    if (!isFile(file) || movedFileIds.has(file.id)) {
      continue
    }
    for (let writePointer = 0; writePointer < readPointer; writePointer += 1) {
      const space = filesystem[writePointer]
      // find the first empty space that will fit this file
      if (isFile(space) || filesystem[writePointer].length < file.length) {
        continue
      }
      // reserve the disk space
      if (space.length === file.length) {
        filesystem[writePointer] = { ...file }
      } else {
        space.length -= file.length
        // place the file on the disk
        filesystem.splice(writePointer, 0, { ...file })
      }
      movedFileIds.add(file.id)
      // delete the old file
      delete (file as Partial<File>).id
      break
    }
  }
  return checkSum(filesystem.reduce<Array<'.' | number>>((diskmap, next) => {
    const val = isFile(next) && next.deleted !== false ? next.id : '.'
    diskmap.push(...new Array(next.length).fill(val))
    return diskmap
  }, [])).toString(10)
}
