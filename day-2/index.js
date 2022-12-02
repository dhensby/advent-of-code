const readFileLines = require('../utils');

const OPPONENT_MOVES = ['A', 'B', 'C'];

const PLAYER_MOVES = ['X', 'Y', 'Z'];

function roundResult(opponent, player) {
    const playerScore = PLAYER_MOVES.indexOf(player);
    const opponentScore = OPPONENT_MOVES.indexOf(opponent);
    // draw
    if (playerScore === opponentScore) {
        return 0;
    }
    // we have a non-transitive game here! Whoop!
    // each item beats the "next" one and the "next" one cycles
    // we can use some MODULAR ARITHMATIC to cycle through the options :)
    const losesTo = (playerScore + 1) % OPPONENT_MOVES.length;
    // lose
    if (opponentScore === losesTo) {
        return -1;
    }
    // win
    return 1;
}

function roundMove(opponent, result) {
    const opponentScore = OPPONENT_MOVES.indexOf(opponent);
    switch (result) {
        case 'X':
            // lose
            return opponentScore === 0 ? PLAYER_MOVES.length - 1 : opponentScore - 1
        case 'Y':
            return opponentScore;
        case 'Z':
            return (opponentScore + 1) % PLAYER_MOVES.length;
    }
}

(async () => {
    const data = await readFileLines('./input.txt');
    // split the lines into tuples
    const gamePairs = data.map((row) => row.split(' '));

    const score = gamePairs.reduce((sum, [opponent, player]) => {
        const result = roundResult(opponent, player);
        let roundScore = PLAYER_MOVES.indexOf(player) + 1;
        switch (result) {
            case 0:
                roundScore += 3;
                break;
            case 1:
                roundScore += 6;
                break;
        }
        return sum + roundScore;
    }, 0);
    console.log(score);

    const nextScore = gamePairs.reduce((sum, [opponent, outcome]) => {
        const player = roundMove(opponent, outcome);
        const result = PLAYER_MOVES.indexOf(outcome) - 1;
        let roundScore = player + 1;
        switch (result) {
            case 0:
                roundScore += 3;
                break;
            case 1:
                roundScore += 6;
                break;
        }
        return sum + roundScore;
    }, 0);
    console.log(nextScore);
})().catch(console.error);
