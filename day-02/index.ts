function prepData (data: string[]): number[][] {
  return data.map((line) => line.trim().split(/\s+/).map((v) => parseInt(v, 10)))
}

function isSafe (report: number[]): boolean {
  for (let i = 1; i < report.length; i += 1) {
    const prev = report[i - 1]
    const cur = report[i]
    const next: number = report[i + 1] ?? null
    const prevDiff = prev - cur
    const nextDiff = cur - next
    // must differ by between 1 & 3
    if (Math.abs(prevDiff) < 1 || Math.abs(prevDiff) > 3) {
      return false
    }
    // if the previous change was negative, the next must be too and vice versa.
    if (next === null && ((prevDiff > 0 && nextDiff < 0) || (prevDiff < 0 && nextDiff > 0))) {
      return false
    }
  }
  return true
}

export async function part1 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const safeCount = data.reduce((count, report) => {
    return isSafe(report) ? count + 1 : count
  }, 0)
  return safeCount.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const safeCount = data.reduce((count, report) => {
    if (isSafe(report)) {
      return count + 1
    }
    for (let i = 0; i < report.length; i += 1) {
      // iterate through removing one of the items to see if removing one makes it safe
      const partial = [...report]
      partial.splice(i, 1)
      if (isSafe(partial)) {
        return count + 1
      }
    }
    return count
  }, 0)
  return safeCount.toString(10)
}
