# Advent of Code 2022 - NodeJS

Implementations to solve the problems from Advent of Code 2022, written in NodeJS

## Using this repo

### Creating a days solution

1. clone this repository
2. run `$ npm install`
3. run `$ npm run create` to create the next days folder (or `$ npm run create [num]` to create a specific days folder)
4. add your puzzle input to `day-[num]/input.txt` and optionally test data to `test-input.txt`
4. add your solution/code to `day-[num]/index.js` - this should export a function that accepts data (array of lines from 
the input file as an argument) and returns an object with props `part1` and `part2` both with corresponding answers

### Running the solution

Assuming you've already followed the steps above, to run a days code and see the solution output...

1. run `$ npm run solve [num]` where [num] is the day of which you want to see the answers
