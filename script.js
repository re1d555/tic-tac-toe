function gameBoard() {
    const makeBoard = () => {
        const rows = 3;
        const columns = 3;
        const board = [];
        for (i = 0; i < rows; i++) {
            board[i] = [];
            for (j = 0; j < columns; j++) {
                board[i].push(' ');
            }
        }
        return board;
    }

    let board = makeBoard();
    const reset = makeBoard(); // save initial array for game reset

    const getBoard = () => board; 

    const resetBoard = () => {
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                board[i][j] = reset[i][j];
            }
        }
    }

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

    return {resetBoard, printBoard, makeMark, winCon, getBoard};
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
            notSwitch: [], // check of choosing wrong cell
            winScore: 0, // all games one player win score
            tieScore: 0
        },
        {
            name: playerTwo,
            marker: 'O',
            combination: [],
            result: [],
            notSwitch: [],
            winScore: 0,
            tieScore: 0
        }
    ]

    const resetPlayers = () => {
        for (i = 0; i < players.length; i++) {
            players[i].combination.length = 0;
            players[i].result.length = 0;
            players[i].notSwitch.length = 0;
        }
    }

    const hardResetPlayers = () => {
        resetPlayers();

        players.forEach(player => {
            ['winScore', 'tieScore'].forEach(key => {
                if (key in player) player[key] = 0;
            })
        })
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

    const roundsCount = () => {
        return players.reduce((acc, player) => {
            const values = Object.values(player);
            const lastTwo = values.slice(-2);
            return acc + lastTwo[0] + lastTwo[1];
        }, 1);
    }

    const getCurrentGameActivePlayer = () => {
        let sum = roundsCount();
        sum % 2 === 0 ? activePlayer = players[1] : activePlayer = players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn`);
    }

    const playRound = (markerOnBoard) => {
        board.makeMark(markerOnBoard, activePlayer.marker, activePlayer.combination, activePlayer.notSwitch);

        board.winCon(activePlayer.combination, activePlayer.result);

        if (activePlayer.result[0] != undefined) {
            if (activePlayer.result[0] === 1) activePlayer.winScore++;
            if (activePlayer.result[0] === 2) activePlayer.tieScore++;
            board.resetBoard();
            resetPlayers();
        }
        switchPlayerTurn();
        printNewRound();
    }

    return {getNames, playRound, getBoard: board.getBoard, resetBoard: board.resetBoard, resetPlayers, getActivePlayer, players, getCurrentGameActivePlayer, hardResetPlayers};
}

const screenController = () => {
    const game = gameFlow();
    const board = game.getBoard();

    const startBtn = document.querySelector('.startBtn');
    const startDiv = document.querySelector('.startDiv');
    const gameField = document.querySelector('.game');
    const firstName = document.querySelector('.firstNameInput');
    const secondName = document.querySelector('.secondNameInput');

    const updateScreen = () => {
        gameField.textContent = ''; // clear screen before update

        const activePlayer = game.getActivePlayer();

        const resultsDiv = document.createElement('h3');
        resultsDiv.textContent = `${game.players[0].name}'s score: ${game.players[0].winScore}; ${game.players[1].name}'s score: ${game.players[1].winScore}; TIES: ${game.players[0].tieScore + game.players[1].tieScore};`;
        gameField.appendChild(resultsDiv);

        const playerDiv = document.createElement('h3');
        playerDiv.textContent = `${activePlayer.name}'s turn!`;
        gameField.appendChild(playerDiv);

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset current game';
        gameField.appendChild(resetBtn);
        resetBtn.classList.add('reset');
        if (game.players[0].combination.length === 0 && game.players[1].combination.length === 0) resetBtn.disabled = true;

        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart';
        gameField.appendChild(restartBtn);
        restartBtn.classList.add('restart');

        const boardDiv = document.createElement('div');
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
    }

    const gettingNamesHandler = () => {
        game.getNames(firstName.value, secondName.value);
        startDiv.style.display = 'none';
        gameField.style.display = 'flex';
        updateScreen();
    }

    const gameHandler = (e) => {
        if (!e.target.classList.contains('cell')) return;
        const clickedCell = e.target.id;
        game.playRound(clickedCell);
        updateScreen();
    }

    const resetHandler = (e) => {
        if (!e.target.classList.contains('reset')) return;
        game.resetBoard();
        game.resetPlayers();
        game.getCurrentGameActivePlayer();
        updateScreen();
    }

    const restartHandler = (e) => {
        if (!e.target.classList.contains('restart')) return;
        game.resetBoard();
        game.hardResetPlayers();
        startDiv.style.display = '';
        gameField.style.display = 'none'
    }

    startBtn.addEventListener('click', gettingNamesHandler);
    gameField.addEventListener('click', gameHandler);
    gameField.addEventListener('click', resetHandler);
    gameField.addEventListener('click', restartHandler);
}

screenController();
