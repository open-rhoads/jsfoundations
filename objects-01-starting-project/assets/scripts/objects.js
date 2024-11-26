//get the movie list and style it...
const movieList = document.getElementById('movie-list');
//you can use either dot notation or bracket notation to access the style methods that allow you to change styles; 
//and with brackets, you can use the traditional CSS property names:
movieList.style['background-color'] = 'red';
//movieList.style.backgroundColor = 'red';
movieList.style.display = 'block';

const userChosenKeyName = 'level'; //what else can we do with brackets...if we want this to be a new key name, we need to add this variable with the brackets in the object

//keys are similar to variables, but with more flexibility because you can use any string as a key - since all keys are coerced into a string
//generally, you should still follow the rules variables would, but you can technically do the following with a key (using first name as example)
//property order...this will be retained
const person = {
  'first name': 'Mikaela',
  age: 32,
  hobbies: ['yoga', 'dancing', 'hiking', 'cooking'],
  [userChosenKeyName]: '...', //the brackets tell JS that this is a variable, not a new key name
  greet: function() {
    alert(`Hi ${person['first name']}`);
  },
  //you can use numbers for key names, but they will be coerced into strings. Cannot use negative numbers. Probably not done a lot
  1.5: 'hello'
};
//you have to use the square bracket notation and refer to the string key when you use strings are keys
//you can also mae it more dynamic by putting the key names in variables when you use bracket notation
//console.log(person['first name']);
let keyName = 'first name';
console.log(person[keyName]); //anything that yields a value can be inserted into the brackets to search the object
//again you need bracket notation if the key is a number
console.log(person[1.5]);
//let's log the whole object to examine properties...when you expand the object, it will sort them alphabetically, but when it is collapsed, they show in order added
//unless you have all number keys in which case they are always sorted
console.log(person);

//how to add a property
//you could use let above and then re-assign everything, but it is verbiose...
//instead...use dot notation. You can also edit properties this way
person.isAdmin = true; //accessing a property that does not exist will give you undefined...setting a value will add the property if it does not exist
person.age = 33; //age is now 33... sigh
//delete a property with the delete keyword and the dot notation
delete person.age; //ageless ;)
//you could also use dot notation and set it to undefined, but you shouldn't really purposefully set the value to undefined...
//technically the property would still be there, but the effect is the same
//null is not the same as undefined and is a value you can use to empty it, but keep the property defined

person.greet();