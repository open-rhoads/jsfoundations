// simple pure function example
// pure functions are more predictable and if possible, a best practice
function add(num1, num2) {
  return num1 + num2;
}

console.log(add(1, 5)); // 6
console.log(add(12, 15)); // 27

// impure function - the random function will produce different output for the same input every time

function addRandom(num1) {
  return num1 + Math.random();
}

console.log(addRandom(5));

// side effects are also considered impure - does it change anything outside (http request, db call, etc)
let previousResult = 0;
function addMoreNumbers(num1, num2) {
  const sum = num1 + num2;
  // this is a side effect because you change an outside variable
  previousPresult = sum;
  return sum;
}
console.log(addMoreNumbers(1, 5));

// it would also be impure if it modifies any passed arrays or objects as below
const hobbies = ['Sports', 'Cooking'];
function printHobbies(h) {
  h.push('NEW HOBBY');
  console.log(h);
}
printHobbies(hobbies);

// factory function example

let multiplier = 1.1;

function createTaxCalculator(tax) {
  // tax is no longer used once outer function is called and inner function is created, 
  // but JS will still hold the value that is stored in there if the inner function is called again 
  // (as we do below when we pass in the amount to the created function)
  // EVERY function behaves like this
  function calculateTax(amount) {
    // parameters from the outer function params can be used here in the inner function
    console.log(multiplier);
    return amount * tax * multiplier;
  }

  return calculateTax; // return a pointer to the function with preconfigured tax amount
}
// now these calls return the function with the specified tax rate
const calcVatAmount = createTaxCalculator(0.19);
const calcIncomeTaxAmount = createTaxCalculator(0.25);
// if we change the multiplier here before we pass the amount to the created functions, the function will use this new value
// function always uses the latest value for all in scope variables used
// every function closes around its environment and registers all variables in their most current state
multiplier = 1.2;
console.log(calcVatAmount(100));
console.log(calcVatAmount(200));

// let's discuss closures - EVERY function is a closure
let userName = 'Mikaela';
function greetUser() {
  //let name = 'Anna';
  console.log('Hi ' + name);
}
let name = 'Maximilian';
userName = 'Minnie'; // If we do this, because every function is a closure, 
// it will use this new value inside the function. The function reflects the value change
// moving to the approach where we create a new variable inside the function 
// and store the value of the global variable, we STILL get the latest value 
// because the function stores a pointer to the outside environment and uses the latest value
// only if we use a new variable inside the function with a new value and then 
// even if we have a variable with the same name outisde, it will finally use the value inside the funciton
// inner function variable will override, it won't need to check the outer environment
greetUser();

// recursion 
// can make the below code shorter (which currently requires a loop)... with recursion
// function powerOf(x, n) {
//   let result = 1; // if we start result at one, it will equal the value of x on the first turn of the loop below when we multple by it
//   for (let i = 0; i < n; i++) {
//     result *= x; // result equals x on the frist turn and the loop continues to multiply by x n times
//   }
//   return result;
// }

// recursive functions calls itself
function powerOf(x, n) {
  // we need an exit condition to prevent infinite loop
  // once n is equal to 1, we have run the loop n times and we no longer want to call the function / we want to exit the loop
  // if (n === 1) {
  //   return x; // don't call the function another time and just return the accumulated value of x
  // }
  // return x * powerOf(x, n - 1); // calls itself and passes the next smaller value for n each time... basically passing n-1 as n
  // since it's returning x multiplied by this value and it's calling itself, x is getting multiplied by itself each time and therefore getting larger
  // use a breakpoint in the dev tools to make this even clearer - look at the call stack and keep stepping into the function to see the function calls in action
  // you can use a ternary to make it even shorter
  return n === 1 ? x : x * powerOf(x, n-1);
  // recursion is not only shorter, but can also solve other problems
}
console.log(powerOf(2, 3)); // 2 to the 3rd power

// advanced recursion - 
// the below objects have the same structure and are nested as deep as we want, we are unsure of the levels of nesting - this is a common problem
// i.e. rendering a folder structure and sub-folders - you don't know how many the user will create
const myself = {
  name: 'Mikaela',
  friends: [
    {
      name: 'Kitrina'
    },
    {
      name: 'Sarah',
      friends: [
        {
          name: 'Jessica'
        },
        {
          name: 'Marah'
        }
      ]
    }
  ]
}

function printFriendNames(person) {
  // we could use nested for loops to try to print all the nested friends, but we don't know how many layers we need to go...and it's hard to read
  // maybe you have an app where the structure you're displaying was created by the user, so you don't know how many
  // use recursion instead...
  const collectedNames = [];
  // use for of to loop through the first layer of the friends property of the object...
  if (!person.friends) {
    return []; // if there is no friends object, we just return and empty array and end
    // this happens anytime there is no friends object
  }
  for (const friend of person.friends) { // if we pass the object, we loop through the friends property
    // push the friends' names of the first layer of the person object
    collectedNames.push(friend.name);
    // use recursion to call the function again and pass the contextual friend object
    // so now it would loop through the next layer of friends object until they don't exist...
    // using the spread ... operator and the push() method, we can then spread the names of the lower layers of friends objects into the same array
    collectedNames.push(...printFriendNames(friend));
    // now no matter how the object structure changes, it will still print the names. Make sure you ALWAYS have an exit condition!
    // again, use breakpoints in the console to analyze further
  }
  return collectedNames;
}

console.log(printFriendNames(myself));