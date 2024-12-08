const relics = {
  a: { name: "Aaron", effect: 1, image: "images/placeholder.png" },
  b: { name: "Bob", effect: 1, image: "images/placeholder.png" },
  c: { name: "Carlisle", effect: 1, image: "images/placeholder.png" },
  d: { name: "David", effect: 1, image: "images/placeholder.png" },
  e: { name: "Edward", effect: 1, image: "images/placeholder.png" },
  f: { name: "Frank", effect: 1, image: "images/placeholder.png" },
  g: { name: "George", effect: 1, image: "images/placeholder.png" },
  h: { name: "Harry", effect: 1, image: "images/placeholder.png" },
  i: { name: "Isaac", effect: 1, image: "images/placeholder.png" },
  j: { name: "Jack", effect: 1, image: "images/placeholder.png" },
  k: { name: "Karl", effect: 1, image: "images/placeholder.png" },
  l: { name: "Larry", effect: 1, image: "images/placeholder.png" },
  m: { name: "Mike", effect: 1, image: "images/placeholder.png" },
  n: { name: "Nathan", effect: 1, image: "images/placeholder.png" },
  o: { name: "Oscar", effect: 1, image: "images/placeholder.png" },
  p: { name: "Paul", effect: 1, image: "images/placeholder.png" },
  q: { name: "Quincy", effect: 1, image: "images/placeholder.png" },
  r: { name: "Robert", effect: 1, image: "images/placeholder.png" },
  s: { name: "Steve", effect: 1, image: "images/placeholder.png" },
  t: { name: "Thomas", effect: 1, image: "images/placeholder.png" },
  u: { name: "Ulysses", effect: 1, image: "images/placeholder.png" },
  v: { name: "Victor", effect: 1, image: "images/placeholder.png" },
  w: { name: "William", effect: 1, image: "images/placeholder.png" },
  x: { name: "Xander", effect: 1, image: "images/placeholder.png" },
  y: { name: "Yale", effect: 1, image: "images/placeholder.png" },
  z: { name: "Zane", effect: 1, image: "images/placeholder.png" }
};

const singleLetterPermaBuffRelics = Object.entries(relics).map(([letter, relic]) => {
  return {
    name: relic.name,
    image: relic.image,
    description: function (state, relic) {
      return `Permanently gains +${relic.effect} additional points for each '${letter.toUpperCase()}' played (+${relic.eCount * relic.effect})`;
    },
    effect: relic.effect,
    handlers: {
      [GameEvents.ON_WORD_PLAY]: function (wordTiles, word) {
        console.log("handlers", wordTiles);
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

console.log(singleLetterPermaBuffRelics);
