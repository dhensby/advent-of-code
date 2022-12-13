module.exports = (data) => {
  // work out the totals for each group in the input
  const totals = data.reduce((sums, next) => {
    if (!next) {
      sums.push(0);
    } else {
      const val = parseInt(next, 10);
      const i = sums.length - 1;
      // eslint-disable-next-line no-param-reassign
      sums[i] += val;
    }
    return sums;
  }, []);
  // find the top 3 from the totals - this could be done lazily with a sort
  // then slice, but this is more fun :)
  const top3 = totals.reduce((maxima, next) => {
    // iterate through all the maxima and find the index at which
    // the next number is larger. If it's found, then insert the
    // value at that index and pop off the last item (keeping a fixed
    // length of array)
    for (let i = 0; i < maxima.length; i += 1) {
      // @todo - it would probably be less iterations if we went backwards
      // through the array checking that the value was not less than the
      // last item
      if (next > maxima[i]) {
        maxima.splice(i, 0, next);
        maxima.pop();
        break;
      }
    }
    return maxima;
  }, [0, 0, 0]);
  return {
    part1: top3[0],
    part2: top3.reduce((sum, next) => sum + next, 0),
  };
};
