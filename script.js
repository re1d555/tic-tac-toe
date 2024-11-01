function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < columns; j++) {
            board[i].push(' ');
        }
    }

    const boardForReset = board; // safe array for reset board
    const getBoardForReset = () => boardForReset; // START HERE
    const getBoard = () => board; 

    const makeMark = (cell, player, combination, notSwitch) => {
        notSwitch.shift(1); 

        let row = Math.floor(cell / 3);
        let col = cell % 3;

        if (board[row][col] != ' ') {
            console.log('Choose another marker!');
            notSwitch.push(1); 
            return;
        }
        board[row][col] = player;

        combination.push(cell);
    }

    const winCon = (combination, result) => {
        const winCombs = [
            [board[0][0], board[0][1], board[0][2]], // [0, 1, 2]
            [board[1][0], board[1][1], board[1][2]], // [3, 4, 5]
            [board[2][0], board[2][1], board[2][2]], // [6, 7, 8]
            [board[0][0], board[1][0], board[2][0]], // [0, 3, 6]
            [board[0][1], board[1][1], board[2][1]], // [1, 4, 7]
            [board[0][2], board[1][2], board[2][2]], // [2, 5, 8]
            [board[0][0], board[1][1], board[2][2]], // [0, 4, 8]
            [board[0][2], board[1][1], board[2][0]]  // [2, 4, 6]
        ]  
    
        for (i = 0; i < winCombs.length; i++) {
            if (['XXX', 'OOO'].includes(winCombs[i].join(''))) result.push(1); // push 1 for WIN
        }

        if (combination.length === 5) result.push(2); // push 2 for TIE
    }

    const printBoard = () => {
        console.log(board);
    }

    return {printBoard, makeMark, winCon, getBoard};
}

function gameFlow() {
    const board = gameBoard();

    let playerOne = '';
    let playerTwo = '';

    const players = [
        {
            name: playerOne,
            marker: 'X',
            combination: [], // sequence of choosing cells
            result: [], // check for WIN or TIE
            notSwitch: [] // check of choosing wrong cell
        },
        {
            name: playerTwo,
            marker: 'O',
            combination: [],
            result: [],
            notSwitch: []
        }
    ]

    const getNames = (firstName, secondName) => {
        players[0].name = firstName;
        players[1].name = secondName;

        printNewRound();
    }

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        if (activePlayer.notSwitch[0] === 1) return;
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn (game.playRound(availableCellOnBoard))`);
    }

    const playRound = (markerOnBoard) => {
        board.makeMark(markerOnBoard, activePlayer.marker, activePlayer.combination, activePlayer.notSwitch);

        board.winCon(activePlayer.combination, activePlayer.result);

        if (activePlayer.result[0] != undefined) return;

        switchPlayerTurn();
        printNewRound();
    }

    return {getNames, playRound, getBoard: board.getBoard, getActivePlayer};
}

const screenController = () => {
    const game = gameFlow();
    const board = game.getBoard();

    const startBtn = document.querySelector('.startBtn');
    const startDiv = document.querySelector('.startDiv');
    const gameField = document.querySelector('.gameField');
    const firstName = document.querySelector('.firstNameInput');
    const secondName = document.querySelector('.secondNameInput');

    const updateScreen = () => {
        gameField.textContent = ''; // clear screen before update

        const activePlayer = game.getActivePlayer();

        const playerDiv = document.createElement('h3');
        playerDiv.textContent = `${activePlayer.name}'s turn!`;
        gameField.appendChild(playerDiv);
        playerDiv.classList.add('player');

        // const resetBtn = document.createElement('button');
        // resetBtn.textContent = 'Reset';
        // gameField.appendChild(resetBtn);
        // resetBtn.classList.add('reset');

        const boardDiv = document.createElement('div') 
        gameField.appendChild(boardDiv);
        boardDiv.classList.add('board');

        let idCounter = 0;
        board.forEach(row => {
            row.forEach((cell) => {
                const cellBtn = document.createElement('button');
                cellBtn.classList.add('cell');
                cellBtn.id = idCounter;
                idCounter++;
                cellBtn.textContent = cell;
                boardDiv.appendChild(cellBtn);
            })
        })

        // if (activePlayer.result[0] != undefined) {
        //     const buttons = document.querySelectorAll('.cell');
        //     buttons.forEach((button) => button.disabled = true);
        // }

        if (activePlayer.result[0] === 1) playerDiv.textContent = `${activePlayer.name} WIN!!!`;
        else if (activePlayer.result[0] === 2) playerDiv.textContent = `IT'S TIE!!!`;
    }

    const gettingNamesHandler = () => {
        game.getNames(firstName.value, secondName.value);
        startDiv.remove();
        updateScreen();
    }

    const gameHandler = (e) => {
        if (!e.target.classList.contains('cell')) return;
        const clickedCell = e.target.id
        game.playRound(clickedCell);
        updateScreen(); 
    }

    // const resetHandler = (e) => {
    //     if (!e.target.classList.contains('reset')) return;
    //     console.log('123');
    //     board = [];
    //     updateScreen(); 
    // }

    startBtn.addEventListener('click', gettingNamesHandler);
    gameField.addEventListener('click', gameHandler);
    // gameField.addEventListener('click', resetHandler);

}

screenController();
