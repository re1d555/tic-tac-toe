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

    const makeMark = (cell, player, combination) => {
        let row = Math.floor(cell / 3);
        let col = cell % 3;

        if (board[row][col] != '*') {console.log('Choose another marker!'); return} 

        board[row][col] = player;

        combination.push(cell);
    }

    const winnerCombination = (player, combination) => {
        const winCombs = ['012','345','678','036','147','258','048','246'];

        let playerComb = combination.join('');

        for (i = 0; i < winCombs.length; i++) {
            winCombs[i] === playerComb ? console.log(`${player} WIN!`) : console.log(`please continue...`);
        }
    }

    const printBoard = () => {
        console.log(board);
        console.log('Choose from 0 to 8');
    }

    return {printBoard, makeMark, winnerCombination};
}

function gameFlow() {
    const board = gameBoard();

    let playerOne = '';
    let playerTwo = '';

    const players = [
        {
            name: playerOne,
            marker: 'X',
            combination: []
        },
        {
            name: playerTwo,
            marker: 'O',
            combination: []
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
        board.makeMark(markerOnBoard, activePlayer.marker, activePlayer.combination);

        board.winnerCombination(activePlayer.name, activePlayer.combination);

        switchPlayerTurn();
        printNewRound();
    }

    welcome();

    return {getNames, playRound};
}

const game = gameFlow();

