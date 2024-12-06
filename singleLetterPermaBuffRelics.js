const names = [
  "Aaron", "Bob", "Carlisle", "David", "Edward", "Frank",
  "George", "Harry", "Isaac", "Jack", "Karl", "Larry", "Mike",
  "Nathan", "Oscar", "Paul", "Quincy", "Robert", "Steve",
  "Thomas", "Ulysses", "Victor", "William", "Xander", "Yale", "Zane"
];

const alphabet = "abcdefghijklmnopqrstuvwxyz";

const singleLetterPermaBuffRelics = alphabet.split("").map((letter, index) => {
  const name = names[index]; // Assign name from the names array
  return {
    name: name,
    image: "images/energized_ears.png",
    description: function (state, relic) {
      return `Permanently gains +${relic.effect} additional points for each '${letter.toUpperCase()}' played (+${relic.eCount * relic.effect})`;
    },
    effect: 1,
    handlers: {
      [GameEvents.ON_WORD_PLAY]: function (wordTiles, word) {
        const eCount = wordTiles.filter(tile => tile.letter.toLowerCase() === letter).length;
        if (eCount > 0) {
          this.eCount += eCount;
        }
      },
      [GameEvents.ON_CALCULATE_WORD]: function (wordTiles, word) {
        state.additionalStatePoints += this.eCount * this.effect;
      }
    },
    eCount: 0
  };
});
