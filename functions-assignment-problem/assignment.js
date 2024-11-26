function sayHello(name) {
  console.log('Hi ' + name);
}

// 1 - re-write this function as the most succinct arrow function
const sayHelloArrow = name => console.log('Hi ' + name);

// 2 - now adjust 3 times: 
    // a. make the 'Hi ' part a parameter/arg setup so it is more dynamic
    // b. no arguments/ hard-coded in function body
    // c. with one returned value
const sayHelloTwo = (greeting, name) => console.log(greeting + name);
const sayHelloNone = () => {
  let greeting = "Hi ";
  let name = 'Mikaela';
  console.log(greeting + name);
};
const sayHelloReturn = name => 'Hi ' + name;

// 3 - add a default argument/fallback value for the phrase if none provided
const sayHelloDefault = greeting => console.log(greeting = 'Hello world!');

// 4 - new function to take an unlimited amount of args or execute a callback if it has at least one arg value
const emptyHandler = () => {
  console.log('All not empty! But this doesn\'t work...');
};

function sayHelloRest (cb, ...greeting) {
  let emptyText = false;
  for (const text of greeting) {
    if (!text) {
      emptyText = true;
      break;
    }
  }
  if (!emptyText) {
    cb();
  }
};

//function calls:
//function declaration
sayHello('Mikaela');
//arrow function with one param
sayHelloArrow('Mikaela');
//arrow function with two params
sayHelloTwo('Hi ', 'Mikaela');
//arrow function with no params - hard coded in function
sayHelloNone();
//arrow function that returns a value
let name = 'Mikaela';
console.log(sayHelloReturn(name));
//default value
sayHelloDefault();
//takes unlimited args and includes a callback handler that throws an exception if the greeting arg is undefined or empty
// try {
  sayHelloRest(emptyHandler, '');
//} catch (exception) {
  //console.log('You need to pass parameters...');
//}
