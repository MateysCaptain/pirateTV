import React, { useState, useEffect } from 'react';
import axios from './axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Shimmer } from 'react-shimmer';
import ReactPlayer from 'react-player/lazy';
import Spinner2 from './Spinner2';
import Navbar5 from './Navbar5';
import './genre.css';

function People() {
	let { name } = useParams();

  	// console.log(name);

  	const [ movie, setMovie ] = useState([]);
  	const [loading, setLoading] = useState(true);
  	const [isLoading, setIsLoading] = useState(true);
  	const [width, setWidth] = useState(0);
  	const [popupData, setPopupData] = useState(null);
    const [previewPosition, setPreviewPosition] = useState({ left: 0, top: 0 });
  	const [isScrolling, setIsScrolling] = useState(false);
    const [popupTimeoutId, setPopupTimeoutId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
  	const [isAudioMuted, setIsAudioMuted] = useState(false);

  	// const fetchUrl = `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${id}`;
  	const fetchUrl = `/search/person?query=${name}&include_adult=false&language=en-US&page=1`;

  	const fetchData = async () => {
	    try {
	      	const response = await axios.get(fetchUrl, {
		        headers: {
		          accept: 'application/json',
		    	  Authorization: 'Bearer paste your key here...'
		        },
	      	});

	      	// console.log(response.data.results[0]?.id);

	      	const response2 = await axios.get(`/person/${response.data.results[0]?.id}/movie_credits?language=en-US`, {
		        headers: {
		          accept: 'application/json',
		    	  Authorization: 'Bearer paste your key here...'
		        },
	      	});

	      	// console.log(response2.data?.cast);

	      	setMovie(response2.data?.cast);

	      	setLoading(false);
          	setIsLoading(false);

	      return response;
	    } catch (error) {
	      console.error('Error fetching data:', error);
	    }
  	};

  	useEffect(() => {
    	fetchData();
  	}, []);

  	const navigate = useNavigate();

  	// console.log(movie);

    const base_url = 'https://image.tmdb.org/t/p/original';

    useEffect(() => {
	    const handleResize = () => {
	      setWidth(window.innerWidth);
	    };

	    window.addEventListener('resize', handleResize);
	    handleResize();

	    return () => {
	      window.removeEventListener('resize', handleResize);
	    };
  	}, []);

  	const handleClick = (movie) => {
    	let name = movie?.original_title || movie?.name || movie?.original_name || movie?.title;
	    let id = movie?.show_id || movie?.id;
	    // console.log(epName, id, movie, name);

	    const url = `/v1/moviePart/${id}?name=${name}&episode=&sno=`;
	    navigate(url);
  	}

  	const handleMouseEnter = async (movie, event) => {
	    if (isScrolling) {
	      return;
	    }
	    event.preventDefault();

	    let name = movie?.original_title || movie?.name || movie?.original_name || movie?.title;
	    let id = movie.id;

	    const imagePosition = event.target.getBoundingClientRect();

	    // console.log(imagePosition);

	    setPreviewPosition({
	      left: imagePosition.left + imagePosition.width - 60 + "px", // Adjust the left position as needed
	      top: imagePosition.top - 50 + "px", // Adjust the top position as needed
	    });

	    closePopup();

	    if (popupData !== null) {
	      return;
	    }

    	const timeoutId = setTimeout(async () => {
      		const response2 = await axios.get(`/search/multi?query=${name}&include_adult=false&language=en-US&page=1`, {
		        headers: {
		          accept: 'application/json',
		    	  Authorization: 'Bearer paste your key here...'
		        }
      		});

		    const filterData = response2.data.results.filter(i => {
		        return i.id === id;
		    })

	      	let mediaType = "movie";

		    if (filterData[0].media_type === 'tv') {
		        mediaType = "tv";
		    }
		    else if (filterData[0].media_type === 'movie') {
		        mediaType = "movie"
		    }

	      	const videosResponse = await axios.get(`/${mediaType}/${id}/videos?language=en-US`, {
		        headers: {
		          accept: 'application/json',
		          Authorization: 'Bearer paste your key here...'
		        },
	        });

	        setPopupData({
		        name,
		        videos: videosResponse.data.results[0]?.key,
		        overview: movie?.overview
	      	});

	        setIsOpen(true);
	    }, 3000);

    	setPopupTimeoutId(timeoutId);
  	};

	const closePopup = () => {
	    // Clear the timeout and close the popup
	    clearTimeout(popupTimeoutId);
	    setPopupData(null);
	    setIsOpen(false);
	};

	const handleMouseLeave = () => {
	    // console.log(popupData);
	    if (!isOpen || popupData !== null) {
	      setPopupData(null);
	      clearTimeout(popupTimeoutId);
	    }
	};

	function truncate(str, n) {
    	return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    const handleClosePreview = () => {
    	setPopupData(null);
    };

	const popupClickHandler = () => {
	    setTimeout(() => {
	      const iframe = document.querySelector('.preview .row_video1');
	      // console.log(iframe);

	      if (iframe) {
	        iframe.requestFullscreen(); // Request full screen for the iframe
	      }
	    }, 100);
  	};

	return (
		<>
			{isLoading ? (
		        <Spinner2 />
		    ) : (
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<Navbar5 />

							<div className="genre__div1 text-center text-white p-2" style={{ fontSize: '25px' }}>
								{name}
							</div>

							<div className="border-0 genre__div2">
								{movie.map((movie, index) => (
					                <div
					                  key={index}
					                  onClick={() => handleClick(movie)}
					                  onMouseOver={(event) => handleMouseEnter(movie, event)}
                                      onMouseOut={handleMouseLeave}
					                  className={`imgContainer genre__div`}
					                >
					                  <Image
					                    className="border"
					                    src={`${base_url}${movie?.poster_path ? movie?.poster_path : movie?.backdrop_path}`}
					                    alt="netflix"
					                    fallback={<Shimmer width={200} height={270} colorShimmer={['green', 'white', 'red']} />}
					                  />
					                </div>
		              			))}
		              			{loading && <Spinner2 />}
							</div>

							<div className="col-12 col-sm-12 mb-2" style={{ overflowY: 'hidden !important' }}>
				              {popupData && (
				                <div className="preview" style={{ position: 'fixed', left: previewPosition.left, top: previewPosition.top }}>
				                  <ReactPlayer 
				                    url={`https://www.youtube.com/embed/${popupData.videos}?autoplay=1&mute=1&controls=0`}
				                    className="row_video1"
				                    width="100%"
				                    height="auto"
				                    loop={true}
				                    playsinline={true}
				                    volume={0.5}
				                    muted={isAudioMuted}
				                    playing={true}
				                    config={{ youtube: { playerVars: { disablekb: 1 } } }}
				                    fullscreen="true"
				                  />
				                  <div className="d-flex mt-2 justify-content-between align-items-center ps-2 pe-2 vBtn">
				                    <p className="" style={{ fontSize: '16px', wordSpacing: '1px' }}>{popupData.name}</p>
				                    <button
				                      className="btn banner__button2 audio-button border-0"
				                      onClick={() => setIsAudioMuted((prevMuted) => !prevMuted)}
				                    >
				                      {isAudioMuted ? (
				                          <i className="fa-solid fa-volume-xmark" style={{ color: '#00000' }}></i>
				                      ) : (
				                          <i className="fa-solid fa-volume-high" style={{ color: '#00000' }}></i>
				                      )}
				                    </button>
				                    <button className="btn full-btn border-0 p-0 d-none" onClick={popupClickHandler}>
				                      <i className="fa-solid fa-down-left-and-up-right-to-center" style={{ color: '#fcfcfc' }}></i>
				                    </button>
				                  </div>
				                  <p className="ps-2 pe-2 div_description" style={{ wordSpacing: '0.5px' }}>{truncate(popupData.overview, 120)}</p>
				                  <button className="close-button border-0 bg-transparent" onClick={handleClosePreview} style={{ position: 'absolute', top: '10%', right: '10%', zIndex: 9999 }}>
				                    <i className="fa-solid fa-circle-xmark" style={{ color: '#f2021a' }}></i>
				                  </button>
				                </div>
				              )}
				            </div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default People;