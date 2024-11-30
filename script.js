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
    dictionary: ["apple", "banana", "orange", "grape", "pear", "melon"], // Sample dictionary words
    tilesById: {},
    tileId: 0,
    placeholder: null,
    draggedTile: null,

    maxDiscards: 3,
    maxWords: 5,
    maxHandLength: 8,
    targetScore: 100,
    currentDiscards: 3,
    currentWords: 5,
    round: 1,
    roundScore: 0
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
            const tile = { letter: item.letter, points: item.points, id: state.tileId++ };
            deck.push(tile);
            state.tilesById[tile.id] = tile;
        }
    });

    return shuffle(deck);
}

// Shuffle the deck
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// Draw tiles from the deck
function drawTiles(num) {
    const drawnTiles = [];
    for (let i = 0; i < num && state.roundDeck.length > 0; i++) {
        drawnTiles.push(state.roundDeck.pop());
    }
    return drawnTiles;
}

function discardTiles() {
    if (state.currentDiscards <= 0) {
        alert('No discards left this round.');
        return;
    }
    const numTilesToDiscard = state.currentWord.length;

    if (numTilesToDiscard === 0) {
        alert('No tiles selected to discard.');
        return;
    }

    state.currentWord = [];

    state.currentDiscards -= 1;

    const newTiles = drawTiles(numTilesToDiscard);
    state.hand = state.hand.concat(newTiles);

    renderHand();
    renderCurrentWord();
    checkIfWordIsValid();
    renderBasicScreen();
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

            renderHand();
            renderCurrentWord();
            checkIfWordIsValid();
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
            if (draggedIndex < targetIndex) {
                currentWordDiv.insertBefore(state.draggedTile, targetTile.nextSibling);
                currentWordDiv.insertBefore(targetTile, state.draggedTile);
            } else {
                currentWordDiv.insertBefore(targetTile, state.draggedTile.nextSibling);
                currentWordDiv.insertBefore(state.draggedTile, targetTile);
            }

            const temp = state.currentWord[draggedIndex];
            state.currentWord[draggedIndex] = state.currentWord[targetIndex];
            state.currentWord[targetIndex] = temp;

            checkIfWordIsValid();
        }
    }
}





function updateCurrentWordOrder() {
    const currentWordDiv = document.getElementById('current-word');
    const tiles = Array.from(currentWordDiv.children);
    state.currentWord = [];
    tiles.forEach(tileDiv => {
        if (tileDiv.classList.contains('placeholder')) return; // Skip placeholder
        const id = parseInt(tileDiv.dataset.id);
        const tile = state.tilesById[id];
        if (tile) {
            state.currentWord.push(tile);
        }
    });
    checkIfWordIsValid();
}


function selectTile(tile) {
    const index = state.hand.indexOf(tile);
    if (index !== -1) {
        state.hand.splice(index, 1);
        state.currentWord.push(tile);
        renderHand();
        renderCurrentWord();
        checkIfWordIsValid();
    }
}

function unselectTile(tile) {
    const index = state.currentWord.indexOf(tile);
    if (index !== -1) {
        state.currentWord.splice(index, 1);
        state.hand.push(tile);
        renderHand();
        renderCurrentWord();
        checkIfWordIsValid();
    }
}

function renderHand() {
    const handDiv = document.getElementById('hand');
    handDiv.innerHTML = '';
    state.hand.forEach(tile => {
        const tileDiv = createTile(tile, 'hand');
        handDiv.appendChild(tileDiv);
    });
}

function renderCurrentWord() {
    const currentWordDiv = document.getElementById('current-word');
    currentWordDiv.innerHTML = '';
    state.currentWord.forEach(tile => {
        const tileDiv = createTile(tile, 'currentWord');
        currentWordDiv.appendChild(tileDiv);
    });
}

// Modified Function: isWildcardWordValid(word)
// Modified Function: getValidWordWithWildcards(word)
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
            // No valid words found by replacing this blank
            return null;
        }
    }

    return helper(word.toLowerCase(), 0);
}

// Changed Function: checkIfWordIsValid()
function checkIfWordIsValid() {
    const word = state.currentWord.map(tile => tile.letter).join('').toLowerCase();
    if (state.dictionary.has(word)) {
        highlightCurrentWord(true);
    } else if (word.includes('_')) {
        const validWord = getValidWordWithWildcards(word);
        if (validWord) {
            highlightCurrentWord(true);
        } else {
            highlightCurrentWord(false);
        }
    } else {
        highlightCurrentWord(false);
    }
}



function highlightCurrentWord(isValid) {
    const currentWordDiv = document.getElementById('current-word');
    if (isValid) {
        currentWordDiv.classList.add('valid-word');
        currentWordDiv.classList.remove('invalid-word');
    } else {
        currentWordDiv.classList.add('invalid-word');
        currentWordDiv.classList.remove('valid-word');
    }
}

function calculateWord(word) {
    let points = word.reduce((sum, tile) => sum + tile.points, 0)
    let mult = word.length


    return points*mult

}

// Changed Function: playWord()
function playWord() {
    const word = state.currentWord.map(tile => tile.letter).join('').toLowerCase();
    let validWord = null;

    if (state.dictionary.has(word)) {
        validWord = word;
    } else if (word.includes('_')) {
        validWord = getValidWordWithWildcards(word);
    }

    if (validWord) {
        const wordScore = calculateWord(state.currentWord);
        state.roundScore += wordScore;
        state.score += wordScore;
        state.currentWords -= 1;

        alert(`Good job, "${validWord}" is a word worth ${wordScore} points!`);

        state.currentWord = [];
        const tilesNeeded = state.maxHandLength - state.hand.length;
        state.hand = state.hand.concat(drawTiles(tilesNeeded));

        // Check win condition
        if (state.roundScore >= state.targetScore) {
            alert(`Congratulations! You've reached the target score of ${state.targetScore} points.`);
            nextRound();
        } else if (state.currentWords <= 0) {
            alert(`Out of words! You didn't reach the target score of ${state.targetScore} points. Game over.`);
            init();
        } else {
            renderBasicScreen();
        }
    } else {
        alert(`Sorry, "${word}" is not a valid word.`);
    }
}



function nextRound() {

    console.log(state.permanentDeck.length)
    console.log(state.roundDeck.length)
    state.round += 1;
    state.targetScore += 5;
    state.currentDiscards = state.maxDiscards;
    state.currentWords = state.maxWords;
    state.roundScore = 0;
    newDeck = shuffle(state.permanentDeck)
    state.roundDeck = [...newDeck];
    state.hand = drawTiles(state.maxHandLength);
    state.currentWord = [];

    renderBasicScreen();
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

    const roundDiv = createTextDiv("Round: " + state.round, 'top-row-stats-div')
    const totalScoreDiv = createTextDiv("Total Score: " + state.score, 'top-row-stats-div')
    const roundScoreDiv = createTextDiv("Round Score: " + state.roundScore + "/" + state.targetScore, 'top-row-stats-div')
    const wordsDiv = createTextDiv(state.currentWords + " words", 'top-row-stats-div')
    const discardsDiv = createTextDiv(state.currentDiscards + " discards", 'top-row-stats-div')
    const tilesDiv = createTextDiv(state.roundDeck.length + "/" + state.permanentDeck.length, 'top-row-stats-div')

    scoreDiv.append(roundDiv, totalScoreDiv, roundScoreDiv, wordsDiv, discardsDiv, tilesDiv)
    scoreDiv.id = 'score';

    return scoreDiv
}



function renderBasicScreen() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';


    const scoreDiv = renderStatsDiv()
    appDiv.appendChild(scoreDiv);

    const currentWordDiv = document.createElement('div');
    currentWordDiv.id = 'current-word';
    appDiv.appendChild(currentWordDiv);

    const handDiv = document.createElement('div');
    handDiv.id = 'hand';
    appDiv.appendChild(handDiv);

    // Create a container for the buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'buttons';
    appDiv.appendChild(buttonsDiv);

    const playWordButton = document.createElement('button');
    playWordButton.id = 'play-word-button';
    playWordButton.textContent = 'Play Word';
    playWordButton.addEventListener('click', playWord);
    buttonsDiv.appendChild(playWordButton);

    const discardButton = document.createElement('button');
    discardButton.id = 'discard-button';
    discardButton.textContent = 'Discard';
    discardButton.addEventListener('click', discardTiles);
    buttonsDiv.appendChild(discardButton);

    renderHand();
    renderCurrentWord();
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
        state.maxWords = 5;
        state.targetScore = 100;
        state.currentDiscards = state.maxDiscards;
        state.currentWords = state.maxWords;
        state.round = 1;

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