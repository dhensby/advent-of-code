/**
 * @param {Array<string>} input
 */
function parseInput (input) {
  return input.reduce((data, next) => {
    const [report, info] = next.split(' ')
    data.push([report, info.split(',').map((num) => parseInt(num, 10))])
    return data
  }, [])
}

/**
 *
 * @param {string} report
 * @param {Array<number>} info
 * @return {number}
 */
function calculateNumOptions (report, info) {
  if (!info.length) {
    if (report.indexOf('#') === -1) {
      return 1
    }
    return 0
  }
  if (!report.length) {
    return 0
  }
  const calcWorking = () => {
    return calculateNumOptions(report.substring(1), info)
  }
  const calcBroken = () => {
    const group = report.substring(0, info[0]).replaceAll('?', '#')
    if (group !== '#'.repeat(info[0])) {
      return 0
    }
    if (report.length === info[0]) {
      if (info.length === 1) {
        return 1
      }
      return 0
    }
    if (['?', '.'].includes(report[info[0]])) {
      return calculateNumOptions(report.substring(info[0] + 1), info.slice(1))
    }
    return 0
  }
  switch (report[0]) {
    case '.':
      return calcWorking()
    case '#':
      return calcBroken()
    case '?':
      return calcWorking() + calcBroken()
  }
}

module.exports = {
  part1: (input) => {
    return parseInput(input).reduce((sum, [report, info]) => {
      return sum + calculateNumOptions(report, info)
    }, 0)
  },
  part2: (data) => {
  }
}
