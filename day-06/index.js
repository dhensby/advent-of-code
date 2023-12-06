/**
 * @param {Array<string>} input
 */
function parseInput (input) {
  const [time, distance] = input.map((line) => {
    const [, vals] = line.split(':').map((v) => v.trim().split(/\s+/).map((val) => parseInt(val.trim(), 10)))
    return vals
  })
  return time.reduce((races, next, i) => {
    races.push([next, distance[i]])
    return races
  }, [])
}

// speed = distance / time
// this essentially tells us the minimum we will have to hold the button for
// or the "wait time" that we need to meet the required speed
function minWaitTime (distance, totalTime) {
  // the theoretical minimum wait time is to use all the time
  // but of course "speed" is equivalent to our waiting time, so
  let speed = Math.ceil(distance / totalTime)
  while ((totalTime - speed) * speed <= distance) {
    speed += 1
  }
  return speed
}

// we need to work out the maximum achievable speed whilst still completing the distance
// in time
function maxWaitTime (distance, time) {
  // could we do a binary search on this?
  let maxWaitTime = Math.min(distance, time - 1)
  while ((time - maxWaitTime) * maxWaitTime <= distance) {
    maxWaitTime -= 1
  }
  return maxWaitTime
}

module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.reduce((product, [time, distance]) => {
      const min = minWaitTime(distance, time)
      const max = maxWaitTime(distance, time)
      return product * (1 + max - min)
    }, 1)
  },
  part2: (input) => {
  }
}
