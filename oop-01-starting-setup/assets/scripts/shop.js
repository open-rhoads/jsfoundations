
//importing the ProductLis, whch uses the Product and ProductItem classes
import ElementAttribute from "./base.js";
import Component from "./base.js";
import ProductList from "./products.js";

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
    const renderHook = document.getElementById('app');
    //storing a new cart as a new property of this Shop class uing 'this' and dot notation
    this.cart = new ShoppingCart('app'); //sending the Id value to the constructor
    //const cartEl = this.cart.render();
    const productList = new ProductList();
    const prodListEl = productList.render();

    renderHook.append(this.cart.render());
    renderHook.append(prodListEl);
  }
}

export default Shop;