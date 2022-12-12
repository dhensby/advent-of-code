// The solution algorithm (including parsing)
function passTheParcel(data, rounds, reduction) {
  // a list of all the monkeys we will parse from the input
  const monkeys = [];
  // the current monkey we are parsing, including an initialised `inspected` counter
  let current = { inspected: 0 };
  // a flag to indicate if we are parsing a monkey definition
  let parsing = false;
  // LCM - this was added to help with part 2 - I had to look this up :(
  // more info below
  let lcm = 1;
  // this is the parsing part - it's very crude but the input is very clearly defined, so we
  // can have a rather rudimentary parser
  for (let i = 0; i <= data.length; i += 1) {
    const line = data[i];
    // black lines between definitions - use this to switch our parsing flag and to push the
    // last parsed monkey object into the monkey list, also instantiate a new monkey
    if (!line) {
      parsing = false;
      monkeys.push(current);
      current = { inspected: 0 };
    } else if (!parsing) {
      // looks for a `Monkey N:` line to define parsing
      const match = line.match(/^Monkey ([0-9]+):/);
      if (match) {
        // we are in a definition so switch the parsing flag
        parsing = true;
      }
    } else if (line.startsWith('  Starting items: ')) {
      // grab the list of "items" and split them into an array
      const [match] = line.match(/([0-9]+(, )?)+$/);
      // split and parse numbers
      current.items = match.split(', ').map((val) => parseInt(val, 10));
    } else if (line.startsWith('  Operation: new = old')) {
      const [op, rawValue] = line.match(/new = old (.*)$/)[1].split(' ');
      // bind an "inspect" function to the monkey - this will be used to manipulate the
      // value of the "item" after the monkey is done playing with it
      // eslint-disable-next-line no-loop-func
      current.inspect = function inspect(val) {
        // increment our inspection counter
        this.inspected += 1;
        // the defined test can either reference `old` (ie: the existing value) or a number
        const value = rawValue === 'old' ? val : parseInt(rawValue, 10);
        // only * and + are supported
        if (op === '*') {
          return (val * value) % lcm;
        }
        if (op === '+') {
          return (val + value) % lcm;
        }
        throw new Error(`Unknown operation ${op}}`);
      };
    } else if (line.startsWith('  Test: divisible by ')) {
      const divisor = parseInt(line.match(/([0-9]+)$/)[1], 10);
      const ifTrue = parseInt(data[i + 1].match(/([0-9]+)$/)[1], 10);
      const ifFalse = parseInt(data[i + 2].match(/([0-9]+)$/)[1], 10);
      // Store the lowest common multiple of our monkeys - ie: multiply ALL their divisors
      // together. We can then modulo our inspected values by this number to keep the size of
      // the value manageable whilst always being able to determine if the item's value is
      // divisible by any of the monkeys
      lcm *= divisor;
      // bind a test function to the monkey
      current.test = (val) => (val % divisor === 0 ? ifTrue : ifFalse);
      // skip ahead 2 lines as we've already parsed them in this block
      i += 2;
    } else {
      throw new Error(`Unable to parse line: ${line}`);
    }
  }

  // perform the rounds
  for (let round = 0; round < rounds; round += 1) {
    // for each monkey, go through all their items, inspect them, test them, and pass them on
    for (let i = 0; i < monkeys.length; i += 1) {
      const monkey = monkeys[i];
      // shift items off the items list one at a time
      while (monkey.items.length) {
        const item = monkey.items.shift();
        // the worry level as calculated after inspection and worry reduction
        const worryLevel = reduction(monkey.inspect(item));
        // determine where the destination monkey is
        const destination = monkey.test(worryLevel);
        // push the item onto the destination monkey's list
        monkeys[destination].items.push(worryLevel);
      }
    }
  }
  // fetch the 2 most busy monkeys
  const sortedMonkeys = [...monkeys].sort(({ inspected: a }, { inspected: b }) => b - a);
  // return the product of the two most busy monkeys inspection counts
  return sortedMonkeys[0].inspected * sortedMonkeys[1].inspected;
}

module.exports = (data) => {
  const part1 = passTheParcel(data, 20, (val) => Math.floor(val / 3));
  const part2 = passTheParcel(data, 10000, (val) => val);
  return { part1, part2 };
};
