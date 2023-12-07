// this is used to score card values - the index of the card in the array indicates its relative strength
const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

/**
 *
 * @param {Array<string>} input
 */
function parseInput (input) {
  return input.reduce((data, next) => {
    const [hand, bid] = next.split(/\s+/).map((v) => v.trim())
    data.push({
      hand,
      bid: parseInt(bid, 10),
      // get the cards in the hand grouped by how many of each card there is
      get cards () {
        return hand.split('').reduce((set, next) => {
          if (!set[next]) {
            set[next] = 0
          }
          set[next] += 1
          return set
        }, {})
      },
      // calculate the strength of a hand based on the cards it has
      get strength () {
        // sort by number of each card type we have in reverse.
        // index 0 will be the highest count of the same card in the hand
        const values = Object.values(this.cards).sort((a, b) => b - a)
        // 5 of a kind
        if (values[0] === 5) {
          return 7
        }
        // 4 of a kind
        if (values[0] === 4) {
          return 6
        }
        // full house
        if (values[0] === 3 && values[1] === 2) {
          return 5
        }
        // three of a kind
        if (values[0] === 3) {
          return 4
        }
        // 2 pair
        if (values[0] === 2 && values[1] === 2) {
          return 3
        }
        // 1 pair
        if (values[0] === 2) {
          return 2
        }
        // high card
        if (values[0] === 1) {
          return 1
        }
      },
      // compare this hand to another hand using the strength of the hand
      // if the strength is the same, then the card with the strongest first
      // different card wins
      compare (hand) {
        if (this.strength === hand.strength) {
          // loop through the hand and the first highest card wins
          const thisCards = this.hand.split('')
          const theirCards = hand.hand.split('')
          for (let i = 0; i < thisCards.length; i += 1) {
            // same card, check the next
            if (thisCards[i] === theirCards[i]) {
              continue
            }
            return CARDS.indexOf(thisCards[i]) - CARDS.indexOf(theirCards[i])
          }
          // identical hands
          return 0
        }
        return this.strength - hand.strength
      }
    })
    return data
  }, [])
}

module.exports = {
  part1: (input) => {
    return parseInput(input).sort((a, b) => {
      // order worst to best
      return a.compare(b)
    }).reduce((sum, { bid }, i) => {
      // iterate over all hands in order, their index will be their rank - 1 (0 based index)
      return sum + (bid * (i + 1))
    }, 0)
  },
  part2: (data) => {
  }
}
