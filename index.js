const gameboard = (function() {
    let gamestate = [];

    return {
        gamestate,
    }
})()

function player(mark) {
    function placeMark(pos) {
        if (pos < 0 || pos > 8) {
            console.error("Mark must be placed inside the board (0 <= x <= 8)");
            return;
        }
        if (gameboard.gamestate[pos]) {
            console.error(`On position ${pos} is already a mark ${gameboard.gamestate[pos]} placed`);
            return;
        }
        gameboard.gamestate[pos] = mark;
        return true;
    }

    return {
        placeMark,
        mark,
    }
}


const game = (function() {
    const player1 = player("X");
    const player2 = player("O");
    let currentPlayer = player1;
    function reset() {
        gameboard.gamestate = [];
        currentPlayer = player1;
        console.log(currentPlayer)
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function winner() {
        let gamestate = gameboard.gamestate;
        if (gamestate[0] && ((gamestate[0] === gamestate[1] && gamestate[0] === gamestate[2])
        || (gamestate[0] === gamestate[3] && gamestate[0] === gamestate[6]))) {
            return gamestate[0];
        }
        else if (gamestate[8] && ((gamestate[8] === gamestate[6] && gamestate[8] === gamestate[7])
        || (gamestate[8] === gamestate[2] && gamestate[8] === gamestate[5]))) {
            return gamestate[8];
        }
        else if (gamestate[4] && ((gamestate[4] === gamestate[0] && gamestate[4] == gamestate[8])
        || (gamestate[4] === gamestate[1] && gamestate[4] === gamestate[7])
        || (gamestate[4] === gamestate[2] && gamestate[4] === gamestate[6])
        || (gamestate[4] === gamestate[3] && gamestate[4] === gamestate[5]))) {
            return gamestate[4];
        }

        return false;
    }

    function full() {
        for (let i = 0; i < 9; ++i) {
            if (!gameboard.gamestate[i]) {
                return false;
            }
        }
        return true;
    }

    function tied() {
        return !winner() && full();
    }

    function takeTurn(pos) {
        if (winner(gameboard.gamestate)) {
            return;
        }
        const succ = currentPlayer.placeMark(pos);
        
        if (succ) {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
        return currentPlayer;
    }

    return {
        reset,
        takeTurn,
        winner,
        tied,
        getCurrentPlayer,
    }
})()


const displayDom = (function() {
    function cleanDom() {
        const board = document.querySelector(".board");
        board.remove();
        const winner = document.querySelector(".winner");
        if (winner) {
            winner.remove();
        }
    }

    function announce(content) {
        const body = document.querySelector("body");
        const span = document.createElement("span");
        span.classList.add("winner");
        span.textContent = content;
        body.appendChild(span);
    }

    function renderBoard() {
        const body = document.querySelector("body");
        const board = document.createElement("div");
        board.classList.add("board");
        for (let i = 0; i < 9; ++i) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            if (gameboard.gamestate[i]) {
                cell.textContent = gameboard.gamestate[i];
            }
            cell.addEventListener("click", (event) => {
                if (game.winner() || game.tied()) {
                    return;
                }
                cell.textContent = game.getCurrentPlayer().mark;
                currentPlayer = game.takeTurn(i);
                game.currentPlayer = currentPlayer;
                let winner = game.winner();
                if (winner) {
                    announce(`${winner} won the game`);
                }
                if (game.tied()) {
                    announce("You tied");
                }
            })
            board.appendChild(cell);
        }
        body.appendChild(board);
    }

    return {
        renderBoard,
        cleanDom,
    }
})();

const start = document.querySelector(".start");
const reset = document.querySelector(".reset");
start.addEventListener("click", () => {
    displayDom.renderBoard();
})
reset.addEventListener("click", () => {
    displayDom.cleanDom();
    game.reset();
    displayDom.renderBoard();
})