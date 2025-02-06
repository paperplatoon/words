const relicsMult = {
  a: { name: "Alpha", effect: 4, image: "images/placeholder.png" },
  c: { name: "Charlie", effect: 4, image: "images/placeholder.png" },
  d: { name: "Delta", effect: 4, image: "images/placeholder.png" },
  e: { name: "Echo", effect: 5, image: "images/placeholder.png" },
  f: { name: "Foxtrot", effect: 4, image: "images/placeholder.png" },
  g: { name: "Golf", effect: 5, image: "images/placeholder.png" },
  h: { name: "Hotel", effect: 4, image: "images/placeholder.png" },
  i: { name: "India", effect: 5, image: "images/placeholder.png" },
  k: { name: "Kilo", effect: 6, image: "images/placeholder.png" },
  l: { name: "Lima", effect: 4, image: "images/placeholder.png" },
  m: { name: "Mike", effect: 5, image: "images/placeholder.png" },
  n: { name: "November", effect: 5, image: "images/placeholder.png" },
  o: { name: "Oscaar", effect: 5, image: "images/placeholder.png" },
  p: { name: "Papa", effect: 4, image: "images/placeholder.png" },
  r: { name: "Romeo", effect: 4, image: "images/placeholder.png" },
  s: { name: "Sierra", effect: 4, image: "images/placeholder.png" },
  t: { name: "Tango", effect: 4, image: "images/placeholder.png" },
  u: { name: "Uniform", effect: 5, image: "images/placeholder.png" },
  w: { name: "Whiskey", effect: 4, image: "images/placeholder.png" },
};

const singleLetterMultRelics = Object.entries(relicsMult).map(([letter, relic]) => {
    return {
      name: relic.name,
      image: relic.image,
      description: function (state, relic) {
        return `Words beginning with '${letter.toUpperCase()}' score an extra +${relic.effect} multiplier`;
      },
      effect: relic.effect,
      handlers: {
        [GameEvents.ON_CALCULATE_WORD]: function (wordTiles, word) {
          if (wordTiles[0].letter.toLowerCase() === letter) {
            console.log("word starts with letter", letter)
            state.additionalMultiplier += this.effect;
          }
        }
      },
    };
  });

  const relicsPermaBuff = {
    a: { name: "Aaron", effect: 1, image: "images/placeholder.png" },
    c: { name: "Carlisle", effect: 2, image: "images/placeholder.png" },
    d: { name: "David", effect: 2, image: "images/placeholder.png" },
    e: { name: "Edward", effect: 1, image: "images/placeholder.png" },
    f: { name: "Frank", effect: 2, image: "images/placeholder.png" },
    g: { name: "George", effect: 2, image: "images/placeholder.png" },
    h: { name: "Harry", effect: 2, image: "images/placeholder.png" },
    i: { name: "Isaac", effect: 1, image: "images/placeholder.png" },
    k: { name: "Karl", effect: 3, image: "images/placeholder.png" },
    l: { name: "Larry", effect: 2, image: "images/placeholder.png" },
    m: { name: "Mike", effect: 2, image: "images/placeholder.png" },
    n: { name: "Nathan", effect: 2, image: "images/placeholder.png" },
    o: { name: "Oscar", effect: 1, image: "images/placeholder.png" },
    p: { name: "Paul", effect: 2, image: "images/placeholder.png" },
    r: { name: "Robert", effect: 1, image: "images/placeholder.png" },
    s: { name: "Steve", effect: 1, image: "images/placeholder.png" },
    t: { name: "Thomas", effect: 1, image: "images/placeholder.png" },
    u: { name: "Ulysses", effect: 2, image: "images/placeholder.png" },
    w: { name: "William", effect: 2, image: "images/placeholder.png" },
  };
  
  const singleLetterPermaBuffRelics = Object.entries(relicsPermaBuff).map(([letter, relic]) => {
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

  const secondLetter = {
    a: { name: "Alpha-2", effect: 6, image: "images/placeholder.png" },
    c: { name: "Charlie-2", effect: 10, image: "images/placeholder.png" },
    d: { name: "Delta-2", effect: 8, image: "images/placeholder.png" },
    e: { name: "Echo-2", effect: 6, image: "images/placeholder.png" },
    f: { name: "Foxtrot-2", effect: 14, image: "images/placeholder.png" },
    g: { name: "Golf-2", effect: 12, image: "images/placeholder.png" },
    h: { name: "Hotel-2", effect: 10, image: "images/placeholder.png" },
    i: { name: "India-2", effect: 6, image: "images/placeholder.png" },
    k: { name: "Kilo-2", effect: 10, image: "images/placeholder.png" },
    l: { name: "Lima-2", effect: 8, image: "images/placeholder.png" },
    m: { name: "Mike-2", effect: 10, image: "images/placeholder.png" },
    n: { name: "November-2", effect: 8, image: "images/placeholder.png" },
    o: { name: "Oscaar-2", effect: 6, image: "images/placeholder.png" },
    p: { name: "Papa-2", effect: 10, image: "images/placeholder.png" },
    r: { name: "Romeo-2", effect: 6, image: "images/placeholder.png" },
    s: { name: "Sierra-2", effect: 10, image: "images/placeholder.png" },
    t: { name: "Tango-2", effect: 10, image: "images/placeholder.png" },
    u: { name: "Uniform-2", effect: 6, image: "images/placeholder.png" },
    w: { name: "Whiskey-2", effect: 12, image: "images/placeholder.png" },
  };

  const secondLetterPoints = Object.entries(secondLetter).map(([letter, relic]) => {
    return {
      name: relic.name,
      image: relic.image,
      description: function (state, relic) {
        return `Scores an extra +${relic.effect} points if the second letter is a '${letter.toUpperCase()}'`;
      },
      effect: relic.effect,
      handlers: {
        [GameEvents.ON_CALCULATE_WORD]: function (wordTiles, word) {
          console.log("handlers", wordTiles);
          if (wordTiles[1].letter.toLowerCase() === letter) {
            state.additionalStatePoints += this.effect;
          }
        },
      },
    };
  });


  const thirdLetter = {
    a: { name: "Alpha-3", effect: 10, image: "images/placeholder.png" },
    c: { name: "Charlie-3", effect: 18, image: "images/placeholder.png" },
    d: { name: "Delta-3", effect: 15, image: "images/placeholder.png" },
    e: { name: "Echo-3", effect: 10, image: "images/placeholder.png" },
    f: { name: "Foxtrot-3", effect: 18, image: "images/placeholder.png" },
    g: { name: "Golf-3", effect: 18, image: "images/placeholder.png" },
    h: { name: "Hotel-3", effect: 18, image: "images/placeholder.png" },
    i: { name: "India-3", effect: 10, image: "images/placeholder.png" },
    k: { name: "Kilo-3", effect: 18, image: "images/placeholder.png" },
    l: { name: "Lima-3", effect: 14, image: "images/placeholder.png" },
    m: { name: "Mike-3", effect: 14, image: "images/placeholder.png" },
    n: { name: "November-3", effect: 14, image: "images/placeholder.png" },
    o: { name: "Oscaar-3", effect: 10, image: "images/placeholder.png" },
    p: { name: "Papa-3", effect: 18, image: "images/placeholder.png" },
    r: { name: "Romeo-3", effect: 10, image: "images/placeholder.png" },
    s: { name: "Sierra-3", effect: 10, image: "images/placeholder.png" },
    t: { name: "Tango-3", effect: 10, image: "images/placeholder.png" },
    u: { name: "Uniform-3", effect: 10, image: "images/placeholder.png" },
    w: { name: "Whiskey-3", effect: 20, image: "images/placeholder.png" },
  };

  const thirdLetterPoints = Object.entries(thirdLetter).map(([letter, relic]) => {
    return {
      name: relic.name,
      image: relic.image,
      description: function (state, relic) {
        return `Scores an extra +${relic.effect} points if the third letter is a '${letter.toUpperCase()}'`;
      },
      effect: relic.effect,
      handlers: {
        [GameEvents.ON_CALCULATE_WORD]: function (wordTiles, word) {
          console.log("handlers", wordTiles);
          if (wordTiles.length > 2 && wordTiles[2].letter.toLowerCase() === letter) {
            state.additionalStatePoints += this.effect;
          }
        },
      },
    };
  });

  const consonantPairs = {
    st: { name: "Sierra-Tango-2", effect: 6, image: "images/placeholder.png" },
    pr: { name: "Papa-Romeo-2", effect: 8, image: "images/placeholder.png" },
    dr: { name: "Delta-Romeo-2", effect: 10, image: "images/placeholder.png" },
    gh: { name: "Golf-Hotel-2", effect: 16, image: "images/placeholder.png" },
    th: { name: "Tango-Hotel-2", effect: 6, image: "images/placeholder.png" },
    ch: { name: "Charlie-Hotel-2", effect: 8, image: "images/placeholder.png" },
    sh: { name: "Sierra-Hotel-2", effect: 10, image: "images/placeholder.png" },
    tr: { name: "Tango-Romeo-2", effect: 8, image: "images/placeholder.png" },
    ph: { name: "Papa-Hotel-2", effect: 14, image: "images/placeholder.png" },
    wh: { name: "Whiskey-Hotel-2", effect: 14, image: "images/placeholder.png" },
    cl: { name: "Charlie-Lima-2", effect: 12, image: "images/placeholder.png" },
    fl: { name: "Foxtrot-Lima-2", effect: 12, image: "images/placeholder.png" },
    pl: { name: "Papa-Lima-2", effect: 14, image: "images/placeholder.png" },
    gl: { name: "Golf-Lima-2", effect: 16, image: "images/placeholder.png" },
    gr: { name: "Golf-Romeo-2", effect: 12, image: "images/placeholder.png" },
    fr: { name: "Foxtrot-Romeo-2", effect: 12, image: "images/placeholder.png" },
    cr: { name: "Charlie-Romeo-2", effect: 14, image: "images/placeholder.png" },
    sl: { name: "Sierra-Lima-2", effect: 10, image: "images/placeholder.png" },
    sp: { name: "Sierra-Papa-2", effect: 12, image: "images/placeholder.png" },
    sw: { name: "Sierra-Whiskey-2", effect: 14, image: "images/placeholder.png" },
    sk: { name: "Sierra-Kilo-2", effect: 16, image: "images/placeholder.png" },
    sc: { name: "Sierra-Charlie-2", effect: 14, image: "images/placeholder.png" },
    sm: { name: "Sierra-Mike-2", effect: 16, image: "images/placeholder.png" },
    sn: { name: "Sierra-November-2", effect: 16, image: "images/placeholder.png" },
    tw: { name: "Tango-Whiskey-2", effect: 16, image: "images/placeholder.png" },
    tw: { name: "Tango-Whiskey-2", effect: 14, image: "images/placeholder.png" },
    kn: { name: "Kilo-November-2", effect: 18, image: "images/placeholder.png" },
    wr: { name: "Whiskey-Romeo-2", effect: 16, image: "images/placeholder.png" },
    ck: { name: "Charlie-Kilo-2", effect: 16, image: "images/placeholder.png" },
    ng: { name: "November-Golf-2", effect: 18, image: "images/placeholder.png" },
    lk: { name: "Lima-Kilo-2", effect: 20, image: "images/placeholder.png" },
    mp: { name: "Mike-Papa-2", effect: 18, image: "images/placeholder.png" }
  };
  
  const secondConsonantPairsPoints = Object.entries(consonantPairs).map(([pair, relic]) => {
    return {
      name: relic.name,
      image: relic.image,
      description: function (state, relic) {
        return `Scores an extra +${relic.effect} points if the pair '${pair.toUpperCase()}' appears anywhere in the word`;
      },
      effect: relic.effect,
      handlers: {
        [GameEvents.ON_CALCULATE_WORD]: function (wordTiles, word) {
          const regex = new RegExp(pair, "i"); // Case-insensitive search for the pair
          if (regex.test(word)) {
            state.additionalStatePoints += this.effect;
          }
        }
      }
    };
  });

  const vowelConsonantPairs = {
    in: { name: "India-November-2", effect: 6, image: "images/placeholder.png" },
    en: { name: "Echo-November-2", effect: 6, image: "images/placeholder.png" },
    at: { name: "Alpha-Tango-2", effect: 8, image: "images/placeholder.png" },
    is: { name: "India-Sierra-2", effect: 10, image: "images/placeholder.png" },
    an: { name: "Alpha-November-2", effect: 8, image: "images/placeholder.png" },
    on: { name: "Oscar-November-2", effect: 8, image: "images/placeholder.png" },
    it: { name: "India-Tango-2", effect: 10, image: "images/placeholder.png" },
    as: { name: "Alpha-Sierra-2", effect: 10, image: "images/placeholder.png" },
    ar: { name: "Alpha-Romeo-2", effect: 10, image: "images/placeholder.png" },
    am: { name: "Alpha-Mike-2", effect: 12, image: "images/placeholder.png" },
    al: { name: "Alpha-Lima-2", effect: 12, image: "images/placeholder.png" },
    up: { name: "Uniform-Papa-2", effect: 14, image: "images/placeholder.png" },
    un: { name: "Uniform-November-2", effect: 14, image: "images/placeholder.png" },
    el: { name: "Echo-Lima-2", effect: 12, image: "images/placeholder.png" },
    es: { name: "Echo-Sierra-2", effect: 12, image: "images/placeholder.png" },
    im: { name: "India-Mike-2", effect: 14, image: "images/placeholder.png" },
    il: { name: "India-Lima-2", effect: 14, image: "images/placeholder.png" },
    ar: { name: "Alpha-Romeo-2", effect: 10, image: "images/placeholder.png" },
    or: { name: "Oscar-Romeo-2", effect: 8, image: "images/placeholder.png" },
    om: { name: "Oscar-Mike-2", effect: 14, image: "images/placeholder.png" },
    er: { name: "Echo-Romeo-2", effect: 6, image: "images/placeholder.png" },
    et: { name: "Echo-Tango-2", effect: 12, image: "images/placeholder.png" },
    op: { name: "Oscar-Papa-2", effect: 16, image: "images/placeholder.png" },
    em: { name: "Echo-Mike-2", effect: 14, image: "images/placeholder.png" },
    ur: { name: "Uniform-Romeo-2", effect: 12, image: "images/placeholder.png" },
    ow: { name: "Oscar-Whiskey-2", effect: 14, image: "images/placeholder.png" },
    os: { name: "Oscar-Sierra-2", effect: 14, image: "images/placeholder.png" },
    aw: { name: "Alpha-Whiskey-2", effect: 16, image: "images/placeholder.png" },
    ig: { name: "India-Golf-2", effect: 16, image: "images/placeholder.png" },
    ow: { name: "Oscar-Whiskey-2", effect: 14, image: "images/placeholder.png" },
    al: { name: "Alpha-Lima-2", effect: 12, image: "images/placeholder.png" },
    as: { name: "Alpha-Sierra-2", effect: 10, image: "images/placeholder.png" },
    ag: { name: "Alpha-Golf-2", effect: 16, image: "images/placeholder.png" },
  };
  
  const vowelConsonantPairsPoints = Object.entries(vowelConsonantPairs).map(([pair, relic]) => {
    return {
      name: relic.name,
      image: relic.image,
      description: function (state, relic) {
        return `Scores an extra +${relic.effect} points if '${pair.toUpperCase()}' appears anywhere in the word`;
      },
      effect: relic.effect,
      handlers: {
        [GameEvents.ON_CALCULATE_WORD]: function (wordTiles, word) {
          const regex = new RegExp(pair, "i"); // Case-insensitive search for the pair
          if (regex.test(word)) {
            state.additionalStatePoints += this.effect;
          }
        }
      }
    };
  });
  
  
  
