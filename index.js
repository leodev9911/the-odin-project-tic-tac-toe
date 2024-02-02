const gameController = (function() {
    const formContainer = document.getElementById('form-container');
    const startButton = document.getElementById('start-button');
    const gameboardContainer = document.querySelector('.gameboard-container');
    const scoreBoardContainer = document.querySelector('.score-board');
    const players = [];
    let currentPlayer = 1;
    let currentTurn = 1;
    let round = 1;
    const winningCombinations = [
        ['1','2','3'],
        ['1','5','9'],
        ['1','4','7'],
        ['2','5','8']
        ['3','5','7'],
        ['3','6','9'],
        ['4','5','6'],
        ['7','8','9'],
    ]
    
    function createPlayer(name, fig) {
        let wins = 0;
        let score = 0;
        let plays = [];

        return { name, wins, fig, score, plays }
    }

    const getPlayer = () => {
        const inputName = document.getElementById('input-name');
        players.push(createPlayer(inputName.value, currentPlayer === 1 ? 'X' : 'O'));
        if (currentPlayer < 2) {
            currentPlayer++;
            renderInput();
        } else {
            formContainer.innerHTML = "";
            gameboardContainer.innerHTML = gameboard.createBoard();
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

    const play = (div) => {
        if (div.textContent) {
            return;
        }    

        if (currentTurn === 1) {
            div.textContent = players[currentTurn - 1].fig;
            players[currentTurn - 1].plays.push(div.id);
            currentTurn++;
        } else {
            div.textContent = players[currentTurn - 1].fig;
            players[currentTurn - 1].plays.push(div.id);
            currentTurn--;
        }

        console.log(players);
    }

    startButton.addEventListener('click', renderInput);

    return {
        getPlayer,
        players,
        play
    }
})();

const gameboard = (function() {
    function createScoreBoard() {
        return `
            <div>
                <p>${gameController.players[0].name} ${gameController.players[0].fig}</p>
                <p>Score: ${gameController.players[0].score}</p>
            </div>
            <div>
                <p>${gameController.players[1].name} ${gameController.players[1].fig}</p>
                <p>Score: ${gameController.players[1].score}</p>
            </div>
        `
    }

    function createBoard() {

        return `
            <div id="1" onclick="gameController.play(this)"></div>
            <div id="2" onclick="gameController.play(this)"></div>
            <div id="3" onclick="gameController.play(this)"></div>
            <div id="4" onclick="gameController.play(this)"></div>
            <div id="5" onclick="gameController.play(this)"></div>
            <div id="6" onclick="gameController.play(this)"></div>
            <div id="7" onclick="gameController.play(this)"></div>
            <div id="8" onclick="gameController.play(this)"></div>
            <div id="9" onclick="gameController.play(this)"></div>
        `
    }

    return {
        createBoard,
        createScoreBoard
    }
})()