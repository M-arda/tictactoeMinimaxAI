const cells = document.querySelectorAll('.cell');
// console.log(cells)
const durumCubugu = document.getElementById('durum');
let player1 = {
    type: 'human',
    letter: 'X'
};

let player2 = {
    type: 'ai',
    letter: 'O'
};

let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let ai = player2;
let human = player1;

let turn = player1;
let over = false;
let letterBtnX = document.querySelector('#letterX');
let letterBtnO = document.querySelector('#letterO');

for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
        let cell = document.querySelector(`#cell${row}${col}`)
        // board[row][col] = '';
        cell.addEventListener('click', () => cellClicked(row, col));
    }
}


function baslat() {

    if (letterBtnO.checked) {
        player1.type = 'ai';
        player2.type = 'human';
        ai = player1;
        human = player2;
    }
    if (letterBtnX.checked) {
        player1.type = 'human';
        player2.type = 'ai';
        human = player1;
        ai = player2;
    }

    durumCubugu.textContent = 'X sırası';
    turn = player1;
    over = false;
    document.querySelector('#startBtn').textContent = "Yeniden Başlat";
    board = [["", "", ""], ["", "", ""], ["", "", ""]];

    updateBoard();

    if (player1 == ai) {
        let move = aiMove();
        console.log(move)
        setTimeout(() => {
            console.log('test')
            cellClicked(move.row, move.col);
        }, 250);
    }
}


function updateBoard() {
    // console.log(board)
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            let cell = document.querySelector(`#cell${row}${col}`);
            cell.textContent = board[row][col];
            cell.style.color = '#c4c4c4';
        }
    }
}

function switchTurn() {
    turn = (turn == player1) ? player2 : player1;
    // console.log(turn)

    if (turn.type === 'ai') {
        let move = aiMove();
        setTimeout(() => {
            cellClicked(move.row, move.col);
        }, 750)
    }
    console.log(turn)
}


function cellClicked(row, col) {
    if (row === undefined || col === undefined) return;
    if (board[row][col] !== '' || over) return;

    board[row][col] = turn.letter;
    updateBoard();

    let finishState = isOver(board);
    if (finishState.finished) {
        if (finishState.winner == 'draw') durumCubugu.textContent = `Berabere`;
        else {
            durumCubugu.textContent = `${finishState.winner} kazandı`;
            console.log(finishState.winningCells)
            for (let index = 0; index < finishState.winningCells.length; index++) {
                const element = finishState.winningCells[index];
                element.style.color = '#0f0';
            }
        }

        over = true;
        return;
    }

    switchTurn();

    durumCubugu.textContent = `${turn.letter} sırası`;
}

function isOver(boardToCheck) {
    const winningCases = [
        [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
        [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
        [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
        [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
        [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
        [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
    ];

    for (let index = 0; index < winningCases.length; index++) {
        const condition = winningCases[index];
        let firstCell = boardToCheck[condition[0].row][condition[0].col];
        let secondCell = boardToCheck[condition[1].row][condition[1].col];
        let thirdCell = boardToCheck[condition[2].row][condition[2].col];


        if (firstCell === '' || secondCell === '' || thirdCell === '') continue;

        else if (firstCell === secondCell && firstCell === thirdCell) {
            // console.log("kazanan")
            return {
                finished: true,
                winner: firstCell,
                winningCells: document.querySelectorAll(`#cell${condition[0].row}${condition[0].col}, #cell${condition[1].row}${condition[1].col}, #cell${condition[2].row}${condition[2].col}`),
            };
        }
    }
    if (!boardToCheck.some(element => element.includes(''))) {
        // console.log("berbera")
        return {
            finished: true,
            winner: 'draw',
        };
    }

    return {
        finished: false,
        winner: null,
    };
}


function minimax(minimaxBoard, depth, isMaximizing) {
    let state = isOver(minimaxBoard);
    let score;
    if (state.finished) {
        if (state.winner == ai.letter) return 10;
        else if (state.winner == human.letter) return -10;
        else return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < minimaxBoard.length; row++) {
            for (let col = 0; col < minimaxBoard[row].length; col++) {
                if (minimaxBoard[row][col] === '') {
                    minimaxBoard[row][col] = ai.letter;
                    score = minimax(minimaxBoard, depth + 1, false);
                    minimaxBoard[row][col] = '';
                    if (score > bestScore) bestScore = score;
                }
            }
        }
        return bestScore - depth;
    }
    else {
        let bestScore = Infinity;
        for (let row = 0; row < minimaxBoard.length; row++) {
            for (let col = 0; col < minimaxBoard[row].length; col++) {
                if (minimaxBoard[row][col] === '') {
                    minimaxBoard[row][col] = human.letter;
                    score = minimax(minimaxBoard, depth + 1, true);
                    minimaxBoard[row][col] = '';
                    if (score < bestScore) bestScore = score;
                }
            }
        }
        return bestScore + depth;
    }
}

function aiMove() {
    let moveRow;
    let moveCol;
    // while (board[moveRow][moveCol] !== '') {
    //     moveRow = Math.floor(Math.random() * 3);
    //     moveCol = Math.floor(Math.random() * 3);

    //     console.log(moveRow, moveCol)
    // }
    // return {
    //     row: moveRow,
    //     col: moveCol
    // }

    let bestMove = -Infinity;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === '') {
                board[row][col] = ai.letter;
                let score = minimax(board, 0, false);
                board[row][col] = '';
                if (score > bestMove) {
                    bestMove = score;
                    moveRow = row;
                    moveCol = col;
                }
            }
        }
    }

    return {
        row: moveRow,
        col: moveCol,
    }

}
