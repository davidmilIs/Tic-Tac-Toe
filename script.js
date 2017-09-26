var initialBoard; //Show the state of the game
const huPlayer='O';
const aiPlayer='X';
const winCombos= 	[
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]


const cells = document.querySelectorAll('.cell');

startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none"; 
	//Create an array with value from 0 to 8
	initialBoard = Array.from(Array(9).keys());
	//Erase all O and X from cells 
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}


function turnClick(square) {
	//console.log(square.target.id)
	//If nobody played in the square 
	if (typeof initialBoard[square.target.id] == 'number') {
		playTurn(square.target.id, huPlayer);
		if (!checkWin(initialBoard, huPlayer) && !checkTie()) playTurn(bestSquare(),aiPlayer);
	}
}

//Permet de faire jouer le tour au joueur ou a l'ia
function playTurn(squareId,player){
	initialBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	var gameWon = checkWin(initialBoard, player);
	if (gameWon) {
		gameOver(gameWon);
	}
}

//On regarde si la partie est terminé
function checkWin(board, player) {
	//We create an element which take all square id where the player played;
	var plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);

	var gameWon = null;
	//On regarde si le joueur a joué une des combinaisons gagnantes
	for (var [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}

	}
	return gameWon;
}

//La partie est terminé !
function gameOver(gameWon) {
	//We look for all the square which composed the win combinaison
	for (var index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "Lime" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

//We look for all empty squares and return them
function emptySquares() {
	return initialBoard.filter(s => typeof s == 'number');
}

//Take the first empty squares
function bestSquare() {
	return minimax(initialBoard, aiPlayer).index;
}


//If all squares is filled and noone won this mean there is a tie
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "#9999ff";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//Show the endame section an put the winner in text :)
function declareWinner(winner) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = winner;
}

//Minimax algorithm cf:https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}