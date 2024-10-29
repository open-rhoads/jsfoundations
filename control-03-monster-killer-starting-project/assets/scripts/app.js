//global constants for attack and heal values
const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER STRONG ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER HEAL';
const LOG_EVENT_GAME_OVER = 'GAME OVER';

//allow the user to set the max life value & check if valid
const enteredValue = prompt('Maximum life for you and the monster.', '100');
let chosenMaxLife = parseInt(enteredValue);
if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

//define variables for health and initialize with max life value
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
//Boolean for the bonus life - can only be used once
let hasBonusLife = true;
//array for the battle log
let battleLog = [];

//initialize the progress bars to the chosen max life value
adjustHealthBars(chosenMaxLife);

//conditional log of moves
function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };

  //without a break statement in a case, the switch statement will continue execute further cases
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = 'PLAYER';
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = 'PLAYER';
      break;
    default:
      logEntry = {};
  }

  //converting this if logic to a switch statement... which will allow for better handling for a default
  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry.target = 'MONSTER';
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = 'MONSTER';
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = 'PLAYER';
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry.target = 'PLAYER';
  // }

  battleLog.push(logEntry);
}

//reset function is called when the game ends
function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

//function to end the round. The monster always fires last and then we check if someone lost or there is a tie
function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You should be dead, but the bonus life saved you.');
  }
  //determine if the game is over
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'PLAYER WON!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'MONSTER WON!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'TIE GAME!',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  //if anyone is below or equal zero, then there is a loser or a draw, so reset
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

//function to attach the monster accepts the mode, delivers attack, then calls endRound()
function attackMonster(attackMode) {
  //using a ternary to determine the attack mode and assign the applicable attack value and log event
  const maxDamage = attackMode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = attackMode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

//handler functions for the attack and strong attack buttons call the attack function and pass the mode
function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

//the heal player function uses the heal value to heal the player if they have enough missing health or fills up the remainder if not.
function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

//using the console to output for now
function printLogHandler() {
  for (let i = 0; i < 3; i++) {
    console.log('-------------')
  }

  
  //although you can use a for loop through the object, there is the for of loop option for arrays, which is shorter to code
  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log(battleLog[i]);
  // }
  let i = 0;
  for (const logEntry of battleLog) {
    //console.log(logEntry);
    console.log(`#${i}`);
    for (const key in logEntry) {
      //console.log(key);
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++
  }
  //console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
