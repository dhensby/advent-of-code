const readFileLines = require('../utils');

const ITEMS = [
    'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', 'A', 'B', 'C', 'D',
    'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z',
];

(async () => {
    const data = await readFileLines('./input.txt');
    const priorityScore = data.reduce((sum, items) => {
        if (items.length % 2 !== 0) {
            throw new Error('String is not even in length');
        }
        const [comp1, comp2] = [items.slice(0, items.length / 2).split(''), items.slice(items.length / 2).split('')];
        if (comp1.length !== comp2.length) {
            throw new Error('Failed to split evenly');
        }
        const matchingChar = comp1.find((char) => {
            return comp2.includes(char);
        });
        return sum += ITEMS.indexOf(matchingChar) + 1;
    }, 0);
    let groupScore = 0;
    for (let i = 0; i < data.length; i += 3) {
        const group  = [data[i], data[i+1], data[i+2]];
        const common = group[0].split('').find((char) => {
            return group[1].indexOf(char) !== -1 && group[2].indexOf(char) !== -1;
        });
        groupScore += ITEMS.indexOf(common) + 1;
    }
    console.log(priorityScore, groupScore);
})().catch(console.error);
