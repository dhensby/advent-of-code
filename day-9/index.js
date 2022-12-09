// Conceptually we are moving points on a graph; the tail follows
// the head whenever there is a gap between the head and tail.
// As the manipulations can only be made in one direction at a time
// we can make some assumptions, eg: if the head is more than 1 space
// from the tail, the tail must move into the same "plane" (well, axis)
// then it must move to one place "behind" the head, depending on the
// direction on the axis we are moving, that's either the head value +1 or -1
module.exports = (data) => {
  // use a `Set` to create a visit register for each unique position visited (x,y)
  // initialise it with the starting position (0,0)
  const visitRegister = new Set().add('0,0');
  // the state records the x,y coords for the head and the tail
  const state = {
    head: [0, 0],
    tail: [0, 0],
  };
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
    // Firstly, we now know the head position
    state.head[axis] += num * relativeDir;
    // if the tail is more than 1 position away from the head, we need to move the tail
    // we only need to worry about the current axis being manipulated
    if (Math.abs(state.tail[axis] - state.head[axis]) > 1) {
      // store our initial tail state for later comparison - we will manipulate this to work
      // out how the tail moves around the grid
      const intermittentState = [...state.tail];
      // if the axis we *aren't* working on is different for the head and tail
      // we must make them the same (the tail moves diagonally into place)
      if (state.tail[(axis + 1) % 2] !== state.head[(axis + 1) % 2]) {
        // move the tail into the correct position
        state.tail[(axis + 1) % 2] = state.head[(axis + 1) % 2];
        // update our intermittent state to mate the actual state
        intermittentState[(axis + 1) % 2] = state.head[(axis + 1) % 2];
        // because we move "diagonally" when we move across we also need to
        // adjust the "initial" position
        intermittentState[axis] += relativeDir;
      }
      // The tail will lag behind the head by 1 position - now we have recoded the *final*
      // position of the tail and head
      state.tail[axis] = state.head[axis] - relativeDir;
      // To solve the first part of the puzzle, we actually need to work out the coordinates
      // the tail has "moved through". This goes from the initial position to the final position
      // recording each coordinate. I'm sure if I knew some graph theory I could solve
      // this with a better algorithm
      for (let j = intermittentState[axis]; j !== state.tail[axis]; j += 1 * relativeDir) {
        intermittentState[axis] = j;
        // record each coordinate in our register
        visitRegister.add(intermittentState.toString());
      }
    }
    // make sure the final tail position has been stored in the register
    visitRegister.add(state.tail.toString());
  }
  return {
    part1: visitRegister.size,
  };
};
