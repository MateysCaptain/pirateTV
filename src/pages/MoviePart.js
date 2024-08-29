import React, { useState, useEffect } from 'react';
import './mp.css';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import axios1 from './axios';
import axios from 'axios';
import Spinner2 from './Spinner2';
import Cookies from 'js-cookie';
// https://i.ibb.co/nbjDvPf/netsd-3.jpg

function MoviePart() {
	let { id } = useParams();
	const [text, setText] = useState([]);
  	const location = useLocation();
  	const queryParams = new URLSearchParams(location.search);
	const [isLoading, setIsLoading] = useState(true);
	const [seasons, setSeasons] = useState(null);
	const [collection, setCollection] = useState(null);
	const [selectedSeason, setSelectedSeason] = useState(null);
	const [episodeData, setEpisodeData] = useState(null);
	const [epId, setEpId] = useState(null);
	const [selectedCollection, setSelectedCollection] = useState(null);
	const [similarMovies, setSimilarMovies] = useState(null);
	const [genre, setGenre] = useState(null);
	const [cast, setCast] = useState(null);
	const [firstSeason, setFirstSeason] = useState(null);
	const [type, setType] = useState(null);
  	const [width, setWidth] = useState(0);
  	const [data, setData] = useState([]);
    const [total, setTotal] = useState('');
    const [perEpId, setPerEpId] = useState(null);
	const navigate = useNavigate();

  	// Access query parameters
  	let name = queryParams.get('name');
  	let eNo = queryParams.get('episode');
  	let sNo = queryParams.get('sno');

  	const isPremium = Cookies.get('bool');
    // console.log(isPremium);

    // const url1 = window.location.href;
	// const url1 = location.pathname;
	window.sessionStorage.clear();
    
    // console.log(url1);
	
	// console.log(id, name, eNo, sNo);
	// console.log(width);
	
  	async function fetchData() {
		const response = await axios1.get(`/search/multi?query=${name}&include_adult=false&language=en-US&page=1`, {
			headers: {
			    accept: 'application/json',
			    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
			}
		});

		// console.log(response.data.results);

		let filterData = response.data.results.filter(i => {
		  return i.id == id;
		});

		if (filterData.length === 0) {
		  filterData = response.data.results.filter((i, index) => {
		  	return index === 0;
		  });
		}

		// console.log(filterData, filterData[0].media_type);

		let mediaType = "movie";

		if (filterData[0].media_type === 'tv') {
			mediaType = "tv";
		}

		else if (filterData[0].media_type === 'movie') {
			mediaType = "movie";
		}

		setType(mediaType);

		// 89113 1782705 2888662 1

		// console.log(mediaType, filterData[0].id);

		const response2 = await axios1.get(`/${mediaType}/${filterData[0].id}?append_to_response=credits&language=en-US`, {
			headers: {
			    accept: 'application/json',
			    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
			}
		});
		// console.log(response2.data, response2.data?.seasons[0].season_number);

		// console.log(response2.data, response2.data.hasOwnProperty('number_of_seasons'), response2.data.hasOwnProperty('belongs_to_collection'));

		setCast(response2.data.credits.cast);
		setGenre(response2.data.genres);

		// const formData = new FormData();
		// formData.append('tmdbId', id);

		// const response51 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
		//     headers: {
		//         'Content-Type': 'multipart/form-data',
		//     },
		//     maxBodyLength: Infinity,
		// });

		// setData(response51.data);

		// console.log(response51.data);

		if (response2.data.hasOwnProperty('number_of_seasons') && response2.data.number_of_seasons !== null) {
			// console.log(response2.data?.seasons);
			const sID = response2.data?.id;
			const sno = (response2.data?.seasons.length > 1) ? response2.data?.seasons[1].season_number : response2.data?.seasons[0].season_number;
			const sid = (response2.data?.seasons.length > 1) ? response2.data?.seasons[1].id : response2.data?.seasons[0].id;

      		const filteredSeasons = response2.data?.seasons.filter(season => season.season_number !== 0);

			// console.log(sID, sid);

			const response6 = await axios1.get(`/tv/${sID}/season/${sno}`, {
				headers: {
					accept: 'application/json',
					Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
				}
			})

			// console.log(response6.data?.episodes);

			setFirstSeason(response6.data?.episodes);
			// console.log(sID, sid);

			if (eNo) {
				// console.log("1", `/tv/${sID}/season/${sNo}/episode/${eNo}`);
				const response7 = await axios1.get(`/tv/${sID}/season/${sNo}/episode/${eNo}`, {
					headers: {
						accept: 'application/json',
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
					}
				})

				// console.log(response7.data?.id);
				setText(response7.data);
				setPerEpId(response7.data?.id);
				const formData = new FormData();
		      	formData.append('tmdbId', sid);

			    const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
			        headers: {
			          'Content-Type': 'multipart/form-data',
			        },
			        maxBodyLength: Infinity,
			    });

			    // console.log(response50.data);

			    setData(response50.data);
			}

			else {
				setText(response2.data);
				const formData = new FormData();
		      	formData.append('tmdbId', id);

			    const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
			        headers: {
			          'Content-Type': 'multipart/form-data',
			        },
			        maxBodyLength: Infinity,
			    });

			    // console.log(response50.data);

			    setData(response50.data);
			}

			// console.log(response2.data);

			const response5 = await axios1.get(`/tv/${sID}/similar`, {
				headers: {
					accept: 'application/json',
					Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
				}
			})

			// console.log(response5.data.results);

			setEpId(response2.data.id);
			setSeasons(filteredSeasons);
			setIsLoading(false);
			setSimilarMovies(response5.data.results);
			setSelectedSeason(sid);

			// const formData = new FormData();
		    //   formData.append('tmdbId', id);

		    //   const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
		    //     headers: {
		    //       'Content-Type': 'multipart/form-data',
		    //     },
		    //     maxBodyLength: Infinity,
		    //   });

		    //   // console.log(data, sid);

		    //   setData(response50.data);
			return response2.data;
		}

		else if (response2.data.hasOwnProperty('belongs_to_collection') && response2.data.belongs_to_collection !== null) {
			// console.log(response2.data);

			if (response2.data.belongs_to_collection !== '') {
				const id = response2.data.belongs_to_collection?.id;
				const sID = response2.data?.id;
				setEpId(response2.data?.id);
				// console.log(id, sID);

				const url = `/collection/${id}`;
				const response4 = await axios1.get(`/collection/${id}`, {
					headers: {
						accept: 'application/json',
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
					}
				})

				// console.log(response4.data);

				const response5 = await axios1.get(`/movie/${sID}/similar`, {
					headers: {
						accept: 'application/json',
						Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
					}
				})

				// console.log(response5.data.results);

				setSimilarMovies(response5.data.results);
				setCollection(response4.data.parts);
				setSelectedCollection(response4.data.parts[0].id);

				const formData = new FormData();
			      formData.append('tmdbId', sID);

			      const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
			        headers: {
			          'Content-Type': 'multipart/form-data',
			        },
			        maxBodyLength: Infinity,
			      });

			      setData(response50.data);
			}
			setText(response2.data);
			setIsLoading(false);
			return response2.data;
		}

		else {
			// console.log("3");
			const response5 = await axios1.get(`/${mediaType}/${id}/similar`, {
		        headers: {
		          accept: 'application/json',
		          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
		        }
		    })

		    setSimilarMovies(response5.data.results);
			setText(response2.data);
			setIsLoading(false);

			const formData = new FormData();
		      formData.append('tmdbId', id);

		      const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
		        headers: {
		          'Content-Type': 'multipart/form-data',
		        },
		        maxBodyLength: Infinity,
		      });

		      setData(response50.data);
			return response2.data;
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	// https://image.tmdb.org/t/p/original/kGzFbGhp99zva6oZODW5atUtnqi.jpg
	// https://image.tmdb.org/t/p/original${text?.poster_path}

	const formatTime = (minutes) => {
	    const hours = Math.floor(minutes / 60);
	    const remainingMinutes = minutes % 60;

	    let timeString = '';

	    if (hours > 0) {
	      timeString += ` ${hours} hr `;
	    }

	    if (remainingMinutes > 0) {
	      timeString += `${remainingMinutes} min `;
	    }

	    return timeString.trim(); // Trim any leading/trailing spaces
  	};

  	const handleButtonClick = () => {
    	// Redirect to the home page
		navigate("/v1/home3");
  	};

  	function truncate(str, n) {
  		// console.log(width, str?.length > n ? str.substr(0, n - 1) + "..." : str);
		return str?.length > n ? str.substr(0, n - 1) + "..." : str;
	}

	// console.log(seasons);
	// console.log(collection);
	// console.log(similarMovies);

	async function seasonClickHandler(id, seasonNumber) {
		// console.log(id);
		setSelectedSeason(id);
        	const url = `/tv/${epId}?language=en-US&append_to_response=season/${seasonNumber}`;
		const response3 = await axios1.get(url, {
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
			}
		})

		const sData = response3.data['season/'+seasonNumber].episodes;

		// console.log(sData);

		setEpisodeData(sData);
		setFirstSeason(null);
	}

	const collectionClickHandler = (collectionId) => {
    	setSelectedCollection(collectionId);
  	};

  	const handleClick = (episode, type) => {
	    // let name = episode?.title || episode?.name || episode?.original_name || episode?.original_title;
	    let id = episode.episode_number;
	    let show_id = '';
	    if (type == 'tv') {
	    	show_id = episode.show_id;
	    }
	    else {
	    	show_id = episode.id;
	    	name = episode?.title || episode?.name || episode?.original_name || episode?.original_title;
	    }
	    let sno = episode.season_number;

	    // console.log(episode, name, show_id, id, sno);

	    navigate(`/v1/nextPart/${show_id}?name=${name}&episode=${id}&sno=${sno}`);

	    // setText(episode);
  	};

  	const smClickHandler = (smovie) => {
  		let name = smovie?.title || smovie?.name || smovie?.original_name || smovie?.original_title;
  		let id = smovie.id;

	    	// console.log(name, id, smovie);
		
		navigate(`/v1/nextPart/${id}?name=${name}&episode=&sno=`);
  	}

  	const handlePlayClick = async (text, type) => {
	    if (type === 'tv') {
	    	if (isPremium && isPremium !== "no") {
	    		// console.log(text?.id, epId, perEpId);
        		// window.location.href = `https://vidsrc.xyz/embed/tv?tmdb=${epId || text?.id}&season=${text?.season_number}&episode=${text?.episode_number}`;
        		// window.location.href = `https://hello-world-yellow-recipe-da50.oizkw1ft.workers.dev/proxy/eyJ1cmwiOiJodHRwczovL215ZmlsZXN0b3JhZ2UueHl6Lzc2MzIxNS5tcDQiLCJyZWZlcmVyIjoiaHR0cHM6Ly9iZmxpeC5ncy8ifQ%3D%3D/${perEpId || text?.id}.mp4`;
            	window.location.href = `/v1/watchMovie/tv?tmdb=${epId || text?.id}&season=${text?.season_number}&episode=${text?.episode_number}&type=tv`;
      		}
      		else {
	      		navigate(`/v1/first/?type=tv&id=${epId || text?.id}&season=${text?.season_number}&episode=${text?.episode_number}`);
	      		// navigate(`/v1/first/?type=tv&id=${perEpId || text?.id}&season=${text?.season_number}&episode=${text?.episode_number}`);
		  		window.location.reload();
		  	}
	    }
	    else {
	    	if (isPremium && isPremium !== "no") {
            	window.location.href = `/v1/watchMovie/movie?tmdb=${epId || text?.id}&type=movie`;
		        // window.location.href = `https://vidsrc.xyz/embed/movie?tmdb=${epId || text?.id}`;
        		// window.location.href = `https://hello-world-yellow-recipe-da50.oizkw1ft.workers.dev/proxy/eyJ1cmwiOiJodHRwczovL215ZmlsZXN0b3JhZ2UueHl6Lzc2MzIxNS5tcDQiLCJyZWZlcmVyIjoiaHR0cHM6Ly9iZmxpeC5ncy8ifQ%3D%3D/${epId || text?.id}.mp4`;
		    }
		    else {
	      		navigate(`/v1/first/?type=movie&id=${epId || text?.id}`);
		  		window.location.reload();
		  	}
	    }
  	}

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

  	useEffect(() => {
	    if (data.length >= 1) {
	      const totalAmount = data.reduce((acc, red) => {
	        return acc + parseFloat(red.total_donation);
	      }, 0);

	      setTotal(totalAmount);
	    }
	}, [data]);

	// console.log(data, total);

  	// console.log(episodeData, firstSeason);

  	// console.log(epId);
  	// console.log(similarMovies);
  	// console.log(text);

	return (
		<div className="text-white" id="mpDiv1">
			{isLoading ? (
        		<Spinner2 />
      		) : (
      		<>
				<header id="headerDiv" className="fade-in" 
					style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.93) 80%), url(https://image.tmdb.org/t/p/original${text?.backdrop_path || text?.still_path})` }}>
					<div className="container-fluid p-0" id="mpDiv3">
						<div className="row p-0">
							<div className="col-12" id="mpDiv">
							</div>
							
							<div id="displayText">
								<div className="d-flex" style={{ color: 'white' }}>
									<div className="border-0"><img src="https://i.ibb.co/GFvwssk/pirate-logo-removebg-preview.png" alt="netflix" width="50" height="50" /></div>
									<div className="align-self-center font-monospace mp__text1">FILM</div>
								</div>
								<h3 
									className="text-uppercase ps-2 mp__text2" 
									style={{ fontWeight: '700', overflow: 'hidden', textShadow: '2px 2px 2px rgba(0,0,0,0.7)' }}
								>
									{width < 600 ? (
									  truncate(text?.original_name || text?.title || text?.name, 20)
									) : (
									  truncate(text?.original_name || text?.title || text?.name, 90)
									)}
								</h3>
						        <div className="d-flex justify-content-between" id="mpDiv2">
						        	<div className="d-flex align-items-center">
						        		{type === 'tv' ? (
								        	<button
								        		type="button"
								        		className="btn text-uppercase btn-light border ms-2" 
								        		style={{ color: 'black', fontWeight: '700', padding: '5px 20px', borderRadius: '3px', textDecoration: 'none' }}
                            					onClick={() => handlePlayClick(text, 'tv')}
								        	>
								        		<i className="fa-solid fa-play me-2" style={{ color: '#000000' }}></i>
								        		play
								        	</button>
								        ) : (
								        	<button
								        		type="button"
								        		className="btn text-uppercase btn-light border ms-2" 
								        		style={{ color: 'black', fontWeight: '700', padding: '5px 20px', borderRadius: '3px', textDecoration: 'none' }}
                            					onClick={() => handlePlayClick(text, 'movie')}
								        	>
								        		<i className="fa-solid fa-play me-2" style={{ color: '#000000' }}></i>
								        		play
								        	</button>
								        )}
							        	<div className="ms-3 mp__btn__div border">
							        		<button type="button" className="btn p-0" style={{}}>
							        			<i className="fa-solid fa-thumbs-up" style={{ color: '#f5f5f5' }}></i>
							        		</button>
							        	</div>
							        	<div className="ms-3 mp__btn__div border">
							        		<button type="button" className="btn p-0" style={{}}>
							        			<i className="fa-solid fa-volume-high" style={{ color: '#f5f5f5' }}></i>
							        		</button>
							        	</div>
							        </div>
						        </div>
							</div>
						</div>
					</div>
				</header>

				<section>
					<div id="closeBtn1">
						<button type="button" className="btn p-0" onClick={handleButtonClick} style={{}}>
							<i className="fa-solid fa-x" style={{ color: '#ffffff' }}></i>
						</button>
					</div>
				</section>

				<section>
					<div className="container-fluid border-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', padding: '0 !important' }}>
						<div className="row">
							<div className="col-12 d-flex flex-row flex-wrap p-0" id="mpDiv4">
								<div className="col-12 col-sm-12 col-md-6 p-2 mt-2 mb-2">
									<div className="flex-item mb-2">
										<p>
											<span className="me-2">
												{text.hasOwnProperty('first_air_date')
	          										? new Date(text?.first_air_date).getFullYear()
	          										: text.release_date
	            									? new Date(text?.release_date).getFullYear()
	            									: ''
	        									}
											</span>
											
											{text.hasOwnProperty('episode_run_time') ? (text?.episode_run_time.length == 1 ? (<span>{formatTime(text?.episode_run_time[0])} </span>) : text?.episode_run_time.length >= 1 &&
			                                  (() => {
			                                    const totalRunTime = text?.episode_run_time.reduce((accumulator, time) => accumulator + time);
			                                    const formattedTime = formatTime(totalRunTime);
			                                    // console.log(formattedTime);
			                                    return <span>{formattedTime}</span>;
			                                  })()
			                                  ) : <span>{formatTime(text?.runtime)} </span>
			                                }
										</p>
										<p>
											<span 
												className="me-1" 
												style={{ backgroundColor: 'yellow', padding: '1px 5px', color: 'black', borderRadius: '5px', fontWeight: '500' }}>
													12+
											</span>
											{genre && genre.map(i => (<span key={i.id}>{i.name}, </span>))}
										</p>
									</div>
									<div className="flex-item mb-2" style={{ fontSize: '20px', fontWeight: '500' }}></div>
									<div className="text-wrap div_description1">
										{text?.overview}
									</div>
								</div>
								<div className="col-12 col-sm-12 col-md-6 p-2 mt-2 mb-2">
									<div className="flex-item mb-3">
	  									<span style={{ color: 'grey' }}>Cast:</span>
	  									{width <= 800 ? ( 
		  									<span className="div_description1">
											  {cast &&
											    cast
											      .map((i) => (<Link 
														to={`/v1/person/${i?.original_name}`} 
														className="" 
														style={{ textDecoration: 'none', color: 'white', wordSpacing: '5px' }}>
														{i?.original_name}, </Link>))
											      	.slice(0, 10)}
											</span>										
										) : 
											(cast && cast.map(i => (<Link 
												to={`/v1/person/${i?.original_name}`} 
												className="" 
												style={{ textDecoration: 'none', color: 'white', wordSpacing: '5px' }}>
												{i?.original_name}, </Link>)
											)) 
										}
									</div>
									<div className="flex-item mb-3">
										<span style={{ color: 'grey' }}>Genres:</span> 
										{genre && genre.map(i => (<span key={i?.id} className="div_description1">{i?.name}, </span>))}
									</div>
									<div className="flex-item mb-3">
										<span style={{ color: 'grey' }}>This film is:</span> <span className="div_description1">Chilling, Ominous</span>
										<div className="border-0 mt-3">
											<Link to={`/v1/payments/${text?.id}`} 
												className="btn text-uppercase border dBtn mb-3" 
												style={{ textDecoration: 'none', color: 'white', borderRadius: '70px', padding: '5px 20px' }}
											>
												donate now
											</Link>
										</div>
										<div>
											{data.length >= 1 && total ? (
												<>Total Donation: {total} SOL</>
											) : ''}
										</div>
									</div>
								</div>
							</div>

							<div className="col-12 col-sm-12" id="mpDiv5">
								{seasons && (
									<>
										<p className="mb-4" style={{ fontSize: '19px', fontWeight: '500' }}>Episodes</p>

										<div className="border-0 mp__div1">
											{seasons.map((season, index) => (
								                <div 
								                	className={`nav__btn ${selectedSeason === season.id ? 'active' : ''}`}
								                	key={index} 
								                	onClick={() => seasonClickHandler(season.id, season.season_number)}
								                >Season {season.season_number}</div>
								            ))}
										</div>
									</>
								)}

								{collection && (
									<>
										<p className="mb-4" style={{ fontSize: '19px', fontWeight: '500' }}>Parts</p>

										<div className="border-0 mp__div1">
											{collection.map((season, index) => (
								                <div 
								                	className={`nav__btn border-0 ${selectedCollection === season.id ? 'active' : ''}`}
								                	key={index} 
								                	onClick={() => collectionClickHandler(season.id)}
								                >{season.title}</div>
								            ))}
										</div>
									</>
								)}
								<hr />
							</div>

							<div className="col-12 col-sm-12 mt-1 mp__div10 mb-3">
								{firstSeason !== null && (
							        <div className="mp__div3">
							           {firstSeason.map((episode, index) => (
							             <div key={index} className="p-1 nav__div1" onClick={() => handleClick(episode, 'tv')}>
							             	<>
								            {episode.still_path ? (
								            	<img src={`https://image.tmdb.org/t/p/original${episode?.still_path}`} alt="netflix" className="sImg" />
											) : (
										    	<div className="sImg" style={{ border: "1px dotted grey" }}></div>
											)}
											<div className="ms-2" style={{ fontSize: '14px' }}>{episode.name}</div>
											</>
							             </div>
							           ))}
							        </div>
							    )}
							</div>

							<div className="col-12 col-sm-12 mt-1 mp__div2 mb-3">
								{episodeData !== null && (
							        <div className="mp__div3">
							           {episodeData.map((episode, index) => (
							             <div key={index} className="p-1 nav__div1" onClick={() => handleClick(episode, 'tv')}>
							             	<>
								            {episode.still_path ? (
								            	<img src={`https://image.tmdb.org/t/p/original${episode?.still_path}`} alt="netflix" className="sImg" />
											) : (
										    	<div className="sImg" style={{ border: "1px dotted grey" }}></div>
											)}
											<div className="ms-2" style={{ fontSize: '14px' }}>{episode.name}</div>
											</>
							             </div>
							           ))}
							        </div>
							    )}

							    {collection && (
							    	<div className="mp__div3">
							    		{collection
							    			.filter((episode) => selectedCollection === episode.id)
							    			.map((episode, index) => (
							    			<div key={index} className="p-1 nav__div3" onClick={() => handleClick(episode, 'movie')}>
								             	<>
										            {episode.backdrop_path ? (
										            	<img src={`https://image.tmdb.org/t/p/original${episode?.backdrop_path}`} alt="netflix" className="sImg" />
													) : (
										            	<img src={`https://image.tmdb.org/t/p/original${episode?.poster_path}`} alt="netflix" className="sImg" />
													)}
													<div className="ms-2" style={{ fontSize: '14px' }}>{episode.title}</div>
												</>
							             	</div>
							    		))}
							    	</div>
							    )}
							</div>

							<div className="col-12 col-sm-12 mt-1 mp__div9 justify-content-center mb-3">
								{firstSeason !== null &&
									firstSeason.map((episode, index) => (
										<div key={index} className="nav__div6" onClick={() => handleClick(episode, 'tv')}>
							             	<div className="col-1 text-center border-0 align-self-center" style={{ fontSize: '25px' }}>{episode.episode_number}</div>
							             	<div className="col text-center align-self-center border-0">
							             		{episode.still_path ? (
								            		<img src={`https://image.tmdb.org/t/p/original${episode?.still_path}`} alt="netflix" className="mImg" />
												) : (
											    	<div className="mImg" style={{ border: "1px dotted grey" }}></div>
												)}
							             	</div>
							             	<div className="col-9 d-flex flex-column justify-content-between border-0 p-2">
							             		<div className="d-flex flex-row justify-content-between align-items-center border-0" style={{ fontWeight: '600' }}>
							             			<div>{episode?.name}</div>
							             			{episode?.runtime && (
							             				<div className="me-3">{episode?.runtime}m</div>
							             			)}
							             		</div>
							             		<div className="div_description1">
							             			{truncate(episode?.overview, 150)}
							             		</div>
							             	</div>
							            </div>
									))
								}
							</div>

							<div className="col-12 col-sm-12 mp__div6 justify-content-center mb-3">
								{episodeData !== null &&
									episodeData.map((episode, index) => (
										<div key={index} className="nav__div6" onClick={() => handleClick(episode, 'tv')}>
							             	<div className="col-1 text-center border-0 align-self-center" style={{ fontSize: '25px' }}>{episode.episode_number}</div>
							             	<div className="col text-center align-self-center border-0">
							             		{episode?.still_path ? (
								            		<img src={`https://image.tmdb.org/t/p/original${episode?.still_path}`} alt="netflix" className="mImg" />
												) : (
											    	<div className="mImg" style={{ border: "1px dotted grey" }}></div>
												)}
							             	</div>
							             	<div className="col-9 d-flex flex-column justify-content-between border-0 p-2">
							             		<div className="d-flex flex-row justify-content-between align-items-center border-0" style={{ fontWeight: '600' }}>
							             			<div>{episode?.name}</div>
							             			{episode?.runtime && (
							             				<div className="me-3">{episode?.runtime}m</div>
							             			)}
							             		</div>
							             		<div className="div_description1">
							             			{truncate(episode?.overview, 150)}
							             		</div>
							             	</div>
							            </div>
									))
								}

								{collection !== null &&
								  collection
								    .filter((episode) => selectedCollection === episode.id) 
								    .map((episode, index) => (
								      <div key={index} className="nav__div6" onClick={() => handleClick(episode, 'movie')}>
								        <div className="justify-content-start border-0">
								          {episode?.backdrop_path ? (
								            <img src={`https://image.tmdb.org/t/p/original${episode?.backdrop_path}`} alt="netflix" className="mImg" />
								          ) : (
								            <div className="mImg" style={{ border: "1px dotted grey" }}></div>
								          )}
								        </div>
								        <div className="d-flex flex-column justify-content-between border-0 p-2">
								          <div className="d-flex flex-row justify-content-between align-items-center" style={{ fontWeight: '600' }}>
								            <div>{episode?.title}</div>
								          </div>
								          <div className="div_description1">
								            {truncate(episode?.overview, 150)}
								          </div>
								        </div>
								      </div>
								    ))
								}
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className="container-fluid border-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', padding: '0 !important' }}>
					{similarMovies.length >= 1 && (
						<div className="row">
							<div className="col-12 col-sm-12 mb-3">
								<p className="mb-1" style={{ fontSize: '19px', fontWeight: '500' }}>More Like This</p>
								<hr />
							</div>
							
							<div className="col-12 col-sm-12 mp__div4">
								{similarMovies && (
									<>										
										{similarMovies.map((smovie, index) => (
											<div key={index} className="border-0 nav__div5" onClick={() => smClickHandler(smovie)}>
												{smovie?.backdrop_path && (
												  <img src={`https://image.tmdb.org/t/p/original${smovie?.backdrop_path}`} alt="netflix" className="sImg" />
												)}
												{!smovie?.backdrop_path && smovie?.poster_path && (
												  <img src={`https://image.tmdb.org/t/p/original${smovie?.poster_path}`} alt="netflix" className="sImg" />
												)}
											</div>
										))}
									</>
								)}
							</div>

							<div className="col-12 col-sm-12 mp__div7">
								{similarMovies && (
									<div className="mp__div8">										
										{similarMovies.map((smovie, index) => (
											<React.Fragment key={index}>
												{smovie?.backdrop_path && (
													<div key={index} className="border-0 nav__div7" onClick={() => smClickHandler(smovie)}>
														{smovie?.backdrop_path && (
														  <img src={`https://image.tmdb.org/t/p/original${smovie?.backdrop_path}`} alt="netflix" className="smImg" />
														)}
														{!smovie?.backdrop_path && (
															<div className="sImg" style={{ border: "1px dotted grey" }}></div>
														)}
														<div className="d-flex justify-content-between align-items-center mt-1 smText1">
															<div>
				        										{Math.round(smovie.vote_average) !== 0 && (
																  <span className="me-2 text-black" style={{ padding: '2px 5px', backgroundColor: '#0096FF', borderRadius: '5px', fontWeight: '700' }}>
																    {Math.round(smovie.vote_average)}+
																  </span>
																)}
																{smovie.hasOwnProperty('first_air_date')
					          										? new Date(smovie.first_air_date).getFullYear()
					          										: smovie.release_date
					            									? new Date(smovie.release_date).getFullYear()
					            									: ''
					        									}
				        									</div>
				        									<button className="btn border text-white pt-1 pb-1 pe-2 ps-2" style={{ borderRadius: '50%' }}>+</button>
			        									</div>
			        									<div className="smText2">
			        										<span className="div_description1">
			        											{smovie?.overview && truncate(smovie?.overview, 100)}
			        										</span>
															{smovie?.name && smovie.name}
															{smovie?.original_name && smovie.original_name}
			        									</div>
													</div>
												)}
											</React.Fragment>
										))}
									</div>
								)}
							</div>
						</div>
					)}
					</div>
				</section>

				<footer>
					<div className="container-fluid" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', padding: '0 !important', height: '100px' }}>
						<div className="row">
							<div className="col-12 col-sm-12"></div>
						</div>
					</div>
				</footer>
			</>
			)}
		</div>
	);
}

export default MoviePart;
