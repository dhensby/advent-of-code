const path = require("path");
const { loadDaysInput } = require("../utils");

(async () => {
    const input = await loadDaysInput(__dirname);
    let depth = 0;
    let position = 0;
    let aim = 0;

    input.forEach((instruction) => {
        const [direction, rawValue] = instruction.split(' ');
        const value = parseInt(rawValue, 10);
        if (direction === 'forward') {
            position = position + value;
        } else if (direction === 'up') {
            depth = depth - value;
        } else if (direction === 'down') {
            depth = depth + value;
        }
    });
    console.log('Part 1:', depth * position);

    depth = 0;
    position = 0;

    input.forEach((instruction) => {
        const [direction, rawValue] = instruction.split(' ');
        const value = parseInt(rawValue, 10);
        if (direction === 'forward') {
            position += value;
            depth += (value * aim);
        } else if (direction === 'up') {
            aim -= value;
        } else if (direction === 'down') {
            aim += value;
        }
    });
    console.log('Part 2:', depth * position);
})().catch(console.error);
