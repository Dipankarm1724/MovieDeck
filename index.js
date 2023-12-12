const url = "https://image.tmdb.org/t/p/original";
const api_key = "f531333d637d0c44abc85b3e74db2186";
const api_url = "https://api.themoviedb.org/3/movie/top_rated";
const Seaech_api_url = "https://api.themoviedb.org/3/search/movie";
const LS_key = "favotiteMovies";

let movies = [];

let sortByDateFlag = 1;
let sortByRatingFlag = 1;
let currentPage = 1;

async function fetchMovies(page = 1) {
  try {
    let response = await fetch(
      `${api_url}?api_key=${api_key}&language=en-US&page=${page}`
    );
    response = await response.json();
    movies = response.results;
    renderMovies(response.results);
  } catch (error) {
    console.log(error);
  }
}
fetchMovies();

function renderMovies(newMovies) {
  const moviesList = document.getElementById("movie-list");
  moviesList.innerHTML = "";
  newMovies.forEach((movie) => {
    const { poster_path, title, vote_average, vote_count } = movie;
    const listItem = document.createElement("li");
    listItem.className = "card";
    let imageSource = poster_path
      ? `${url}/${poster_path}`
      : "https://m.media-amazon.com/images/M/MV5BZmYzMzU4NjctNDI0Mi00MGExLWI3ZDQtYzQzYThmYzc2ZmNjXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg";

    const imageTag = `
  <img 
  class="poster"
  src=${imageSource}
  alt=${title}
  />`;
    listItem.innerHTML += imageTag;
    const titleTag = `<p class="title">${title}</p>`;
    listItem.innerHTML += titleTag;

    let sectionTag = `<section class="vote-favouriteIcon">
    <section class="vote">
        <p class="vote-count"> Vote :${vote_count}</p>
        <p class="vote-rating">Rating : ${vote_average}</p>
    </section>
    <section>
        <i class="fa-regular fa-heart fa-2x favourite-icon" id="${title}"></i>
    </section>
</section>`;
    listItem.innerHTML += sectionTag;

    const favoriteIcon = listItem.querySelector(".favourite-icon");
    favoriteIcon.addEventListener("click", (event) => {
      const { id } = event.target;
      if (favoriteIcon.classList.contains("fa-solid")) {
        removeMovieNamesToLocalStorage(id);
        favoriteIcon.classList.remove("fa-solid");
      } else {
        addMovieNamesToLocalStorage(id);
        favoriteIcon.classList.add("fa-solid");
      }
    });

    moviesList.appendChild(listItem);
  });
}

//Sorting By Date

const sortBydateButton = document.getElementById("sort-by-date");
function sortByDate() {
  let sortedMovies;
  if (sortByDateFlag === 1) {
    sortedMovies = movies.sort((movie1, movie2) => {
      return new Date(movie1.release_date) - new Date(movie2.release_date);
    });
    sortByDateFlag = -1;
    sortBydateButton.textContent = "Sort by date (latest to oldest)";
  } else if (sortByDateFlag === -1) {
    sortedMovies = movies.sort((movie1, movie2) => {
      return new Date(movie2.release_date) - new Date(movie1.release_date);
    });
    sortByDateFlag = 1;
    sortBydateButton.textContent = "Sort by date (oldest to latest )";
  }
  renderMovies(sortedMovies);
}
sortBydateButton.addEventListener("click", sortByDate);

//Sorting By rating

const sortByRatingButton = document.getElementById("sort-by-rating");
function sortByRating() {
  let sortedMovies;
  if (sortByRatingFlag === 1) {
    sortedMovies = movies.sort((movie1, movie2) => {
      return movie1.vote_average - movie2.vote_average;
    });
    sortByRatingFlag = -1;
    sortByRatingButton.textContent = "Sort by Rating (most to least)";
  } else if (sortByRatingFlag === -1) {
    sortedMovies = movies.sort((movie1, movie2) => {
      return movie2.vote_average - movie1.vote_average;
    });
    sortByRatingFlag = 1;
    sortByRatingButton.textContent = "Sort by Rating (least to most)";
  }
  renderMovies(sortedMovies);
}
sortByRatingButton.addEventListener("click", sortByRating);

//Pagination

const prevBotton = document.getElementById("prev-button");
const psgeNumberBotton = document.getElementById("page-number-button");
const nextBotton = document.getElementById("next-button");
//we want page 1 initially
prevBotton.disabled = true;

prevBotton.addEventListener("click", () => {
  nextBotton.disabled = false;
  //decrease page number by 1
  currentPage--;
  //Fetch movie by new page number
  fetchMovies(currentPage);
  psgeNumberBotton.textContent = `Current page: ${currentPage}`;
  if (currentPage === 1) {
    prevBotton.disabled = true;
  }
});

nextBotton.addEventListener("click", () => {
  //increase page number by 1
  prevBotton.disabled = false;

  currentPage++;
  //Fetch movie by new page number
  fetchMovies(currentPage);
  psgeNumberBotton.textContent = `Current page: ${currentPage}`;
  // we want uppor page 3
  if (currentPage === 5) {
    nextBotton.disabled = true;
  }
});

const searchMovies = async (searchedMovie) => {
  try {
    const response = await fetch(
      `${Seaech_api_url}?query=${searchedMovie}&api_key=${api_key}&language=en-US&page=1`
    );
    const result = await response.json();
    movies = result.results;
    renderMovies(movies);
  } catch (error) {
    console.log(error);
  }
};

const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
searchButton.addEventListener("click", () => {
  searchMovies(searchInput.value);
});

//favourite Icon

//Local Storage
// getter
function getMoveiFromLocalStorage() {
  const favotiteMovies = JSON.parse(localStorage.getItem(LS_key));
  return favotiteMovies === null ? [] : favotiteMovies;
}
// setter
function addMovieNamesToLocalStorage(movieName) {
  const favoriteMovies = getMoveiFromLocalStorage();
  const newFavoriteMovies = [...favoriteMovies, movieName];

  localStorage.setItem(LS_key, JSON.stringify(newFavoriteMovies));
}

// remove func

function removeMovieNamesToLocalStorage(movieName) {
  const allMovies = addMovieNamesToLocalStorage();
  const newFavoriteMovies = allMovies.filter((movie) => movie !== movieName);
  localStorage.setItem(LS_key, JSON.stringify(newFavoriteMovies));
}

// All-tab,Favorite-Tab
const allTab = document.getElementById("all-tab");
const favoriteTab = document.getElementById("favourites-tab");

function switchTab(event) {
  allTab.classList.remove("active-tab");
  favoriteTab.classList.remove("active-tab");
  event.target.classList.add("active-tab");
  displayMovies();
}

allTab.addEventListener("click", switchTab);
favoriteTab.addEventListener("click", switchTab);
//get all movie date from its name by calling the api
async function getMovieByName(movieName) {
  try {
    const response = await fetch(
      `${Seaech_api_url}?query=${movieName}&api_key=${api_key}&language=en-US&page=1`
    );
    const result = await response.json();
    //we only return first movie from our response
    return result.results[0];
  } catch (error) {
    console.log(error);
  }
}
function showFavorites(movie) {
  const movieList = document.getElementById("movie-list");
  const { poster_path, title, vote_average, vote_count } = movie;
  const listItem = document.createElement("li");
  listItem.className = "card";
  let imageSource = poster_path
    ? `${url}/${poster_path}`
    : "https://m.media-amazon.com/images/M/MV5BZmYzMzU4NjctNDI0Mi00MGExLWI3ZDQtYzQzYThmYzc2ZmNjXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg";

  const imageTag = `
  <img 
  class="poster"
  src=${imageSource}
  alt=${title}
  />`;
  listItem.innerHTML += imageTag;
  const titleTag = `<p class="title">${title}</p>`;
  listItem.innerHTML += titleTag;

  let sectionTag = `<section class="vote-favouriteIcon">
    <section class="vote">
        <p class="vote-count"> Vote :${vote_count}</p>
        <p class="vote-rating">Rating : ${vote_average}</p>
    </section>
    <section>
        <i class="fa-solid fa-xmark fa-xl xmark" id="${title}"></i>
    </section>
</section>`;
  listItem.innerHTML += sectionTag;
  const removeWishlistButton = listItem.querySelector(".xmark");
  removeWishlistButton.addEventListener("click", (event) => {
    const { id } = event.target;
    removeMovieNamesToLocalStorage(id);
    fetchWishlistmovie();
  });

  movieList.appendChild(listItem);
}

//get movie data and display movie data
async function fetchWishlistmovie() {
  const moviesList = document.getElementById("movie-list");
  moviesList.innerHTML = "";
  const moviesNamesList = getMoveiNamesFromLocalStorage();
  moviesNamesList.forEach(async (movie) => {
    const movieData = await getMovieByName(movie);
    showFavorites(movieData);
  });
}

function displayMovies() {
  if (allTab.classList.contains("active-tab")) {
    renderMovies(movies);
  } else if (favoriteTab.classList.contains("active-tab")) {
    fetchWishlistmovie();
  }
}
