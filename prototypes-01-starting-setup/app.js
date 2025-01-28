// here is a more modern class (blueprint for objects) that contains a constructor function as part of it to initialize the object
// the class is 'syntactical sugar' to the constructor function below, providing an easier way and including a convention seen in many other languages
// classes also help with building prototypes and allowing a more efficient way to set up constructors... 
// //and also have other methods that are treated differently and not run upon initialization

class AgedPerson {
  printAge() {
    console.log(this.age);
  }
}

class Person extends AgedPerson {
  //you can define fields/properties here like this and they will be added after the call to super()
  //cannot access the properties/fields created in the sub-clas wthin super()
  name ='Mikaela';

  constructor() {
    super(); //he mentioned removing super() (& extends) because we're not extending anything anymore...
    // is that because we are no longer adding methods...? Or not using printAge()?
    this.age = 32;
    //adding the greet method in the constructor will make it created for every object
    //this.greet = function() {...}
  }
  //let's add greet as a field and remove the method shorthand - this also means it will be created for each object instead of being optimized
  //you can use traditional or arrow syntax, but arrow will ensure that the 'this' keyword refers to the surrounding class without using bind()
  // (because arrow functions don't respect this, so it moves to surrounding logic)
  //the traditional syntax with bind() has slight perfrmance advantages, but it is typically negligible 

  // greet = () => {
  //   console.log(
  //     'Hi, I am ' + this.name + ' and I am ' + this.age + ' years old.'
  //   );
  // }
  greet() {
    console.log(
      'Hi, I am ' + this.name + ' and I am ' + this.age + ' years old.'
    );
  }
}

//here is the same blueprint using just an older constructor function syntax
//it's not exactly the same as the properties with class setup, but the difference is advanced
// it is a convention to name these functions with pascal case - starting with a capital
// function Person() {
//   this.age = 32;
//   this.name = 'Mikaela';
//   removed the this.greet = function() { ... } and added it in prototype to replicate classes
// no return statement, so this function only returns an object due to the new keyword when instantiating
// } 

//To replicate the optimization what classes perform with methods via adding an extra __proto__ to the created objects to contain any methods
//We have to add any methods via overriding the prototype property for the desired constructor function
// Person.prototype = {
//   printAge() {
//     console.log(this.age);
//   }
// }

//when we set this all up with classes, it will embed the prototype methods inside a constructor when you look at it in the console.
//with the constructor function, it will not do that embedding, it will just show you the method.
//this is because we are replacing the prototype with the method above.
//if we add a method to the prototype instead of replacing it, we get a similar effect functionally, but the prototype constructor is maintained...
//this is a better approach generally
// Person.prototype.printAge = function() {
//   console.log(this.age);
// }
// Person.prototype.greet = function() {
//   console.log(
//     'Hi, I am ' + this.name + ' and I am ' + this.age + ' years old.'
//   );
// }

//so therefore, this then also works to create a new object:
// const p2 = new Person.__proto__.constructor();
// console.log(p2); //but it is more complex and wouldn't be done unless you don't have access to the original constructor anymore for some reason...

//let's have a look at the global Object
// console.log(Object);
// console.dir(Object);
// console.log(Object.prototype); //this is the fallback for all objects
//inside the __proto__ for the global Object will have toString() and other built in properties and methods we can call 
//and we don't have to instantiate an object - they are static
//it's like when you add a property to a class or constructor prototype directly - 
//it does not get applied to objects created from that class, so you don't have to create one before using it
//because it is not part of the constructor, so created objects will not have it
// Person.describe = function() {
//   console.log('Creating Persons...');
// }

//the new keyword executes the function, sets 'this' equal to the object that will be created, adds all the properties and returns 'this' (the object)
const person = new Person();

// person.greet();

//if we try to call a property/method that does not exist in the defined constructor, JS will search the prototype, represented by the __proto__ property
// person.toString();
// person.printAge();

//we can see the __proto__ property which contains the connected prototype object for the contextual object by logging it
// console.log(person.__proto__);
//now that we added a static property to Person, we can see the difference between the prototype Person having the property 
// and the created object not having it by logging it
// console.log(person);
// console.log(person.length); //why is this undefined...shouldn't it use the global Object.prototype...I find it in the structure....hmmm

//this allows us to see all the properties and methods of the prototype
// console.dir(person.__proto__);

//remember that when the object is a function/prototype, there will be a prototype property (confusing) 
//that will allow you to set the prototype of objects created FROM the contextual object/prototype...
//using classes with extends to create inheritance is essentially providing an easier syntax to do this 
// using the prototype proprty to replace the __proto__ for objects created from it... 
// let's demonstrate by commenting out our constructor function and using classes above

//let's do an example with the greet method (which we finalized written as a field and arrow function syntax, 
// so it belongs to the subclass itself and this refers to that class)  
// using an event listener
const button = document.getElementById('btn');
// button.addEventListener('click', person.greet);
button.addEventListener('click', person.greet.bind(person)); //this is how you have to call it if you write the method with traditional syntax - performance advantage
//you have to bind the person object so that 'this' will refer to it inside of the greet method

const course = { //could also use new Object()
  title: 'JavaScript: The Complete Guide',
  rating: 5
}

//both of the following will print the prototype of the referenced object to the console
//lthough the __proto__ property has been implemented by browsers, the more official way to do this would be using the Object.getPrototypeOf() method
// console.log(course.__proto__);
console.log(Object.getPrototypeOf(course));

//you can use the Object.setPrototypeOf() method to override the already created prototype of an object
//the following would override the prototype completely
// Object.setPrototypeOf(course, {
//   printRating: function() {
//     console.log(`${this.rating}/5`);
//   }
// })
//if we want to add to the existing prototype, we can use the spread operator as follows 
// to spread the properties of the current prototype into the new object along with the new functionality... the spread goes in the list of properties
Object.setPrototypeOf(course, {
  ...Object.getPrototypeOf(course),
  printRating: function() {
    console.log(`${this.rating}/5`);
  }
})

course.printRating(); // error at first - not a defined property/method, until we used setPrototypeOf to add it

//now let's work with using Object.create() which is another way to create objects...
const student = Object.create(
  {
    printProgress: function () {
      console.log(this.progress);
    },
  },
  {
    name: {
      configurable: true,
      enumerable: true,
      value: 'Mikaela',
      writable: false,
    }
  }
); //similar to object literal notation, but it takes an object as a parameter 
// that will be set as the PROTOTYPE for the new empty object
//you can use a second object argment to add properties to the empty object as shown above

//or you can add properties with tactics we already know (dot notation and then the Object.defineProperty() method)
// student.name = 'Mikaela';
Object.defineProperty(student, 'progress', {
  configurable: true,
  enumerable: true,
  value: 0.8,
  writable: false
})

console.log(student); //logs our new object with its prototype created above
student.printProgress();