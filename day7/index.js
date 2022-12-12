const { loadDaysInput } = require("../utils");
(async () => {
    const input = (await loadDaysInput(__dirname)).join(',').split(',').map((num) => parseInt(num, 10));
    const [start, end] = input.reduce(([min, max], next) => {
        return [Math.min(min, next), Math.max(max, next)];
    }, [Infinity, 0]);
    const items = input.reduce((accum, i) => {
        if (typeof accum[i] === 'undefined') {
            accum[i] = 0;
        }
        accum[i] += 1;
        return accum;
    }, Array.from(new Array(end)));
    let min = Infinity;
    let pos = null;
    // we can work out the effort to get to a target point by summing over all points and performing:
    // num points * distance to target (abs((current pos - target point))
    for (let i = start; i <= end; i++) {
        let sum = 0;
        for (let j = 0; j < items.length; j++) {
            sum += (items[j] ?? 0) * Math.abs(i - j);
            // it we've gone over our minimum we don't need to go any further into our sum
            if (sum >= min) {
                break;
            }
        }
        if (sum < min) {
            min = sum;
            pos = i;
        }
    }
    console.log('Part 1:', min, { optimalPos: pos });

    min = Infinity;
    pos = null;
    // we can work out the effort to get to a target point by summing over all points and performing:
    // num points * distance to target (abs((current pos - target point))
    for (let i = start; i <= end; i++) {
        let sum = 0;
        for (let j = 0; j < items.length; j++) {
            // factorial based cost of movement
            for (let k = Math.abs(i - j); k > 0; k--) {
                sum += (items[j] ?? 0) * k;
                // it we've gone over our minimum we don't need to go any further into our sum
                if (sum >= min) {
                    break;
                }
            }
            if (sum >= min) {
                break;
            }
        }
        if (sum < min) {
            min = sum;
            pos = i;
        }
    }
    console.log('Part 2:', min, { optimalPos: pos });
})().catch(console.error);
