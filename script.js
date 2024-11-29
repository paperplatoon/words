let state = {
    deck: [],
    hand: [],
    currentWord: [],
    score: 0,
    dictionary: ["apple", "banana", "orange", "grape", "pear", "melon"], // Sample dictionary words
    tilesById: {},
    tileId: 0,
    placeholder: null,
    draggedTile: null
};
// Initialize the deck with letters and points
function initializeDeck() {
    const letters = [
        { letter: 'A', count: 5, points: 1 },
        { letter: 'B', count: 1, points: 3 },
        { letter: 'C', count: 1, points: 3 },
        { letter: 'D', count: 2, points: 2 },
        { letter: 'E', count: 6, points: 1 },
        { letter: 'F', count: 1, points: 4 },
        { letter: 'G', count: 1, points: 2 },
        { letter: 'H', count: 1, points: 4 },
        { letter: 'I', count: 5, points: 1 },
        { letter: 'J', count: 1, points: 8 },
        { letter: 'K', count: 1, points: 5 },
        { letter: 'L', count: 3, points: 1 },
        { letter: 'M', count: 2, points: 3 },
        { letter: 'N', count: 4, points: 1 },
        { letter: 'O', count: 5, points: 1 },
        { letter: 'P', count: 1, points: 3 },
        { letter: 'R', count: 3, points: 1 },
        { letter: 'S', count: 3, points: 1 },
        { letter: 'T', count: 4, points: 1 },
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
    for (let i = 0; i < num && state.deck.length > 0; i++) {
        drawnTiles.push(state.deck.pop());
    }
    return drawnTiles;
}

function discardTiles() {
    const numTilesToDiscard = state.currentWord.length;

    if (numTilesToDiscard === 0) {
        alert('No tiles selected to discard.');
        return;
    }

    // Remove tiles in currentWord from the game (discard them)
    state.currentWord = [];

    // Draw new tiles from the deck
    const newTiles = drawTiles(numTilesToDiscard);
    state.hand = state.hand.concat(newTiles);

    renderHand();
    renderCurrentWord();
    checkIfWordIsValid();
}


// Create a tile div
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
        tileDiv.addEventListener('click', () => unselectTile(tile));
    }

    return tileDiv;
}


let draggedTile = null;

function dragStart(event) {
    state.draggedTile = event.target;
    state.placeholder = document.createElement('div');
    state.placeholder.classList.add('placeholder');
    event.dataTransfer.setData('text/plain', null);

    state.draggedTile.addEventListener('dragend', dragEnd);
}

function dragEnd(event) {
    if (state.placeholder && state.placeholder.parentElement) {
        state.placeholder.parentElement.removeChild(state.placeholder);
    }
    state.draggedTile.removeEventListener('dragend', dragEnd);
    state.draggedTile = null;
    state.placeholder = null;
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    if (event.target.classList.contains('tile') && event.target !== draggedTile) {
        const currentWordDiv = document.getElementById('current-word');
        const tiles = Array.from(currentWordDiv.children);
        const draggedIndex = tiles.indexOf(draggedTile);
        const targetIndex = tiles.indexOf(event.target);
        if (draggedIndex > targetIndex) {
            currentWordDiv.insertBefore(draggedTile, event.target);
        } else {
            currentWordDiv.insertBefore(draggedTile, event.target.nextSibling);
        }
        updateCurrentWordOrder();
    }
}

function currentWordDragOver(event) {
    event.preventDefault();

    const currentWordDiv = event.currentTarget;
    const rect = currentWordDiv.getBoundingClientRect();
    const x = event.clientX - rect.left;

    let index = 0;
    let found = false;

    const tiles = Array.from(currentWordDiv.children);
    tiles.splice(tiles.indexOf(state.placeholder), 1); // Remove placeholder from tiles array if present

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        if (tile !== state.placeholder) {
            const tileRect = tile.getBoundingClientRect();
            const tileX = tile.offsetLeft + tile.offsetWidth / 2;
            if (x < tileX) {
                index = i;
                found = true;
                break;
            }
        }
    }

    if (!found) {
        index = tiles.length;
    }

    if (state.placeholder && state.placeholder.parentElement) {
        state.placeholder.parentElement.removeChild(state.placeholder);
    }

    currentWordDiv.insertBefore(state.placeholder, currentWordDiv.children[index]);
}

function currentWordDragLeave(event) {
    if (state.placeholder && state.placeholder.parentElement) {
        state.placeholder.parentElement.removeChild(state.placeholder);
    }
}

function currentWordDrop(event) {
    event.preventDefault();

    if (state.placeholder && state.placeholder.parentElement) {
        state.placeholder.parentElement.replaceChild(state.draggedTile, state.placeholder);
    } else {
        event.currentTarget.appendChild(state.draggedTile);
    }

    updateCurrentWordOrder();
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

function checkIfWordIsValid() {
    const word = state.currentWord.map(tile => tile.letter).join('').toLowerCase();
    if (state.dictionary.has(word)) {
        highlightCurrentWord(true);
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

function playWord() {
    const word = state.currentWord.map(tile => tile.letter).join('').toLowerCase();
    if (state.dictionary.has(word)) {
        alert(`Good job, "${word}" is a word!`);
        const wordScore = state.currentWord.reduce((sum, tile) => sum + tile.points, 0);
        state.score += wordScore;
        state.currentWord = [];
        const tilesNeeded = 7 - state.hand.length;
        state.hand = state.hand.concat(drawTiles(tilesNeeded));
        renderBasicScreen();
    } else {
        alert(`Sorry, "${word}" is not a valid word.`);
    }
}

function renderBasicScreen() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '';

    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'score';
    scoreDiv.textContent = `Score: ${state.score}`;
    appDiv.appendChild(scoreDiv);

    const currentWordDiv = document.createElement('div');
    currentWordDiv.id = 'current-word';
    currentWordDiv.addEventListener('dragover', currentWordDragOver);
    currentWordDiv.addEventListener('dragleave', currentWordDragLeave);
    currentWordDiv.addEventListener('drop', currentWordDrop);
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

    // Added Discard Button
    const discardButton = document.createElement('button');
    discardButton.id = 'discard-button';
    discardButton.textContent = 'Discard';
    discardButton.addEventListener('click', discardTiles);
    buttonsDiv.appendChild(discardButton);

    renderHand();
    renderCurrentWord();
}

function loadDictionaryFromFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const wordsArray = text.split('\n').map(word => word.trim().toLowerCase());
        state.dictionary = new Set(wordsArray);
        callback();
    };
    reader.onerror = function(error) {
        console.error('Error reading word list:', error);
        state.dictionary = new Set(); // Use an empty set to prevent errors
        callback();
    };
    reader.readAsText(file);
}



function init() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = '<p>Please select the dictionary file to load.</p>';

    const dictionaryInput = document.createElement('input');
    dictionaryInput.type = 'file';
    dictionaryInput.accept = '.txt';
    dictionaryInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            loadDictionaryFromFile(file, () => {
                state.deck = initializeDeck();
                state.hand = drawTiles(7);
                state.currentWord = [];
                state.score = 0;

                renderBasicScreen();
            });
        } else {
            console.error('No file selected.');
        }
    });
    appDiv.appendChild(dictionaryInput);
}



window.onload = init;


























































const letters = [
    { letter: 'A', count: 6, points: 1 },
    { letter: 'B', count: 1, points: 3 },
    { letter: 'C', count: 1, points: 3 },
    { letter: 'D', count: 2, points: 2 },
    { letter: 'E', count: 8, points: 1 },
    { letter: 'F', count: 1, points: 4 },
    { letter: 'G', count: 2, points: 2 },
    { letter: 'H', count: 1, points: 4 },
    { letter: 'I', count: 5, points: 1 },
    { letter: 'J', count: 1, points: 8 },
    { letter: 'K', count: 1, points: 5 },
    { letter: 'L', count: 3, points: 1 },
    { letter: 'M', count: 2, points: 3 },
    { letter: 'N', count: 4, points: 1 },
    { letter: 'O', count: 6, points: 1 },
    { letter: 'P', count: 1, points: 3 },
    { letter: 'Q', count: 1, points: 10 },
    { letter: 'R', count: 3, points: 1 },
    { letter: 'S', count: 3, points: 1 },
    { letter: 'T', count: 4, points: 1 },
    { letter: 'U', count: 2, points: 1 },
    { letter: 'V', count: 1, points: 4 },
    { letter: 'W', count: 1, points: 4 },
    { letter: 'X', count: 1, points: 8 },
    { letter: 'Y', count: 1, points: 4 },
    { letter: 'Z', count: 1, points: 10 },
    { letter: '_', count: 2, points: 0 } // Blanks
];