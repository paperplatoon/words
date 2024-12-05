var GameEvents = {
    ON_WORD_PLAY: 'onWordPlay',
    ON_DISCARD: 'onDiscard',
    ON_CALCULATE_WORD: 'onCalculateWord',
    ON_RELIC_ACQUIRED: 'onRelicAcquired',
    // Add more events as needed
};

wordLengthRelics = [
//1
    {
        name: "Dirty Mouth",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Four-letter words gain an extra +${relic.effect} multiplier`;
        },
        effect: 4,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 4) {
                    state.additionalMultiplier += this.effect;
                }
            }
        }
    },
    {
        name: "The Firm",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Three-letter words gain an extra +${relic.effect} multiplier`;
        },
        effect: 4,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 4) {
                    state.additionalMultiplier += this.effect;
                }
            }
        }
    },
    {
        name: "Raptor",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Five-letter words gain an extra +${relic.effect} multiplier`;
        },
        effect: 6,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 4) {
                    state.additionalMultiplier += this.effect;
                }
            }
        }
    },

    {
        name: "Nerd",
        image: "images/nerd.png",
        description: function(state, relic) {
            return `Words longer than five letters gain an extra +${relic.effect} points`;
        },
        effect: 10,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (word.length >= 6) {
                    state.additionalStatePoints += this.effect;
                }
            }
        }
    },

    //perma buffs
    {
        name: "Briefs",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Gains +${relic.effect} additional points for each two-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 2,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 2) {
                    this.eCount += 1;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalStatePoints += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },

//6

    {
        name: "Frizzle",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Gains +${relic.effect} additional mult for each three-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 2) {
                    this.eCount += eCount;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalMultiplier += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },

    {
        name: "Fiery Ring",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Gains +${relic.effect} additional point for each four-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 4) {
                    this.eCount += eCount;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalStatePoints += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },

    //"free" stuff
    {
        name: "Replacement",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Draw +${relic.effect} cards whenever you play a three-letter word`;
        },
        effect: 3,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 3) {
                    const newTiles = drawTiles(this.effect);
                    state.hand = state.hand.concat(newTiles)
                }
            },
        },
    },

    {
        name: "Lucky",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Seven-letter words do not count against your word total`;
        },
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                const wordLength = wordTiles.length;
                if (wordTiles.length == 7) {
                    state.wordsLeft += 1
                }
            },
        },
    },

    {
        name: "Dumpster",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Five-letter words grant ${relic.effect} extra discard`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                const wordLength = wordTiles.length;
                if (wordTiles.length == 5) {
                    state.discardsLeft += this.effect
                }
            },
        },
    },

    //11
    {
        name: "Six-Shooter",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Six-letter words grant ${relic.effect} extra draw`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                const wordLength = wordTiles.length;
                if (wordTiles.length == 6) {
                    state.drawsLeft += this.effect
                }
            },
        },
    },
]

console.log(wordLengthRelics.length)