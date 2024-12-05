var GameEvents = {
    ON_WORD_PLAY: 'onWordPlay',
    ON_DISCARD: 'onDiscard',
    ON_CALCULATE_WORD: 'onCalculateWord',
    ON_RELIC_ACQUIRED: 'onRelicAcquired',
    // Add more events as needed
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
            description: function(state, relic) {
                return `Gain +1 point for each unique word played (+${relic.uniqueWordCount})`;
            },
            handlers: {
                [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                    if (!state.playedWords[word]) {
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
                return "Words with double 'o' (like 'look') get +13 multiplier.";
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
            image: "images/energized_ears.png", // Replace with actual image path
            description: function(state, relic) {
                return `Gains +2 additional points for each 'E' played (+${relic.eCount*2})`;
            },
            handlers: {
                [GameEvents.ON_WORD_PLAY]: function(wordTiles, word) {
                    console.log("handlers", wordTiles)
                    const eCount = wordTiles.filter(tile => tile.letter.toLowerCase() === 'e').length;
                    if (eCount > 0) {
                        this.eCount += eCount;
                    }
                },
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    state.additionalStatePoints += this.eCount * 2;
                }
            },
            eCount: 0 // Initialize counter
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
                    console.log(wordTiles)
                    console.log(blankNumbers)
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
                return "Gives +5 multiplier if the second letter of the word is 'N'.";
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
                return "Words containing a 'one' get +14 multiplier.";
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
                        console.log(`Color Expert: Added +12 points for word "${word}".`);
                    }
                }
            },
        },
        {
            name: "Driving Force",
            image: "images/driving_force.png", // Replace with actual image path
            description: function(state) {
                return "Gives +20 points if your word relates to driving a card";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (drivingWords && drivingWords.includes(word.toLowerCase())) {
                        state.additionalStatePoints += 20;
                    }
                }
            }
        },
    
    ];

console.log(normalRelics.length)
console.log(wordLengthRelics.length)
relicsCollection = normalRelics.concat(wordLengthRelics)
console.log(relicsCollection.length)






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
      
const drivingWords = [
        // 1-100
        "car", "key", "gas", "oil", "brake", "pedal", "turn", "tire", "road", "gear",
        "lane", "seat", "belt", "horn", "dash", "park", "stop", "steer", "clutch", "cruise",
        "drive", "speed", "wheel", "mile", "light", "route", "truck", "motor", "tank", "gauge",
        "shift", "start", "trunk", "axle", "sedan", "wagon", "van", "ride", "bump", "jerk",
        "drift", "merge", "yield", "curve", "plow", "rev", "race", "spin", "burn", "roll",
        "back", "drag", "tow", "haul", "map", "trip", "pit", "loop", "zoom", "zip",
        "fuel", "cool", "fan", "bolt", "cap", "jump", "leak", "lock", "load", "lug",
        "vent", "hood", "roof", "tool", "muff", "grip", "auto", "used", "coil",
      
        // Additional words
        "airbag", "alarm", "antenna", "armrest", "axle", "battery", "belt", "blind", "blinker",
        "body", "bonnet", "boost", "bulb", "bumper", "cable", "cam", "cargo",
        "clamp", "clip", "clock", "coil", "column", "compass", "cone", "control", "coolant",
        "crank", "crash", "defrost", "dial", "digital", "door", "drain", "driver", "driving",
        "dual", "dump", "engine", "entry", "exhaust", "fanbelt", "fender", "funnel",
        "fuse",  "gearbox", "glass", "grille", "ground", "grommet", "guard", "guide",
        "handle", "hatch", "heater", "helmet", "hinge", "hook", "horn", "hose",
        "hub", "hybrid", "jack", "knob", "lever", "license", "lift", "limp", "link", "loader",
        "lug", "marker", "mat", "mirror", "mount", "mud", "muffler", "needle", "neutral",
        "oilpan", "onboard", "oxygen", "parking", "parkway", "piston", "plate",
        "plug", "pointer", "polish", "port", "post", "power", "pull", "pump", "push", "quarter",
        "rack", "radar", "rain", "range", "ramp", "rattle", "rear", "relay", "release", "remote",
        "repair", "reserve", "reset", "reverse", "rider", "ring", "runner",
        "scan", "scoop", "screw", "seat", "seal", "semi", "sensor", "shackle",
        "shaft", "shake", "shell", "shift",
        "signal", "siphon", "siren", "skid", "slot",
        "smoke", "snow", "socket", "spindle", "spinner", "split", "spool", "sport", "spring",
        "stall", "standby", "stick", "strap", "street", "stroke", "stud", "stub",
        "sunroof", "suspend", "switch", "system",
        "tank", "tap", "tar", "taxi", "teeth", "terrain", "timing", "tire",
        "tunnel", "turbo", "tyre","upshift", "valve", "vent",
        "view", "vinyl", "visor", "volvo", "water",
        "wheel", "window", "wing", "wire", "wiper", "wiring",
        "wrench",  "yoke",  "zone"
];