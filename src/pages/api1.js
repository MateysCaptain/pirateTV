import axios from 'axios';

const searchMovies = async () => {
	// https://image.tmdb.org/t/p/original
	
	const response = await axios.get("https://api.themoviedb.org/3/search/multi?query=kaabil&include_adult=false&language=en-US&page=1", {
		headers: {
		    accept: 'application/json',
		    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
		}
	});

	// console.log(response.data.results[0]);
	return response.data.results[0];
}

export default searchMovies;