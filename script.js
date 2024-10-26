function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
// make 2d array as game board
    for (i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < columns; j++) {
            board[i].push('*');
        }
    }
// make mark in cell from 0 to 8
    const makeMark = (cell, player, combination, notSwitch) => {
        notSwitch.shift(1); 

        let row = Math.floor(cell / 3);
        let col = cell % 3;
// check if already marked
        if (board[row][col] != '*') {
            console.log('Choose another marker!');
            notSwitch.push(1); // prevent players change
            return;
        }
        board[row][col] = player;
// push active player marks for check on win condition
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
            [board[0][0], board[1][1], board[2][2]]] // [0, 4, 8] || [2, 4, 6]
    
        for (i = 0; i < winCombs.length; i++) {
            if (['XXX', 'OOO'].includes(winCombs[i].join(''))) result.push(1); // push 1 for WIN
        }

        if (combination.length === 5) result.push(2); // push 2 for TIE
    }

    const printBoard = () => {
        console.log(board);
    }

    return {printBoard, makeMark, winCon};
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

    const welcome = () => {
        console.log('Enter player names please (game.getNames(`firstName`, `secondName`))');
    }

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

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn (game.playRound(availableCellOnBoard))`);
    }

    const playRound = (markerOnBoard) => {
        board.makeMark(markerOnBoard, activePlayer.marker, activePlayer.combination, activePlayer.notSwitch);

        board.winCon(activePlayer.combination, activePlayer.result);

        if (activePlayer.result[0] === 1) {
            console.log(`${activePlayer.name} WIN!`);
            board.printBoard();
            return;
        }
        else if (activePlayer.result[0] === 2) {
            console.log('TIE!');
            board.printBoard();
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    welcome();

    return {getNames, playRound};
}

const game = gameFlow();

