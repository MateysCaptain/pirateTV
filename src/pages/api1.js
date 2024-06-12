import axios from 'axios';

const searchMovies = async () => {
	// https://image.tmdb.org/t/p/original
	
	const response = await axios.get("https://api.themoviedb.org/3/search/multi?query=kaabil&include_adult=false&language=en-US&page=1", {
		headers: {
		    accept: 'application/json',
		    Authorization: 'Bearer paste your key here...'
		}
	});

	// console.log(response.data.results[0]);
	return response.data.results[0];
}

export default searchMovies;