// Get all necessary DOM elements
const statusDisplay = document.querySelector('.game--status');
const restartButton = document.querySelector('.game--restart');
const cells = document.querySelectorAll('.cell');

// Game state variables
let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

// Messages to display
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

// Set the initial message
statusDisplay.innerHTML = currentPlayerTurn();

// All possible winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

/**
 * Handles a click on a cell.
 * @param {MouseEvent} clickedCellEvent - The click event.
 */
function handleCellClick(clickedCellEvent) {
    // Get the clicked cell element
    const clickedCell = clickedCellEvent.target;

    // Get the 'data-cell-index' attribute from the clicked cell
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // Check if the cell has already been played or if the game is inactive
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    // If the cell is valid, proceed with the game logic
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

/**
 * Updates the game state and UI for a played cell.
 * @param {HTMLElement} clickedCell - The cell that was clicked.
 * @param {number} clickedCellIndex - The index of the clicked cell.
 */
function handleCellPlayed(clickedCell, clickedCellIndex) {
    // Update the internal game state
    gameState[clickedCellIndex] = currentPlayer;

    // Update the UI to reflect the played move
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase()); // Adds 'x' or 'o' class for styling
}

/**
 * Checks if the game has been won or if it's a draw.
 */
function handleResultValidation() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue; // If any cell in the condition is empty, skip
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition;
            break; // Exit the loop as soon as a win is found
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        // Highlight the winning cells
        winningCombo.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
        return;
    }

    // Check for a draw
    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    // If no one has won and it's not a draw, change the player
    handlePlayerChange();
}

/**
 * Switches the current player and updates the status display.
 */
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

/**
 * Resets the game to its initial state.
 */
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();

    // Clear the UI
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.classList.remove('x', 'o', 'winning-cell');
    });
}

// Add event listeners to the cells and the restart button
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
