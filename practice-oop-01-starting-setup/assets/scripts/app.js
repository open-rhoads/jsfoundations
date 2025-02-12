// you could write prodecural code and select the buttons, use global arrays, 
// and move the elements between the arrays
// but let's practice an object oriented approach 
// use classes to get the element, perform the logic

//add inheritance - base component class with detch and attach methods
class Component {
  constructor(hostElementId, insertBefore = false) {
    //if an id is provided
    if (hostElementId) {
      //set it as a property of the class
      this.hostElement = document.getElementById(hostElementId);
    } else { //otherwise, set the body as the hostElement
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore; //store insertBefore in property
  }
  detach() {
    //check if element is set
    if (this.element) {
      this.element.remove(); //remove the element
    }
    //this.element.parentElement.removeChild(this.element); //remove it for older browsers that don't support remove()
  }
  attach() {
    //use insertAdjacentElement() method and pass ternary expression to define the id...where to place...
    this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
    // document.body.append(this.element); new approach
  }
}

// Tooltip class for the button
class Tooltip extends Component {
  //constructor accepts a function to indicate whether the tooltip is closed...
  constructor(closeNotifierFunction) {
    super(); //no values will mean it as appended to the body default. we can include an id and/or true to move tooltip
    this.closeNotifier = closeNotifierFunction;
    this.create(); //run the create method so the toolTip element is instantiated
  }
  closeTooltip = () => {
    this.detach();
    this.closeNotifier(); //call the closeNotifier when the tooltip is closed, 
    // which is the anonymous function that will set hasActiveTooltip to false
  }

  create() {
    console.log('Here is the Tooltip...');
    //create a tooltip element and add a class that will give it some styling
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    tooltipElement.textContent = 'Heyyyy!'; //text content
    // event listener to call the detach() method and remove the tooltip 
    // need tp use bind(this) so it will refer to the class, not the global object (event listener)... 
    // OR use an arrow function for the closeTooltip method, slightly less efficient, but ok in this app/let's demo
    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement; //store the tooltip element as a property so the detach() method can refer to it
  }

}

//helper class for moving a ProjectItem DOM node
class DOMHelper {
  //static method to clear the event listener when an Item is moved from one list to another to prevent memory leak
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true); // create a clone of the element that is passed
    element.replaceWith(clonedElement); // replace the element with itself/the clone...
    return clonedElement; // return it...
  }
  //static method to move the element
  static moveElement(elementId, newDestinationSelector) {
    //grab the element to move by Id
    const element = document.getElementById(elementId);
    //grab the new location using the passed query CSS selector
    const destinationElement = document.querySelector(newDestinationSelector);
    //use append() method, which will not copy, but move the element
    destinationElement.append(element);
  }
}

// ProjectItem class
class ProjectItem {
  // constructor accepts the id (sent from the project list that is looping and calling this constructor)
  // and stores it as a property of the ProjectItem
  // also accepts a callback function, which will be the switchProject
  constructor(id, updateProjectListsFunction, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectSwitchButton(type);
    this.connectMoreInfoButton();
  }
  //methods for event listeners and logic for the buttons
  //'switch' button that says either Finish or Activate
  //let's accept a type here to indicate which list we are in
  connectSwitchButton(type) {
    //add property to indicate if tooltip exists (initially false)
    this.hasActiveTooltip = false;
    const projectItemElement = document.getElementById(this.id);
    // selects the last button in the element with the passed id that we stored above
    let switchBtn = projectItemElement.querySelector('button:last-of-type');
    //now we need to use clear any existing event listeners from the button before we add a new one, using the helper function in the DOMHelper class
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    //change the text content of the button depending on which list it is in, based on the type passed above
    switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
    // add click event listener to the button to execute a method from ProjectList...the updateProjectListsHandler, 
    // which was passed to the constuctor and is the switchProject() method of the ProjectList
    // we are using bind with first argument null, because we do not need to alter 'this'
    // but we are using the second argument to pass the id of the project when the button is clicked - this was causing logic error
    switchBtn.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
    // we need to update the click event above once the project is moved/switched, 
    // because the handler was tied to the addPorject() method of the opposite list which it is now in
  }
  update(updateProjectListsFunction, type) {
    // reset the updateProjectListsHandler property to the function that is passed, 
    // which is the new swicthProject function for the correct list it is now in
    this.updateProjectListsHandler = updateProjectListsFunction;
    // now we call the connectSwtchButton() function again to add back the event listener...
    // so now it gets tied to the new updateProjectListsHandler that we set
    this.connectSwitchButton(type);
  }
  //this is the helper method for the tooltip button
  showMoreInfoHandler() {
    //check the hasActiveTooltip property and return if true to prevent duplicates if there is already one
    if (this.hasActiveTooltip) {
      return;
    }
    //before we create a Tooltip, let's access the DOM 
    //create a new tooltip using the tooltip class
    //passing an anonymous function that will set the hasActiveTooltip property to false
    const tooltip = new Tooltip(() => {
      this.hasActiveTooltip = false;
    });
    //call the attach() method of the tooltip class
    tooltip.attach(); 
    this.hasActiveTooltip = true;
  }
  //this is the tooltip button
  connectMoreInfoButton() {
    //grab both buttons using methods from the DOM
    const projectItemElement = document.getElementById(this.id); 
    const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
    //add event listener to the More Info button to call another event handler
    moreInfoBtn.addEventListener('click', this.showMoreInfoHandler);
  }
}

// ProjectList class
class ProjectList {
  // logic to parse the lists...
  projects = [];
  // constructor accepts an argument to indicate which list (type)
  constructor(type) {
    this.type = type;
    //selecting and storing all the list items from the specified list type
    const projItems = document.querySelectorAll(`#${type}-projects li`);
    // console.log(projItems);
    // for loop through the project items and push a new project item to the projects array property
    for (const projItem of projItems) {
      //passing in the applicable id and the switchProject method to new ProjectItem constructor
      // & need to bind(this) because otherwise the event listener would make 'this' refer to global document object
      // passing the id by using the DOM property that yields the HTML id
      this.projects.push(new ProjectItem(projItem.id, this.switchProject.bind(this), this.type));
    }
    console.log(this.projects);
  }
  //we cannot use the constructor for the callback function that will switch items between lists
  // because we need each list to be finished before we can swap items, so we add a method here
  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }
  //this is called when set as the switchHandler (upon App init) & set on event listener of the projectItem buttons
  addProject(project) {
    // this is the method to add the item to another list
    console.log(project);
    // push the project that was passed to the projects list of this list
    this.projects.push(project);
    // move DOM node... use helper class created above and call the moveElement method, 
    // passing the project id and the ul selector within the applicable list id
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    //here we will call an update method to update the switch handler and pass in a new handler
    //therefore, once the project is moved to a new list above, the handler will be referring to the wrong list
    //so we will call the update() method and pass the same reference code,
    // but 'this' will now be referring to the new list that the Item is in
    // we're also passing in the type of the new list to help update the button caption
    project.update(this.switchProject.bind(this), this.type);
  }
  switchProject(projectId) {
    // removes it from the projects array of the contxtual list and calls a different method in the other list to add it there
    // you could use the findIndex() method for arrays to find the item with the matching passed id
    // const projectIndex = this.projects.findIndex(p => p.id === projectId);
    // then splice the array to remove the specific item at the index above, just 1 item
    // this.projects.splice(projectIndex, 1);
    // could also use filter() on this.projects for all elements where the items are not equal instead
    this.switchHandler(this.projects.find(p => p.id === projectId));
    this.projects = this.projects.filter(p => p.id !== projectId);
    // we cannot simply call this.addProject() because it would refer to this same contextual ProjectList
    // so instead, we use a callback method that is passed in as param that we set as a property and call it here
    // and we pass in the specific project by using the find() method on the projects array 
    // (& pass an anonymous function) to find the project whose id equals the passed projectId
    
    
  }
}

// overall App class
class App {
  static init() {
    // logic to create the ProjectLists...we need to pass the id and the callback function to switch items
    // we created in the ProjectList class
    const activeProjectsList = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');
    // here we call the setSwitchHandlerFunction() method of the activeProjectsList 
    // and pass the finishedProjectsList.addProject method as the 'switchHandler'
    // don't call it yet, it will be executed in the switchProject() method when the switchHandler() is called
    // you need to bind(finishedProjectsList) so 'this' will refer to it... 
    // which it would normally refer to the switchProect method where it is called
    // so this approach allows us to call the addProject method of one list from inside another
    // so basically the switch handler for each list is being set as the addProject method of the other list...
    // so in each list, we 'switch' by adding it to the other list
    activeProjectsList.setSwitchHandlerFunction(
      finishedProjectsList.addProject.bind(finishedProjectsList)
    );
    finishedProjectsList.setSwitchHandlerFunction(
      activeProjectsList.addProject.bind(activeProjectsList)
    );
  }
}

App.init();