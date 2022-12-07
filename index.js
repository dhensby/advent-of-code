/* eslint-disable no-console */
const {
  readdir,
  mkdir,
  writeFile,
  readFile,
} = require('fs').promises;
const { Command, InvalidArgumentError } = require('commander');

// helper for reading input data from files
async function readFileLines(path) {
  const data = await readFile(path);
  return data.toString().replace(/\s+$/, '').split('\n');
}

function validateDay(val) {
  const day = val.startsWith('day-') ? val.match(/^day-([0-9]+)$/)[1] : val;
  const intVal = parseInt(day, 10);
  if (Number.isNaN(intVal) || intVal.toString(10) !== day) {
    throw new InvalidArgumentError('day arg must be a number.');
  }
  if (intVal > 25) {
    throw new InvalidArgumentError('day cannot be above 25. Do you even advent?');
  }
  return intVal;
}

const program = new Command();

program.name('aoc')
  .description('Advent of Code')
  .version('0.1.0');

// add a command for creating new days easily
program.addCommand(
  new Command()
    .name('create')
    .description('Create a new stub folder for an AoC day')
    .argument('[day]', 'The day of the challenge', validateDay)
    .action(async (day) => {
      const dirs = await readdir('.');
      const existingDays = dirs.filter((name) => name.match(/^day-[0-9]+$/))
        .map((name) => parseInt(name.match(/^day-([0-9]+)$/)[1], 10))
        .sort();
      const chosenDay = day ?? (Math.max(0, ...existingDays) + 1);
      if (existingDays.includes(chosenDay)) {
        throw new InvalidArgumentError(`Folder already exists for day-${chosenDay}`);
      }
      console.log('Creating folder for challenge day', chosenDay);
      await mkdir(`./day-${chosenDay}`);
      await Promise.all([
        ['index.js', 'module.exports = (data) => {\n}'],
        ['input.txt', ''],
        ['test-input.txt', ''],
      ].map(([fileName, data]) => writeFile(`./day-${chosenDay}/${fileName}`, data)));
    }),
);

program.addCommand(
  new Command()
    .name('run')
    .description('Run a days code')
    .option('-t, --test', 'Run with test input', false)
    .argument('day', 'The day of the challenge', validateDay)
    .action(async (day, opts) => {
      const dirs = await readdir('.');
      const existingDays = dirs.filter((name) => name.match(/^day-[0-9]+$/))
        .map((name) => parseInt(name.match(/^day-([0-9]+)$/)[1], 10))
        .sort();
      if (!existingDays.includes(day)) {
        throw new InvalidArgumentError(`No program found for day-${day}`);
      }
      const dataFile = `./day-${day}/${opts.test ? 'test-' : ''}input.txt`;
      const data = await readFileLines(dataFile);
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const action = require(`./day-${day}`);
      const result = await action(data);
      if (result) {
        console.log(result);
      }
    }),
);

program
  .parseAsync()
  .catch(console.error);
