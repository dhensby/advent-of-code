// The tree is completely hidden if there's a taller tree in every direction
// therefore we can use the inverse of this function to determine if a tree
// is visible from at least 1 direction
function isHidden(north, south, east, west) {
  // if all values are true, it is definitely hidden
  return [north, south, east, west].every((v) => !!v);
}

// determine if every single point is out of bounds (ie: we can stop searching the grid)
function isCompletelyOutOfBounds([north, south, east, west], width, height) {
  if (north >= 0) {
    // north point in bounds
    return false;
  }
  if (south < height) {
    // south in bounds
    return false;
  }
  if (east < width) {
    // east in bounds
    return false;
  }
  if (west >= 0) {
    // west in bounds
    return false;
  }
  return true;
}

// Conceptually the idea here is to go through every single point in the
// grid and incrementally step out in a radial pattern from the starting
// point. ie: for each point, iterate until we've hit the outermost edge
// in all directions
module.exports = (data) => {
  // variables to store our answers
  let numVisible = 0;
  let peakScore = 0;
  // nested for loops allow us to iterate through the 2 dimensional dataset
  for (let i = 0; i < data.length; i += 1) { // every row
    const row = data[i];
    // boundary rows - we don't need to iterate, we know every single item on this row
    // is visible and thus also has a "scenic score" of 0
    if (i === 0 || i === data.length - 1) {
      numVisible += row.length;
      // eslint-disable-next-line no-continue
      continue;
    }
    for (let j = 0; j < row.length; j += 1) { // every column in the row
      // boundary column - as with boundary rows, we can skip ahead
      if (j === 0 || j === row.length - 1) {
        numVisible += 1;
        // eslint-disable-next-line no-continue
        continue;
      }
      // record the height of the tree we are comparing against
      const height = parseInt(row[j], 10);
      // move in steps of 1 radially out from the point to see if any tree is taller
      let count = 0;
      // set up an 4-tuple of [north, south, east, west] to record if it's hidden in
      // that direction
      const hidden = [false, false, false, false];
      // set up another 4-tuple to record the viewing distance in each direction
      // initialise it with values assuming it's visible from all sides,
      // this is the peak possible viewing distance along each direction
      const viewingDistance = [i, data.length - 1 - i, row.length - 1 - j, j];
      do {
        count += 1;
        // work out the heights of the tree in the given direction
        // if there is no tree there, height is `-1`, which is guaranteed
        // to be shorted than the height of our tree... ie: as we step
        // further out of the boundary we are always taller than the
        // missing tree
        const heightInDirection = [
          parseInt(data[i - count]?.[j] ?? '-1', 10),
          parseInt(data[i + count]?.[j] ?? '-1', 10),
          parseInt(row[j + count] ?? '-1', 10),
          parseInt(row[j - count] ?? '-1', 10),
        ];
        // this was a nice optimisation for part1, but not for part2
        // We have reached the boundary - so if the tree is definitely
        // visible when we get here, we can break knowing it's visible
        // if (
        //     ((i - count) < 0 && hidden[0] === false)
        //     || ((i + count) >= data.length && hidden[1] === false)
        //     || ((j + count) >= row.length && hidden[2] === false)
        //     || ((j - count) < 0 && hidden[3] === false)
        // ) {
        //     break;
        // }
        //
        // iterate over the tree heights in each direction comparing them
        // to our current tree's height. If we haven't already determined
        // that our tree is hidden in that direction, we set it as hidden
        // and record the distance of this tree
        for (let pos = 0; pos < heightInDirection.length; pos += 1) {
          if (!hidden[pos] && heightInDirection[pos] >= height) {
            hidden[pos] = true;
            viewingDistance[pos] = count;
          }
        }
      } while (
        !isHidden(...hidden)
          && !isCompletelyOutOfBounds([
            i - count, // north
            i + count, // south
            j + count, // east
            j - count, // west
          ], row.length, data.length)
      );
      // if the tree is not hidden, increment our visibility counter
      if (!isHidden(...hidden)) {
        numVisible += 1;
      }
      // calculate our "scenic score" for this tree by multiplying all the distances
      const score = viewingDistance.reduce((product, next) => product * next, 1);
      // if the current score is larger than our previous high score, record it
      if (score > peakScore) {
        peakScore = score;
      }
    }
  }
  return {
    part1: numVisible,
    part2: peakScore,
  };
};
