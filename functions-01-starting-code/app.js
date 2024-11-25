const startGameBtn = document.getElementById('start-game-btn');

const ROCK = 'ROCK';
const PAPER = 'PAPER';
const SCISSORS = 'SCISSORS';
DEFAULT_CHOICE = ROCK;
const DRAW = 'DRAW :/';
const PLAYER_WIN = 'PLAYER WINS!';
const COMP_WIN = 'COMPUTER WINS!';

let gameRunning = false;

const getPlayerChoice = () => {
  const selection = prompt(
    `${ROCK}, ${PAPER}, or ${SCISSORS}?`,
    ''
  ).toUpperCase();
  if (selection !== ROCK && selection !== PAPER && selection !== SCISSORS) {
    alert(`Invalid choice! We chose ${DEFAULT_CHOICE} for you!`);
    return; //returning nothing will stop the function execution
  }
  return selection;
};

const getComputerChoice = () => {
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

//arrow function syntax - needs to use the expression syntax for functions
//if you have an arrow function with only one expression, you can omit the curly braces and the return statement
  //This means it will be automatically returned
//If there are no arguments, you need an empty set of parentheses
//If there is exactly one argument, you can omit the parentheses
const getWinner = (cSelection, pSelection = DEFAULT_CHOICE) => //default arg in case the user selection is undefined due to user entering incorrect selection...but NOT other falsy values
  //default args could be in any order in JS, even though other languages could cause error
  //default values can also use the value of other parameters previously defined
// if (cSelection === pSelection) {
  //   return DRAW;
  // } else if (
  //   (cSelection === ROCK && pSelection === PAPER) ||
  //   (cSelection === PAPER && pSelection === SCISSORS) ||
  //   (cSelection === SCISSORS && pSelection === ROCK)
  // ) {
  //   return PLAYER_WIN;
  // } else {
  //   return COMP_WIN;
  // }
  //with an arrow function, we can rewrite the above with nested ternary expressions...this makes it one expression
  cSelection === pSelection
    ? DRAW
    : (cSelection === ROCK && pSelection === PAPER) ||
      (cSelection === PAPER && pSelection === SCISSORS) ||
      (cSelection === SCISSORS && pSelection === ROCK)
    ? PLAYER_WIN
    : COMP_WIN;

//indirect call through event listener... this is called a callback function when the second parameter is a function - this is a pointer to the function
//the browser calls it for you on click of the button (callback)
//this is the pattern for many built-in JS functions and you can 
startGameBtn.addEventListener('click', () => {
  if (gameRunning) {
    //stop the function if game is already running
    return;
  }
  gameRunning = true;
  console.log('Game is starting...');
  const playerSelection = getPlayerChoice(); //might be undefined if the player enters wrong data, not yet handled
  let winner;
  if (playerChoice) {
    winner = getWinner(compSelection, playerSelection);
  } else {
    winner = getWinner(compSelection); //only sending one arg if player choice is undefined...this could be an error in some languages, but not JS
    //this one arg will be assigned to the first parameter in the list
  }
  const compSelection = getComputerChoice();
  console.log(playerSelection);
  console.log(compSelection);
  //console.log(winner);
  let message = `You picked ${playerSelection || DEFAULT_CHOICE}, computer picked ${compSelection}, therefore `; //The or condition is added in case player selection was undefined
  if (winner === DRAW) {
    message += `you have a draw.`;
  } else if (winner === PLAYER_WIN) {
    message += `you win.`;
  } else {
    message += `you lost.`;
  }
  alert(message);
  gameRunning = false;
});

//not related to the game
//how do we make this function accept different amounts of args...if you pass too many, JS does care
//You could pass an array, but...
//or the rest operator can construct one for you...the 3 dots at the beginning of the parameter (at the end is the spread operator)
//this will build an array from all the arguments passed (singularly), so you don't need to pass the arg as an array
//you can only have one rest operator in the parameter list and it needs to be the last arg because it will consume all args and merge into an array
//if you have parameters before the rest operator, then the first args passed will be in those and the rest in an array
const sumUp = (a, b, ...numbers) => {
  //you can nest functions inside each other, just like objects because they are objects
  //this function now has block scope
  //usually functions should have global scope, but some cases where this makes sense
  const validateNumber = (number) => {
    return isNaN(number) ? 0 : number;
  };
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
};

//if not using an arrow function, you can also use the rest operator and it also has the automatic arguments variable - ONLY when using the function keyword
//but this is bad practice, should use rest operator
// const subtractUp  = function() {
//   let sum = 0;
//   for (const num of arguments) {
//     sum -= num;
//   }
//   return sum;
// }

console.log(sumUp(1, 5, 10, -3, 6, 10));
//console.log(subtractUp(1, 10, 15, 20));