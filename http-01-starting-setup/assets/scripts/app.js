// Let's work with HTTP requests and APIs
// We need a server; which we could use Node as en evironment to run JS on the server 
// For now, we'll use a dummy API server - https://jsonplaceholder.typicode.com/ - shows the available routes (or endpoint URLs & methods)

// First, let's create an XMLHttpRequest object that will allow us to send Http requests
// This object is built into the browser - all broswers support it
const httpRequest = new XMLHttpRequest();

// use the object to configure the request by calling the open() method
// just the first step to configure request, takes 2 args, the method as a string, and the URL
httpRequest.open('GET', 'https://jsonplaceholder.typicode.com/posts'); // normally you probably need credentials/a key too...

// we can see the request in the network tab of dev tools and click it to see the data/click headers to see the info
// once the request completes (sends below), the load event occurs (data is loaded)
// what if we want to hook up the request to a DOM event - event listener
// XMLHttpRequests don't always support addEventListener(), so it is more common to use the event handler .onload()
httpRequest.onload = function() {
  // we don't need an argument for the data; we can handle it with .response
  console.log(httpRequest.response);
}
httpRequest.send(); // this actually sends the request 

