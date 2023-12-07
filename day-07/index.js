// this is used to score card values - the index of the card in the array indicates its relative strength
const CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const JOKER_CARDS = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']

/**
 *
 * @param {Array<string>} input
 */
function parseInput (input, cardlist) {
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
        // pull out the jokers, they can be added to whatever the highest non joker count is
        const cardCounts = Object.entries(this.cards).sort((a, b) => b[1] - a[1])
        const [, jokerCount] = cardlist[0] === 'J' ? cardCounts.find(([card]) => card === 'J') ?? ['', 0] : ['', 0]
        const values = cardCounts.reduce((nonJokerCounts, next) => {
          if (cardlist[0] !== 'J' || next[0] !== 'J') {
            nonJokerCounts.push(next[1])
          }
          return nonJokerCounts
        }, [])
        // sort by number of each card type we have in reverse.
        // index 0 will be the highest count of the same card in the hand
        // 5 of a kind
        if ((values[0] ?? 0) + jokerCount === 5) {
          return 7
        }
        // 4 of a kind
        if (values[0] + jokerCount === 4) {
          return 6
        }
        // full house
        if ((values[0] + jokerCount === 3 && values[1] === 2) || (values[0] === 3 && values[1] + jokerCount === 2)) {
          return 5
        }
        // three of a kind
        if (values[0] + jokerCount === 3) {
          return 4
        }
        // 2 pair
        if ((values[0] + jokerCount === 2 && values[1] === 2) || (values[0] === 2 && values[1] + jokerCount === 2)) {
          return 3
        }
        // 1 pair
        if (values[0] + jokerCount === 2) {
          return 2
        }
        // high card
        return 1
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
            return cardlist.indexOf(thisCards[i]) - cardlist.indexOf(theirCards[i])
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
    return parseInput(input, CARDS).sort((a, b) => {
      // order worst to best
      return a.compare(b)
    }).reduce((sum, { bid }, i) => {
      // iterate over all hands in order, their index will be their rank - 1 (0 based index)
      return sum + (bid * (i + 1))
    }, 0)
  },
  part2: (input) => {
    return parseInput(input, JOKER_CARDS).sort((a, b) => {
      // order worst to best
      return a.compare(b)
    }).reduce((sum, { bid }, i) => {
      // iterate over all hands in order, their index will be their rank - 1 (0 based index)
      return sum + (bid * (i + 1))
    }, 0)
  }
}
