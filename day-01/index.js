function extractDigits(text) {
  return text.match(/[0-9]/g);
}

/**
 * @param {Array<string>} data
 */
module.exports = (data) => {
  const part1 = data.reduce((sum, next) => {
    const digits = extractDigits(next);
    return sum + parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
  }, 0);
  return {
    part1,
  };
};
