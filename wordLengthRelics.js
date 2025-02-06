var GameEvents = {
    ON_WORD_PLAY: 'onWordPlay',
    ON_DISCARD: 'onDiscard',
    ON_CALCULATE_WORD: 'onCalculateWord',
    ON_RELIC_ACQUIRED: 'onRelicAcquired',
    // Add more events as needed
};

//gain permanent points - 4
//permanently gain mult - 2
//gain temporary mult - 4
//gain temporary points - 4
// Gain extra draws/words/discards - 5

//total - 19

wordLengthRelics = [
//
//gain permanent points - 4
//  
    {
        name: "Briefs",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Permanently gains +${relic.effect} mult for each two-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 2) {
                    this.eCount += 1;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalMultiplier += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },

    {
        name: "Short Words",
        image: "images/energized_ears.png",
        description: function(state, relic) {
            return `Permanently gains +${relic.effect} points for each word shorter than 4 letters played (+${relic.eCount*relic.effect})`;
        },
        effect: 2,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                if (wordTiles.length < 4) {
                    this.eCount += 1;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalStatePoints += this.eCount * this.effect;
            }
        },
        eCount: 0
    },

    {
        name: "Tri-State",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Permanently gains +${relic.effect} points for each three-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 3) {
                    this.eCount += 1;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalStatePoints += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },

    {
        name: "Cuatro",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Permanently gains +${relic.effect} points for each four-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 4) {
                    this.eCount += 1;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalStatePoints += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },

    {
        name: "Cinco",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Permanently gains +${relic.effect} points for each five-letter word played (+${relic.eCount*relic.effect})`;
        },
        effect: 1,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                console.log("handlers", wordTiles)
                const wordLength = wordTiles.length;
                if (wordTiles.length == 5) {
                    this.eCount += 1;
                }
            },
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                state.additionalStatePoints += this.eCount * this.effect;
            }
        },
        eCount: 0 // Initialize counter
    },
//
//gain temporary mult - 4
//  
    {
        name: "Trinity",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Three-letter words score an extra +${relic.effect} multiplier`;
        },
        effect: 5,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 3) {
                    state.additionalMultiplier += this.effect;
                }
            }
        }        
    },

    {
        name: "Dirty Mouth",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Four-letter words score an extra +${relic.effect} multiplier`;
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
            return `Five-letter words score an extra +${relic.effect} multiplier`;
        },
        effect: 4,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 5) {
                    state.additionalMultiplier += this.effect;
                }
            }
        }
    },

    {
        name: "Nerd",
        image: "images/nerd.png",
        description: function(state, relic) {
            return `Words with at least six letters score an extra +${relic.effect} multiplier`;
        },
        effect: 6,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (word.length >= 6) {
                    state.additionalMultiplier += this.effect;
                }
            }
        }
    },

//
//gain temporary points - 4
// 

    {
        name: "The Firm",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Three-letter words score an extra +${relic.effect} points`;
        },
        effect: 8,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 3) {
                    state.additionalStatePoints += this.effect;
                }
            }
        }
    },

    {
        name: "Clover",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Four-letter words score an extra +${relic.effect} points`;
        },
        effect: 7,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 4) {
                    state.additionalStatePoints += this.effect;
                }
            }
        }
    },

    {
        name: "Clover",
        image: "images/four_letter_bonus.png",
        description: function(state, relic) {
            return `Five-letter words score an extra +${relic.effect} points`;
        },
        effect: 6,
        handlers: {
            [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                if (wordTiles.length === 4) {
                    state.additionalStatePoints += this.effect;
                }
            }
        }
    },
    
    {
        name: "Glasses",
        image: "images/nerd.png",
        description: function(state, relic) {
            return `Words with six or more letters score an extra +${relic.effect} points`;
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
    
//
//permanently gain mult - 2
//

{
    name: "Soul of Wit",
    image: "images/energized_ears.png", // Replace with actual image path
    description: function(state, relic) {
        return `Gains +${relic.effect} additional mult for each two-letter word played (+${relic.eCount*relic.effect})`;
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
    name: "Frizzle",
    image: "images/energized_ears.png", // Replace with actual image path
    description: function(state, relic) {
        return `Gains +${relic.effect} additional mult for each four-letter word played (+${relic.eCount*relic.effect})`;
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
            state.additionalMultiplier += this.eCount * this.effect;
        }
    },
    eCount: 0 // Initialize counter
},

//
// Gain extra draws/words/discards - 5
//
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
    
    {
        name: "Dumpster",
        image: "images/energized_ears.png", // Replace with actual image path
        description: function(state, relic) {
            return `Five-letter words permanently lower the necessary score by ${relic.effect}`;
        },
        effect: 10,
        handlers: {
            [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                const wordLength = wordTiles.length;
                if (wordTiles.length == 5) {
                    state.targetScore -= this.effect
                }
            },
        },
    }, 

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
]

console.log(wordLengthRelics.length)