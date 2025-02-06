var GameEvents = {
    ON_WORD_PLAY: 'onWordPlay',
    ON_DISCARD: 'onDiscard',
    ON_CALCULATE_WORD: 'onCalculateWord',
    ON_RELIC_ACQUIRED: 'onRelicAcquired',
    ON_ROUND_END: 'onRoundEnd',   
};

var normalRelics = [

        //PERMA-BUFF TILES
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
            name: "Sea's Blessing",
            image: "images/seas_blessing.png",
            description: function(state) {
                return "Add +10 to the multiplier if the word contains 'sea'.";
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
            description: function(state, relic) {
                return `Gain +1 point for every second unique word played (+${relic.uniqueWordCount})`;
            },
            handlers: {
                [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                    if (!state.playedWords[word] && state.playedWords.length/2 % 1 ) {
                        state.playedWords[word] = 1;
                        this.uniqueWordCount += 1;
                    }
                },
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                        state.additionalStatePoints += this.uniqueWordCount;
                }
            },
            uniqueWordCount: 0 // Initialize counter
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
            image: "images/placeholder.png",
            description: function(state, relic) {
                return  `Words beginning with A score an extra +${relic.effect} multiplier`;
            },
            effect: 5,
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (word.startsWith('a')) {
                        state.additionalMultiplier += this.effect;
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
        },

        //11

        {
            name: "History Buff",
            image: "images/history_buff.png", // Replace with actual image path
            description: function(state) {
                return "Gives +10 multiplier if the word ends with 'ed'.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (typeof word === 'string' && word.endsWith('ed')) {
                        state.additionalMultiplier += 10;
                    }
                }
            }
        },
        {
            name: "Watching Eyes",
            image: "images/watching_eyes.png", // Replace with actual image path
            description: function(state, relic) {
                return "Words with a double 'o' get +13 multiplier.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (/oo/i.test(word)) {
                        state.additionalMultiplier += 13;
                    }
                }
            }
        },
        {
            name: "Seeing Double",
            image: "images/seeing_double.png", // Replace with actual image path
            description: function(state) {
                return "Words with any double letters (two of the same letter in a row) give +10 multiplier.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (/([a-zA-Z])\1/.test(word)) {
                        state.additionalMultiplier += 10;
                    }
                }
            }
        },
        {
            name: "Commoner",
            image: "images/energized_ears.png",
            description: function(state, relic) {
                return `Permanently gains +${relic.effect} additional points for each 'E' played (+${relic.eCount*relic.effect})`;
            },
            effect: 1,
            handlers: {
                [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                    const eCount = wordTiles.filter(tile => tile.letter.toLowerCase() === 'e').length;
                    if (eCount > 0) {
                        this.eCount += eCount;
                    }
                },
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    state.additionalStatePoints += this.eCount * this.effect;
                }
            },
            eCount: 0
        },

        //16

        {
            name: "Jane Doe",
            image: "images/jane_doe.png", // Replace with actual image path
            description: function(state, relic) {
                return `Gains +1 additional points for each '_' played (+${relic.blankCount})`;
            },
            handlers: {
                [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                    const blankNumbers = wordTiles.filter(tile => tile.letter === '_').length;
                    if (blankNumbers > 0) {
                        this.blankCount += blankNumbers;
                    }
                },
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    state.additionalStatePoints += this.blankCount;
                }
            },
            blankCount: 0 // Initialize counter
        },

        {
            name: "The Breach",
            image: "images/the_breach.png", // Ensure this image exists in your images directory
            description: function(state, relic) {
                return "Gives +8 multiplier if the second letter of the word is 'N'.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    // Ensure the word has at least two letters
                    if (word.charAt(1).toLowerCase() === 'n') {
                        state.additionalMultiplier += 5;
                    }
                }
            }
        },

        {
            name: "Phone Book",
            image: "images/vowel_enchantment.png",
            description: function(state) {
                return "Words beginning with a vowel give +5 points";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    const vowels = ['a', 'e', 'i', 'o', 'u'];
                    if (vowels.includes(word.charAt(0).toLowerCase())) {
                        state.additionalMultiplier += 3;
                    }
                }
            }
        },

        {
            name: "The Grizzly",
            image: "images/the_breach.png", // Ensure this image exists in your images directory
            description: function(state, relic) {
                return "Gives +6 points if the second letter of the word is 'R'.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    // Ensure the word has at least two letters
                    if (word.charAt(1).toLowerCase() === 'r') {
                        state.additionalStatePoints += 6;
                    }
                }
            }
        },

        {
            name: "Sibilance",
            image: "images/the_breach.png", // Ensure this image exists in your images directory
            description: function(state, relic) {
                return "Gives +5 mult points if the second letter of the word is 'L'.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    // Ensure the word has at least two letters
                    if (word.charAt(1).toLowerCase() === 'r') {
                        state.additionalMultiplier += 5;
                    }
                }
            }
        },

        //21

        {
            name: "Interrogation",
            image: "images/watching_eyes.png", // Replace with actual image path
            description: function(state) {
                return "Words containing a 'wh' get +16 multiplier.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (/wh/i.test(word)) {
                        state.additionalMultiplier += 16;
                    }
                }
            }
        },

        {
            name: "Neo",
            image: "images/watching_eyes.png", // Replace with actual image path
            description: function(state) {
                return "Words containing 'one' get +14 multiplier.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (/one/i.test(word)) {
                        state.additionalMultiplier += 16;
                    }
                }
            }
        },
        {

            name: "Color Expert",
            image: "images/color_expert.png", // Replace with actual image path
            description: function(state, relic) {
                return `Gives +12 points if the word is a color`;
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (colorWords.includes(word.toLowerCase())) {
                        state.additionalStatePoints += 12;
                    }
                }
            },
        },
        {
            name: "High Value Hunter",
            image: "images/energized_ears.png",
            description: function(state, relic) {
                return `Permanently gains +${relic.effect} points for each high-value tile (5+ points) discarded (+${relic.eCount*relic.effect})`;
            },
            effect: 2,
            handlers: {
                [GameEvents.ON_DISCARD]: function(discardedTiles) {
                    const highValueTiles = discardedTiles.filter(tile => tile.points >= 5).length;
                    if (highValueTiles > 0) {
                        this.eCount += highValueTiles;
                    }
                },
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    state.additionalStatePoints += this.eCount * this.effect;
                }
            },
            eCount: 0
        },

        {
            name: "Careful Curator",
            image: "images/energized_ears.png",
            description: function(state, relic) {
                return `At the end of each round, permanently gains +${relic.effect} points for each unused discard (+${relic.eCount*relic.effect})`;
            },
            effect: 2,
            handlers: {
                [GameEvents.ON_ROUND_END]: function() {
                    this.eCount += state.discardsLeft;
                },
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    state.additionalStatePoints += this.eCount * this.effect;
                }
            },
            eCount: 0
        }


    
    ];

relicsCollection = normalRelics.concat(wordLengthRelics, singleLetterPermaBuffRelics, )

console.log("there are ", relicsCollection.length, " total relics in the game")






    const colorWords = [
        "red", "blue", "green", "yellow", "black", "white", "pink", "orange", "brown", "purple",
        "gray", "violet", "indigo", "cyan", "magenta", "lime", "maroon", "olive", "teal", "navy",
        "beige", "gold", "silver", "bronze", "coral", "peach", "mint", "aqua", "lavender", "tan",
        "ivory", "crimson", "emerald", "fuchsia", "honey", "jade", "lilac", "mauve", "mustard", "ruby",
        "saffron", "salmon", "sapphire", "scarlet", "sepia", "tangerine", "amber", "azure", "blush", "brick",
        "copper", "cream", "denim", "flame", "forest", "ginger", "khaki", "lemon", "lime", "melon",
        "mint", "moss", "navy", "ochre", "olive", "onyx", "pear", "plum", "puce", "rust",
        "sage", "sky", "slate", "snow", "steel", "taupe", "topaz", "wheat", "wine", "rose",
        "apricot", "banana", "biloba", "carmine", "cobalt", "cream", "copper", "crimson", "cyan", "denim",
        "ebony", "emerald", "fawn", "fern", "fire", "flax", "foam", "golden", "grape", "graphite",
        "hazel", "heliotrope", "honeydew", "ice", "jade", "jam", "jet", "kiwi", "lavender", "lemon",
        "lichen", "linen", "mahogany", "marigold", "mauve", "mulberry", "mustard", "nectarine", "nutmeg", "olive",
        "orchid", "papaya", "peach", "pear", "periwinkle", "persimmon", "platinum", "plum", "pumpkin", "quartz",
        "raspberry", "rose", "ruby", "sandy", "sangria", "sapphire", "scarlet", "seafoam", "sepia", "sienna",
        "smoke", "snow", "steel", "straw", "sunset", "tangerine", "taupe", "teal", "terracotta", "thistle",
        "tomato", "topaz", "turquoise", "umber", "vanilla", "verdant", "vermilion", "violet", "wheat", "wine",
        "amber", "auburn", "aqua", "beige", "black", "blue", "bronze", "brown", "cerise", "charcoal",
        "chartreuse", "chestnut", "cinnamon", "claret", "cobalt", "copper", "coral", "crimson", "cyan", "denim",
        "emerald", "fuchsia", "gold", "gray", "green", "hazel", "indigo", "ivory", "jade", "lavender",
        "lemon", "lime", "magenta", "maroon", "mint", "mustard", "navy", "olive", "orange", "orchid",
        "peach", "pear", "periwinkle", "pink", "plum", "powder", "purple", "raspberry", "red", "ruby",
        "salmon", "sapphire", "scarlet", "seafoam", "silver", "smoke", "snow", "steel", "tan", "teal",
        "tangerine", "turquoise", "violet", "white", "wine", "yellow", "alabaster", "amber", "amethyst", "aquamarine",
        "azure", "beige", "bisque", "blush", "brick", "bronze", "bubblegum", "butterscotch", "carmine", "copper",
        "cream", "emerald", "fawn", "flax", "forest", "fuchsia", "ginger", "golden", "grapefruit", "heliotrope",
        "honeydew", "jade", "lavender", "lemon", "lichen", "linen", "mahogany", "marigold", "mint", "moss",
        "mustard", "nectarine", "nutmeg", "olive", "orchid", "papaya", "peach", "pear", "persimmon", "platinum",
        "pumpkin", "quartz", "raspberry", "rose", "ruby", "sandy", "sangria", "sapphire", "scarlet", "seafoam",
        "sepia", "sienna", "smoke", "snow", "steel", "straw", "sunset", "tangerine", "taupe", "teal",
        "terracotta", "thistle", "tomato", "topaz", "turquoise", "umber", "vanilla", "verdant", "vermilion", "violet",
        "wheat", "wine", "amber", "auburn", "aqua", "beige", "black", "blue", "bronze", "brown",
        "cerise", "charcoal", "chartreuse", "chestnut", "cinnamon", "claret", "cobalt", "copper", "coral", "crimson",
        "cyan", "denim", "emerald", "fuchsia", "gold", "gray", "green", "hazel", "indigo", "ivory",
        "jade", "lavender", "lemon", "lime", "magenta", "maroon", "mint", "mustard", "navy", "olive",
        "orange", "orchid", "peach", "pear", "periwinkle", "pink", "plum", "powder", "purple", "raspberry",
        "red", "ruby", "salmon", "sapphire", "scarlet", "seafoam", "silver", "smoke", "snow", "steel",
        "tan", "teal", "tangerine", "turquoise", "violet", "white", "wine", "yellow"
      ];
