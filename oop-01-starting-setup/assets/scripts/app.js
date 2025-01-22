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
    this.value = attrValue;
  }
}

class Component {
  //another solution to solving the problem of needing to render content before data has arrived is to add another param here of whether to render
  //we'll use a default value of true that can be overriden when called, if desired
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render(); //render is called in parent constructor - empty here and will be overridden by the version in the subclasses. 
      //When called, the subclass version will run because this always refers to what called the method, which will almost always be the object you're creating
      //new keyword makes sure that 'this' is bound to the object being created
    }
  }

  render () {} //adding render so it is clear why it is called above

  createRootElement(tag, classes, attributes) {
    const rootElement = document.createElement(tag);
    if (classes) {
      rootElement.className = classes; 
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
  //define the params/args it can accept and inside the braces, you can assign the values with the 'this' keyword
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
    super(renderHookId, false); //passing the second parameter so the parent constructor does not render the content without product being set
    this.product = product;
    this.render(); //and we render it here instead
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
  //defining the products array as private by including a hashtag # in front of the name and then you also need to include it any time it is called
  #products = [];
  
  //the super(); constructor (parent constructor) must be called before any other properties are added or set or the 'this' keyword can be used
  //but it has to be after we add the products array below because render() is also called inside super...and render will need the products data
  //but you still always have to call super() first, so how do we solve this? keep super in the constructor and add separate method for getting data
  //so we can call super() first and then use 'this' to call fetchProducts() method
  //it is a common problem that you might need to render some content only after the data has arrived...this is a solution...
  // //you load an empty element structure and then load data only once it is available
  //constructor
  constructor(renderHookId) {
    //now that the products property array is private, we will not render when the super constructor is called by passing the second argument of false
    super(renderHookId, false);
    //we will manually call render here instead. 
    // //This will prevent a type error from being called when we instantiate an object from this class and call render to render the products...
    //now he is saying that it is a bit redundant to still have render in the base class...but keeping it in as an example...
    this.render();
    this.fetchProducts();
  }

  fetchProducts() {
    //later, this would be done with an http request to load the products from a database
    //since we are using a hard-coded option for the products, let's make it a private property - only accessible in this class
    this.#products = [
      //here we'll use a field for the products array and set values right away
      //using the new keyword and calling the class name with parentheses returns a new object with the above class structure
      //pass in any expected params defined in the class
      new Product('Pillow', 'https://linensociety.com/products/heirloom-pillow', 19.99, 'a soft pillow.'),
      new Product('carpet', 'https://linensociety.com/products/heirloom-pillow', 89.99, 'super cool carpet.')
    ];
    //calling renderProducts() here too once the products have been fetched...because they weren't there the fist time when the constructor called render()...
    this.renderProducts();
  }

  //separating the rendering of the products so we can call this conditionally in render() only if the products are there
  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, 'prod-list');
      //product.render(); removing redundant render methods and no longer storing
    }
  }

  render() {
    //creating the root element and adding an id property for the ProductList to be passed to constructor
    this.createRootElement('ul', 'product-list', [
      new ElementAttribute('id', 'prod-list')
    ]);
    //we only try to render the products if products exist and the length is greater than zero
    //in our case, they won't be there when it is called the first time by super(), but they will be after the products are fetched...
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

//Shopping Cart class - 
class ShoppingCart extends Component {
  items = [];
  
  constructor(renderHookId) {
    //passing false as second arg to super() so that render() is not called before the orderProducts field/method can be created.
    super(renderHookId, false);
    //let's then add the orderProducts as a property here... for our purposes, this is almost the same as a field. The difference is advanced...
    this.orderProducts = () => {
      console.log('Ordering...');
      console.log(this.items);
    }
    //and then we can manually call render
    this.render();
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
    const orderButton = cartEl.querySelector('button');
    //can use arrow function which does not recognize 'this' and so 'this' will revert back to what it would be otherwise (calling code), which is the class
    //could've also chained .bind(this) to orderProducts...or even make orderProducts() an arrow function instead and make this call without parentheses (which is what we did)
    orderButton.addEventListener('click', this.orderProducts);
    this.totalOutput = cartEl.querySelector('h2');
    return cartEl;
  }
}


//Shop Class will now be the root of the app and will render both the ShoppingCart and the ProductList
class Shop extends Component {
  //don't need to pass args to the super(); constructor in this case because we're not using the renderhookid
  constructor() {
    //you could also call this.render(); here and not extend the class since the only thing you needed was the render method...
    super(); 
  }

  render() {
    //const renderHook = document.getElementById('app');
    //storing a new cart as a new property of this Shop class uing 'this' and dot notation
    this.cart = new ShoppingCart('app'); //sending the Id value to the constructor
    //this.cart.render(); removing redundant render methods...and no longer storing the ProductList in a variable
    //making the products private above ensures that you cannot assign a new products value when you instantiate a ProductList object
    new ProductList('app');
    //productList.render();
  }
}

class App {
  //good practice to add static field here to make it clear that there is a static cart property (instead of implicit access)
  static cart;
  //using 'this' in a static method would always refer to the class itself, NOT an object instantiated from the class
  static init() {
    const shop = new Shop();
    //shop.render(); removing redundant render method...still storing the shop because we need to access its methods below
    //set cart property/field of the App class equal to the shop cart property
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



