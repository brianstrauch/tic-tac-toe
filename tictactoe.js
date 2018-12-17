const PLAYER = 'X', AI = 'O', EMPTY = '';

const WINNING_PATTERNS = [
	// Horizontal
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	// Vertical
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	// Diagonal
	[0, 4, 8], [2, 4, 6]
];

Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var j = Math.floor((i + 1) * Math.random());
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this;
};

function setup() {
	var board = document.getElementsByTagName('table')[0];

	cells = board.getElementsByTagName('td');
	for (var i = 0; i < cells.length; i++) {
		cells[i].addEventListener('click', click);
	}
}

function start() {
	state = [];
	for (var i = 0; i < cells.length; i++) {
		state[i] = cells[i].innerHTML = EMPTY;
	}
	done = false;

	if (Math.random() < 0.5) {
		move(minimax(state, AI, 0), AI);
	}
}

function click(event) {
	if (done) {
		start();
	} else {
		var row = event.target.parentElement.rowIndex;
		var col = event.target.cellIndex;

		var index = row * 3 + col;
		move(index, PLAYER);

		if (!done) {
			move(minimax(state, AI, 0), AI);
		}
	}
}

function minimax(state, player, depth) {
	if (isWin(state, AI)) {
		return 1;
	} else if (isWin(state, PLAYER)) {
		return -1;
	} else if (isTie(state)) {
		return 0;
	}

	var indices = [];
	for (var i = 0; i < state.length; i++) {
		indices[i] = i;
	}
	if (depth == 0) {
		indices.shuffle();
	}

	var bestIndex = 0;
	var bestScore = 0;

	for (var i = 0; i < indices.length; i++) {
		var index = indices[i];

		if (state[index] == EMPTY) {
			state[index] = player;

			if (player == AI) {
				var score = minimax(state, PLAYER, depth + 1);
				if (score > bestScore) {
					bestIndex = index;
					bestScore = score;
				}
			} else {
				var score = minimax(state, AI, depth + 1);
				if (score < bestScore) {
					bestIndex = index;
					bestScore = score;
				}
			}

			state[index] = EMPTY;
		}
	}

	return (depth == 0) ? bestIndex : bestScore;
}

function move(index, player) {
	if (state[index] == EMPTY) {
		state[index] = cells[index].innerHTML = player;
		done = isDone(player);
	}
}

function isDone(player) {
	return isWin(state, player) || isTie(state);
}

function isWin(state, player) {
	for (var i = 0; i < WINNING_PATTERNS.length; i++) {
		var pattern = WINNING_PATTERNS[i];

		var a = state[pattern[0]];
		var b = state[pattern[1]];
		var c = state[pattern[2]];

		if (a == player && b == player && c == player) {
			return true;
		}
	}
	return false;
}

function isTie(state) {
	for (var i = 0; i < cells.length; i++) {
		if (state[i] == EMPTY) {
			return false;
		}
	}
	return true;
}

var cells;
setup();

var state, done;
start();
