const path = require("path");
const { loadDaysInput } = require("../utils");
const { readFile } = require('fs').promises;

function pluckByBitPos(list, pos, mostCommon = true) {
    const oS = [];
    const zS = [];
    list.forEach((entry) => {
        const bit = entry[pos];
        if (bit === "0") {
            zS.push(entry);
        } else {
            oS.push(entry);
        }
    });
    if (zS.length === oS.length) {
        return mostCommon ? oS : zS;
    }
    if (zS.length > oS.length) {
        return mostCommon ? zS : oS;
    }
    return mostCommon ? oS : zS;
}

function bitStringToInt(bits) {
    return bits.split('').reverse().reduce((sum, bit, i) => {
        if (bit === "1") {
            sum += 2**i;
        }
        return sum;
    }, 0)
}

(async () => {
    const input = await loadDaysInput(__dirname);
    const bitVals = [];
    input.forEach((binary) => {
        const bits = binary.split('');
        bits.forEach((bit, i) => {
            if (!bitVals[i]) {
                bitVals[i] = 0;
            }
            bitVals[i] += parseInt(bit, 10);
        });
    });
    const mostCommon = bitVals.map((val) => {
        return val > input.length / 2 ? '1' : '0';
    });
    let gamma = 0;
    let epsilon = 0;
    mostCommon.reverse().forEach((bit, i) => {
        gamma += bit === "1" ? (2**i) : 0;
        epsilon += bit === "0" ? (2**i) : 0;
    });
    console.log('Part 1:', gamma * epsilon);

    let oxygen = pluckByBitPos(input, 0, true);
    let pos = 1;
    while (oxygen.length > 1) {
        oxygen = pluckByBitPos(oxygen, pos++, true);
    }
    let carbon = pluckByBitPos(input, 0, false);
    pos = 1;
    while (carbon.length > 1) {
        carbon = pluckByBitPos(carbon, pos++, false);
    }

    console.log('Part 2:', bitStringToInt(oxygen[0]) * bitStringToInt(carbon[0]));
})().catch(console.error);
