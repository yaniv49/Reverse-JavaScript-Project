class Cell {
    constructor(hasACircle, color) {
        this.HasACircle = hasACircle;
        this.color = color;
    }
}

class Player {
    constructor(color) {
        this.color = color;
        this.movesCount = 0;
        this.numberOfChips = 2;
        this.has2ChipCounter = 1;
        this.playedTime = 0;
        this.getNumberOfChip = getNumberOfChip;
    }
}

class Game {
    constructor() {
        this.player1;
        this.player2;
        this.currentPlayer;
        this.matrix;
        this.matrixSize;
        this.initGame = initGame;
    }
}

var gameModel;
var time = window.setInterval(timeElapsed, 100);
var gameStartTimer = new Date().getTime();
var turnTimer = new Date().getTime();

function start() {
    document.getElementById("StartGame").style.display = "block";
    document.getElementById("SetGame").style.display = "none";
    boardSize = document.getElementById("SelectSize").selectedIndex * 2 + 8;
    gameModel = new Game();
    gameModel.initGame(boardSize);
    initTable();
    updateBoard();
}

function initTable() {
    for (let i = 0; i < gameModel.matrixSize; i++) {
        let table = document.getElementById("gameTable");
        let row = table.insertRow(i);
        for (let j = 0; j < gameModel.matrixSize; j++) {
            let cell = row.insertCell(j);
            if (i === 0 || i === gameModel.matrixSize - 1 || j === 0 || j === gameModel.matrixSize - 1) {
                cell.className = "borderCell";
            }
            else {
                cell.X = i;
                cell.Y = j;
                cell.hasCirle = false;
                cell.addEventListener("mouseover", mouseOver);
                cell.addEventListener("mouseout", mouseOut);
                cell.addEventListener("click", playTurn_Click);
                cell.className = "gameCell";
            }
        }
    }
}

function initGame(matrixSize) {
    this.player1 = new Player("white");
    this.player2 = new Player("black");
    this.currentPlayer = gameModel.player1;
    this.matrixSize = matrixSize;
    this.matrix = [];

    for (let i = 0; i < matrixSize; i++) {
        this.matrix[i] = new Array(matrixSize);
        for (let j = 0; j < matrixSize; j++) {
            this.matrix[i][j] = new Cell(false, null);
        }
    }

    this.matrix[matrixSize / 2 - 1][matrixSize / 2 - 1] = new Cell(true, "black");
    this.matrix[matrixSize / 2 - 1][matrixSize / 2] = new Cell(true, "white");
    this.matrix[matrixSize / 2][matrixSize / 2 - 1] = new Cell(true, "white");
    this.matrix[matrixSize / 2][matrixSize / 2] = new Cell(true, "black");
}

function playTurn_Click() {
    if (isMoveValid(this)) {
        gameModel.currentPlayer.movesCount++;
        updateMatrix(this.X, this.Y);
        updateBoard();
        upadateStatistics();
        
        if (gameModel.currentPlayer === gameModel.player1) {  //שחקן 1
            currentTimePlayer1 = new Date().getTime() - turnTimer;
            gameModel.player1.playedTime += currentTimePlayer1;
            document.getElementById('whiteAvgTime').innerHTML = convertTime(gameModel.player1.playedTime / gameModel.currentPlayer.movesCount);
            gameModel.currentPlayer = gameModel.player2;
        }
        else {                                      //שחקן 2
            currentTimePlayer1 = new Date().getTime() - turnTimer;
            gameModel.player2.playedTime += currentTimePlayer1;
            document.getElementById('blackAvgTime').innerHTML = convertTime(gameModel.player2.playedTime / gameModel.currentPlayer.movesCount);
            gameModel.currentPlayer = gameModel.player1;
        }
        
        if (isGameOver()) {
            clearInterval(time);
            disableTable();
        }
        else{
            turnTimer = new Date().getTime();
        }
    }
}

function mouseOver() {
    if (isCellEmpty(this)) {
        if (isMoveValid(this))
            this.className = "valid";
        else
            this.className = "notValid";
    }
}

function mouseOut() {
    this.className = "gameCell";
}

function updateBoard() {
    let table = document.getElementById("gameTable");

    for (let i = 1; i <= gameModel.matrixSize - 2; i++) {
        let row = table.rows[i].cells;
        for (let j = 1; j <= gameModel.matrixSize - 2; j++) {
            if (gameModel.matrix[i][j].HasACircle === true) {
                if (row[j].hasCirle === false) {
                    row[j].hasCirle = true;
                    let circle = document.createElement("div");
                    if (gameModel.matrix[i][j].color == "white")
                        circle.className = "circle white";
                    else
                        circle.className = "circle black";
                    row[j].appendChild(circle);
                    row[j].className = "gameCell";
                }
                else
                    if (gameModel.matrix[i][j].color == "white")
                        row[j].childNodes[0].className = "circle white";
                    else
                        row[j].childNodes[0].className = "circle black";
            }
        }
    }
}

function isCellEmpty(cell) {
    return gameModel.matrix[cell.X][cell.Y].HasACircle ? false : true;
}

function isMoveValid(CellToMoveTo) {
    if (isCellEmpty(CellToMoveTo))
        if (gameModel.matrix[CellToMoveTo.X + 1][CellToMoveTo.Y].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X][CellToMoveTo.Y + 1].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X][CellToMoveTo.Y - 1].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X - 1][CellToMoveTo.Y].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X - 1][CellToMoveTo.Y - 1].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X - 1][CellToMoveTo.Y + 1].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X + 1][CellToMoveTo.Y - 1].HasACircle === true ||
            gameModel.matrix[CellToMoveTo.X + 1][CellToMoveTo.Y + 1].HasACircle === true)
            return true;
        else
            return false;
    else
        return false;
}

function getOppositePlayerColor(playerColor) {
    let x = playerColor === "white" ? "Black" : "White";
    return x;
}

function updateMatrix(x, y) {
    gameModel.matrix[x][y] = new Cell(true, gameModel.currentPlayer.color);
    checkOneDirection(x + 1, y + 1, 1, 1);
    checkOneDirection(x, y + 1, 0, 1);
    checkOneDirection(x, y - 1, 0, -1);
    checkOneDirection(x + 1, y, 1, 0);
    checkOneDirection(x + 1, y - 1, 1, -1);
    checkOneDirection(x - 1, y, -1, 0);
    checkOneDirection(x - 1, y + 1, -1, 1);
    checkOneDirection(x - 1, y - 1, -1, -1);
}

function checkOneDirection(x, y, xDirection, yDirection) {
    if (gameModel.matrix[x][y].HasACircle !== true || x > gameModel.matrixSize - 2 || y > gameModel.matrixSize - 2)
        return false;
    if (gameModel.matrix[x][y].color === gameModel.currentPlayer.color)
        return true;

    let found = checkOneDirection(x + xDirection, y + yDirection, xDirection, yDirection);

    if (found) {
        gameModel.matrix[x][y].color = gameModel.currentPlayer.color;
        return true;
    }
}

function upadateStatistics() {
    updateTurnNumber();
    upadateHas2ChipsAndScore(gameModel.player1);
    upadateHas2ChipsAndScore(gameModel.player2);
}

function updateTurnNumber() {
    document.getElementById("TurnNumber").innerHTML = gameModel.player1.movesCount + gameModel.player2.movesCount;
}

function upadateHas2ChipsAndScore(player) {
    let numberOfChips = player.getNumberOfChip();

    if (numberOfChips === 2 && player.numberOfChips !== 2) {
        document.getElementById(player.color + "Has2Chips").innerHTML = ++player.has2ChipCounter;
    }

    player.numberOfChips = numberOfChips;
    document.getElementById(player.color + "Score").innerHTML = numberOfChips;
}

function getNumberOfChip() {
    let count = 0;

    for (let i = 1; i <= gameModel.matrixSize - 2; i++) {
        for (let j = 1; j <= gameModel.matrixSize - 2; j++) {
            if (gameModel.matrix[i][j].color === this.color) {
                count++;
            }
        }
    }
    return count;
}

function timeElapsed() {
    let elapsed = new Date().getTime() - gameStartTimer;
    let formatted = convertTime(elapsed);
    document.getElementById('time').innerHTML = formatted;
}

function convertTime(miliseconds) {
    let totalSeconds = Math.floor(miliseconds / 1000);
    let minutes = clockDisplay(Math.floor(totalSeconds / 60), 2);
    let seconds = clockDisplay(totalSeconds - minutes * 60, 2);
    return minutes + ':' + seconds;
}

function clockDisplay(aNumber, aLength) {
    if (aNumber.toString().length >= aLength)
        return aNumber;
    return (Math.pow(10, aLength) + Math.floor(aNumber)).toString().substring(1);
}

function isGameOver() {
    let player1NumberOfChips = gameModel.player1.getNumberOfChip();
    let player2NumberOfChips = gameModel.player2.getNumberOfChip();
    let numberOfCells = (gameModel.matrixSize - 2) * (gameModel.matrixSize - 2);
    let isGameOver = false;

    if (player1NumberOfChips === 0) {
        document.getElementById("winner").innerHTML = "Black Is The Winner!";
        isGameOver = true;
    }
    else if (player2NumberOfChips === 0) {
        document.getElementById("winner").innerHTML = "White Is The Winner!";
        isGameOver = true;
    }
    else if ((player1NumberOfChips + player2NumberOfChips) === numberOfCells) { //אם הלוח מלא בודק את מצב המשחק
        if (player1NumberOfChips > player2NumberOfChips) {
            document.getElementById("winner").innerHTML = "White Is The Winner!";
            isGameOver = true;
        }
        else if (player2NumberOfChips > player1NumberOfChips) {
            document.getElementById("winner").innerHTML = "Black Is The Winner!";
            isGameOver = true;
        }
        else {
            document.getElementById("winner").innerHTML = "It's a Tie!";
            isGameOver = true;
        }
    }

    return isGameOver;
}

function disableTable() {
    let table = document.getElementById("gameTable");
    for (let i = 1; i <= gameModel.matrixSize - 2; i++) {
        let row = table.rows[i].cells;
        for (let j = 1; j <= gameModel.matrixSize - 2; j++) {
            row[j].removeEventListener("mouseover", mouseOver);
            row[j].removeEventListener("mouseout", mouseOut);
            row[j].removeEventListener("click", playTurn_Click);
        }
    }

}

function quitGame() {
    let winningColor = getOppositePlayerColor(gameModel.currentPlayer.color);
    document.getElementById("winner").innerHTML = winningColor + " Is The Winner!";
    disableTable();
    clearInterval(time);
}