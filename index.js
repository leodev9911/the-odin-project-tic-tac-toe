const gameController = (function() {
    const formContainer = document.getElementById('form-container');
    const startButton = document.getElementById('start-button');
    const scoreBoardContainer = document.querySelector('.score-board');
    const roundContainer = document.getElementById('round-container');
    const continueButton = document.getElementById('continue-button');
    const resetButton = document.getElementById('reset-button');
    const resultContainer = document.getElementById('result-container');
    let players = [];
    let currentPlayer = 1;
    let currentTurn = 1;
    let round = 1;
    const winningCombinations = [
        [0, 1, 2],
        [0, 4, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 4, 6],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8]
    ]
    
    function createPlayer(name, fig, moves) {
        let wins = 0;
        let score = 0;

        return { name, wins, fig, moves, score }
    }

    const getPlayer = () => {
        const inputName = document.getElementById('input-name');
        players.push(createPlayer(inputName.value, currentPlayer === 1 ? 'X' : 'O', currentPlayer === 1 ? 5 : 4));
        if (currentPlayer < 2) {
            currentPlayer++;
            renderInput();
        } else {
            formContainer.innerHTML = "";
            gameboard.createBoard();
            roundContainer.textContent = `Round: ${round}`;
            scoreBoardContainer.innerHTML = gameboard.createScoreBoard();
        }
    }

    const renderInput = () => {
        formContainer.innerHTML = `
            <label for="input-name">Player ${currentPlayer} name:</label>
            <input type="text" id="input-name">
            <button type="button" onclick="gameController.getPlayer()">Submit</button>
        `
    }

    const checkWinner = (boardToCheck) => {
        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (
                boardToCheck[a] &&
                boardToCheck[a] === boardToCheck[b] &&
                boardToCheck[a] === boardToCheck[c]
            ) {
                return boardToCheck[a];
            }
        }

        return null;
    }

    const renderRoundResult = (winnerPlayer, checkWinnerResult) => {
        resultContainer.textContent = checkWinnerResult !== null ? `Player ${winnerPlayer.name} wins this Round` : `The round ends in draw`;
        resultContainer.textContent += winnerPlayer.wins === 1 ? ` and wins the game. Congrats!🎉` : '';
    }

    const play = (div) => {
        const player1P = document.getElementById('player1');
        const player2P = document.getElementById('player2');
        if (gameboard.board[parseInt(div.id)]) return;    

        gameboard.board[parseInt(div.id)] = players[currentTurn - 1].fig;
        gameboard.createBoard();
        if (currentTurn === 1) {
            players[currentTurn - 1].moves--;
            currentTurn++;
            player1P.classList.remove('turn');
            player2P.classList.add('turn');
        } else {
            players[currentTurn - 1].moves--;
            currentTurn--;
            player2P.classList.remove('turn');
            player1P.classList.add('turn');
        }

        let checkWinnerResult = checkWinner(gameboard.board);

        if (checkWinnerResult !== null) {
            const winnerPlayer = players.filter(player => player.fig === checkWinnerResult);
            winnerPlayer[0].score++
            winnerPlayer[0].score === 3 && winnerPlayer[0].wins++;
            renderRoundResult(winnerPlayer[0], checkWinnerResult);
            continueButton.classList.remove('disabled');
        }

        if (players[0].moves === 0 && players[1].moves === 0 && checkWinnerResult === null) {
            renderRoundResult(null, checkWinnerResult);
            continueButton.classList.remove('disabled');
        }
    }

    const handleContinue = () => {
        const winnerPlayer = players.filter(player => player.fig === checkWinner(gameboard.board));
        round++;
        if (winnerPlayer[0].score === 3) {
            players[0].score = 0;
            players[1].score = 0;
            round = 1;
        }
        players[0].moves = 5;
        players[1].moves = 4;
        gameboard.board.fill("");
        currentPlayer = 1;
        currentTurn = 1;
        gameboard.createBoard();
        roundContainer.textContent = `Round: ${round}`;
        resultContainer.textContent = '';
        scoreBoardContainer.innerHTML = gameboard.createScoreBoard();
        continueButton.classList.add('disabled');
    }

    const handleResetGame = () => {
        players = [];
        gameboard.board.fill("");
        currentPlayer = 1;
        currentTurn = 1;
        gameboard.createBoard();
        roundContainer.textContent = `Round: ${round}`;
        resultContainer.textContent = '';
        scoreBoardContainer.innerHTML = gameboard.createScoreBoard();
        continueButton.classList.add('disabled');
        scoreBoardContainer.innerHTML = "";
        gameboard.gameboardContainer.innerHTML = "";
        roundContainer.textContent = "";
        getPlayer();
    }

    continueButton.addEventListener('click', handleContinue);
    startButton.addEventListener('click', renderInput);
    resetButton.addEventListener('click', handleResetGame);

    return {
        getPlayer,
        players,
        play
    }
})();

const gameboard = (function() {
    const gameboardContainer = document.querySelector('.gameboard-container');

    function createScoreBoard() {
        return `
            <div>
                <p id="player1" class="turn">${gameController.players[0].name} ${gameController.players[0].fig}</p>
                <p>Score: ${gameController.players[0].score}</p>
                <p>Games win: ${gameController.players[0].wins}</p>
            </div>
            <div>
                <p id="player2">${gameController.players[1].name} ${gameController.players[1].fig}</p>
                <p>Score: ${gameController.players[1].score}</p>
                <p>Games win: ${gameController.players[1].wins}</p>
            </div>
        `
    }

    let board = Array(9).fill("");

    function createBoard() {
        gameboardContainer.innerHTML = "";
        board.map((square, index) => {
            gameboardContainer.innerHTML += `<div id="${index}" onclick="gameController.play(this)">${square}</div>`;
        })
    }

    return {
        board,
        createBoard,
        createScoreBoard,
        gameboardContainer
    }
})()