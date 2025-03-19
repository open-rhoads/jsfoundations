// Let's work with HTTP requests and APIs
// We need a server; which we could use Node as en evironment to run JS on the server 
// For now, we'll use a dummy API server - https://jsonplaceholder.typicode.com/ - shows the available routes (or endpoint URLs & methods)

const listElement = document.querySelector('.posts'); // get the list in the HTML where we want to output
const postTemplate = document.getElementById('single-post'); // get the single post template in the HTML
const form = document.querySelector('#new-post form'); // get the post form
const fetchButton = document.querySelector('#available-posts button'); // get the submit/add button within the post form
const postList = document.querySelector('ul'); // get the post list element

// let's make a re-usable function for sending XML Http Requests - it accepts a method and URL
function sendHttpRequest(method, url, data) {
  // let's create a promise for the Http Request and we can handle errors and make the HTML rendering dependent on the return of data with .then()
  const promise = new Promise((resolve, reject) => {
    // Let's create an XMLHttpRequest object that will allow us to send Http requests
    // This object is built into the browser - all broswers support it
    const httpRequest = new XMLHttpRequest();
    // use the object to configure the request by calling the open() method
    // just the first step to configure request, takes 2 args, the method as a string, and the URL
    httpRequest.open(method, url); // normally you probably need credentials/a key too...
    // If we set the responseType property to 'json' the XMLHttpRequest object will return JSON and there is no need to parse below
    httpRequest.responseType = 'json';
    // we can see the request in the network tab of dev tools and click it to see the data/click headers to see the info
    // once the request completes (sends below), the load event occurs (data is loaded)
    // what if we want to hook up the request to a DOM event - event listener
    // XMLHttpRequests don't always support addEventListener(), so it is more common to assign a function to the .onload property
    httpRequest.onload = function() { // this will happen asynchronously & the tasks below will continue until response is received
      // we don't need an argument for the data; we can handle it with .response
      // console.log(httpRequest.response); // this is returning JSON data & you must work with it as such
      // you can also use the default JSON object in JS and its methods to parse the JSON 
      // .stringify() to get JSON from JS values (object, array, etc) and .parse() to get JS values from JSON
      // const listOfPosts = JSON.parse(httpRequest.response); // this will turn the JSON into a JS array
      // pass the data to the resolve callback, if it occurs
      if (httpRequest.status >= 200 && httpRequest.status < 300) {
        resolve(httpRequest.response); // Resolve with the response data
      } else {
        reject('Request failed. Status: ' + httpRequest.status); // Reject on failure
      }
    }
    // handle an error
    httpRequest.onerror = function() {
      reject('Network error'); // Reject on network error
    };
    httpRequest.send(JSON.stringify(data)); // this actually sends the request. We can append the data passed in as a param to the response by passing it here in JSON FORM
  });
  return promise; // return the promise 
} 

async function getPosts() {
  const responseData = await sendHttpRequest(
    'GET',
    'https://jsonplaceholder.typicode.com/posts'
  );
  // instead of using the .response property of the httpRequest, we can tap into the responseData directly stored in the variable via async await
  const listOfPosts = responseData; 
  console.log(listOfPosts); // check for the data. We'll work with in inside this function because the next tasks will run while async code does & data not accessible outside
  // let's loop through the data returned from the promise above when calling sendHttpRequest() and output HTML
  for (const post of listOfPosts) {
    // use for of because it's object notation
    // let's use DOM methods to store the post template using the importNode() method
    const postEl = document.importNode(postTemplate.content, true); // this makes a clone of the template
    postEl.querySelector('h2').textContent = post.title.toUpperCase(); // select the heading and put the .title property value in it
    postEl.querySelector('p').textContent = post.body; // select the paragraph and put the .body property value in it
    postEl.querySelector('li').id = post.id; // attach the post id as the HTML id, so we can properly delete a post
    listElement.append(postEl); // append the posts to the list element
  }
}

// async function to send/add a new post 
async function createPost(title, content) {
  const postId = Math.random(); // generate a random ID... this is not always random...
  const post = { // create a post object with the exact properties expected from the API
    title: title,
    body: content,
    userId: postId
  };
  try { // use our Http Request function to send a POST request this time, same URL, send the post data for the body using the optional third argument
    const response = await sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
    // Log the response data to check its structure
    console.log('Full response from the API:', response);
    // Check the structure of the response
    if (response && response.id) {
      // Log the individual properties after confirming they exist
      console.log('Post created - ID:', response.userId);
      console.log('Post title:', response.title); // Access the title property
      console.log('Post body (content):', response.body); // Access the body/content property
    } else {
      console.error('Response structure is not as expected:', response);
    }
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

// instead of simply calling the getPosts() function, let's tie it to an event listener
fetchButton.addEventListener('click', getPosts);

// let's also add an event listener for the add button in form
form.addEventListener('submit', async e => { // use async/await for this will happen asynchronously
  e.preventDefault(); // Don't submit the form

  const enteredTitle = e.currentTarget.querySelector('#title').value; // get the title value
  const enteredContent = e.currentTarget.querySelector('#content').value; // get the content value

  // Log the entered values
  console.log('Entered Title:', enteredTitle);
  console.log('Entered Content:', enteredContent);

  // Ensure the values are not empty
  if (!enteredTitle || !enteredContent) {
    console.error('Title or content is empty');
    return;
  }

  await createPost(enteredTitle, enteredContent);
  
  // might want to adjust later to clear the values...right now clicking multiple times will always append the data
});

// now let's use an event listener to delete a post - we are putting it on the list so that it could apply to any children items
// and then we will use event.target.tagName === 'BUTTON' to check what element was clicked
postList.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    console.log('Clicked on button! ');
    const postId = e.target.closest('li').id; // use event.target.closest() to find the closest list item and its id property
    console.log(postId);
    // now we send another HttpRequest, but use DELETE as method and string literal to append the postId to the end of the URL string
    sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`); // check network tab to see this working
    // and then we would probably update the UI in real life, but we won't to save time.
  }
});




