module.exports = (data) => {
  let overlap = 0;
  let encompass = 0;
  for (let i = 0; i < data.length; i += 1) {
    const [first, second] = data[i].split(',')
      .map((pair) => pair.split('-').map((val) => parseInt(val, 10)))
      .sort((a, b) => (a[1] - a[0]) - (b[1] - b[0]));
    // first is the shortest so can only be encompassed by second
    if ((first[0] >= second[0] && first[0] <= second[1])
        || (first[1] >= second[0] && first[1] <= second[1])) {
      overlap += 1;
      if (first[0] >= second[0] && first[1] <= second[1]) {
        encompass += 1;
      }
    }
  }
  return {
    part1: encompass,
    part2: overlap,
  };
};
