// const buttons = document.querySelectorAll('button'); // select all buttons. You would use querySelecotr() to select only the first button found
// const buttonClickHandler = e => { //add a handler function - this will accept the event object as a parameter
//   console.log(e); //let's log the event object to examine it
//   //e.target.disabled = true; // disable the button when it is clicked using the disabled property of the target property of event object
//   //alert('Button was clicked!');
// };
// const boundFn = buttonClickHandler.bind(this);
// // One approach is to use the addEventListener() method - this is preferred
// buttons.forEach(btn => { //use forEach() to loop through all the buttons and add event listener to each one
//   //btn.addEventListener('click', buttonClickHandler);
//   btn.addEventListener('click', buttonClickHandler);
// }) //lots of events you could pass - dblclick, contextmenu is right click

// also comes with a removeEventListener() method
//let's use a timer to do that
// setTimeout(() => {
//   buttons.removeEventListener('click', buttonClickHandler); //after 2 seconds, remove the event listener
// }, 2000); 
// you have to use the same event name and function for this to work
// problem if you use an anonymouse function, b/c it creates a new function each time even if it's the 'same code,' so don't do that
// same idea if you use bind() on the function because bind creates a new function object
// you would have to store the bound function in a constant and refer to it: const boundFn = buttonClickHandler.bind(this);

// Another approach is to set the onclick property of the element.
// we could use an anonymous function, but we'll use the above
// button.onclick = buttonClickHandler; //downside to this approach is you can only attach one event/function

// the code below uses properties of the document.body and document.documentElement to implement an 'infinite scroll' event handler
// measure the total distance between our viewport (top left corner of what we currently see) and the end of the page (not just the end of our currently visible area) => Stored in distanceToBottom.
// For example, if our browser window has a height of 500px, then distanceToBottom could be 684px, assuming that we got some content we can scroll to.
// Next, we compare the distance to the bottom of our overall content (distanceToBottom) to the window height + a certain threshold (in this example 150px). 
// document.documentElement.clientHeight is preferable to window.innerHeight because it respects potential scroll bars.
// If we have less than 150px to the end of our page content, we make it into the if-block (where we append new data).
let curElementNumber = 0;
function scrollHandler() {
    const distanceToBottom = document.body.getBoundingClientRect().bottom;
 
    if (distanceToBottom < document.documentElement.clientHeight + 150) {
        const newDataElement = document.createElement('div');
        curElementNumber++;
        newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
        document.body.append(newDataElement);
    }
}
window.addEventListener('scroll', scrollHandler);

//form events
const form = document.querySelector('form');
form.addEventListener('submit', e => { //only form elements have the submit event
  e.preventDefault(); // exists for many elements and prevents the default behavior of the browser for that element
  console.log(e); // we won't really see this unless we prevent the default of submitting the form
  //then you would need to send the data yourself after validation - HTTP request, which we will cover later
});