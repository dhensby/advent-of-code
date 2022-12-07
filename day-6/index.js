// This is the main logic for solving the problem.
// We take data input (a string of "seemingly random"
// chars, process it looking for `num` unique items in a row
function findUniqueChars(data, num = 4) {
    // split the string into an array to iterate over
    const input = data.split('');
    // initiate a buffer for storing the last `num` chars we've seen
    const buffer = [];
    // a counter (this is the answer)
    let count = 0;
    // a variable for analysing the next char in the list
    let next;
    // go through the array of chars one at a time
    while (next = input.shift()) {
        count++;
        // check if the buffer has this char in it already
        // if it does, we'll need to discard that char (and the ones before it)
        // as those can't be part of the unique marker
        const i = buffer.indexOf(next);
        // push the current char into the buffer in anticipation of it being needed
        buffer.push(next);
        if (i !== -1) {
            // this is not a unique char, so we must remove the one that was there
            // and all of the items before it (ie: from the beginning)
            buffer.splice(0, i + 1);
        } else if (buffer.length === num) {
            // if the buffer length is as long as our target length, then we have our answer
            return count;
        }
    }
}

module.exports = (data) => {
    // although there input data is only one line, I've iterated over all the lines
    // so that the test inputs can be used and output in one go
    const startOfPacket = data.map((input) => {
        return findUniqueChars(input, 4);
    });
    const startOfMessage = data.map((input) => {
        return findUniqueChars(input, 14);
    });
    return {
        part1: startOfPacket,
        part2: startOfMessage,
    };
};
