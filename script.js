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
            notSwitch.push(1);
            return;
        }

        board[row][col] = player;
// push active player marks for check on win condition
        combination.push(cell);
    }

    const winCon = (combination, result) => {
        const winCombs = ['012','345','678','036','147','258','048','246'];

        let playerComb = combination.join('');
// if push 1 into result then activePlayer WIN!
        for (i = 0; i < winCombs.length; i++) {
            if (winCombs[i] === playerComb) result.push(1); // HERE BUG
        }
// if push 2 into result then TIE!
        if (combination.length === 5) result.push(2); // HERE BUG
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
            combination: [],
            result: [],
            notSwitch: []
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

    // const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn (game.playRound(availableNumberOnBoard))`);
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

