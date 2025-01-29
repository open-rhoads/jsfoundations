// you could write prodecural code and select the buttons, use global arrays, 
// and move the elements between the arrays
// but let's practice an object oriented approach 
// use classes to get the element, perform the logic

// ProjectItem class
class ProjectItem {
  // constructor accepts the id (sent from the project list that is looping and calling this constructor)
  // and stores it as a property of the ProjectItem
  // also accepts a callback function, which will be the switchProject
  constructor(id, updateProjectListsFunction) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.finishActivateButton();
    this.connectMoreInfoButton();
  }
  //methods for event listeners on the buttons
  finishActivateButton() {
    const projectItemElement = document.getElementById(this.id);
    // selects the last button in the element with the passed id that we stored above
    const finishActivateBtn = projectItemElement.querySelector('button:last-of-type');
    // add click event listener to the button to execute a method from ProjectList...the updateProjectListsHandler, 
    // which was passed to the constuctor
    finishActivateBtn.addEventListener('click', this.updateProjectListsHandler);
  }
  connectMoreInfoButton() {

  }
}

// Tooltip class for the button
class Tooltip {

}

// ProjectList class
class ProjectList {
  // logic to parse the lists...
  projects = [];
  // constructor accepts an argument to indicate which list (type)
  constructor(type) {
    this.type = type;
    const projItems = document.querySelectorAll(`#${type}-projects li`);
    // console.log(projItems);
    // for loop through the project items and push a new project item to the projects array property
    // passing the id by using the DOM property that yields the HTML id
    for (const projItem of projItems) {
      //passing in the applicable id and the switchProject method to new ProjectItem constructor
      // & need to bind(this) because otherwise the event listener would make 'this' refer to global document object
      this.projects.push(new ProjectItem(projItem.id, this.switchProject.bind(this)));
    }
    console.log(this.projects);
  }
  //we cannot use the constructor for the callback function that will switch items between lists
  // because we need each list to be finished before we can swap items, so we add a method here
  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }
  addProject() {
    // this is the method to add the item to another list
    console.log(this);
  }
  switchProject(projectId) {
    // removes it from the projects array of the contxtual list and calls a different method in the other list to add it there
    // you could use the findIndex() method for arrays to find the item with the matching passed id
    // const projectIndex = this.projects.findIndex(p => p.id === projectId);
    // then splice the array to remove the specific item at the index above, just 1 item
    // this.projects.splice(projectIndex, 1);
    // could also use filter() on this.projects for all elements where the items are not equal instead
    this.projects = this.projects.filter(p => p.id !== projectId);
    // we cannot simply call this.addProject() because it would refer to this same contextual ProjectList
    // so instead, we use a callback method that is passed in as param that we set as a property and call it here
    // and we pass in the specific project by using the find() method on the projects array 
    // (& pass an anonymous function) to find the project whose id equals the passed projectId
    this.switchHandler(this.projects.find(p => p.id === projectId));
    
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
    // which it owuld normally refer to the switchProect method where it is called
    // so this approach allowsu s to call the addProject method of one list from inside another
    activeProjectsList.setSwitchHandlerFunction(
      finishedProjectsList.addProject.bind(finishedProjectsList)
    );
    finishedProjectsList.setSwitchHandlerFunction(
      activeProjectsList.addProject.bind(activeProjectsList)
    );
  }
}

App.init();