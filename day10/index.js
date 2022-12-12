const { loadDaysInput } = require("../utils");

(async () => {
    const input = (await loadDaysInput(__dirname));
    const syntax = {
        '(': ')',
        '[': ']',
        '{': '}',
        '<': '>',
    };
    let score = 0;
    for (let i = 0; i < input.length; i++) {
        const line = input[i];
        let stack = [];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (Object.keys(syntax).includes(char)) {
                stack.push(char);
            } else if (char === syntax[stack[stack.length - 1]]) {
                stack.pop();
            } else {
                console.log('Syntax error:', line);
                // syntax error
                switch (char) {
                    case ')':
                        score += 3;
                        break;
                    case ']':
                        score += 57;
                        break;
                    case '}':
                        score += 1197;
                        break;
                    case '>':
                        score += 25137;
                        break;
                    default:
                        throw new Error(`threw on char '${char}'`);
                }
                break;
            }
        }
    }
    console.log('Part 1:', score);

    let scores = [];
    for (let i = 0; i < input.length; i++) {
        const line = input[i];
        let stack = [];
        let error = false;
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (Object.keys(syntax).includes(char)) {
                stack.push(char);
            } else if (char === syntax[stack[stack.length - 1]]) {
                stack.pop();
            } else {
                error = true;
                break;
            }
        }
        let lineScore = 0;
        let completionString = '';
        while (!error && stack.length) {
            const nextChar = syntax[stack.pop()];
            completionString += nextChar;
            lineScore *= 5;
            switch (nextChar) {
                case ')':
                    lineScore += 1;
                    break;
                case ']':
                    lineScore += 2;
                    break;
                case '}':
                    lineScore += 3;
                    break;
                case '>':
                    lineScore += 4;
                    break;
                default:
                    throw new Error(`threw on char '${char}'`);
            }
        }
        if (!error) {
            scores.push(lineScore);
        }
    }
    scores.sort((a, b) => a-b);
    console.log('Part 2:', scores[Math.floor(scores.length / 2)]);
})().catch(console.error);
