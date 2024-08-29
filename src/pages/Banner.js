import { useState, useEffect } from 'react';
import axios from 'axios';
import './banner.css';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import Spinner2 from "./Spinner2";
import Cookies from 'js-cookie';

function Banner3() {
	const [movie, setMovie] = useState([]);
  	const [videos, setVideos] = useState([]);
  	const [loading, setLoading] = useState(true);
  	const [isAudioMuted, setIsAudioMuted] = useState(true);
  	const [showVideo, setShowVideo] = useState(false);
  	const [videoLoaded, setVideoLoaded] = useState(false);
    const [video, setVideo] = useState('');
    const [tag, setTag] = useState('movie');
    const [duration, setDuration] = useState(0);

  	const base_url = "https://image.tmdb.org/t/p/original";

    // const location = useLocation();
  	
  	const navigate = useNavigate();

	const isPremium = Cookies.get('bool');
	// console.log(isPremium, isPremium !== "no");

	// console.log(window.location.protocol);

	const fetchData = async () => {
	    try {
	        // Fetch Netflix originals
	        const response = await axios.get("https://api.themoviedb.org/3/trending/all/day?language=en-US", {
	          	headers: {
				    accept: 'application/json',
				    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
				},
	        });

	        // console.log(response.data.results);

	        const rNumber = Math.floor(Math.random() * response.data.results.length - 1);

	        // Randomly select a movie
	        const randomMovie = await response.data.results[rNumber];

	        // Set the selected movie
	        setMovie(randomMovie);

	        // console.log(randomMovie, randomMovie?.id);

	        let tag = "movie";

	        if (randomMovie?.media_type === 'tv') {
		        // Fetch videos for the selected movie
		        tag = "tv";
		        setTag("tv");
		    	}

		    	else {
		    		tag = "movie";
		    		setTag("movie");
		    	}

		    const videosResponse = await axios.get(`https://api.themoviedb.org/3/${tag}/${randomMovie?.id}/videos?language=en-US`, {
			    headers: {
				    accept: 'application/json',
				    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
					},
		    });

		    // Set the videos for the selected movie
		    setVideos(videosResponse.data.results[0]?.key);
		    // console.log(videosResponse.data.results[0].key);
		    setLoading(false);
	    } catch (error) {
	        console.error('Error fetching data:', error);
	        setLoading(false);
	    }
	}

  	useEffect(() => {
	    fetchData();
	}, []); // Empty dependency array means this effect runs once when the component mounts

  	// Rest of your component logic...

  	function truncate(str, n) {
		return str?.length > n ? str.substr(0, n - 1) + "..." : str;
	}

	const handlePlayClick = async (movie, type) => {
		if (type === 'tv') {
			if (isPremium && isPremium !== "no") {
				// console.log(isPremium, movie?.id);
            	window.location.href = `/v1/watchMovie/tv?tmdb=${movie?.id}&season=${movie?.season_number}&episode=${movie?.episode_number}&type=tv`;
				// window.location.href = `https://vidsrc.xyz/embed/tv?tmdb=${movie?.id}&season=${movie?.season_number}&episode=${movie?.episode_number}`;
				// window.location.href = `https://hello-world-yellow-recipe-da50.oizkw1ft.workers.dev/proxy/eyJ1cmwiOiJodHRwczovL215ZmlsZXN0b3JhZ2UueHl6Lzc2MzIxNS5tcDQiLCJyZWZlcmVyIjoiaHR0cHM6Ly9iZmxpeC5ncy8ifQ%3D%3D/${movie?.id}.mp4`;
			}
			else {
				navigate(`/v1/first/?type=tv&id=${movie?.id}&season=${movie?.season_number}&episode=${movie?.episode_number}`);
				window.location.reload();
			}
		}
		else {
			if (isPremium && isPremium !== "no") {
            	window.location.href = `/v1/watchMovie/movie?tmdb=${movie?.id}&type=movie`;
				// window.location.href = `https://vidsrc.xyz/embed/movie?tmdb=${movie?.id}`;
				// window.location.href = `https://hello-world-yellow-recipe-da50.oizkw1ft.workers.dev/proxy/eyJ1cmwiOiJodHRwczovL215ZmlsZXN0b3JhZ2UueHl6Lzc2MzIxNS5tcDQiLCJyZWZlcmVyIjoiaHR0cHM6Ly9iZmxpeC5ncy8ifQ%3D%3D/${movie?.id}.mp4`;
			}
			else {
				navigate(`/v1/first/?type=movie&id=${movie?.id}`);
				window.location.reload();
			}
		}
	}

	  // to={`https://vidsrc.xyz/embed/tv?tmdb=${movie?.id}&season=${movie?.season_number}&episode=${movie?.episode_number}`}

	  // to={`https://vidsrc.xyz/embed/movie?tmdb=${movie?.id}`}

		// console.log(movie, movie?.media_type);

		// console.log(videos, movie);

	  if (loading) {
	    return <Spinner2 />;
	  }

	const dynamicSrc = `${window.location.protocol}//www.youtube.com/embed/${videos}?version=3&autoplay=1&mute=1&controls=0&loop=1&playlist=${videos}
						&enablejsapi=1&origin=${window.location.origin}`;

	return (
		<>
		{videoLoaded ? (
		  <div className="bg-dark banner" 
		  		style={{ position: 'relative', width: '100vw', height: '100vh', 
		  			overflow: 'hidden', zIndex: '9999'
		  		}}
		  	>
	        <ReactPlayer
			    url={video}
			    className="play__video"
			    playing={true}
				loop={true}
				muted={true}
				width="100%"
				height="100%"
				allow="autoplay; encrypted-media; allow-scripts; allow-same-origin"
				style={{ position: 'absolute', top: 0, left: 0 }}
				fullscreen="true"
	  			controls={false}
				id="video-player"
			/>
	      </div>
		) : (
			<header className="banner mb-3 border-0">
				{!videos ? (
				  <div
					  className="banner__background-image"
					  style={{
					    backgroundImage: `url(${base_url}${movie?.backdrop_path})`,
					    backgroundSize: 'cover',
					    backgroundPosition: 'center',
					    width: '100%',
					    height: '100%',
					  }}
				  />
				) : (
					<ReactPlayer 
					    url={dynamicSrc}
					    className="banner__video"
					    width="100%"
					    height="100%"
					    loop={true}
					    playsinline={true}
					    volume={0.5}
					    muted={isAudioMuted}
					    playing={true}
					    allow="autoplay; encrypted-media; allow-scripts; allow-same-origin"
					    config={{ youtube: { playerVars: { disablekb: 1 } } }}
					    fullscreen="true"
		      		/>
					)
				}

				<div className="banner__contents">
					<h3 className="banner__title">
						{truncate(movie?.title || movie?.name || movie?.original_name, 20)}
					</h3>

					<div className="banner__buttons">
						{movie?.media_type === 'tv' ? (
	            <button
	            	type="button"
	              	className="btn banner__button1 text-uppercase text-white ms-2"
	              	style={{ textDecoration: 'none' }}
	              	rel="noopener noreferrer"
	              	onClick={() => handlePlayClick(movie, 'tv')}
	              	aria-label="Play TV Show"
	            >
	              <i className="fa-solid fa-play me-2" style={{ color: '#FFFFFF' }}></i>
	              PLAY
	            </button>
	          ) : (
	            <button
	             type="button"
	              className="btn banner__button1 text-uppercase text-white ms-2"
	              style={{ textDecoration: 'none' }}
	              rel="noopener noreferrer"
	              onClick={() => handlePlayClick(movie, 'movie')}
	              aria-label="Play Movie"
	            >
	              <i className="fa-solid fa-play me-2" style={{ color: '#FFFFFF' }}></i>
	                PLAY
	            </button>
	          )}
						<button
							className="btn banner__button2 audio-button border-0"
							onClick={() => setIsAudioMuted((prevMuted) => !prevMuted)}
							aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
						>
							{isAudioMuted ? (
							    <i className="fa-solid fa-volume-xmark" style={{ color: '#00000' }}></i>
							) : (
							    <i className="fa-solid fa-volume-high" style={{ color: '#00000' }}></i>
							)}
						</button>
					</div>

					<h1 className="banner__description">
						{truncate(movie?.overview, 150)}
					</h1>
				</div>
				<div className="banner--fadeBottom"></div>
			</header>
		)}
		</>
	);
}

export default Banner3;