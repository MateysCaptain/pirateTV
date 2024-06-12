import { useState, useEffect, useRef, useCallback } from 'react';
import './sm.css';
import Navbar1 from './Navbar1';
import Navbar2 from './Navbar2';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import Spinner2 from './Spinner2';

function SearchMovies(props) {
  	const [text, setText] = useState('');
  	// const [id, setId] = useState(null);
  	const [searchResults, setSearchResults] = useState([]);
  	const [isResultsVisible, setIsResultsVisible] = useState(true);
  	const [selectedItem, setSelectedItem] = useState({});
  	const [rSearch, setRSearch] = useState([]);
  	const [pSearch, setPSearch] = useState([]);
	const searchResultsRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
  	const [loading, setLoading] = useState(false);
  	const [isError, setError] = useState(false);
  	const [similar, setSimilar] = useState([]);
  	const [showSimilar, setShowSimilar] = useState(false);
    const [page, setPage] = useState(1);

	const base_url = "https://image.tmdb.org/t/p/original";

  	const inputChangeHandler = (event) => {
    	setText(event.target.value);
    	setIsResultsVisible(true);
  	}

  	const handleLiClick = (result) => {
  		// console.log(searchResults);
  		setSimilar(searchResults);
    	setText(result.title || result.name);
    	setIsResultsVisible(false);
    	setSelectedItem({ id: result.id, media_type: result.media_type });
    	// handleLIClick();
  	};

  	useEffect(() => {
	    if (text.trim() !== '') {
	    	const fetchData = async () => {
			    try {
			      const response = await axios.get(`/search/multi?query=${text}&include_adult=false&language=en-US&page=1`, {
			        headers: {
						accept: 'application/json',
		                Authorization: 'Bearer paste your key here...'
					}
			      });

			      // console.log(response.data.results, response.data.results == '');

			      setSearchResults(response.data.results);
			      return response;
			    } catch (error) {
			      console.error('Error fetching data:', error);
			    }
		  	};
	      	fetchData();
	    } 
	    else {
	      setSearchResults([]);
	      setRSearch([]);
	      setSimilar([]);
	      setShowSimilar(false);
	    }
  	}, [text, setSearchResults]);

    // console.log(selectedItem);

  	const handleGoButtonClick = async () => {
	  if (selectedItem.id) {
	    try {
	      setLoading(true);
	      let mediaType = "movie";

	      console.log(selectedItem);

	      if (selectedItem.media_type === 'tv') {
	        mediaType = "tv";
	      }
	      else if (selectedItem.media_type === 'movie') {
	        mediaType = "movie"
	      }
	      else if (selectedItem.media_type === 'person') {
	        mediaType = "person"
	      }

	      if (mediaType !== 'person') {
	        const response2 = await axios.get(`/${mediaType}/${selectedItem.id}?language=en-US`, {
	          headers: {
	            accept: 'application/json',
		    	Authorization: 'Bearer paste your key here...'
	          }
	        });

	        const x = similar.filter(i => i.id !== response2.data.id);

	        setSimilar(x);

	        setRSearch(response2.data);
	        if (x.length >= 1) {
	          setShowSimilar(true);
	        }
	        else {
	          setShowSimilar(false);
	        }
	        setLoading(false);

	        return response2.data;
	      }

	      else {
	        const response2 = await axios.get(`/person/${selectedItem.id}/movie_credits?language=en-US`, {
	          headers: {
	            accept: 'application/json',
		    	Authorization: 'Bearer paste your key here...'
	          }
	        });

	        setSimilar(response2.data?.cast);

	        if (response2.data?.cast.length >= 1) {
	          setShowSimilar(true);
	        }
	        else {
	          setShowSimilar(false);
	        }
	        setLoading(false);

	        return response2.data;
	      }
	    } catch (error) {
	      setError(true);
	      setLoading(false);
	    }
	  }
	  else {
	    setLoading(false);
	    alert("Please select a movie");
	  }
	};

  	useEffect(() => {
	    async function fetchData() {
	      	try {
		        // Fetch Netflix originals
		        const response = await axios.get("/trending/all/day?language=en-US", {
		          	headers: {
					    accept: 'application/json',
		    			Authorization: 'Bearer paste your key here...'
					},
		        });

                //  console.log(response.data.results);

		        setPSearch(response.data.results);
		        setIsLoading(false);
		        return response.data.results;
	    	}
	    	catch (error) {
		        console.error('Error fetching data:', error);
		    }
		}
		fetchData();
	}, [])

	const navigate = useNavigate();

	const handleClick = (movie) => {
	    // Extract necessary information
	    let name = '';
	    let id = '';

	    // console.log(movie.media_type, movie);
	    // console.log(movie);

	    if (movie.hasOwnProperty('media_type') && movie.media_type === "movie") {
	      name = movie.original_title;
	      id = movie.id;
	    }
	    else if (movie.hasOwnProperty('media_type') && movie.media_type === "tv") {
	      name = movie.name;
	      id = movie.id;
	    }
	    else {
	      name = movie?.original_name || movie?.title;
	      id = movie.id;
	    }

	    // console.log(name, id);

	    // Build the URL with query parameters
	    const url = `/v1/moviePart/${id}?name=${name}`;

	    // Navigate to the URL
	    navigate(url);
  	};

  	const handleKeyDown = (event) => {
	  if (event.key === "Enter") {
	    event.preventDefault(); // Prevent form submission
	    handleGoButtonClick(); // Call your submit function
		setIsResultsVisible(false);
	  }
	};

  	useEffect(() => {
	    const handleOutsideClick = (event) => {
	      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
	        // setSearchResults([]);
	        setIsResultsVisible(false);
	      }
	    };

	    document.addEventListener('click', handleOutsideClick);

	    return () => {
	      document.removeEventListener('click', handleOutsideClick);
	    };
  	}, [searchResultsRef]);

	const handleScroll = useCallback((event) => {
	   	const { scrollTop, clientHeight, scrollHeight } = event.target;

	    if (scrollTop + clientHeight >= scrollHeight) {
	        // Fetch next page of search results
	        const nextPage = searchResults.length / 20 + 1; // Assuming each page contains 20 results
	        const fetchNextPage = async () => {
	          try {
	            const response = await axios.get(`/search/multi?query=${text}&include_adult=false&language=en-US&page=${nextPage}`, {
	              headers: {
	                accept: 'application/json',
		    		Authorization: 'Bearer paste your key here...'
	              }
	            });

	            // console.log(response.data.results);

	            setSearchResults((prevResults) => [...prevResults, ...response.data.results]);
	            return response;
	          } catch (error) {
	            console.error('Error fetching data:', error);
	          }
	        };
	        fetchNextPage();
	    }
	}, [searchResults.length, text]);

	const fetchUrl = `/search/multi?query=${text}&include_adult=false&language=en-US&page=${page}`;

	const fetchData = useCallback(async () => {
	  try {
	    const response = await axios.get(fetchUrl, {
	      headers: {
	        accept: 'application/json',
		    Authorization: 'Bearer paste your key here...'
	      },
	    });

	    // console.log(response.data.results, page);

	    setSimilar((prevMovie) => [...prevMovie, ...response.data.results]);

	    setLoading(false);

	    return response;
	  } catch (error) {
	    console.error('Error fetching data:', error);
	  }
	}, [fetchUrl, setSimilar, setLoading]);


  	const handleLoadMore = () => {
  		setPage((prevPage) => prevPage + 1);
  		setLoading(true);
	};

  	useEffect(() => {
    	fetchData();
  	}, [page, fetchData]);

	return (
		<div>
			{isLoading ? (
		      <Spinner2 />
		    ) : (
				<div className="container-fluid">
					<div className="row bg-black">
						<Navbar2 />

						<div className="col-12 col-sm-12 bg-black text-white p-5" id="smDiv1">
							<div className="col-xxl border-0 mt-2 bg-dark text-white p-2" id="searchBox" style={{ borderRadius: '5px' }}>
								<form className="d-flex">
								    <input
								        className="form-control search bg-transparent text-white"
								        value={text}
								        type="search"
								        placeholder="Movie, shows and more"
								        onChange={inputChangeHandler}
								        onKeyDown={handleKeyDown}
								      />
								    <button 
								    	type="button" 
								    	onClick={handleGoButtonClick} 
								    	className="btn bg-transparent text-white"
								    >
								    	<i className="fa-solid fa-magnifying-glass" style={{ color: '#ffffff' }}></i>
								    </button>
								</form>

								{isResultsVisible && searchResults.length >= 1 && (
		  							<ul className="searchList"
		  									ref={searchResultsRef} 
		  									onScroll={handleScroll}
		  									style={{ overflowY: 'scroll', touchAction: 'panY' }} 
		  							>
										{searchResults.map((result) => (
										    <li
										        key={result?.id}
										        onClick={() => {
										          handleLiClick(result);
										          setSearchResults([]); // Clear search results when an item is selected
										        }}
										        className="p-2 d-flex justify-content-between align-items-center"
										        style={{ cursor: 'pointer', fontSize: '20px' }}
										    >
										    	<img src={`${base_url}${result?.poster_path || result?.profile_path}`} alt="piratedTV" width="100" height="109.7" />
										        {result?.title || result?.name}
										        {result?.release_date || result?.last_air_date || result?.first_air_date ? 
									        		<span className="text-white">{new Date(result?.release_date || result?.last_air_date || result?.first_air_date).getFullYear()}</span>
									        		: '' 
									        	}
										    </li>
										))}
		  							</ul>
								)}
							</div>

							{loading && <Spinner2 />}

							<div className="mt-5">
								<div className="d-flex justify-content-center align-items-center flex-wrap">
									{rSearch && Object.keys(rSearch).length > 1 && (
		        						<div className="card bg-black border">
										  	<img 
										  		src={`${base_url}${rSearch?.poster_path || rSearch?.backdrop_path}`} 
										  		className="card-img-top" 
										  		alt="piratedTV"
										  		onClick={() => handleClick(rSearch)}
										  	/>
										  	<div className="card-body">
											    <h5 className="card-title text-white">{rSearch?.title || rSearch?.name || rSearch?.original_name || rSearch?.original_title}</h5>
											    <p className="card-text text-white">{new Date(rSearch?.release_date || rSearch?.last_air_date).getFullYear()}</p>
	  										</div>
										</div>
									)}

									{showSimilar && searchResults.length >= 1 && (
									  similar.map((i, index) => (
									    <div className="card bg-black border" key={index}>
									        <img 
									          src={`${base_url}${i?.poster_path || i?.backdrop_path}`} 
									          className="card-img-top" 
									          alt="piratedTV"
									          onClick={() => handleClick(i)}
									        />
									        <div className="card-body">
									          	<h5 className="card-title text-white">{i?.title || i?.name || i?.original_name || i?.original_title}</h5>
									        	{i?.release_date || i?.last_air_date || i?.first_air_date ? 
									        		<p className="card-text text-white">{new Date(i?.release_date || i?.last_air_date || i?.first_air_date).getFullYear()}</p>
									        		: '' }
									        </div>
									    </div>
									  ))
									)}

									{isError && (
										<div>No results found...</div>
									)}

									{loading && <Spinner2 />}
									{showSimilar ? (
							            <div className="col-12 col-sm-12 mb-2 mt-3 text-center">
							            	<button type="button" 
							            		className="btn border text-white"
							            		onClick={handleLoadMore} 
							            		style={{ borderRadius: '50%', padding: '10px 10px 0 10px' }}
							            	>
							            		<i className="fa-solid fa-angle-down" color="#ffffff"></i>
							            	</button>
							            </div>
						            ) : '' }
								</div>

								<h4 className="mt-5">Popular Searches</h4>
								{pSearch && pSearch.length >= 1 && (
									<div className="flex flex-row flex-wrap">
										{pSearch.map(i => (
											<button 
												key={i.id} 
												className="btn p-2 me-3 mb-3 border sBtn"
												onClick={() => {
										          setText(i.name || i.original_title);
										        }}
											>
												{i?.name || i?.original_title}
											</button>
										))}
									</div>
								)}
							</div>
						</div>

						<Navbar1 />
					</div>
				</div>
			)}
		</div>
	);
}

export default SearchMovies;