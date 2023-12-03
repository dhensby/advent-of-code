/* eslint-disable no-console */
const {
  readdir,
  mkdir,
  writeFile,
  readFile
} = require('fs').promises
const { Command, InvalidArgumentError } = require('commander')

// helper for reading input data from files
async function readFileLines (path) {
  const data = await readFile(path)
  return data.toString().replace(/\s+$/, '').split(/\r?\n/)
}

function validateDay (val) {
  const day = val.startsWith('day-') ? val.match(/^day-([0-9]+)$/)[1] : val
  const intVal = parseInt(day, 10)
  if (Number.isNaN(intVal) || intVal.toString(10) !== day) {
    throw new InvalidArgumentError('day arg must be a number.')
  }
  if (intVal > 25) {
    throw new InvalidArgumentError('day cannot be above 25. Do you even advent?')
  }
  return intVal
}

/**
 *
 * @param {string} day
 * @param {boolean} test
 * @returns {Promise<string[][]>}
 */
async function findInputForDay (day, test) {
  if (test) {
    const files = await readdir(`./day-${day}`)
    const testFiles = files.filter((fileName) => fileName.startsWith('test-input'))
    return Promise.all(testFiles.sort().map((fileName) => readFileLines(`./day-${day}/${fileName}`)))
  }
  return Promise.all([readFileLines(`./day-${day}/input.txt`)])
}

const program = new Command()

program.name('aoc')
  .description('Advent of Code')
  .version('0.1.0')

// add a command for creating new days easily
program.addCommand(
  new Command()
    .name('create')
    .description('Create a new stub folder for an AoC day')
    .argument('[day]', 'The day of the challenge', validateDay)
    .action(async (day) => {
      const dirs = await readdir('.')
      const existingDays = dirs.filter((name) => name.match(/^day-[0-9]+$/))
        .map((name) => parseInt(name.match(/^day-([0-9]+)$/)[1], 10))
        .sort()
      const chosenDay = day ?? (Math.max(0, ...existingDays) + 1)
      if (existingDays.includes(chosenDay)) {
        throw new InvalidArgumentError(`Folder already exists for day-${chosenDay.toString().padStart(2, '0')}`)
      }
      console.log('Creating folder for challenge day', chosenDay)
      await mkdir(`./day-${chosenDay.toString().padStart(2, '0')}`)
      await Promise.all([
        ['index.js', 'module.exports = {\n  part1: (data) => {\n  },\n  part2: (data) => {\n  },\n};\n'],
        ['input.txt', ''],
        ['test-input-part1.txt', '']
      ].map(([fileName, data]) => writeFile(`./day-${chosenDay.toString().padStart(2, '0')}/${fileName}`, data)))
    })
)

program.addCommand(
  new Command()
    .name('run')
    .description('Run a days code')
    .option('-t, --test', 'Run with test input', false)
    .argument('[day]', 'The day of the challenge', validateDay)
    .action(async (day, opts) => {
      const dirs = await readdir('.')
      const existingDays = dirs.filter((name) => name.match(/^day-[0-9]+$/))
        .map((name) => parseInt(name.match(/^day-([0-9]+)$/)[1], 10))
        .sort((a, b) => a - b)
      const chosenDay = day ?? existingDays[existingDays.length - 1]
      if (!existingDays.includes(chosenDay)) {
        throw new InvalidArgumentError(`No program found for day-${chosenDay}`)
      }
      const data = await findInputForDay(chosenDay.toString().padStart(2, '0'), opts.test)
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const action = require(`./day-${chosenDay.toString().padStart(2, '0')}`)
      const results = {}
      if (action.part1) {
        results.part1 = await action.part1(data[0])
      }
      if (action.part2) {
        results.part2 = await action.part2(data[data.length - 1])
      }
      console.log(results)
    })
)

program
  .parseAsync()
  .catch(console.error)
