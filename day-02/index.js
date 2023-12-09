function parseInput (input) {
  return input.map((dimensions) => dimensions.split('x').map((v) => parseInt(v, 10)))
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.reduce((sum, [w, l, h]) => {
      const areas = [l * w, w * h, h * l]
      return sum + areas.reduce((total, area) => total + area, 0) * 2 + Math.min(...areas)
    }, 0)
  },
  part2: (input) => {
    const data = parseInput(input)
    return data.reduce((sum, [w, l, h]) => {
      const volume = w * l * h
      const [s1, s2] = [w, l, h].sort((a, b) => a - b)
      return sum + volume + 2 * (s1 + s2)
    }, 0)
  }
}
