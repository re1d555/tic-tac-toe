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
            notSwitch.push(1); // prevent from taking already taken cell
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

    return {resetBoard, makeMark, winCon, getBoard};
}

function gameFlow(dialog) {
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
        players.forEach(player => {
            ['combination', 'result', 'notSwitch'].forEach(key => {
                if (key in player) player[key].length = 0;
            })
        })
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

    const playRound = (markerOnBoard) => {
        board.makeMark(markerOnBoard, activePlayer.marker, activePlayer.combination, activePlayer.notSwitch);

        board.winCon(activePlayer.combination, activePlayer.result);
        
        if (activePlayer.result[0] != undefined) {
            if (activePlayer.result[0] === 1) {
                activePlayer.winScore++;
                dialog.showDialog(`${activePlayer.name} Win!`);
            }
            if (activePlayer.result[0] === 2) {
                activePlayer.tieScore++;
                dialog.showDialog(`It's TIE`);
            }
        }
        switchPlayerTurn();
    }

    return {getNames, playRound, getBoard: board.getBoard, resetBoard: board.resetBoard, resetPlayers, getActivePlayer, players, getCurrentGameActivePlayer, hardResetPlayers};
}

const screenController = (() => {
    const dialog = {
        showDialog : (message) => {
            const dialog = document.createElement('dialog');
            document.body.appendChild(dialog)
        
            const textNode = document.createTextNode(message);
            dialog.appendChild(textNode);
            const close = document.createElement('button');
            close.classList.add('gameButton', 'closeDialog');
            close.textContent = 'OK'
            dialog.appendChild(close);
            
            dialog.showModal();
            dialog.style.display = 'flex';

            close.addEventListener('click', () => {
                dialog.close();
                dialog.style.display = 'none';
                game.resetBoard();
                game.resetPlayers();
                updateScreen();
            });
        }
    }

    const game = gameFlow(dialog);
    const board = game.getBoard();
    
    const startBtn = document.querySelector('.startBtn');
    const startDiv = document.querySelector('.startDiv');
    const gameField = document.querySelector('.game');
    const gameUax = document.querySelector('.gameUi')
    const firstName = document.querySelector('.firstNameInput');
    const secondName = document.querySelector('.secondNameInput');
    const logo = document.querySelector('.logo');
    const footer = document.querySelector('.footer');

    const gameUi = () => {
        gameUax.textContent = '';
        const activePlayer = game.getActivePlayer();

        const resultsDiv = document.createElement('h2');
        resultsDiv.textContent = `${game.players[0].name}'s score: ${game.players[0].winScore}; ${game.players[1].name}'s score: ${game.players[1].winScore}; TIES: ${game.players[0].tieScore + game.players[1].tieScore};`;
        gameUax.appendChild(resultsDiv);

        const playerDiv = document.createElement('h2');
        playerDiv.textContent = `${activePlayer.name}'s turn!`;
        activePlayer.marker === 'X' ? playerDiv.style.color = '#9b59b6' : playerDiv.style.color = '#f3dc47'
        gameUax.appendChild(playerDiv);
    }

    const updateScreen = () => {
        gameField.textContent = ''; // clear screen before update

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        gameField.appendChild(resetBtn);
        resetBtn.classList.add('reset', 'gameButton');

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

        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart';
        gameField.appendChild(restartBtn);
        restartBtn.classList.add('restart', 'gameButton');
    }

    const gettingNamesHandler = () => {
        game.getNames(firstName.value, secondName.value);
        startDiv.style.display = 'none';
        gameField.style.display = 'flex';
        gameUax.style.display = 'flex';
        logo.style.display = 'none';
        footer.classList.add('gameFooter');
        gameUi();
        updateScreen();
    }

    const gameHandler = (e) => {
        const actPlayer = game.getActivePlayer();
        if (!e.target.classList.contains('cell')) return;

        if (actPlayer.marker === 'X') {
            e.target.classList.add('x');
        } else if (!e.target.classList.contains('x')) e.target.classList.add('o');

        const clickedCell = e.target.id;
        game.playRound(clickedCell);
        gameUi();
    }

    const resetHandler = (e) => {
        if (!e.target.classList.contains('reset')) return;
        game.resetBoard();
        game.resetPlayers();
        game.getCurrentGameActivePlayer();
        gameUi();
        updateScreen();
    }

    const restartHandler = (e) => {
        if (!e.target.classList.contains('restart')) return;
        game.resetBoard();
        game.hardResetPlayers();
        game.getCurrentGameActivePlayer();
        startDiv.style.display = '';
        gameField.style.display = 'none'
        gameUax.style.display = 'none';
        logo.style.display = '';
        footer.classList.remove('gameFooter');
    }

    startBtn.addEventListener('click', gettingNamesHandler);
    gameField.addEventListener('click', gameHandler);
    gameField.addEventListener('click', resetHandler);
    gameField.addEventListener('click', restartHandler);

    return {showDialog: dialog.showDialog};
})();
