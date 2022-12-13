// Logic for moving "crates" from one stack to another
// the logic can operate in "incremental" mode (move one crate
// at a time) or not (move all crates at once)
function moveCrates(stacks, moves, incremental = true) {
  // iterate over all the moves - this could be done with a series of pop/push ops
  // but that's a bit inefficient...
  moves.forEach(([num, from, to]) => {
    // stack is zero indexed, so we find the target stack by using from - 1
    // then splice off the number of crates we need from the end. This removes
    // the "crates" from the end of the stack and gives us an array of them,
    const cratesToMove = stacks[from - 1].splice(-num, num);
    // if we are moving in incremental mode we can just reverse the crates we are moving
    // before pushing them onto the target stack. This "simulates" moving them one by on
    if (incremental) {
      cratesToMove.reverse();
    }
    // like with finding the "from" stack, we use to - 1 to find the destination stack
    // for our crates as it's a 0 index
    stacks[to - 1].push(...cratesToMove);
  });
  return stacks;
}

module.exports = (data) => {
  const moves = [];
  const stacks = [];
  let isParsingStack = true;
  // iterate over all data, either parsing the stack diagram
  // or parsing the moves into a 3-tuple
  for (let i = 0; i < data.length; i += 1) {
    const line = data[i];
    if (isParsingStack) {
      // a blank line indicates we are no longer parsing the stack diagram, so we can
      // set our parser state to indicate we're no longer parsing the stack diagram
      if (!line) {
        isParsingStack = false;
        // go to the next iteration of the loop
        // eslint-disable-next-line no-continue
        continue;
      }
      // we are parsing from top to bottom of the diagram, which means
      // stacks that have nothing in them are represented by 3 spaces
      // we can't just split on a ' ' otherwise we need to start looking
      // ahead in our loops to determine if we are in an empty column.
      // Instead, split at every 3 chars plus optional trailing space to
      // parse out each stack as an item in a list
      line.match(/(.){1,3} ?/g).forEach((r, j) => {
        // remove any whitespace
        const val = r.trim();
        // if the value is an integer, then we are in the "label" row of
        // the diagram, so we don't need to process it - we're making
        // assumptions bout the labels (probably shouldn't do that)
        if (!Number.isNaN(parseInt(val, 10))) {
          return;
        }
        // if there's no value, there's no crate, but if there is, then we push
        // the crate into it's stack
        if (val) {
          if (!stacks[j]) {
            stacks[j] = [];
          }
          stacks[j].unshift(val);
        }
      });
    } else {
      // we are now parsing the instructions - use a basic regex to extract
      // the values from the sentence
      const [, num, from, to] = line.match(/^move ([0-9]+) from ([0-9]+) to ([0-9]+)$/);
      // store a 3-tuple of values in our moves list
      moves.push([num, from, to]);
    }
  }
  // get our answers! Arrays are objects that are passed by reference, so we need to deep-clone
  // the stacks before processing them otherwise we will have the second operation act on the
  // outcome of the first. The laziest way to perform this clone is to encode the stack as JSON
  // and then parse it out again.
  const rearranged = moveCrates(JSON.parse(JSON.stringify(stacks)), moves, true);
  const rearranged2 = moveCrates(JSON.parse(JSON.stringify(stacks)), moves, false);
  // log answers to screen - here we loop over each stack pulling out the last item from the
  // stack (ie: the top item) and then use regex to extract the letter from the `[ ]` illustration.
  // There are some assumptions that there will always be an item in every stack, but that could
  // easily be worked out if needed.
  return {
    part1: rearranged.map((stack) => stack[stack.length - 1].match(/\[([A-Z])\]/)[1]).join(''),
    part2: rearranged2.map((stack) => stack[stack.length - 1].match(/\[([A-Z])\]/)[1]).join(''),
  };
};
