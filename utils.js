const { readFile } = require('fs').promises;
const path = require("path");
module.exports = {
    loadDaysInput: async (dirName, prefix = '') => {
        return (await readFile(path.join(dirName, `./${prefix}input.txt`))).toString().trim().split('\r\n');
    },
};
