const { loadDaysInput } = require("../utils");
(async () => {
    const input = (await loadDaysInput(__dirname)).join(',').split(',').map((num) => parseInt(num, 10));
    let state = input.reduce((initialState, num) => {
        initialState[num] += 1;
        return initialState;
    }, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    for (let i = 0; i < 80; i++) {
        const newState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let j = 0; j < newState.length; j++) {
            const nextIndex = j === 0 ? 6 : j - 1;
            newState[nextIndex] += state[j];
            if (j === 0) {
                newState[8] += state[j];
            }
        }
        state = newState;
    }
    console.log('Part 1:', state.reduce((sum, num) => sum + num));

    state = input.reduce((initialState, num) => {
        initialState[num] += 1;
        return initialState;
    }, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
    for (let i = 0; i < 256; i++) {
        const newState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let j = 0; j < newState.length; j++) {
            const nextIndex = j === 0 ? 6 : j - 1;
            newState[nextIndex] += state[j];
            if (j === 0) {
                newState[8] += state[j];
            }
        }
        state = newState;
    }
    console.log('Part 2:', state.reduce((sum, num) => sum + num));
})().catch(console.error);
