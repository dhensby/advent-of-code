const { readFile } = require('fs').promises;

module.exports = async function readFileLines(path) {
    const data = await readFile(path);
    return data.toString().trim().split('\n');
}
