//Object-Oriented Shopping Cart

//Classes are a blueprint we can use to create objects - the fields become properties when an object is created
//Classes make it easier to create reusable objects that are always the same - you cannot omit a property
//the order of classes doesn't matter because JS parses the whole script before executing and all the classes will then be recognized
//BUT all classes need to be defined before any code that uses them

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

//Product Class - a key difference between defining object literals and classes is that properties are referred to as fields, 
//values are assigned with an equal sign (not colon) and they are separated by a semi-colon (not comma)
class Product {
  //if you're using a constructor, you can just assign the necessary data in the constructor as class properties because it will override anyway
  //methods are added similar to traditional function declarations...(name, parentheses, & curly braces) doesn't need a semi-colon
  //defining a constructor method in this class will allow us to send values to the fields/props in place of the default when we create objects
  //define the params/args it can accept and inside thebraces, you can assign the values with the 'this' keyword
  constructor(title, image, price, desc) {
    this.title = title;
    this.imageURL = image;
    this.description = desc;
    this.price = price;
  }
}

//Product Item class - this is separate from the Product because this is the rendering logic, whereas the product is simply the data
class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId);
    this.product = product;
  }

  addToCart() {
    App.addItemToCart(this.product); //you need to use static methods to make this work without instantiating an object
  }

  render() {
    const prodEl = this.createRootElement('li', 'product-item');
    prodEl.innerHTML = `
      <div>
        <img src="${this.product.imageURL}" alt="${this.product.title}"
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h3>\$${this.product.price}</h3>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
    `;
    const addCartButton = prodEl.querySelector('button');
    //you have to bind this to AddToCart so it doesn't refer to the Add to Cart button
    addCartButton.addEventListener('click', this.addToCart.bind(this));
  }
}

//Product List Class - it is hard to create true object-oriented code that is reusable with the object literal notation, so this was re-factored to use classes
//Objects can also hold more logic like the below...
class ProductList extends Component {
  //here we'll use a field for the products array and set values right away
  products = [
    //using the new keyword and calling the class name with parentheses returns a new object with the above class structure
    //pass in any expected params defined in theclass
    new Product('Pillow', 'https://linensociety.com/products/heirloom-pillow', 19.99, 'a soft pillow.'),
    new Product('carpet', 'https://linensociety.com/products/heirloom-pillow', 89.99, 'super cool carpet.')
  ];
  //adding a constructor in case it is needed, but we don't need to set the values because it is done above
  constructor(renderHookId) {
    super(renderHookId);
  }
  render() {
    //adding an id property for the ProductList to be passed to constructor
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list')
    ]);
    for (const prod of this.products) {
      const product = new ProductItem(prod, 'prod-list');//he hard coded the id as string...and it was prod-list...
      product.render();
    }
  }
}


//Shopping Cart class - 
class ShoppingCart extends Component {
  items = [];
  
  constructor(renderHookId) {
    super(renderHookId);
  }

  set cartItems(value) {
    this.items = value;
    // Ensure the total is updated correctly when cartItems is updated
    if (this.totalOutput) {
      this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }
  }

  get totalAmount() {
    const sum = this.items.reduce((prev, curr) => prev + curr.price, 0);
    return sum;
  }

  addItem(product) {
    const updatedItems = [...this.items, product];
    this.cartItems = updatedItems;  // Calls setter to update cart and total
  }

  render() {
    const cartEl = this.createRootElement('section', 'cart');
    cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now!</button>
    `;
    this.totalOutput = cartEl.querySelector('h2');
    return cartEl;
  }
}


//Shop Class will now be the root of the app and will render both the ShoppingCart and the ProductList
class Shop /* extends Component*/ {

  render() {
    //const renderHook = document.getElementById('app');
    //storing a new cart as a new property of this Shop class uing 'this' and dot notation
    this.cart = new ShoppingCart('app'); //sending the Id value to the constructor
    this.cart.render();
    const productList = new ProductList('app');
    productList.render();
  }
}

class App {
  //good practice to add static field here to make it clear that there is a static cart property (instead of implicit access)
  static cart;
  //using 'this' in a static method would always refer to the class itself, NOT an object instantiated from the class
  static init() {
    const shop = new Shop();
    shop.render();
    //add a cart property to the App class that equals the shop cart property
    this.cart = shop.cart;
  }
  //add another static method to add to cart that uses the addProduct() method now available through the cart property
  //this App class and this static method is used as a proxy for adding to cart so you can call it directly from the class anywhere without creating objects
  static addItemToCart(product) {
    this.cart.addItem(product);
  }
}

//init() methodis able to be accessed directly from the class without instantiating a new object
App.init();

export default App;



