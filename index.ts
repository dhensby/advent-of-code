/* eslint-disable no-console */
import {
  readdir,
  mkdir,
  writeFile,
  readFile
} from 'node:fs/promises'
import { Command, InvalidArgumentError } from 'commander'

// helper for reading input data from files
async function readFileLines (path: string): Promise<string[]> {
  const data = await readFile(path)
  return data.toString().replace(/\s+$/, '').split(/\r?\n/)
}

function validateDay (val: string): number {
  const [, day] = val.match(/^day-([0-9]+)$/) ?? [undefined, val]
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
async function findInputForDay (day: string): Promise<string[][]> {
  return await Promise.all([readFileLines(`./day-${day}/input.txt`)])
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
        .map((name) => parseInt((name.match(/^day-([0-9]+)$/) ?? [])[1], 10))
        .sort((a, b) => a - b)
      const chosenDay: number = day ?? (Math.max(0, ...existingDays) + 1)
      if (existingDays.includes(chosenDay)) {
        throw new InvalidArgumentError(`Folder already exists for day-${chosenDay.toString().padStart(2, '0')}`)
      }
      console.log('Creating folder for challenge day', chosenDay)
      await mkdir(`./day-${chosenDay.toString().padStart(2, '0')}`)
      await Promise.all([
        ['index.ts', 'export async function part1 (data: string[]): Promise<string> {\n}\n\nexport async function part2 (data: string[]): Promise<string> {\n}\n'],
        ['input.txt', '']
      ].map(async ([fileName, data]) => await writeFile(`./day-${chosenDay.toString().padStart(2, '0')}/${fileName}`, data)))
    })
)

program.addCommand(
  new Command()
    .name('run')
    .description('Run a days code')
    .argument('[day]', 'The day of the challenge', validateDay)
    .action(async (day, opts) => {
      const dirs = await readdir('.')
      const existingDays = dirs.filter((name) => name.match(/^day-[0-9]+$/))
        .map((name) => parseInt((name.match(/^day-([0-9]+)$/) ?? [])[1], 10))
        .sort((a, b) => a - b)
      const chosenDay: number = day ?? existingDays[existingDays.length - 1]
      if (!existingDays.includes(chosenDay)) {
        throw new InvalidArgumentError(`No program found for day-${chosenDay}`)
      }
      const data = await findInputForDay(chosenDay.toString().padStart(2, '0'))
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const action = require(`./day-${chosenDay.toString().padStart(2, '0')}`) as { part1?: ((data: string[]) => Promise<string>), part2?: ((data: string[]) => Promise<string>) }
      if (action.part1 != null) {
        console.time('part1')
        const res = await action.part1(data[0])
        console.timeLog('part1', res)
      }
      if (action.part2 != null) {
        console.time('part2')
        const res = await action.part2(data[data.length - 1])
        console.timeLog('part2', res)
      }
    })
)

program
  .parseAsync()
  .catch(console.error)
