const defaultResult = 0;
let currentResult = defaultResult;
let logEntries = [];

// Gets input from input field
function getUserNumberInput() {
  return parseInt(usrInput.value);
}

// Generates and writes calculation log
function createAndWriteOutput(operator, resultBeforeCalc, calcNumber) {
  const calcDescription = `${resultBeforeCalc} ${operator} ${calcNumber}`;
  outputResult(currentResult, calcDescription); // from vendor file
}

function writeToLog(
  operationIdentifier,
  prevResult,
  operationNumber,
  newResult
) {
  const logEntry = {
    operation: operationIdentifier,
    prevResult: prevResult,
    operand: operationNumber,
    newResult: newResult,
  };
  logEntries.push(logEntry);
  console.log(logEntries);
}

function calcResult(calcType) {
  const enteredNumber = getUserNumberInput();
  const initialResult = currentResult;
  let mathOperator;
  if (calcType === 'ADD') {
    currentResult += enteredNumber;
    mathOperator = '+';
  } else if (calcType === 'SUBTRACT') {
    currentResult -= enteredNumber;
    mathOperator = '-';
  } else if (calcType === 'MULTIPLY') {
    currentResult *= enteredNumber;
    mathOperator = '*';
  } else if (calcType === 'DIVIDE') {
    currentResult /= enteredNumber;
    mathOperator = '/';
  }

  if (
    calcType !== 'ADD' &&
    calcType !== 'SUBTRACT' &&
    calcType !== 'MULTIPLY' &&
    calcType !== 'DIVIDE'
  ) {
    return; //this will stop the rest of the code from running if there is no valid calcType
  }
  createAndWriteOutput(mathOperator, initialResult, enteredNumber);
  writeToLog(calcType, initialResult, enteredNumber, currentResult);
}

function add() {
  calcResult('ADD');
}

function subtract() {
  calcResult('SUBTRACT');
}

function multiply() {
  calcResult('MULTIPLY');
}

function divide() {
  calcResult('DIVIDE');
}

addBtn.addEventListener('click', add);
subtractBtn.addEventListener('click', subtract);
multiplyBtn.addEventListener('click', multiply);
divideBtn.addEventListener('click', divide);
