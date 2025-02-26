class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  detach() {
    if (this.element) {
      this.element.remove();
      // this.element.parentElement.removeChild(this.element);
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement(
      this.insertBefore ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
}

class Tooltip extends Component {
  constructor(closeNotifierFunction, text, hostElementId) {
    super(hostElementId);
    this.closeNotifier = closeNotifierFunction;
    this.text = text;
    this.create();
  }

  closeTooltip = () => {
    this.detach();
    this.closeNotifier();
  };

  create() {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'card';
    const tooltipTemplate = document.getElementById('tooltip');
    const tooltipBody = document.importNode(tooltipTemplate.content, true);
    tooltipBody.querySelector('p').textContent = this.text;
    tooltipElement.append(tooltipBody);

    const hostElPosLeft = this.hostElement.offsetLeft;
    const hostElPosTop = this.hostElement.offsetTop;
    const hostElHeight = this.hostElement.clientHeight;
    const parentElementScrolling = this.hostElement.parentElement.scrollTop;

    const x = hostElPosLeft + 20;
    const y = hostElPosTop + hostElHeight - parentElementScrolling - 10;

    tooltipElement.style.position = 'absolute';
    tooltipElement.style.left = x + 'px'; // 500px
    tooltipElement.style.top = y + 'px';

    tooltipElement.addEventListener('click', this.closeTooltip);
    this.element = tooltipElement;
  }
}

class ProjectItem {
  hasActiveTooltip = false;

  constructor(id, updateProjectListsFunction, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunction;
    this.connectMoreInfoButton();
    this.connectSwitchButton(type);
    this.connectDrag();
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const projectElement = document.getElementById(this.id);
    const tooltipText = projectElement.dataset.extraInfo;
    const tooltip = new Tooltip(
      () => {
        this.hasActiveTooltip = false;
      },
      tooltipText,
      this.id
    );
    tooltip.attach();
    this.hasActiveTooltip = true;
  }

  // Adding a method to allow drag and drop for the list items
  // The draggale="true" attribute has been added to the <li> html
  connectDrag() {
    const item = document.getElementById(this.id);
    item.addEventListener('dragstart', e => {
      // appending the id of the element so we can extract it...
      // The dataTransfer.setData() methods allow you to attach data
      // See MDN docs for more.
      e.dataTransfer.setData('text/plain', this.id);
      // you can also define the behavior that is allowed for the event
      e.dataTransfer.effectAllowed = 'move';
    });
    // now let's listen to the dragend event which is not always required, but useful
    item.addEventListener('dragend', e => { 
      console.log(e);
      // could update UI, updated data, etc. here
    });
  }

  connectMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    const moreInfoBtn = projectItemElement.querySelector(
      'button:first-of-type'
    );
    moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));
  }

  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchBtn = projectItemElement.querySelector('button:last-of-type');
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
    switchBtn.addEventListener(
      'click',
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }

  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.connectSwitchButton(type);
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(
        new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type)
      );
    }
    console.log(this.projects);
    this.connectDroppable();
  }

  // The method below allows the ProjectList to accept elements dropped into the area
  connectDroppable() {
    const list = document.querySelector(`#${this.type}-projects ul`);
    // The dragover event listener is required, and dragenter allows more optional control
    // We have to preventDefault() for dragover at the least so it is able to be dropped
    // This will not actually drop it though, will also listen to the drop event
    list.addEventListener('dragenter', e => {
      // If there are multiple draggable elements on the page, we can check to ensure that the type is what we expect
      if (e.dataTransfer.types[0] === 'text/plain') { 
        e.preventDefault();
        list.parentElement.classList.add('droppable');
      }
    });
    list.addEventListener('dragover', e => {
      if (e.dataTransfer.types[0] === 'text/plain') {
        e.preventDefault();
      }
    });
    list.addEventListener('dragleave', e => {
      // we can check if we remove the class without condition, 
      // the styling is removed even if you're dragging over a child element
      // To prevent this, we can select and check that the relatedTarget 
      // (being dragged over) has an ancestor that is the list we selected above
      // added tje check that the ancestor exists for Firefox
      if (e.relatedTarget.closest && e.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
        // So we're only doing this if the element is being dragged fully outside the list
        list.parentElement.classList.remove('droppable');
      };
    });
    // this will allow us to actually drop an element
    list.addEventListener('drop', e => {
      e.preventDefault(); // this would be for Firefox...
      // extract the data that we passed earlier in dragstart within the ProjectListItem
      const projectId = e.dataTransfer.getData('text/plain');
      // We need to make sure that we are dropping the element in the correct list...
      // so we'll loop through the projects in the list with the find() method, pass each project, 
      // and compare the id with the id of the dropping project
      if (this.projects.find(p => p.id === projectId)) {
        // if we  find the id, then we don't want to drop it 
        // because it is already in the hovered list, so we just return
        return;
      }
      // if we got past the above logic, then we want to drop the element and remove it from previous one
      // To simplify things and not have to use another handler function approach, 
      // we can instead use DOM methods to select and click() the button that moves items already
      document
        .getElementById(projectId)
        .querySelector('button:last-of-type')
        .click();
        // remove the styling again
        list.parentElement.classList.remove('droppable');
        e.preventDefault(); // not needed here, but you can use it if there is any default behavior for the leement you're dropping (i.e. size)
    });
  }

  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    // const projectIndex = this.projects.findIndex(p => p.id === projectId);
    // this.projects.splice(projectIndex, 1);
    this.switchHandler(this.projects.find(p => p.id === projectId));
    this.projects = this.projects.filter(p => p.id !== projectId);
  }
}

class App {
  static init() {
    const activeProjectsList = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');
    activeProjectsList.setSwitchHandlerFunction(
      finishedProjectsList.addProject.bind(finishedProjectsList)
    );
    finishedProjectsList.setSwitchHandlerFunction(
      activeProjectsList.addProject.bind(activeProjectsList)
    );

    // const timerId = setTimeout(this.startAnalytics, 3000);

    // document.getElementById('stop-analytics-btn').addEventListener('click', () => {
    //   clearTimeout(timerId);
    // });
  }

  static startAnalytics() {
    const analyticsScript = document.createElement('script');
    analyticsScript.src = 'assets/scripts/analytics.js';
    analyticsScript.defer = true;
    document.head.append(analyticsScript);
  }
}

App.init();
