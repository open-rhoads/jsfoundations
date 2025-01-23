// here is a more modern class (blueprint for objects) that contains a constructor function as part of it to initialize the object
// the class is 'syntactical sugar' to the constructor function below, providing an easier way and including a convention seen in many other languages
// classes also help with building prototypes and allowing a more efficient way to set up constructors... 
// //and also have other methods that are treated differently and not run upon initialization

// class AgedPerson {
//   printAge() {
//     console.log(this.age);
//   }
// }

// class Person extends AgedPerson {
//   name ='Max';

//   constructor() {
//     super();
//     this.age = 30;
//   }

//   greet() {
//     console.log(
//       'Hi, I am ' + this.name + ' and I am ' + this.age + ' years old.'
//     );
//   }
// }

//here is the same blueprint using just an older constructor function syntax
//it's not exactly the same as the properties with class setup, but the difference is advanced
// it is a convention to name these functions with pascal case - starting with a capital
function Person() {
  this.age = 32;
  this.name = 'Mikaela';
  this.greet = function() {
    console.log(
      'Hi, I am ' + this.name + ' and I am ' + this.age + ' years old.'
    );
  } // no return statement, so this function only returns an object due to the new keyword when instantiating
} 

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
Person.prototype.printAge = function() {
  console.log(this.age);
}

//so therefore, this then also works to create a new object:
const p2 = new Person.__proto__.constructor();
console.log(p2); //but it is more complex and wouldn't be done unless you don't have access to the original constructor anymore for some reason...

//let's have a look at the global Object
console.log(Object);
console.dir(Object);
//inside the __proto__ for the global Object will have toString() and other built in properties and methods we can call 
//and we don't have to instantiate an object - they are static
//it's like when you add a property to a class or constructor prototype directly - 
//it does not get applied to objects created from that class, so you don't have to create one before using it
//because it is not part of the constructor, so created objects will not have it
Person.describe = function() {
  console.log('Creating Persons...');
}

//the new keyword executes the function, sets 'this' equal to the object that will be created, adds all the properties and returns 'this' (the object)
const person = new Person();

person.greet();

//if we try to call a property/method that does not exist in the defined constructor, JS will search the prototype, represented by the __proto__ property
person.toString();
person.printAge();

//we can see the __proto__ property which contains the connected prototype object for the contextual object by logging it
// console.log(person.__proto__);
//now that we added a static property to Person, we can see the difference between the prototype Person having the property 
// and the created object not having it by logging it
console.log(person);

//this allows us to see all the properties and methods of the prototype
console.dir(person.__proto__);

//remember that when the object is a function/prototype, there will be a prototype property (confusing) 
//that will allow you to set the prototype of objects created FROM the contextual object/prototype...
//using classes with extends to create inheritance is essentially providing an easier syntax to do this 
// using the prototype proprty to replace the __proto__ for objects created from it... 
// let's demonstrate by commenting out our constructor function and using classes above