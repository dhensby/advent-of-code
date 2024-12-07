function prepData (raw: string[]): Array<[number, number[]]> {
  return raw.map((line) => {
    const [answer, parts] = line.split(':')
    return [parseInt(answer.trim(), 10), parts.trim().split(' ').map((v) => parseInt(v.trim(), 10))]
  })
}

export async function part1 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  const result = data.reduce((sum, [answer, parts]) => {
    let potentialAnswers = [parts[0]]
    for (let i = 1; i < parts.length; i += 1) {
      const answers: number[] = []
      do {
        const candidate = potentialAnswers.pop()
        if (candidate === undefined) {
          return sum
        }
        answers.push(candidate + parts[i])
        answers.push(candidate * parts[i])
      } while (potentialAnswers.length > 0)
      potentialAnswers = answers
    }
    if (potentialAnswers.includes(answer)) {
      return sum + answer
    }
    return sum
  }, 0)
  return result.toString(10)
}

export async function part2 (raw: string[]): Promise<string> {
  const data = prepData(raw)
  console.time('part2')
  const result = data.reduce((sum, [answer, parts]) => {
    let potentialAnswers = [parts[0]]
    for (let i = 1; i < parts.length; i += 1) {
      const answers: number[] = []
      do {
        const candidate = potentialAnswers.pop()
        if (candidate === undefined) {
          return sum
        }
        if (candidate > answer) {
          continue
        }
        const add = candidate + parts[i];
        if (add <= answer) {
          answers.push(add)
        }
        const mul = candidate * parts[i]
        if (mul <= answer) {
          answers.push(mul)
        }
        const concat = parseInt(`${candidate.toString(10)}${parts[i].toString(10)}`, 10)
        if (concat <= answer) {
          answers.push(concat)
        }
      } while (potentialAnswers.length > 0)
      potentialAnswers = answers
    }
    if (potentialAnswers.includes(answer)) {
      return sum + answer
    }
    return sum
  }, 0)
  console.timeEnd('part2')
  return result.toString(10)
}
