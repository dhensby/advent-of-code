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

function quadraticFormula (a, b, c) {
  return [
    (-b + Math.sqrt(b ** 2 - (4 * a * c))) / (2 * a),
    (-b - Math.sqrt(b ** 2 - (4 * a * c))) / (2 * a)
  ]
}

/**
 * The maths here is derived from speed = distance / time
 * speed is equivalent to the "wait time" (W), distance is fixed (D),
 * and time is the record (R) - the wait time (W):
 *
 * D = W * (R - W)
 * D = RW - W^2
 * 0 = W^2 - RW + D
 *
 * That is our quadratic formula, which can be plugged into the quadratic equation
 * to find the two solutions to W.
 *
 * This catch is that we want to find the wait time that *beats* the record, and this will
 * give us beat or match. So if the answer is an integer (no rounding needed) then we are matching
 * the record and not beating it. So we have to make sure we account for that
 */
module.exports = {
  part1: (input) => {
    const data = parseInput(input)
    return data.reduce((product, [time, distance]) => {
      // solve the quadratic equation
      let [max, min] = quadraticFormula(1, -time, distance)
      // if the numbers are integers, then this will only *match* the record and not *beat* it
      // so we must adjust the min/max values as needed
      max = max % 1 === 0 ? max - 1 : Math.floor(max)
      min = min % 1 === 0 ? min + 1 : Math.ceil(min)
      // calculate the product of the number of ways to win - note we need to add 1
      // because if there was only one way to win (max === min) then we are out by 1
      return product * (1 + Math.floor(max) - Math.ceil(min))
    }, 1)
  },
  part2: (input) => {
    const data = parseInput(input)
    const [time, distance] = data.reduce(([t, d], [time, distance]) => {
      return [
        parseInt(`${t}${time}`, 10),
        parseInt(`${d}${distance}`, 10)
      ]
    }, [0, 0])
    let [max, min] = quadraticFormula(1, -time, distance)
    max = max % 1 === 0 ? max - 1 : Math.floor(max)
    min = min % 1 === 0 ? min + 1 : Math.ceil(min)
    return 1 + Math.floor(max) - Math.ceil(min)
  }
}
