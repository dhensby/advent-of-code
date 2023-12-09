/**
 *
 * @param {Array<string>} input
 */
function parseInput (input) {
  return input.map((val) => {
    return val.trim().split(/\s+/).map((v) => parseInt(v.trim(), 10))
  })
}

function calculateNextValue (values) {
  // we will iterate through all the "historic values" and calculate a new entry
  // with the differences - this will repeat until the different are the same
  const differences = [[...values]]
  for (let i = 0; i < differences.length; i += 1) {
    const history = differences[i]
    const diffs = []
    // calculate the difference between the current number and the next one
    // and push that into a new list
    for (let j = 0; j < history.length - 1; j += 1) {
      diffs[j] = history[j + 1] - history[j]
    }
    // push the new list into our set of differences
    differences.push(diffs)
    // check if every element is the same (ie: all the differences are 0)
    // and break the loop if they are
    if (diffs.every((v) => v === diffs[0])) {
      break
    }
  }
  // go backwards through all the differences and sum the last value
  let increment = 0
  for (let i = differences.length - 1; i >= 0; i -= 1) {
    const set = differences[i]
    increment += set[set.length - 1]
  }
  return increment
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input).map((values) => {
      return calculateNextValue(values)
    })
    return data.reduce((sum, next) => {
      return sum + next
    }, 0)
  },
  part2: (input) => {
    const data = parseInput(input).map((values) => {
      return calculateNextValue(values.reverse())
    })
    return data.reduce((sum, next) => {
      return sum + next
    }, 0)
  }
}
