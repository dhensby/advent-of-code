module.exports = {
  part1: ([data]) => {
    const position = [0, 0]
    const visited = {
      '0,0': 1
    }
    for (let i = 0; i < data.length; i += 1) {
      switch (data[i]) {
        case '^':
          position[1]++
          break
        case '>':
          position[0]++
          break
        case '<':
          position[0]--
          break
        case 'v':
          position[1]--
          break
      }
      if (!visited[position.join(',')]) {
        visited[position.join(',')] = 1
      }
    }
    return Object.keys(visited).length
  },
  part2: ([data]) => {
    const santaPosition = [0, 0]
    const roboPosition = [0, 0]
    const visited = {
      '0,0': 1
    }
    for (let i = 0; i < data.length; i += 2) {
      const santa = data[i]
      const robo = data[i + 1]
      switch (santa) {
        case '^':
          santaPosition[1]++
          break
        case '>':
          santaPosition[0]++
          break
        case '<':
          santaPosition[0]--
          break
        case 'v':
          santaPosition[1]--
          break
      }
      if (!visited[santaPosition.join(',')]) {
        visited[santaPosition.join(',')] = 1
      }
      switch (robo) {
        case '^':
          roboPosition[1]++
          break
        case '>':
          roboPosition[0]++
          break
        case '<':
          roboPosition[0]--
          break
        case 'v':
          roboPosition[1]--
          break
      }
      if (!visited[roboPosition.join(',')]) {
        visited[roboPosition.join(',')] = 1
      }
    }
    return Object.keys(visited).length
  }
}
