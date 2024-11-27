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
    const {title: movieTitle, ...restProps} = info; //the colon allows you to assign a new name to the new object/prop in case there are name conflicts
    console.log(restProps);
    let text = movieTitle + ' - '; //this is 'chaining' the propertes/method...
    //loop through the object keys
    for (key in info) {
      if (key !== 'title') { //compare the key to the string version of what you're looking for, because keys are strings
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
  if (title.trim() === '' || extraKey.trim() === '' || extraValue.trim() === '') {return;}

  //create movie object
  const newMovie = {
    //when keys and values (via variable) are named the same (like title), you can omit the second one and the colon:
    info: {
      title,
      [extraKey]: extraValue
    },
    id: Math.random().toString() //this first gets a random number, then turns it into a string via chaining - helpful to keep code concise
  };
  movies.push(newMovie);
  console.log(newMovie);
  renderMovies();
};

const searchMovies = () => {
  const filterTerm = document.getElementById('filter-title').value;

  renderMovies(filterTerm);
}

addMovieBtn.addEventListener('click', addMovie);
searchBtn.addEventListener('click', searchMovies);