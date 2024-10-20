function gameBoard() {

    const rows = 3;
    const columns = 3;
    const board = [];

    for (i = 0; i < rows; i++) {
        board[i] = [];
        for (j = 0; j < columns; j++) {
            board[i].push('*');
        }
    }

    const makeMark = (cell, player) => {
        
        let row = Math.floor(cell / 3);
        let col = cell % 3;

        if (board[row][col] != '*') return

        board[row][col] = player;
    }

    const printBoard = () => {
        console.log(board);
    }

    return {printBoard, makeMark};
}


function gameFlow() {

    const board = gameBoard();

    let playerOne = '';
    let playerTwo = '';

    const players = [
        {
            name: playerOne,
            marker: 'X'
        },
        {
            name: playerTwo,
            marker: 'O'
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
        activePlayer === players[0] ? activePlayer = players[1] : activePlayer = players[0];
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn (game.playRound(availableNumberOnBoard))`);
    }

    const playRound = (markerOnBoard) => {
        board.makeMark(markerOnBoard, activePlayer.marker);

        switchPlayerTurn();
        printNewRound();
    }

    welcome();

    return {getNames, playRound};
}

const game = gameFlow();

