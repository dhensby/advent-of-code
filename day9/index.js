const { loadDaysInput } = require("../utils");
(async () => {
    const input = (await loadDaysInput(__dirname, 'ex-'));
    const lineLength = input[0].length;
    const numLines = input.length;
    let riskScore = 0;
    for (let i = 0; i < numLines; i++) {
        for (let j = 0; j < lineLength; j++) {
            const currentPoint = parseInt(input[i][j], 10);
            const adjacentPoints = [];
            if (i > 0) {
                adjacentPoints.push(input[i-1][j]);
            }
            if (i+1 < numLines) {
                adjacentPoints.push(input[i+1][j]);
            }
            if (j > 0) {
                adjacentPoints.push(input[i][j-1]);
            }
            if (j+1 < lineLength) {
                adjacentPoints.push(input[i][j+1]);
            }
            if (currentPoint < Math.min(...adjacentPoints.map((num) => parseInt(num, 10)))) {
                riskScore += (currentPoint + 1);
                // if we are lowest of adjacent points we don't need to test the next value along
                // because it will not be as low as our current point. In theory we could also skip
                // the points below, but that's a bit harder to compute in a nested for loop like this
                j++;
            }
        }
    }
    console.log('Part 1:', riskScore);

    const basins = [];
    let currentBasin = [];
    let inBasin = false;
    let entryPoint = [];
    // using nested for loops is not a practical solution
    // I think a recursive function is better with a list of points to check being added on each recursion
    // stopping once all points surrounded by 9s are found
    for (let i = 0; i < numLines; i++) {
        for (let j = 0; j < lineLength; j++) {
            const currentPoint = parseInt(input[i][j], 10);
            if (!inBasin) {
                if (currentPoint !== 9) {
                    inBasin = true;
                    entryPoint = [i, j];
                    currentBasin.push(currentPoint);
                }
            } else {

            }
        }
    }
})().catch(console.error);
