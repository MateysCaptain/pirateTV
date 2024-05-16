import { useState, useEffect } from 'react';
import './home.css';
import Navbar5 from './Navbar5';
import Navbar1 from './Navbar1';
import Banner from './Banner';
import Row4 from './Row4';
import requests from './requests';
import Spinner2 from './Spinner2';

function Home3() {
	const [isLoading, setIsLoading] = useState(true);
	window.sessionStorage.clear();

  	useEffect(() => {
	    // Simulate data loading delay
	    const timeout = setTimeout(() => {
	      setIsLoading(false);
	    }, 2000); // Replace 2000 with the actual loading time for the first row

	    return () => clearTimeout(timeout);
  	}, []);

  	const handleNextRowLoad = () => {
	    // Set isLoading to true when the next row loads
	    setIsLoading(true);

	    // Simulate data loading delay for the next row
	    setTimeout(() => {
	      setIsLoading(false);
	    }, 2000); // Replace 2000 with the actual loading time for the next row
  	};

  	// const isLoggedIn = Cookies.get('isLoggedIn');
	// const userId = Cookies.get('userId');

	// console.log('isLoggedIn:', isLoggedIn);
	// console.log('userId:', userId);

	return (
		<div className="container-fluid" id="mainContainer">
			<div className="row">
				<div className="col-12 col-sm-12 text-white p-0 home__div1">
					<Navbar5 />
					<Banner />
					{isLoading && <Spinner2 />}
					<Row4 
						title="new releases" 
						fetchUrl={requests.fetchNewReleases} 
						isLargeRow={true} 
						onLoaded={handleNextRowLoad}
					/>
					<Row4 
						title="pirated.tv originals" 
						fetchUrl={requests.fetchNetflixOriginals} 
						isLargeRow={true} 
						onLoaded={handleNextRowLoad}
					/>
					<Row4 
						title="trending now" 
						fetchUrl={requests.fetchTrending}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="top rated" 
						fetchUrl={requests.fetchTopRated}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="action movies" 
						fetchUrl={requests.fetchActionMovies}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="comedy movies" 
						fetchUrl={requests.fetchComedyMovies}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="horror movies" 
						fetchUrl={requests.fetchHorrorMovies}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="romance movies" 
						fetchUrl={requests.fetchRomanceMovies}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="documentaries" 
						fetchUrl={requests.fetchDocumentaries}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Adventure" 
						fetchUrl={requests.fetchAdventure}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Animation" 
						fetchUrl={requests.fetchAnimation}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Crime" 
						fetchUrl={requests.fetchCrime}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Drama" 
						fetchUrl={requests.fetchDrama}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Mystery" 
						fetchUrl={requests.fetchMystery}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Thriller" 
						fetchUrl={requests.fetchThriller}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Fantasy" 
						fetchUrl={requests.fetchFantasy}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="History" 
						fetchUrl={requests.fetchHistory}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Science & Fiction" 
						fetchUrl={requests.fetchScienceFiction}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="War" 
						fetchUrl={requests.fetchWar}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Western" 
						fetchUrl={requests.fetchWestern}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<Row4 
						title="Children & Family" 
						fetchUrl={requests.fetchChildrenFamily}
						isLargeRow={true}
						onLoaded={handleNextRowLoad} 
					/>
					<div style={{ height: '60px' }}></div>
					<Navbar1 />
				</div>
			</div>
		</div>
	);
}

export default Home3;