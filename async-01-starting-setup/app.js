const button = document.querySelector('button');
const output = document.querySelector('p');

// because the setTimeout() function doesn't support promises, we have to create one if we want to use it
// this will also help us understand promises better
// now here we have a callback function that accepts a duration, creates a new Promise, 
// and then runs setTimeout() inside the function that is run when the promise is created
// promise constructor takes a function - promise API executes the function right away
// the Promise object accepts two function params: resolve and reject. Basically what to do if the promise happens and what to do if it doesn't
const setTimer = (duration) => { 
  // The function passed to the Promise constructor will run right away. It accepts two args
  // the browser/JS engine will pass these functions in for us; we don't have to do anything further
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      // execute the resolve() function param; occurs after the duration (timer is done, promise occurs) - could also pass a value of data to it
      resolve('Done!'); // this will mark the promise as resolved/done
    }, duration);
  });
  return promise; // return the promise so we can use it whenever we call the function
}

const getPosition = (options) => {
  const promise = new Promise((resolve, reject) => {
    // you still have to pass the 3 params for success/fail callback and optional options, just the way it's built
    navigator.geolocation.getCurrentPosition(success => {
      // we'll take advantage of the fact that the success callback of the getCurrentPosition() method has a success object & log it
      resolve(success);
    }, error => {
      reject(error); // since we are using a promise, this error can be call the reject param and pass the error object from getCurrentPosition()
      // reject will mark the promise as failed 
    }, options);
  });
  return promise;
}

// refactoring the function to leverage async/await makes it much more concise to write .then() conditions (using await instead)
// await effectively replicates what the .then() block does behind the scenes. 
// async creates the initial wrapping promise and then await allows you to nest more promises inside and it will automatically return the data from their callback
async function trackUserHandler() {
  // console.log('Clicked!');
  // getCurrentPosition is a built in method of the navigator.geolocation object/property with 3 params: success callback, error callback, options object (optional)
  // let's refactor and 'promisify' it (see function above)
  // let positionData; // defining this here so we can refer to it in subsequent chained then() methods
  // let's add error handling - we can use a synchronous try/catch block:
  let posData; // now that we are using try/catch, let's define these variables here so they will have global scope and be available in and out of the blocks
  let timerData;
  try {
    posData = await getPosition();
    timerData = await setTimer(2000); 
  } catch (error) { // if the above promise fails, then this catch block will run 
    console.log(error);
  }
  console.log(timerData, posData);
    // here we are using promise chaining by leveraging multiple then() methods 
    // and returning something in the first one to keep the original promise pending until all are resolved
    // .then(posData => {
      // positionData = posData;
      //console.log(posData);
      // return setTimer(); // returning something inside of this one will make the promise pending again until this next promise resolves
      // we are using a promise, but you can return any data and it will be wrapped inside a promise that immediately resolves 
      // and the data can be passed to the next .then() block and its callback function
      // the second callback function argument for the then() method is an error handler if the promise fails... 
      // OR you can chain a catch() method anywhere in the chain. Both approaches will catch any errors that occurred before the place you add it...
      // but if one of the early then() methods causes error, it will skip subsequent then() methods until it finds a catch() block or second arg for then()
      // after it finds one of those, it would continue with any subsequent then() calls (if any)... 
      // so it doesn't cancel the whole promise block unless it's at the end. It will go back into pending when it continues to execute - positioning matters
    // }, error => {
    //   console.log(error);
    // }
    // )  
    // .catch(
    //   error => {
    //     console.log(error);
    //   }
    // ) 
    // now we can make another call to .then() before the whole promise is resolved
    // .then(data => { // this is the data from the second promise (setTimer())
    //   console.log(data, positionData);
    // });
  // navigator.geolocation.getCurrentPosition(
  //   // first param is anonymous callback function to log the position data that is returned if successful
  //   posData => {
  //     // now we add a timer before the data gets logged for the success callback 
  //     // nesting callbacks can get a little hard to read... let's turn it into a Promise
  //     // calling the new setTimer() function we defined above which creates a Promise to run the timer and returns it
  //     // now we don't need to pass a callback function, just the duration
  //     // now we can use the .then() method to do something after the promise runs...
  //     setTimer(2000).then(data => { // returns the promise & .then() executes after it resolves
  //       console.log(data, posData);
  //     }); 
  //   },
  //   // second param is anonymous function to log the error info if failure
  //   error => {
  //     console.log(error);
  //   }
  // );
  
  // what happens if we add a timer here outside the callback... this will still run after the code below 
  // because setTimeout() is passed off to the browser and has to use the message queue and event loop to get back in... 
  // even though the timer goes off after 0 milliseconds - this is the minimum time, not the guaranteed time (same for setInterval)
  // setTimer(1000).then(() => {
  //   console.log('Timer done!');
  // });
  
  // console.log('Getting Position...'); // this fires first in the console because everything else is asynchronous - ONLY if using raw Promises with .then() & .catch()
  // If you use async/await, then this will only fire after ALL the promises return/resolve 
  // because ALL the actions inside the function are wrapped inside a promise, so those actions are actually part of their own .then() block behind the scenes
  // one potential downside...if you want something to kick off simultaneously and not all one after another
  // there are ways around it by using a separate function for some tasks...
}

// this task is handed off to the browser so the rest of the script can continue and it's not perpetually listening for a click
// second argument is the callback function that happens after the browser finishes the task
button.addEventListener('click', trackUserHandler); 

// another example... this will take a minute and with no other action, the click event above would not fire until this loop finishes
// this would be the single threading in action. A loop cannot use multi threading...
// let result = 0;
// for (let i=0; i < 100000000; i++) {
//   result += i;
// }

// Promise methods
// what if we only want one - the faster one - to execute (i.e. wait one minute and if position not detected yet, then do something else) (could use setTimeout for this but w/e)
// the Promise.race() method takes an array of Promise calls and it returns a Promise/data with the result of the fastest one you passed to it
// so we can alse use then() to take action after it is returned and work with the data
// Promise.race([getPosition(), setTimer(1000)]).then(data => {
//   console.log(data);
// }); // it only cares about the fastest one and other promise results will not occur and are ignored (request is still sent, just ignored)

// sometimes you want something to happen only after multiple promises have occurred.
// of course, you can chain .then() blocks, but you could also use Promise.all()
// it returns the combined data of all the Promises
// Promise.all([getPosition(), setTimer(1000)]).then(promiseData => {
//   console.log(promiseData);
// }); // if one promise fails, then the other(s) are not executed. We wait for ALL to resolve or ONE to reject
// can handle error with catch block

// if you want to wait until all resolve or failed, there is also Promise.allSettled()
// Promise.allSettled([getPosition(), setTimer(1000)]).then(promiseData => {
//   console.log(promiseData); // this will return the result of all, no matter what. Does not cancel any Promise actions
// });

