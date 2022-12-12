const { loadDaysInput } = require('../utils');

(async () => {
    const input = await loadDaysInput(__dirname);
    const bingoNumbers = input[0].split(',').map((num) => parseInt(num, 10));
    const cards = input.slice(1).reduce((inProgressCards, line) => {
        const card = line ? inProgressCards.pop() : [];
        if (line) {
            card.push(line.trim().split(/\s+/).map((num) => parseInt(num, 10)));
        }
        inProgressCards.push(card);
        return inProgressCards;
    }, []);
    // find winning card
    for (let i = 0; i < bingoNumbers.length; i++) {
        const calledNumbers = bingoNumbers.slice(0, i+1);
        const winner = cards.find((rows) => {
            const winnables = rows.concat(rows.reduce((colsInProgress, row) => {
                row.forEach((item, i) => {
                    if (!colsInProgress[i]) {
                        colsInProgress[i] = [];
                    }
                    colsInProgress[i].push(item);
                });
                return colsInProgress
            }, []));
            return winnables.find((winnable) => {
                return calledNumbers.length >= winnable.length && winnable.every((candidate) => calledNumbers.includes(candidate));
            });
        });
        if (winner) {
            const lastCalledNumber = calledNumbers[i];
            const uncalledSum = winner.reduce((sum, row) => {
                return sum + row.reduce((rowSum, val) => {
                    if (!calledNumbers.includes(val)) {
                        rowSum += val;
                    }
                    return rowSum;
                }, 0);
            }, 0);
            console.log('Winning Card', winner.reduce((asString, row) => {
                return `${asString}\n${row.map(((num) => num.toString().padStart(2, ' '))).join(' ')}`;
            }, ''));
            console.log(lastCalledNumber, uncalledSum);
            console.log('Part 1:', lastCalledNumber * uncalledSum);
            break;
        }
    }

    // find losing card
    let lastLosers;
    for (let i = 0; i < bingoNumbers.length; i++) {
        const calledNumbers = bingoNumbers.slice(0, i+1);
        const losers = cards.filter((rows) => {
            const winnables = rows.concat(rows.reduce((colsInProgress, row) => {
                row.forEach((item, i) => {
                    if (!colsInProgress[i]) {
                        colsInProgress[i] = [];
                    }
                    colsInProgress[i].push(item);
                });
                return colsInProgress
            }, []));
            return !winnables.find((winnable) => {
                return calledNumbers.length >= winnable.length && winnable.every((candidate) => calledNumbers.includes(candidate));
            });
        });
        if (!losers.length) {
            const [loser] = lastLosers;
            // need to find when the losing card wins
            const lastCalledNumber = calledNumbers[i];
            const uncalledSum = loser.reduce((sum, row) => {
                return sum + row.reduce((rowSum, val) => {
                    if (!calledNumbers.includes(val)) {
                        rowSum += val;
                    }
                    return rowSum;
                }, 0);
            }, 0);
            console.log('Losing Card', loser.reduce((asString, row) => {
                return `${asString}\n${row.map(((num) => num.toString().padStart(2, ' '))).join(' ')}`;
            }, ''));
            console.log(lastCalledNumber, uncalledSum);
            console.log('Part 2:', lastCalledNumber * uncalledSum);
            break;
        }
        lastLosers = losers;
    }
})().catch(console.error);
