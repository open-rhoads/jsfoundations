//Object-Oriented Shopping Cart

//Classes are a blueprint we can use to create objects - the fields become properties when an object is created
//Classes make it easier to create reusable objects that are always the same - you cannot omit a property
//the order of classes doesn't matter because JS parses the whole script before executing and all the classes will then be recognized
//BUT all classes need to be defined before any code that uses them

//using imports and separate files to keep these shorter and more modular
// import Product from "./products.js";
// import ProductItem from "./products.js";

//importing the Shop, which uses the ShoppingCart, ProductList, ProductItem, and Product classes
import Shop from "./shop.js";

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



