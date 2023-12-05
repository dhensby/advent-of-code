/**
 * @param {Array<string>} input
 */
function parseInput (input) {
  let section = ''
  let isMap = false
  let parsing = false
  return input.reduce((parsed, next) => {
    const line = next.trim()
    if (!line) {
      section = ''
      isMap = false
      parsing = false
      return parsed
    }
    if (!parsing && line.indexOf(':') !== -1) {
      const [namePart, rest] = line.split(':')
      const [name, map] = namePart.split(/\s+/)
      section = name.trim()
      isMap = map === 'map'
      parsing = isMap
      if (isMap) {
        return parsed
      }
      // seeds line, basically
      const nums = rest.trim().split(/\s+/).map((num) => parseInt(num, 10))
      return {
        ...parsed,
        [section]: nums
      }
    }
    const [destination, source, offset] = line.split(/\s+/).map((num) => parseInt(num, 10))
    if (!parsed[section]) {
      parsed[section] = {
        offsets: [],
        offsetOf (position) {
          const offset = this.offsets.find(({ source, offset }) => {
            return position >= source && position <= source + offset
          })
          if (offset) {
            return offset.destination - offset.source + position
          }
          return position
        }
      }
    }
    parsed[section].offsets.push({
      source,
      destination,
      offset
    })
    return parsed
  }, {})
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.seeds.reduce((lowest, next) => {
      const location = [
        'seed-to-soil',
        'soil-to-fertilizer',
        'fertilizer-to-water',
        'water-to-light',
        'light-to-temperature',
        'temperature-to-humidity',
        'humidity-to-location'
      ].reduce((pos, section) => {
        return data[section].offsetOf(pos)
      }, next)
      return Math.min(lowest, location)
    }, Infinity)
  },
  part2: (data) => {
  }
}
