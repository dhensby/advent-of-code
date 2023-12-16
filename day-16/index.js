/**
 * Parse the input data into a set of coordinates of the meaningful points
 *
 * @param {Array<string>} input
 * @returns {Array<[number, number, string]>}
 */
function parseInput (input) {
  return input.reduce((coords, line, row) => {
    for (let col = 0; col < line.length; col += 1) {
      if (line[col] !== '.') {
        coords.push([row, col, line[col]])
      }
    }
    return coords
  }, [])
}

/**
 * Find the next item along the path of a beam
 *
 * @param {Array<[number, number, string]>} coords
 * @param {[number, number, number]} beam
 * @returns {[number, number, string]}
 */
function findNextObject (coords, beam) {
  const [beamRow, beamCol, dir] = beam
  const NS = dir % 2 === 1
  const reverse = dir === 2 || dir === 3
  // this is basically a complex filter & find for the "closest" point to a beam in its direction of travel
  return coords.reduce((closest, [row, col, object]) => {
    // find the closest point ahead of us on the same axis
    // first, is this point on the same axis as us?
    if ((NS && col !== beamCol) || (!NS && row !== beamRow)) {
      return closest
    }
    // is the point ahead of us - @todo simplify
    if ((NS && reverse && row < beamRow) || (!NS && reverse && col < beamCol) || (NS && !reverse && row > beamRow) || (!NS && !reverse && col > beamCol)) {
      // no closer point, so we use this one
      if (!closest) {
        return [row, col, object]
      }
      // is this closer than the current closest point? if we are going vertically we want to find the one on the closest ROW. If we are going in reverse we want to find the largest row number
      // @todo simplify
      if ((NS && reverse && closest[0] < row) || (!NS && reverse && closest[1] < col) || (NS && !reverse && closest[0] > row) || (!NS && !reverse && closest[1] > col)) {
        return [row, col, object]
      }
    }
    return closest
  }, null)
}

/**
 * Take a beam and the object it will hit, and return the transformed (and sometimes split) beams
 *
 * @param {number} row
 * @param {number} col
 * @param {string} object
 * @param {number} dir
 * @returns {Array<[number, number, number]>}
 */
function transformBeam ([row, col, object], [, , dir]) {
  const beams = []
  const NS = dir % 2 === 1
  // clockwise is +1
  // anticlockwise is -1
  switch (object) {
    case '/':
      // rotate beam - odd numbers turn clockwise
      dir += (dir % 2 ? 1 : -1) + 4
      dir %= 4
      beams.push([row, col, dir])
      break
    case '\\':
      // rotate beam, odd numbers turn anti-clockwise
      dir += (dir % 2 ? -1 : 1) + 4
      dir %= 4
      beams.push([row, col, dir])
      // rotate beam
      break
    case '|':
      // odd number dirs travel through
      if (NS) {
        beams.push([row, col, dir])
      } else {
        // even numbers get split into two beams going perpendicular
        beams.push([row, col, (dir + 1) % 4], [row, col, (dir + 3) % 4])
      }
      break
    case '-':
      // even number dirs travel through
      if (!NS) {
        beams.push([row, col, dir])
      } else {
        // odd numbers get split into two beams going perpendicular
        beams.push([row, col, (dir + 1) % 4], [row, col, (dir + 3) % 4])
      }
      // deflect beam
      break
    default:
      // beam is unchanged
      beams.push([row, col, dir])
  }
  return beams
}

/**
 * Trace the path of a beam through the map. Returns a set of points that were visited and from what direction. This can
 * later be used to calculate visited points.
 *
 * @param {Array<[number, number, string]>} coords
 * @param {[number, number, number]} startBeam
 * @returns {Array<[number, number, number]>}
 */
function tracePaths (coords, startBeam) {
  // adjust the initial beam as needed
  const initialObject = coords.find(([row, col]) => row === startBeam[0] && col === startBeam[1]) ?? [startBeam[0], startBeam[1], '.']
  // keep track of all beams in play
  const beams = [...transformBeam(initialObject, startBeam)]
  const visited = []
  do {
    // take a beam off, and we'll push it back in if it encounters an object
    const [beamRow, beamCol, dir] = beams.pop()
    if (visited.find((v) => v[0] === beamRow && v[1] === beamCol && v[2] === dir)) {
      continue
    }
    // are we moving vertically or not
    visited.push([beamRow, beamCol, dir])
    // find the closest object on the same line
    const nextObject = findNextObject(coords, [beamRow, beamCol, dir])
    // we haven't hit an object, so we've gone off the edge, or we've visited this object in this direction (we don't need to recompute it)
    if (!nextObject) {
      continue
    }
    beams.push(...transformBeam(nextObject, [beamRow, beamCol, dir]))
  } while (beams.length)
  // this should give us enough info to figure out what coordinates have been visited
  return visited
}

module.exports = {
  part1: (input) => {
    const coords = parseInput(input)
    const maxRow = input.length
    const maxCol = input[0].length
    // we have an array of visited points and corresponding directions they were visited from
    const pathPoints = tracePaths(coords, [0, 0, 0])
    // we can use our path points to compute which points we have had to pass through
    const visitedPoints = pathPoints.reduce((map, [row, col, dir]) => {
      // we have to have visited the point we are looking at:
      map.set(`${row},${col}`, 1)
      const reverse = dir === 2 || dir === 3
      // where did we go to from this point and direction?
      const nextObject = findNextObject(coords, [row, col, dir]) ?? [reverse ? 0 : maxRow, reverse ? 0 : maxCol]
      // which coordinates do we pass through until we hit the next object
      if (dir === 0) { // heading east
        for (let i = 0; i < nextObject[1] - col; i += 1) {
          map.set(`${row},${col + i}`, [row, col + i])
        }
      } else if (dir === 1) { // heading south
        for (let i = 0; i < nextObject[0] - row; i += 1) {
          map.set(`${row + i},${col}`, [row + i, col])
        }
      } else if (dir === 2) { // heading west
        for (let i = 0; i <= col - nextObject[1]; i += 1) {
          map.set(`${row},${col - i}`, [row, col - i])
        }
      } else if (dir === 3) { // heading north
        for (let i = 0; i <= row - nextObject[0]; i += 1) {
          map.set(`${row - i},${col}`, [row, col - i])
        }
      }
      return map
    }, new Map())
    return visitedPoints.size
  },
  part2: (data) => {
  }
}
