// you could write prodecural code and select the buttons, use global arrays, 
// and move the elements between the arrays
// but let's practice an object oriented approach 
// use classes to get the element, perform the logic

// ProjectItem class
class Projectitem {

}

// Tooltip class for the button
class Tooltip {

}

// ProjectList class
class ProjectList {
  // logic to parse the lists...
  // constructor accepts an argument to indicate which list
  constructor(type) {
    const projItems = document.querySelectorAll(`#${type}-projects li`);
    console.log(projItems);
  }
}

// overall App class
class App {
  static init() {
    // logic to create the ProjectLists...
    const activeProjectsList = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');
  }
}

App.init();