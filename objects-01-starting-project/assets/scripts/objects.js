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
  
  const filteredMovies = !term
    ? movies //display all movies if the string is flasy/still blank
    : movies.filter((movie) => movie.info.title.includes(term)); //or filter the movies and display only ones that match the entered term
  
    filteredMovies.forEach((movie) => {//pass anonymous function to the forEach() method of the array (loops)
    const movieElement = document.createElement('li');
    // movieElement.textContent = movie.info.title;
    let text = movie.info.title + ' - '; //this is 'chaining' the propertes/method...
    //loop through the object keys
    for (key in movie.info) {
      if (key !== 'title') { //compare the key to the string version of what you're looking for, because keys are strings
        //this would be the one the user entered
        //using the loop and the key variable allows us to dynamically get what the user entered for the extra property
        text += `${key} : ${movie.info[key]}`
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