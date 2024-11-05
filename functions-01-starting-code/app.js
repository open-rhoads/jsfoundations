const startGameBtn = document.getElementById('start-game-btn');

const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
DEFAULT_CHOICE = ROCK;
const DRAW = 'DRAW :/';
const PLAYER_WIN = 'PLAYER WINS!';
const COMP_WIN = 'COMPUTER WINS!';

let gameRunning = false;

const getPlayerChoice = function () {
  const selection = prompt(
    `${ROCK}, ${PAPER}, or ${SCISSORS}?`,
    ''
  ).toUpperCase();
  if (selection !== ROCK && selection !== PAPER && selection !== SCISSORS) {
    alert(`Invalid choice! We chose ${DEFAULT_CHOICE} for you!`);
    return DEFAULT_CHOICE;
  }
  return selection;
};

const getComputerChoice = function () {
  //random number between 0 and 1
  const randomValue = Math.random();
  //conditional logic using possible ranges to assign values to return
  if (randomValue < 0.34) {
    return ROCK;
  } else if (randomValue < 0.67) {
    return PAPER;
  } else {
    return SCISSORS;
  }
};

const getWinner = function (cSelection, pSelection) {
  if (cSelection === pSelection) {
    return DRAW;
  } else if (
    (cSelection === ROCK && pSelection === PAPER) ||
    (cSelection === PAPER && pSelection === SCISSORS) ||
    (cSelection === SCISSORS && pSelection === ROCK)
  ) {
    return PLAYER_WIN;
  } else {
    return COMP_WIN;
  }
};

//indirect call through event listener
startGameBtn.addEventListener('click', function startGame() {
  if (gameRunning) {
    //stop the function if game is already running
    return;
  }
  gameRunning = true;
  console.log('Game is starting...');
  const playerSelection = getPlayerChoice();
  const compSelection = getComputerChoice();
  console.log(playerSelection);
  console.log(compSelection);
  const winner = getWinner(compSelection, playerSelection);
  console.log(winner);
});
