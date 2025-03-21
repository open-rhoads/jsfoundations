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
  // const promise = new Promise((resolve, reject) => {
    // Let's create an XMLHttpRequest object that will allow us to send Http requests
    // This object is built into the browser - all broswers support it
  //   const httpRequest = new XMLHttpRequest();
  //   httpRequest.setRequestHeader('Content-Type', 'application/json');
  //   // use the object to configure the request by calling the open() method
  //   // just the first step to configure request, takes 2 args, the method as a string, and the URL
  //   httpRequest.open(method, url); // normally you probably need credentials/a key too...
  //   // If we set the responseType property to 'json' the XMLHttpRequest object will return JSON and there is no need to parse below
  //   httpRequest.responseType = 'json';
  //   // we can see the request in the network tab of dev tools and click it to see the data/click headers to see the info
  //   // once the request completes (sends below), the load event occurs (data is loaded)
  //   // what if we want to hook up the request to a DOM event - event listener
  //   // XMLHttpRequests don't always support addEventListener(), so it is more common to assign a function to the .onload property
  //   httpRequest.onload = function() { // this will happen asynchronously & the tasks below will continue until response is received
  //     // we don't need an argument for the data; we can handle it with .response
  //     // console.log(httpRequest.response); // this is returning JSON data & you must work with it as such
  //     // you can also use the default JSON object in JS and its methods to parse the JSON 
  //     // .stringify() to get JSON from JS values (object, array, etc) and .parse() to get JS values from JSON
  //     // const listOfPosts = JSON.parse(httpRequest.response); // this will turn the JSON into a JS array
  //     // pass the data to the resolve callback, if it occurs. Add error handling for server errors where a response is received, but it indicates server issue
  //     // this logic handles certain error codes 
  //     if (httpRequest.status >= 200 && httpRequest.status < 300) {
  //       resolve(httpRequest.response); // Resolve with the response data
  //     } else {
            // when using XMLHttp, you can still access the response here for error handling
            // httpRequest.response;
  //       reject(new Error('Something went wrong!')); // Reject on failure - server issue
  //     }
  //   }
  //   // handle an error - this will trigger if so. It only triggers if the error is a network failure or similar. NOT for server side issues
  //   // if anything is returned, even an error message, then it will go to the onload event
  //   httpRequest.onerror = function() {
  //     reject(new Error('Failed to send request!')); // Reject on network error
  //     console.log(response, httpRequest.status);
  //   };

  //   httpRequest.send(JSON.stringify(data)); // this actually sends the request. We can append the data passed in as a param to the response by passing it here in JSON FORM
// });
//   return promise; // return the promise 

  // let's use the more modern fetch() API; centered around the global fetch() function in JS
  // fetch takes a URL & an optional object parameter to configure the request. It is natively Promise based, so we don't need to build one
  // there are also response.text() for text & response.blob() for files, but not applicable here 
  return fetch(url, {
    // some keys you can set here like method
    method: method,
    body: data/* JSON.stringify(data) */, // If we are passing FormData to the request, we don't need a header and the data can be sent without parsing
    // headers: { // extra information for the request
    //   'Content-Type': 'application/json' // this is a typical header added to JSON POST requests because it tells the server to expect JSON
    // }
  }).then(response => {
    // let's implement a condition here to catch any server responses that indicate an issue
    if (response.status >= 200 && response.status < 300) {
      return response.json(); // unlike XMLHttpRequest, fetch() does not give parsed response. You have to use the response.json() method
      // which yields a new Promise and turns the 'streamed' data into a 'snapshot'
    } else {
      // because the data is streamed with the fetch method, it is not longer available here
      // we need to call response.json() again, which will still not yield the exact data, but a promise.
      return response.json().then(errorData => { // turn the response to json again, returning promise and use .then() to handle the error data
        console.log(errorData);
        throw new Error('Something went wrong - server side.');
      }); // you have to return this promise chain to get the error object to work right
      // we cannot use another .then() method above to return response.json() no matter what and then check the response status; because the response object would then not be available anymore
      // we also cannot nest another .then() method inside this existing one...
    }
  }) /* .catch(e => { }) */; 
  // using a catch method here or a catch block elsewhere would not catch server issues 
  // where there is technically a response, but it is a server issue, just like with the XMLHttpRequest
}

async function getPosts() {
  try {
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
  } catch (error) {
    // alert(error.message);
    console.log(error); // this catches the error, if it gets generated when the promise returns from Http function above
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

  const formData = new FormData(form); // this is built into JS/the browser where you can add key/value pairs; sent differently than json. Different format
  // if we pass a form element to the FormData constructor, it will try to parse the values in the form fields, but they need the name attribute
  // now we can use the append() method to add any additional key/value pairs and prepare the form data object which can be sent in the response
  // formData.append('title', title);
  // formData.append('body', content);
  formData.append('userId', postId);

  try { // use our Http Request function to send a POST request this time, same URL, send the post data for the body using the optional third argument
    const response = await sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', formData);
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




