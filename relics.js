var GameEvents = {
    ON_WORD_PLAY: 'onWordPlay',
    ON_DISCARD: 'onDiscard',
    ON_CALCULATE_WORD: 'onCalculateWord',
    ON_RELIC_ACQUIRED: 'onRelicAcquired',
    // Add more events as needed
};

var relicsCollection = [
        {
            name: "Enchanted Tiles",
            image: "images/enchanted_tiles.png", 
            description: function(state) {
                return "Every tile in a played word gets +1 added to its points";
            },
            handlers: {
                [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                    wordTiles.forEach(tile => {
                        if (tile.letter !== '_') { // Ensure blanks are not affected
                            const deckTile = state.permanentDeck.find(t => t.id === tile.id);
                            if (deckTile) {
                                deckTile.points += 1;
                            }
                        }
                    });
                }
            }
        },
        {
            name: "Nerd",
            image: "images/nerd.png",
            description: function(state) {
                return "Words with 6 letters or longer get an additional 15 points.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (word.length >= 6) {
                        state.additionalPoints += 15;
                    }
                }
            }
        },
        {
            name: "Four-Letter Bonus",
            image: "images/four_letter_bonus.png",
            description: function(state) {
                return "Add +3 to the multiplier when the word is exactly 4 letters long.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (wordTiles.length === 4) {
                        state.additionalMultiplier += 3;
                    }
                }
            }
        },
        {
            name: "Sea's Blessing",
            image: "images/seas_blessing.png",
            description: function(state) {
                return "Add +6 to the multiplier if the word contains 'sea'.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word, context) {
                    if (word.includes('sea')) {
                        state.additionalMultiplier += 5;
                    }
                }
            }
        },
        {
            name: "Loyalty Multiplier",
            image: "images/loyalty_multiplier.png",
            description: function(state) {
                const wordCount = state.currentWord.length;
                const count = state.playedWords[state.currentWord.join('').toLowerCase()] || 0;
                return `+5X multiplier, where X is the number of times you've played this word before (${count} times)`;
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    const count = state.playedWords[word] || 0;
                    if (count > 0) {
                        state.additionalMultiplier += (count*5);
                    }
                }
            }
        },

        //6
        
        {
            name: "Unique Contributor",
            image: "images/unique_contributor.png",
            description: (state) => "Add +1 point for each unique word played (+" + Object.keys(state.playedWords).length +  ")",
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (!state.playedWords[word]) {
                        state.additionalStatePoints += Object.keys(state.playedWords).length;
                    }
                }
            }
        },
        {
            name: "Vowel Enchantment",
            image: "images/vowel_enchantment.png",
            description: function(state) {
                return "Vowels are worth +3 additional points";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    const vowels = ['a', 'e', 'i', 'o', 'u'];
                    wordTiles.forEach(tile => {
                        if (vowels.includes(tile.letter.toLowerCase())) {
                            tile.additionalPoints += 3; 
                        }
                    });
                }
            }
        },
    
        {
            name: "Consonant Fortification",
            image: "images/consonant_fortification.png",
            description: function(state) {
                return  "Non-vowels are worth +2 additional points";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    const vowels = ['a', 'e', 'i', 'o', 'u'];
                    wordTiles.forEach(tile => {
                        if (!vowels.includes(tile.letter.toLowerCase()) && tile.letter !== '_') {
                            tile.additionalPoints += 2;
                        }
                    });
                }
            }
        },

        {
            name: "Alphabet",
            image: "images/alphabet.png",
            description: function(state) {
                return  "Words beginning with A get a +5 multiplier";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (word.startsWith('a')) {
                        state.additionalMultiplier += 5;
                    }
                }
            }
        },
        {
            name: "Joss",
            image: "images/joss.png", 
            description: function(state) {
                return   "Words ending in Y get a +8 multiplier.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (word.endsWith('y')) {
                        state.additionalMultiplier += 8;
                    }
                }
            }
        }

        //11
    
    ];