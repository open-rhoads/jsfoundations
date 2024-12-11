//Object-Oriented Shopping Cart

//Classes are a blueprint we can use to create objects - the fields become properties when an object is created
//Classes make it easier to create reusable objects that are always the same - you cannot omit a property
//the order of classes doesn't matter because JS parses the whole script before executing and all the classes will then be recognized
//BUT all classes need to be defined before any code that uses them

//Product Class - a key difference between defining object literals and classes is that properties are referred to as fields, 
//values are assigned with an equal sign (not colon) and they are separated by a semi-colon (not comma)
class Product {
  //if you're using a constructor, you can just assign the necessary data in the constructor as class properties because it will override anyway
  // title = 'DEFAULT';
  // imageURL;
  // description;
  // price;
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
class ProductItem {
  constructor(product) {
    this.product = product;
  }

  addToCart() {
    App.addItemToCart(this.product); //you need to use static methods to make this work without instantiating an object
  }

  render() {
    const prodEl = document.createElement('li');
    prodEl.className = 'product-item';
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
    //now let's work with the add to cart button...
    const addCartButton = prodEl.querySelector('button');
    //you have to bind this to AddToCart so it doesn't refer to the Add to Cart button
    addCartButton.addEventListener('click', this.addToCart.bind(this));
    return prodEl;
  }
}

//Product List Class - it is hard to create true object-oriented code that is reusable with the object literal notation, so this was re-factored to use classes
//Objects can also hold more logic like the below...
class ProductList {
  //here we'll use a field for the products array and set values right away
  products = [
    //using the new keyword and calling the class name with parentheses returns a new object with the above class structure
    //pass in any expected params defined in theclass
    new Product('Pillow', 'https://linensociety.com/products/heirloom-pillow', 19.99, 'a soft pillow.'),
    new Product('carpet', 'https://linensociety.com/products/heirloom-pillow', 89.99, 'super cool carpet.')
  ];
  //adding a constructor in case it is needed, but we don't need to set the values because it is done above
  constructor() {}
  render() {

    const prodList = document.createElement('ul');
    prodList.className = 'product-list';
    for (const prod of this.products) {
      const product = new ProductItem(prod);
      //Was getting uncaught type error...looks like it is gone
      const prodEl = product.render();
      prodList.append(prodEl);
    }
    return prodList;
  }
}

//Shopping Cart class - 
class ShoppingCart {
  items = [];

  //the setter overrides the existing array of items with a new value and updates the total value in the heading
  set cartItems(value) {
    this.items = value;
    //sets the totalOutput property set in the render() method to the sum from the totalAmount() method and rounds to 2 decimal places
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
  }

  //use a getter for the total cart amount
  get totalAmount() {
    //use reduce method to get the total price from all items in the items array
    //reduce accepts a function and an initial value as args
    //the anonymous function passed access args for the previous value (to keep adding) and the current item
    const sum = this.items.reduce((previousValue, currentItem) => previousValue + currentItem.price, 0);
    return sum;
  }

  addItem(product) {
    //this.items.push(product);
    const updatedItems = [...this.items]; //copies the items array into a new variable
    updatedItems.push(product); //pushes the passed product to the new updatedItems
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = document.createElement('section');
    cartEl.innerHTML = `
    <h2>Total: \$${0}</h2>
    <button>Order Now!</button>
    `;
    cartEl.className = 'cart';
    //adds a totalOutput property to the ShoppingCart class which is the heading element in the cartEl
    this.totalOutput = cartEl.querySelector('h2');
    return cartEl;
  }
}

//Shop Class will now be the root of the app and will render both the ShoppingCart and the ProductList
class Shop {

  render() {
    const renderHook = document.getElementById('app');
    //storing a new cart as a new property of this Shop class uing 'this' and dot notation
    this.cart = new ShoppingCart();
    const cartEl = this.cart.render();
    const productList = new ProductList();
    const prodListEl = productList.render();

    renderHook.append(cartEl);
    renderHook.append(prodListEl);
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



