//Base classes - these will hold common logic that other classes will inherit
//Element Attribute class contains construtor that accepts the name and value of the attribute
//The attributes array that is passed to the createRootElement method is an array of Element Attributes
class ElementAttribute {
  constructor (attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue
  }
}

class Component {
  constructor(renderHookId) {
    this.hookId = renderHookId
  }

  createRootElement(tag, classes, attributes) {
    const rootElement = document.createElement(tag);
    if (classes) {
      rootElement.className = classes; //why don't we have to use a loop here...
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

export {ElementAttribute};
export default Component;