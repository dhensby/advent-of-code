const cache = new Map()

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
  const key = `${report}-${info.join(',')}`
  if (cache.has(key)) {
    return cache.get(key)
  }
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
  let res = 0
  switch (report[0]) {
    case '.':
      res = calcWorking()
      break
    case '#':
      res = calcBroken()
      break
    case '?':
      res = calcWorking() + calcBroken()
      break
  }
  cache.set(key, res)
  return res
}

module.exports = {
  part1: (input) => {
    const res = parseInput(input).reduce((sum, [report, info]) => {
      return sum + calculateNumOptions(report, info)
    }, 0)
    return res
  },
  part2: (input) => {
    return parseInput(input).map(([report, info]) => {
      let expandedReport = ''
      const expandedInfo = []
      for (let i = 0; i < 5; i += 1) {
        expandedReport += report + '?'
        expandedInfo.push(...info)
      }
      return [expandedReport.substring(0, expandedReport.length - 1), expandedInfo]
    }).reduce((sum, [report, info]) => {
      return sum + calculateNumOptions(report, info)
    }, 0)
  }
}
