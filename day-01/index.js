const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

function extractDigits(text, justDigits = false) {
  let firstDigit;
  let lastDigit;
  // if the first char is a digit, we can shortcut the checks
  if (DIGITS.includes(text[0])) {
    firstDigit = parseInt(text[0], 10);
  } else {
    let textFromStart = text;
    do {
      // eslint-disable-next-line no-loop-func
      const number = NUMBERS.find((num) => textFromStart.startsWith(num));
      if (!justDigits && number) {
        firstDigit = NUMBERS.indexOf(number) + 1;
        break;
      } else {
        textFromStart = textFromStart.substring(1);
        if (DIGITS.includes(textFromStart[0])) {
          firstDigit = parseInt(textFromStart[0], 10);
          break;
        }
      }
    } while (textFromStart.length);
  }
  if (DIGITS.includes(text[text.length - 1])) {
    lastDigit = parseInt(text[text.length - 1], 10);
  } else {
    let textFromEnd = text;
    do {
      // eslint-disable-next-line no-loop-func
      const number = NUMBERS.find((num) => textFromEnd.endsWith(num));
      if (!justDigits && number) {
        lastDigit = NUMBERS.indexOf(number) + 1;
        break;
      } else {
        textFromEnd = textFromEnd.substring(0, textFromEnd.length - 1);
        if (DIGITS.includes(textFromEnd[textFromEnd.length - 1])) {
          lastDigit = parseInt(textFromEnd[textFromEnd.length - 1], 10);
          break;
        }
      }
    } while (textFromEnd.length);
  }
  return [firstDigit, lastDigit];
}

module.exports = {
  part1: (data) => data.reduce((sum, next) => {
    const digits = extractDigits(next, true);
    return sum + parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
  }, 0),
  part2: (data) => data.reduce((sum, next) => {
    const digits = extractDigits(next);
    return sum + parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
  }, 0),
};
