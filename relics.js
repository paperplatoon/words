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
        },

        //11
        {
            name: "Driving Force",
            image: "images/driving_force.png", // Replace with actual image path
            description: function(state) {
                return "Gives +20 points if your word relates to driving a card";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (drivingWords && drivingWords.includes(word.toLowerCase())) {
                        state.additionalPoints += 20;
                    }
                }
            }
        },

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
            description: function(state) {
                return "Words with double 'o' (like 'look') get +15 multiplier.";
            },
            handlers: {
                [GameEvents.ON_CALCULATE_WORD]: function(wordTiles, word) {
                    if (/oo/.test(word)) {
                        state.additionalMultiplier += 15;
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
        }
    
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
      