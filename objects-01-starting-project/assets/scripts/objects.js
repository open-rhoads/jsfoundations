const addMovieBtn = document.getElementById('add-movie-btn');
const searchBtn = document.getElementById('search-btn');

const movies = [];

const renderMovies = (term = '') => {
  const movieList = document.getElementById('movie-list');
  if (movies.length === 0) { //no movies exist
    movieList.classList.remove('visible'); //remove the visible class from the movie list, which will hide it
  } else {
    movieList.classList.add('visible'); //add the visible class
  }
  movieList.innerHTML = ''; //clear the movie list...this is not the best performance to re-render it every time...appending might be better, but saving time
  
  //since this function is repeatedly concerned with movie.info property, we can use object destructuring to pull out that key/value in a new variable
  const filteredMovies = !term
    ? movies //display all movies if the string is falsy/still blank
    : movies.filter((movie) => movie.info.title.includes(term)); //or filter the movies and display only ones that match the entered term
  
    filteredMovies.forEach((movie) => {//pass anonymous function to the forEach() method of the array (loops)
    const movieElement = document.createElement('li');
    //you can use the 'in' keyword to check if a property exists - dynamic programs can have unsure property values. 
    //Add parentheses and the not operator to check the opposite...and you could also use dot notation to check if it is equal to undefined
    // if ('info' in movie) {

    // }
    //OBJECT DESTRUCTURING
    //braces on the left allow you to enter a key name (only) inside and now that property is stored in the variable name (info) and set it equal to the object with the key name
    const {info, ...otherProps} = movie; //you can then also use the rest operator and a second param/prop name that will catch all other properties and store in that object
    //you could have also checked for the existence of the info variable here because if it wasn't set before, it wouldn't be here
    console.log(otherProps);
    //const {title: movieTitle, ...restProps} = info; //the colon allows you to assign a new name to the new object/prop in case there are name conflicts
    let { getFormattedTitle } = movie; //we are commenting this out to avoid an advanced error...and using dot notation to access this below...
    //getFormattedTitle = getFormattedTitle.bind(movie); //now we're sayin that when this function executes, 'this' inside the function will now refer to the movie
    //this code above can be a little redundant with bind() since we want to execute this right away
    getFormattedTitle = getFormattedTitle.call(movie); //call will execute the function right away and allow you to override 'this' and you can add as many additional args as you want, comma separated
    //apply is similar, but it can only take one additional argument that is an array
    let text = getFormattedTitle() + ' - '; //this is 'chaining' the propertes/method...
    //loop through the object keys
    for (key in info) {
      if (key !== 'title' && key !== '_title') { //compare the key to the string version of what you're looking for, because keys are strings
        //this would be the one the user entered
        //using the loop and the key variable allows us to dynamically get what the user entered for the extra property
        text += `${key} : ${info[key]}`
      }
    }
    movieElement.textContent = text;
    movieList.append(movieElement);
  })
}

const addMovie = () => {
  //get values entered by user in the text boxes
  const title = document.getElementById('title').value;
  const extraKey = document.getElementById('extra-name').value;
  const extraValue = document.getElementById('extra-value').value;

  //validate if anything is empty
  if (extraKey.trim() === '' || extraValue.trim() === '') {return;}

  //create movie object
  const newMovie = {
    //when keys and values (via variable) are named the same (like title), you can omit the second one and the colon:
    info: {
      //use the set and get keywords to allow this property to have controlling logic when someone tries to access or modify it
      //you can then add any desired validation or handling with the data that is passed
      set title(value) {
        if (value.trim() === '') {
          this._title = 'DEFAULT';
          return;
        }
        this._title = value;
      },
      get title() {
        return this._title;
      },
      [extraKey]: extraValue
    },
    id: Math.random().toString(), //this first gets a random number, then turns it into a string via chaining - helpful to keep code concise
    getFormattedTitle() { //don't use an arrow function...you can use this shorter syntax for methods where you omit the colon and the function keyword
      //'this' is used in many cases, but especially in objects. Inside a function/object, this refers to whatever called or executed the function (movie object in this case)
      return this.info.title.toUpperCase(); //if we use the destructuring above to assign the title to a variable that we manually call, then the object is no longer calling the function, so 'this' will not refer to the object
      //in cases where it is called by the global execution context like this, then 'this' refers to the window object
      //you can log the value of this to troubleshoot/verify this
      //use bind() to fix this with 'this' XD - you can preconfigure what 'this' refers to
    }
  };
  movies.push(newMovie);
  console.log(newMovie);
  renderMovies();
};
//when you call the property with the dot notation and you don't have to include parentheses
//JS will know there is a getter/setter and use it depending on the context you are using the property 
newMovie.info.title = title;

//'this' with arrow functions...if we log 'this' inside the arow function, it wil be the window object. Arrow functions don't know 'this', so it will refer as if you called it outside
//but also sometimes an arrow function can fix weird behavior with 'this' ...it is helpful when you have nested logic/functions in an object because with a normal function with keyword, they can become called indrectly from other methods and 'this can get assigned to the window object
const searchMovies = () => {
  const filterTerm = document.getElementById('filter-title').value;

  renderMovies(filterTerm);
}
//when we use event listeners as below, 'this' will refer to the element that triggered the event... this is ONLY true when not using an arrow function
addMovieBtn.addEventListener('click', addMovie);
searchBtn.addEventListener('click', searchMovies);