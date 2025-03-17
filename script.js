const API_KEY = 'e7c3a62b7317ee9eaa41d0a23888b84b'; // Replace with your TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const moviesContainer = document.getElementById('movies-container');

// Fetch latest movies
async function fetchMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

// Display movies
function displayMovies(movies) {
  moviesContainer.innerHTML = ''; // Clear previous content
  var i=1;
  movies.forEach(movie => {
   // console.log(movie);
   
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.setAttribute('id',i)

    movieCard.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.overview.slice(0, 100)}...</p>
      <p><strong>Rating:</strong> ${movie.vote_average}</p>
       <div class="stars" >
      <span class="star" data-rating="1">&#9733</span>
      <span class="star" data-rating="2">&#9733</span>
      <span class="star" data-rating="3">&#9733</span>
      <span class="star" data-rating="4">&#9733</span>
      <span class="star" data-rating="5">&#9733</span>
    </div>
    `;
    moviesContainer.appendChild(movieCard);
  i++;

  });

  // star raing
document.querySelectorAll('.movie-card').forEach(card=>{
  // console.log('ok');
  
  const stars=card.querySelectorAll('.star');
  stars.forEach(star=>{

    // console.log(star.getAttribute('data-raing'));
    
    star.addEventListener('click',()=>{
      // console.log("cliked");
      
      const rating=star.getAttribute('data-rating');
      // console.log(card,rating);
      
      highlightStars(card,rating);
    });
  });
});
}



function highlightStars(card,rating){
  // console.log('function called');
  
  // console.log(card);
  
  const stars=card.querySelectorAll('.star');
  // console.log(stars);
  
  stars.forEach(star=>{
    // console.log("high");
    // console.log(star);
    // console.log(star.getAttribute('class'));
    
    const starRating=star.getAttribute('data-rating');
    // console.log(starRating);
    
    if(starRating<=rating){
      star.classList.add('active');
    }else{
      star.classList.remove('active');
    }
  });

}



// Fetch movies when the page loads
fetchMovies();