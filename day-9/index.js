let PRINT_QUEUE = Promise.resolve();

// writing to the stdout can be an async operation, so to ensure we get
// reliable output we have to use a promise chain to ensure writing to
// the stdout happens as expected
function print(message) {
  PRINT_QUEUE = PRINT_QUEUE.then(() => new Promise((resolve, reject) => {
    process.stdout.write(message, (err) => (err ? reject(err) : resolve()));
  }));
}

// A helper function for emulating the printing of the rope "graphic"
// as is done in the AoC examples - good for debugging!
// eslint-disable-next-line no-unused-vars
function printState(state, height = 5, width = 6, offsetX = 0, offsetY = 0) {
  const output = [];
  // loop from top to bottom
  for (let j = height - 1; j >= 0; j -= 1) {
    // loop from left to right
    for (let k = 0; k < width; k += 1) {
      // find the first (if any) part of the rope that appears in this coordinate
      const inCoord = state.find(([x, y]) => x === k - offsetX && y === j - offsetY);
      if (!inCoord) {
        // no part of the rope, so either print `s` for initial position otherwise `.`
        if (k - offsetX === 0 && j - offsetY === 0) {
          output.push('s');
        } else {
          output.push('.');
        }
      } else {
        // print the part of the rope (H for head, number for the rest)
        const index = state.indexOf(inCoord);
        output.push(index === 0 ? 'H' : index.toString());
      }
    }
    // end of row
    output.push('\n');
  }
  // end of diagram
  output.push('\n');
  print(output.join(''));
}

// a function for simulating rope motion as per challenge description
function simulateRope(length, data) {
  // create a list of states - each representing a "knot" in the rope
  // each knot is represented by a tuple: its x, y coords
  const state = Array.from(new Array(length).keys()).map(() => [0, 0]);
  const visitRegister = new Set().add('0,0');
  // loop over each instruction one by one
  for (let i = 0; i < data.length; i += 1) {
    // split the data element into its direction and number of places to move
    const [dir, num] = data[i].split(' ');
    // which axis coordinate to manipulate for the head
    // index 0 of the state arrays is X axis and 1 is Y axis in coordinates
    // 'L'/'R' indicate we are working on X axis and 'U'/'D' indicate Y axis
    const axis = dir === 'R' || dir === 'L' ? 0 : 1;
    // 'D' or 'L' directions move in the negative direction along their respective axis
    // we'll use this later to increment/decrement coordinate values
    const relativeDir = dir === 'D' || dir === 'L' ? -1 : 1;
    // incrementally go through each coordinate to reach the destination
    // going through all the following knots to move them incrementally (if needed)

    // print(`== ${dir} ${num} ==\n`);
    for (let j = 0; j < num; j += 1) {
      // the "off axis" is the one we aren't directly transforming along
      const offAxis = (axis + 1) % 2;
      state[0][axis] += relativeDir;
      for (let k = 1; k < state.length; k += 1) {
        const current = state[k];
        const prev = state[k - 1];
        const onAxisDiff = current[axis] - prev[axis];
        const offAxisDiff = current[offAxis] - prev[offAxis];
        // if the current knot is within 1 of the one in front of it
        // we can break out as no more moves need to happen
        if (Math.abs(onAxisDiff) <= 1 && Math.abs(offAxisDiff) <= 1) {
          break;
        }
        // we have to snap into the same row/column as the leading knot
        // if we move over 1 away from it
        if ((Math.abs(onAxisDiff) > 1 || Math.abs(offAxisDiff) > 1) && offAxisDiff) {
          const snapDir = offAxisDiff > 0 ? -1 : 1;
          current[offAxis] += snapDir;
        }
        // move the trailing knot one position along the axis as long as that won't move us
        // away from the part of the rope in front of us
        if (onAxisDiff && Math.abs((current[axis] + relativeDir) - prev[axis]) <= 1) {
          current[axis] += relativeDir;
        } else if (onAxisDiff && offAxisDiff) {
          // after any previous moves, we are still not inline with our leading knot
          // so we need to move towards it on the on axis. This takes into account
          // issues where the head could be moving left, but we need to move right
          // to keep up with the part in front of us
          const snapDir = onAxisDiff > 0 ? -1 : 1;
          current[axis] += snapDir;
        }
        if (k === state.length - 1) {
          visitRegister.add(current.toString());
        }
      }
      // printState(state);
    }
  }
  return visitRegister.size;
}

module.exports = (data) => ({
  part1: simulateRope(2, data),
  part2: simulateRope(10, data),
});
