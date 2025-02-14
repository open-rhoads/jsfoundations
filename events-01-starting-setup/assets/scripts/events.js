const button = document.querySelector('button'); // select button(s). querySelector() or querySelecotorAll()
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

// add another button listener...let's examine event propagation
// with these techniques, we can create event delegation
const div = document.querySelector('div');
div.addEventListener('click', event => {
  console.log('Clicked the div!');
  console.log(event);
}, true);
button.addEventListener('click', function(e) { //converted to traditional function syntax so that 'this' is respected and refers to the element that triggers the event
  e.stopPropagation();
  e.stopImmediatePropagation();
  console.log('Clicked the button!');
  console.log(e);
  console.log(this);
});

// delegation to color a clicked list item

// APPROACH 1: select all list items. this approach is cumbersome to add all the listeners and it can be bad for performance
const listItems = document.querySelectorAll('li');
// loop through and pass each one to anonymous function
// listItems.forEach(listItem => {
//   listItem.addEventListener('click', e => {
//     e.target.classList.toggle('highlight'); //toggle the highlight class, which we will style with CSS
//   });
// });

// APPROACH 2: delegation via propagation of the event bubbling up - this accomplishes the same as above with only one listener
const list = document.querySelector('ul');
list.addEventListener('click', function(e) {
     // e.target.classList.toggle('highlight'); //toggle the highlight class, which we will style with CSS
     // even though this listener is on the whole list, the target will refer to the list item that is clicked
     // this is problematic though if the element has children, it's possible that not the whole item gets highlighted
     // there is currentTarget, which is always the element that has the listener, but this is also not what we need (would be the whole list)
     // instead we can use event.target with the closest() method (exists for all DOM elements) and pass in a selector - finds closest matching ancestor
     e.target.closest('li').classList.toggle('highlight'); // includes the element you clicked
     //form.submit(); // this triggers this event programmatically - available for other events and DOM elements too
     button.click(); 
     // how is this the submit when it is not the first button and we used querySelector()...
     console.log(this); // this is the currentTarget - the element that has the listener
});

// instead of listening, you might want to trigger an event to occur programmatically
// i.e. when we click any list item, we want the form to submit
// if you trigger a submit event programmatically, any respective event listener that is defined is skipped
// the click event does not do this, so you could get around it by using a click event on the submit button instead

// one note about the 'this' keyword - in a listener it is bound to the event source...


