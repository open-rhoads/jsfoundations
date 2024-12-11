//import App class so we can use its static methods
import ElementAttribute from "./base.js";
import Component from "./base.js";
import App from "./app.js";

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
class ProductItem /*extends Component*/ {
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
class ProductList /*extends Component*/ {
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

// export {Product};
// export {ProductItem};
export default ProductList;