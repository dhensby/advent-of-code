// Notes for part2
// most of the optimisations for part one need to be undone;
// instead each "step" needs to be applied one after the other to the next "knot" in the rope.
// eg, if the head moves up 5, it should move up 1 place, calculate the next knots position (recursively), breaking when
// no change is needed. Then move the next place, recalculate for the knots, and so on...

function printState(state, height = 5, width = 6) {
  for (let j = height - 1; j >= 0; j -= 1) {
    for (let k = 0; k < width; k +=1) {
      const inCoord = state.find(([x, y]) => x === k && y === j);
      if (!inCoord) {
        process.stdout.write('.');
      } else {
        const index = state.indexOf(inCoord);
        process.stdout.write(index === 0 ? 'H' : index.toString());
      }
    }
    process.stdout.write('\n');
  }
  process.stdout.write('\n');
}

module.exports = (data) => {
  // create a list of states - each representing a "knot" in the rope
  // each knot is represented by a tuple: its x, y coords
  const state = Array.from(new Array(10).keys()).map(() => [0, 0]);
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

    console.log(`== ${dir} ${num} ==`);
    for (let j = 0; j < num; j += 1) {
      state[0][axis] += relativeDir;
      for (let k = 1; k < state.length; k += 1) {
        // if the current knot is within 1 of the one in front of it
        // we can break out as no more moves need to happen
        if (Math.abs(state[k][axis] - state[k - 1][axis]) <= 1 && Math.abs(state[k][(axis + 1) % 2] - state[k - 1][(axis + 1) % 2]) <= 1) {
          break;
        }
        // we have to snap into the same row/column as the leading knot
        // if we move over 1 away from it
        if ((Math.abs(state[k][axis] - state[k - 1][axis]) > 1 || Math.abs(state[k][(axis + 1) % 2] - state[k - 1][(axis + 1) % 2]) > 1) && state[k][(axis + 1) % 2] !== state[k - 1][(axis + 1) % 2]) {
          const snapDir = state[k][(axis + 1) % 2] > state[k - 1][(axis + 1) % 2] ? -1 : + 1;
          state[k][(axis + 1) % 2] = state[k][(axis + 1) % 2] + snapDir;
        }
        // move the trailing knot one position along the access
        state[k][axis] = state[k][axis] + relativeDir;
        if (k === state.length - 1) {
          visitRegister.add(state[k].toString());
        }
      }
      printState(state);
    }
  }
  console.log(visitRegister, visitRegister.size);
};
