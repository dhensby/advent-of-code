// record the interesting signal strength
function recordInterestingSignalStrength(record, cycle, register) {
  // interesting signals are every 40 cycles with an offset of 20 (20, 60, etc)
  if ((cycle + 20) % 40 === 0) {
    record.push(register * cycle);
  }
}

// Render the CRD pixel for every cycle
function renderCrtPixel(record, cycle, register) {
  // Each row on the CRT is 40px wide, so we use modulus to work out where we are horizontally
  const pixel = cycle % 40;
  // the register is within 3 of our current pixel (so draw it)
  if (pixel === register - 1 || pixel === register || pixel === register + 1) {
    record.push('#');
  } else {
    // no sprite to render, so dot
    record.push('.');
  }
}

module.exports = (data) => {
  // arrays to store our state
  const signalStrength = [];
  const crtData = [];
  // cycle counter and register store
  let cycleCount = 0;
  let register = 1;
  // we need to render our initial CRT pixel
  renderCrtPixel(crtData, cycleCount, register);
  for (let i = 0; i < data.length; i += 1) {
    const [instruction, value] = data[i].split(' ');
    // every loop is at least one cycle, so we can always increment once
    cycleCount += 1;
    // render the pixel for this cycle
    renderCrtPixel(crtData, cycleCount, register);
    // potentially record interesting signal strength
    recordInterestingSignalStrength(signalStrength, cycleCount, register);
    // perform add op
    if (instruction === 'addx') {
      // addx is 2 cycles, so we increment the cycle count again
      cycleCount += 1;
      // record out interesting signal strengths
      recordInterestingSignalStrength(signalStrength, cycleCount, register);
      // modify the register
      register += parseInt(value, 10);
      // render the CRT *after* the register is updated
      renderCrtPixel(crtData, cycleCount, register);
    }
  }
  return {
    part1: signalStrength.reduce((prev, next) => prev + next, 0),
    part2: ['', ...crtData.reduce((chunks, next, i) => {
      const chunkIndex = Math.floor(i / 40);
      if (!chunks[chunkIndex]) {
        // eslint-disable-next-line no-param-reassign
        chunks[chunkIndex] = '';
      }
      // eslint-disable-next-line no-param-reassign
      chunks[chunkIndex] += next;
      return chunks;
    }, []), ''].join('\n'),
  };
};
