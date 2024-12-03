///     cd Documents/Javascript-Games/scrabble
// start local server with      python3 -m http.server 8000   


let state = {
    deck: [],
    roundDeck: [],
    roundDiscard: [],
    permanentDeck: [],
    hand: [],
    currentWord: [],
    score: 0,

    dictionary: ["apple", "banana",],
    tilesById: {},
    tileId: 0,
    placeholder: null,
    draggedTile: null,
    validWord: false,

    discardsLeft: 3,
    maxDiscards: 3,

    maxWords: 3,
    wordsLeft: 3,
    maxHandLength: 7,
    
    drawsLeft: 2,
    maxDraws: 2,
    numTilesDrawn: 3,

    round: 1,
    roundScore: 0,
    currentRelics: [],
    playedWords: {},
    targetScore: 60,

    additionalMultiplier: 0,
    additionalStatePoints: 0,

    currentScreen: 'basic-screen',
};
// Initialize the deck with letters and points
function initializeDeck() {
    const letters = [
        { letter: 'A', count: 4, points: 1 },
        { letter: 'B', count: 1, points: 3 },
        { letter: 'C', count: 1, points: 3 },
        { letter: 'D', count: 1, points: 2 },
        { letter: 'E', count: 4, points: 1 },
        { letter: 'F', count: 1, points: 4 },
        { letter: 'G', count: 2, points: 2 },
        { letter: 'H', count: 1, points: 4 },
        { letter: 'I', count: 3, points: 1 },
        { letter: 'J', count: 1, points: 8 },
        { letter: 'K', count: 1, points: 5 },
        { letter: 'L', count: 2, points: 1 },
        { letter: 'M', count: 1, points: 3 },
        { letter: 'N', count: 2, points: 1 },
        { letter: 'O', count: 3, points: 1 },
        { letter: 'P', count: 1, points: 3 },
        { letter: 'R', count: 2, points: 1 },
        { letter: 'S', count: 2, points: 1 },
        { letter: 'T', count: 2, points: 1 },
        { letter: 'U', count: 2, points: 1 },
        { letter: 'V', count: 1, points: 4 },
        { letter: 'W', count: 1, points: 4 },
        { letter: 'X', count: 1, points: 8 },
        { letter: 'Y', count: 1, points: 4 },
        { letter: 'Z', count: 1, points: 10 },
        { letter: '_', count: 2, points: 0 } // Blanks
    ];

    let deck = [];

    letters.forEach(item => {
        for (let i = 0; i < item.count; i++) {
            const tile = { 
                letter: item.letter, 
                points: item.points, 
                additionalPoints: 0,
                id: state.tileId++ };
            deck.push(tile);
            state.tilesById[tile.id] = tile;
        }
    });

    return shuffle(deck);
}

var GameEvents = {
    ON_WORD_PLAY: 'onWordPlay',
    ON_DISCARD: 'onDiscard',
    ON_CALCULATE_WORD: 'onCalculateWord',
    ON_RELIC_ACQUIRED: 'onRelicAcquired',
    // Add more events as needed
};

function dispatchEvent(eventName, ...args) {
    state.currentRelics.forEach(relic => {
        if (relic.handlers && typeof relic.handlers[eventName] === 'function') {
            relic.handlers[eventName](...args);
        }
    });
}

// Shuffle the deck
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function shuffleHand() {
    let newArrayOrder = shuffle([...state.hand])
    state.hand = newArrayOrder
    renderCurrentScreen()
}

// Draw tiles from the deck
function drawTiles(num) {
    const drawnTiles = [];
    for (let i = 0; i < num && state.roundDeck.length > 0; i++) {
        drawnTiles.push(state.roundDeck.pop());
    }
    return drawnTiles;
}

function drawThreeTiles() {
    const drawnTiles = [];
    for (let i = 0; i < state.numTilesDrawn && state.roundDeck.length > 0; i++) {
        drawnTiles.push(state.roundDeck.pop());
    }

    if (state.drawsLeft > 0) {
        state.drawsLeft -= 1;
    }
    state.hand = state.hand.concat(drawnTiles);
    renderCurrentScreen()
}

function discardTiles() {
    if (state.discardsLeft <= 0) {
        alert('No discards left this round.');
        return;
    }
    const numTilesToDiscard = state.currentWord.length;

    if (numTilesToDiscard === 0) {
        alert('No tiles selected to discard.');
        return;
    }
    dispatchEvent(GameEvents.ON_DISCARD, state.currentWord);

    state.currentWord = [];

    state.discardsLeft -= 1;

    const newTiles = drawTiles(numTilesToDiscard);
    state.hand = state.hand.concat(newTiles);

    renderCurrentScreen()
}


function createTile(tile, location) {
    const tileDiv = document.createElement('div');
    tileDiv.classList.add('tile');
    tileDiv.textContent = tile.letter;
    tileDiv.dataset.id = tile.id;

    const pointsDiv = document.createElement('div');
    pointsDiv.classList.add('points');
    pointsDiv.textContent = tile.points;

    tileDiv.appendChild(pointsDiv);

    if (location === 'hand') {
        tileDiv.addEventListener('click', () => selectTile(tile));
    } else if (location === 'currentWord') {
        tileDiv.setAttribute('draggable', true);
        tileDiv.addEventListener('dragstart', dragStart);
        tileDiv.addEventListener('dragover', dragOver);
        tileDiv.addEventListener('drop', drop);

        tileDiv.addEventListener('click', () => {
            const index = state.currentWord.findIndex(t => t.id === tile.id);
            if (index !== -1) {
                state.currentWord.splice(index, 1);
            }
            state.hand.push(tile);

            renderCurrentScreen()
        });
    }

    return tileDiv;
}

function dragStart(event) {
    state.draggedTile = event.target;
    event.dataTransfer.setData('text/plain', null);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const targetTile = event.target;

    if (targetTile.classList.contains('tile') && targetTile !== state.draggedTile) {
        const currentWordDiv = document.getElementById('current-word');
        const tiles = Array.from(currentWordDiv.children);

        const draggedIndex = tiles.indexOf(state.draggedTile);
        const targetIndex = tiles.indexOf(targetTile);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            currentWordDiv.removeChild(state.draggedTile);

            if (draggedIndex < targetIndex) {
                currentWordDiv.insertBefore(state.draggedTile, targetTile.nextSibling);
            } else {
                currentWordDiv.insertBefore(state.draggedTile, targetTile);
            }

            updateCurrentWordOrder();
        }
    }
}

function updateCurrentWordOrder() {
    const currentWordDiv = document.getElementById('current-word');
    const tiles = Array.from(currentWordDiv.children);
    state.currentWord = [];
    tiles.forEach(tileDiv => {
        if (tileDiv.classList.contains('placeholder')) return;
        const id = parseInt(tileDiv.dataset.id);
        const tile = state.tilesById[id];
        if (tile) {
            state.currentWord.push(tile);
        }
    });
    renderCurrentScreen()
}



function selectTile(tile) {
    const index = state.hand.indexOf(tile);
    if (index !== -1) {
        state.hand.splice(index, 1);
        state.currentWord.push(tile);
        renderCurrentScreen()
    }
}

function unselectTile(tile) {
    const index = state.currentWord.indexOf(tile);
    if (index !== -1) {
        state.currentWord.splice(index, 1);
        state.hand.push(tile);
        renderCurrentScreen()
    }
}

function renderHandDiv() {
    const handDiv = document.createElement('div');
    handDiv.id = "hand"
    state.hand.forEach(tile => {
        const tileDiv = createTile(tile, 'hand');
        handDiv.appendChild(tileDiv);
    });

    return handDiv
}

function renderCurrentWord() {
    const currentWordDiv = document.createElement('div');
    currentWordDiv.id = "current-word"
    state.currentWord.forEach(tile => {
        const tileDiv = createTile(tile, 'currentWord');
        currentWordDiv.appendChild(tileDiv);
    });
    return currentWordDiv
}

function getValidWordWithWildcards(word) {
    const letters = 'abcdefghijklmnopqrstuvwxyz';

    function helper(currentWord, index) {
        if (index >= currentWord.length) {
            // Base case: reached the end of the word
            if (state.dictionary.has(currentWord)) {
                return currentWord;
            } else {
                return null;
            }
        }

        if (currentWord[index] !== '_') {
            // If current character is not a blank, move to next character
            return helper(currentWord, index + 1);
        } else {
            // If current character is a blank, try replacing it with all letters
            for (let i = 0; i < letters.length; i++) {
                const letter = letters[i];
                const newWordArray = currentWord.split('');
                newWordArray[index] = letter;
                const newWord = newWordArray.join('');
                const result = helper(newWord, index + 1);
                if (result) {
                    // Found a valid word
                    return result;
                }
            }
            return null;
        }
    }

    return helper(word.toLowerCase(), 0);
}

function checkIfWordIsValid() {
    const word = state.currentWord.map(tile => tile.letter).join('').toLowerCase();
    let boolValue = false
    if (state.dictionary.has(word) && state.currentWord.length > 1) {
        boolValue = true
    } else if (word.includes('_')) {
        const validWord = getValidWordWithWildcards(word);
        if (validWord) {
            boolValue = true
        }
    }
    return boolValue
}


function calculateWord(wordTiles, validWord) {
    state.additionalMultiplier = 0;
    state.additionalStatePoints = 0;
    state.currentWord.forEach(tile => {
        tile.additionalPoints = 0;
    });

    if (validWord) {
        dispatchEvent(GameEvents.ON_CALCULATE_WORD, wordTiles, validWord);
    }

    let points = wordTiles.reduce((sum, tile) => sum + tile.points + (tile.additionalPoints || 0), 0) + state.additionalStatePoints;
    let mult = wordTiles.length;

    mult += state.additionalMultiplier;

    return [points, mult];
}




function playWord() {
    const wordTiles = state.currentWord;
    const word = wordTiles.map(tile => tile.letter).join('').toLowerCase();
    let validWord = null;

    if (state.dictionary.has(word)) {
        validWord = word;
    } else if (word.includes('_')) {
        validWord = getValidWordWithWildcards(word);
    }

    if (validWord && state.currentWord.length > 1) { // Ensure word length > 1
        
        const scoreArray = calculateWord(wordTiles, validWord);
        const wordScore = scoreArray[0] * (scoreArray[1]);
        state.roundScore += wordScore;
        state.score += wordScore;
        state.wordsLeft -= 1;

        if (state.playedWords[validWord]) {
            state.playedWords[validWord] += 1;
        } else {
            state.playedWords[validWord] = 1;
        }

        dispatchEvent(GameEvents.ON_WORD_PLAY, wordTiles, validWord);

        alert(`Good job, "${validWord}" is a word worth ${wordScore} points!`);

        state.currentWord = [];
        const tilesNeeded = state.maxHandLength - state.hand.length;
        state.hand = state.hand.concat(drawTiles(tilesNeeded));

        // Check win condition
        if (state.roundScore >= state.targetScore) {
            alert(`Congratulations! You've reached the target score of ${state.targetScore} points.`);
            if (state.round % 2 == 1) {
                chooseRelic();
            } else {
                chooseTilesToRemove();
            }
            
        } else if (state.wordsLeft <= 0) {
            alert(`Out of words! You didn't reach the target score of ${state.targetScore} points. Game over.`);
            init();
        } else {
            renderBasicScreen();
        }
    } else {
        alert(`Sorry, "${word}" is not a valid word or too short.`);
    }
}


function chooseTile() {
    state.currentScreen = 'choosing-new-tile';
    renderCurrentScreen();
}

function chooseTilesToRemove() {
    state.currentScreen = 'removing-tiles';
    renderCurrentScreen();
}

function chooseRelic() {
    state.currentScreen = 'choosing-new-relic';
    renderCurrentScreen();
}

function nextRoundActual() {
    state.additionalMultiplier = 0; 
    state.additionalStatePoints = 0;  
    state.permanentDeck.forEach(tile => {
        tile.additionalPoints = 0;
    });
    state.currentScreen = 'basic-screen';
    state.round += 1;
    state.targetScore += 20;
    state.discardsLeft = state.maxDiscards;
    state.wordsLeft = state.maxWords;
    state.drawsLeft +=1
    state.roundScore = 0;
    state.roundDeck = shuffle([...state.permanentDeck]);
    state.hand = drawTiles(state.maxHandLength);
    state.currentWord = [];

    renderCurrentScreen();
}

function createTextDiv(string=false, className=false) {
    const newDiv = document.createElement('div');
    if (string) {
        const newText = document.createElement('p');
        newText.textContent = string
        newDiv.append(newText)
    }
    if (className) {
        newDiv.classList.add(className)
    }
    return newDiv
}

function renderStatsDiv() {
    const scoreDiv = document.createElement('div');

    const topRowDiv = createTextDiv(false, "stats-row-div");
    const bottomRowDiv = createTextDiv(false, "stats-row-div");

    const roundDiv = createTextDiv("Round: " + state.round, 'stats-div')
    const totalScoreDiv = createTextDiv("Total Score: " + state.score, 'stats-div')
    const roundScoreDiv = createTextDiv("Round Score: " + state.roundScore + "/" + state.targetScore, 'stats-div')
    const wordsDiv = createTextDiv(state.wordsLeft + " Words left", 'stats-div')
    const discardsDiv = createTextDiv(state.discardsLeft + " Discards left", 'stats-div')
    const drawsDiv = createTextDiv(state.drawsLeft + " Draws left", 'stats-div')
    const tilesDiv = createTextDiv("Tiles left: " + state.roundDeck.length + "/" + state.permanentDeck.length, 'stats-div')

    topRowDiv.append(roundDiv, totalScoreDiv, roundScoreDiv)
    bottomRowDiv.append(wordsDiv, discardsDiv, drawsDiv, tilesDiv)

    let currentWordDiv;

    if (state.currentWord.length > 1 && checkIfWordIsValid()) {
        const validWord = getValidWordWithWildcards(state.currentWord.map(tile => tile.letter).join('').toLowerCase());
        const scoreArray = calculateWord(state.currentWord, validWord);
        currentWordDiv = createTextDiv(scoreArray[0] + " x " + scoreArray[1], 'stats-div')     
    } else {
        currentWordDiv = createTextDiv()
    }
    bottomRowDiv.append(currentWordDiv)

    scoreDiv.append(topRowDiv, bottomRowDiv)
    scoreDiv.id = 'score';

    return scoreDiv
}

function renderButtonsDiv() {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'buttons';

    const playWordButton = document.createElement('div');
    playWordButton.classList.add('default-button');
    playWordButton.textContent = 'Play Word';
    playWordButton.addEventListener('click', playWord);
    buttonsDiv.append(playWordButton)

    const discardButton = document.createElement('div');
    discardButton.classList.add('default-button');
    discardButton.textContent = 'Discard';
    discardButton.addEventListener('click', discardTiles);
    if (state.discardsLeft > 0) {
        buttonsDiv.append(discardButton)
    }

    const drawButton = document.createElement('div');
    drawButton.classList.add('default-button');
    drawButton.textContent = 'Draw ' + state.numTilesDrawn + ' tiles';
    drawButton.addEventListener('click', drawThreeTiles);
    if (state.drawsLeft > 0) {
        buttonsDiv.append(drawButton)
    }

    const shuffleButton = document.createElement('div');
    shuffleButton.classList.add('default-button');
    shuffleButton.textContent = 'Shuffle';
    shuffleButton.addEventListener('click', shuffleHand);
    buttonsDiv.append(shuffleButton);

    return buttonsDiv
}

function renderRelicsDiv() {
    console.log("state current relics is ", state.currentRelics)
    if (state.currentRelics.length === 0) {
        return document.createElement('div'); // Return an empty div if no relics
    }

    const relicsContainer = document.createElement('div');
    relicsContainer.id = 'relics-container';
    relicsContainer.style.display = 'flex';
    relicsContainer.style.flexWrap = 'wrap';
    relicsContainer.style.justifyContent = 'center';
    relicsContainer.style.marginBottom = '10px';

    state.currentRelics.forEach(relic => {
        const relicDiv = document.createElement('div');
        relicDiv.classList.add('relic');
        relicDiv.style.border = '1px solid #ddd';
        relicDiv.style.borderRadius = '5px';
        relicDiv.style.padding = '10px';
        relicDiv.style.margin = '5px';
        relicDiv.style.width = '150px';
        relicDiv.style.textAlign = 'center';
        relicDiv.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.1)';
        relicDiv.style.backgroundColor = '#f9f9f9';

        const relicImage = document.createElement('img');
        relicImage.src = relic.image;
        relicImage.alt = relic.name;
        relicImage.style.width = '100px';
        relicImage.style.height = '100px';
        relicImage.style.objectFit = 'cover';
        relicImage.style.marginBottom = '10px';

        const relicName = document.createElement('h4');
        relicName.textContent = relic.name;
        relicName.style.margin = '5px 0';

        const relicDescription = document.createElement('p');
        relicDescription.textContent = relic.description(state);
        relicDescription.style.fontSize = '12px';
        relicDescription.style.color = '#555';

        relicDiv.appendChild(relicImage);
        relicDiv.appendChild(relicName);
        relicDiv.appendChild(relicDescription);

        relicsContainer.appendChild(relicDiv);
    });

    return relicsContainer;
}


function renderBasicScreen() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const relicsDiv = renderRelicsDiv()


    const scoreDiv = renderStatsDiv()
    const handDiv = renderHandDiv()
    const buttonsDiv = renderButtonsDiv()
    const currentWordDiv = renderCurrentWord()

    appDiv.append(relicsDiv, scoreDiv, currentWordDiv, handDiv, buttonsDiv);
}

function renderCurrentScreen() {
    if (state.currentScreen === 'basic-screen') {
        renderBasicScreen();
    } else if (state.currentScreen === 'choosing-new-tile') {
        renderChoosingNewTileScreen();
    } else if (state.currentScreen === 'choosing-new-relic') {
        renderChoosingNewRelicScreen();
    } else if (state.currentScreen === 'removing-tiles') {
        renderRemovingTilesScreen();
    }
}

function renderChoosingNewTileScreen() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const messageDiv = document.createElement('div');
    messageDiv.textContent = 'Choose a new tile to add to your deck or skip to the next round:';
    appDiv.appendChild(messageDiv);

    // Potential letters to choose from
    const potentialLetters = [
        { letter: 'A', points: 1 },
        { letter: 'B', points: 3 },
        { letter: 'C', points: 3 },
        { letter: 'D', points: 2 },
        { letter: 'E', points: 1 },
        { letter: 'F', points: 4 },
        { letter: 'G', points: 2 },
        { letter: 'H', points: 4 },
        { letter: 'I', points: 1 },
        { letter: 'J', points: 8 },
        { letter: 'K', points: 5 },
        { letter: 'L', points: 1 },
        { letter: 'M', points: 3 },
        { letter: 'N', points: 1 },
        { letter: 'O', points: 1 },
        { letter: 'P', points: 3 },
        { letter: 'R', points: 1 },
        { letter: 'S', points: 1 },
        { letter: 'T', points: 1 },
        { letter: 'U', points: 1 },
        { letter: 'V', points: 4 },
        { letter: 'W', points: 4 },
        { letter: 'X', points: 8 },
        { letter: 'Y', points: 4 },
        { letter: 'Z', points: 10 },
        { letter: '_', points: 0 } // Blanks
    ];

    // Pick 3 random letters
    const availableLetters = potentialLetters.slice();
    const randomLetters = [];
    for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * availableLetters.length);
        const letterObj = availableLetters.splice(index, 1)[0];

        // Add a random number between 1 and 5 to the points
        const additionalPoints = Math.floor(Math.random() * 5) + 1;
        letterObj.points += additionalPoints;

        randomLetters.push(letterObj);
    }

    // Display the letters as clickable elements
    const lettersDiv = document.createElement('div');
    lettersDiv.id = 'letters-choice';

    randomLetters.forEach((letterObj) => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        tileDiv.textContent = letterObj.letter;
        tileDiv.dataset.letter = letterObj.letter;
        tileDiv.dataset.points = letterObj.points;

        const pointsDiv = document.createElement('div');
        pointsDiv.classList.add('points');
        pointsDiv.textContent = letterObj.points;

        tileDiv.appendChild(pointsDiv);

        tileDiv.addEventListener('click', () => {
            // Add the selected letter to the permanent deck
            const newTile = { 
                letter: letterObj.letter, 
                points: letterObj.points, 
                id: state.tileId++ 
            };
            state.permanentDeck.push(newTile);
            state.tilesById[newTile.id] = newTile;

            // Proceed to the next round
            nextRoundActual();
        });

        lettersDiv.appendChild(tileDiv);
    });

    appDiv.appendChild(lettersDiv);

    // Add a "Skip" button
    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip';
    skipButton.addEventListener('click', () => {
        // Proceed to the next round without adding a tile
        nextRoundActual();
    });

    appDiv.appendChild(skipButton);
}

// Implement 'renderChoosingNewRelicScreen' Function
function renderChoosingNewRelicScreen() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const messageDiv = document.createElement('div');
    messageDiv.textContent = 'Choose a relic to add to your collection or skip to the next round:';
    messageDiv.style.marginBottom = '20px';
    appDiv.appendChild(messageDiv);

    // Select 3 random relics from relicsCollection without duplicates
    const availableRelics = relicsCollection.filter(relic => !state.currentRelics.some(r => r.name === relic.name));
    const randomRelics = [];
    const relicsToChoose = Math.min(3, availableRelics.length);
    for (let i = 0; i < relicsToChoose; i++) {
        const index = Math.floor(Math.random() * availableRelics.length);
        const selectedRelic = availableRelics.splice(index, 1)[0];

        // Clone the relic object to avoid modifying the original
        randomRelics.push({ ...selectedRelic });
    }

    // Display the relics as clickable elements
    const relicsDiv = document.createElement('div');
    relicsDiv.id = 'relics-choice';
    relicsDiv.style.display = 'flex';
    relicsDiv.style.justifyContent = 'space-around';
    relicsDiv.style.flexWrap = 'wrap';
    relicsDiv.style.marginBottom = '20px';

    randomRelics.forEach(relic => {
        const relicDiv = document.createElement('div');
        relicDiv.classList.add('relic-choice');
        relicDiv.style.border = '1px solid #ddd';
        relicDiv.style.borderRadius = '5px';
        relicDiv.style.padding = '10px';
        relicDiv.style.width = '150px';
        relicDiv.style.textAlign = 'center';
        relicDiv.style.cursor = 'pointer';
        relicDiv.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.1)';
        relicDiv.style.margin = '10px';
        relicDiv.style.backgroundColor = '#fff';

        const relicImage = document.createElement('img');
        relicImage.src = relic.image;
        relicImage.alt = relic.name;
        relicImage.style.width = '100px';
        relicImage.style.height = '100px';
        relicImage.style.objectFit = 'cover';
        relicImage.style.marginBottom = '10px';

        const relicName = document.createElement('h4');
        relicName.textContent = relic.name;
        relicName.style.margin = '5px 0';

        const relicDescription = document.createElement('p');
        relicDescription.textContent = relic.description(state);
        relicDescription.style.fontSize = '12px';
        relicDescription.style.color = '#555';

        relicDiv.appendChild(relicImage);
        relicDiv.appendChild(relicName);
        relicDiv.appendChild(relicDescription);

        // Add click event listener to add relic and switch screen
        relicDiv.addEventListener('click', () => {
            // Add relic to currentRelics
            
            state.currentRelics.push(relic);
            dispatchEvent(GameEvents.ON_RELIC_ACQUIRED, relic);
            alert(`You have acquired the relic: ${relic.name}!`);

            // Proceed to the next round
            chooseTilesToRemove()
        });

        relicsDiv.appendChild(relicDiv);
    });

    appDiv.appendChild(relicsDiv);

    // Add a "Skip" button
    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip';
    skipButton.classList.add("default-button")
    skipButton.addEventListener('click', () => {
        // Proceed to the next round without adding any relic
        chooseTile();
    });

    appDiv.appendChild(skipButton);
}

function renderRemovingTilesScreen() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const messageDiv = document.createElement('div');
    messageDiv.textContent = 'Choose up to 3 tiles to remove from your deck:';
    messageDiv.classList.add('message');
    appDiv.appendChild(messageDiv);

    // Select 3 random tiles from the permanent deck
    const availableTiles = state.permanentDeck.slice();
    const tilesToShow = [];
    const numTiles = Math.min(4, availableTiles.length);
    for (let i = 0; i < numTiles; i++) {
        const index = Math.floor(Math.random() * availableTiles.length);
        tilesToShow.push(availableTiles.splice(index, 1)[0]);
    }

    // Reset selectedTiles
    state.selectedTiles = [];

    // Display the tiles as clickable elements
    const tilesDiv = document.createElement('div');
    tilesDiv.id = 'tiles-choice';
    tilesDiv.classList.add('tiles-container');

    tilesToShow.forEach(tile => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        tileDiv.dataset.tileId = tile.id;

        const letterSpan = document.createElement('span');
        letterSpan.classList.add('letter');
        letterSpan.textContent = tile.letter;

        const pointsDiv = document.createElement('div');
        pointsDiv.classList.add('points');
        pointsDiv.textContent = tile.points;

        tileDiv.appendChild(letterSpan);
        tileDiv.appendChild(pointsDiv);

        tileDiv.addEventListener('click', () => {
            if (state.selectedTiles.includes(tile.id)) {
                // Deselect the tile
                state.selectedTiles = state.selectedTiles.filter(id => id !== tile.id);
                tileDiv.classList.remove('selected');
            } else {
                if (state.selectedTiles.length < 3) {
                    // Select the tile
                    state.selectedTiles.push(tile.id);
                    tileDiv.classList.add('selected');
                }
            }
            updateSelectedTiles();
        });

        tilesDiv.appendChild(tileDiv);
    });

    appDiv.appendChild(tilesDiv);

    // Selected tiles div
    const selectedDiv = document.createElement('div');
    selectedDiv.id = 'selected-tiles';
    selectedDiv.textContent = 'Selected Tiles: 0';
    selectedDiv.classList.add('selected-info');
    appDiv.appendChild(selectedDiv);

    // Buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-container');

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.disabled = true;
    removeButton.classList.add('remove-button');

    removeButton.addEventListener('click', () => {
        if (state.selectedTiles.length > 0) {
            state.selectedTiles.forEach(tileId => {
                const index = state.permanentDeck.findIndex(t => t.id === tileId);
                if (index > -1) {
                    state.permanentDeck.splice(index, 1);
                }
            });
            state.selectedTiles = [];
            // Proceed to choosing new tile screen
            state.currentScreen = 'choosing-new-tile';
            renderCurrentScreen();
        }
    });

    const skipButton = document.createElement('button');
    skipButton.textContent = 'Skip';
    skipButton.classList.add('skip-button');

    skipButton.addEventListener('click', () => {
        // Proceed to choosing new tile screen without removing
        state.currentScreen = 'choosing-new-tile';
        renderCurrentScreen();
    });

    buttonsDiv.appendChild(removeButton);
    buttonsDiv.appendChild(skipButton);
    appDiv.appendChild(buttonsDiv);

    // Function to update selected tiles display and button state
    function updateSelectedTiles() {
        selectedDiv.textContent = `Selected Tiles: ${state.selectedTiles.length}`;
        removeButton.disabled = state.selectedTiles.length === 0;
    }
}




function loadDictionary(callback) {
    fetch('words.txt')
        .then(response => response.text())
        .then(text => {
            const wordsArray = text.split('\n').map(word => word.trim().toLowerCase());
            state.dictionary = new Set(wordsArray);
            callback();
        })
        .catch(error => {
            console.error('Error loading word list:', error);
            state.dictionary = new Set(); // Use an empty set to prevent errors
            callback();
        });
}

function init() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '<p>Loading dictionary, please wait...</p>';

    loadDictionary(() => {
        newDeck = initializeDeck()
        state.deck = newDeck;
        state.roundDeck = [...newDeck];
        state.permanentDeck = [...newDeck];
        state.hand = drawTiles(state.maxHandLength);
        state.currentWord = [];
        state.score = 0;
        state.roundScore = 0;
        state.maxDiscards = 3;
        state.discardsLeft = state.maxDiscards;
        state.wordsLeft = state.maxWords;
        state.playedWords = {}
        state.round = 1;
        state.currentScreen = 'basic-screen';

        renderBasicScreen();
    });
}


window.onload = init;


























































// const letters = [
//     { letter: 'A', count: 6, points: 1 },
//     { letter: 'B', count: 1, points: 3 },
//     { letter: 'C', count: 1, points: 3 },
//     { letter: 'D', count: 2, points: 2 },
//     { letter: 'E', count: 8, points: 1 },
//     { letter: 'F', count: 1, points: 4 },
//     { letter: 'G', count: 2, points: 2 },
//     { letter: 'H', count: 1, points: 4 },
//     { letter: 'I', count: 5, points: 1 },
//     { letter: 'J', count: 1, points: 8 },
//     { letter: 'K', count: 1, points: 5 },
//     { letter: 'L', count: 3, points: 1 },
//     { letter: 'M', count: 2, points: 3 },
//     { letter: 'N', count: 4, points: 1 },
//     { letter: 'O', count: 6, points: 1 },
//     { letter: 'P', count: 1, points: 3 },
//     { letter: 'Q', count: 1, points: 10 },
//     { letter: 'R', count: 3, points: 1 },
//     { letter: 'S', count: 3, points: 1 },
//     { letter: 'T', count: 4, points: 1 },
//     { letter: 'U', count: 2, points: 1 },
//     { letter: 'V', count: 1, points: 4 },
//     { letter: 'W', count: 1, points: 4 },
//     { letter: 'X', count: 1, points: 8 },
//     { letter: 'Y', count: 1, points: 4 },
//     { letter: 'Z', count: 1, points: 10 },
//     { letter: '_', count: 2, points: 0 } // Blanks
// ];