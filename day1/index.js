const { loadDaysInput } = require("../utils");

(async () => {
    const input = (await loadDaysInput(__dirname)).map((num) => parseInt(num, 10));
    let prev;
    const increases = input.reduce((numIncreases, next) => {
        if (prev !== undefined && next > prev) {
            numIncreases++;
        }
        prev = next;
        return numIncreases;
    }, 0);
    console.log('Part 1:', increases);

    const window = [];
    let prevWindowSum;
    const windowIncreases = input.reduce((numIncreases, next) => {
        window.push(next);
        if (window.length === 3) {
            const currentSum = window.reduce((sum, val) => sum + val, 0);
            if (prevWindowSum !== undefined && currentSum > prevWindowSum) {
                numIncreases++;
            }
            prevWindowSum = currentSum;
            window.shift();
        }
        return numIncreases;
    }, 0);
    console.log('Part 2:', windowIncreases);
})().catch(console.error);
