import React, { useState, useEffect, useCallback } from 'react';
import axios from './axios';
import { useNavigate, Link } from 'react-router-dom';
import { Image, Shimmer } from 'react-shimmer';
import ReactPlayer from 'react-player/lazy';
import Spinner2 from './Spinner2';
import './row1.css';
import Cookies from 'js-cookie';

function Row4({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  // const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [popupData, setPopupData] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ left: 0, top: 0 });
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [clickData, setClickData] = useState(null);
  const [epName, setEpName] = useState(null);

  const [seasons, setSeasons] = useState(null);
  const [collection, setCollection] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);
  const [epId, setEpId] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [genre, setGenre] = useState(null);
  const [cast, setCast] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [isScrolling, setIsScrolling] = useState(false);
  const [popupTimeoutId, setPopupTimeoutId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mType, setMType] = useState('movie');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState('');

  // const location = useLocation();

  const navigate = useNavigate();

  const isPremium = Cookies.get('bool');
  // console.log(isPremium);
  window.sessionStorage.clear();

  const base_url = 'https://image.tmdb.org/t/p/original';

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(fetchUrl, {          
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w',
        },
      });

      if (response.data.hasOwnProperty('results')) {
        // console.log(response.data.results);

        // setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
        // setPage((prevPage) => prevPage + 1);
        setMovies(response.data?.results);
      }
      else {
        setMovies(response.data?.items);
      }
      setLoading(false);
      setIsLoading(false);

      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [fetchUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setPopupData(null);
        fetchData();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchData]);

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

  const handleMouseEnter = async (movie, event) => {
    if (isScrolling || width <= 600) {
      return;
    }
    event.preventDefault();

    // console.log(movie);

    // console.log(window.location.protocol);

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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
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
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
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

  const closePopup = useCallback(() => {
    // Clear the timeout and close the popup
    clearTimeout(popupTimeoutId);
    setPopupData(null);
    setIsOpen(false);
  },[popupTimeoutId]);

  const handleMouseLeave = () => {
    // console.log(popupData);
    if (!isOpen || popupData !== null) {
      setPopupData(null);
      clearTimeout(popupTimeoutId);
    }
  };

  useEffect(() => {
    const handleScroll2 = () => {
      // console.log("is scroll");
      setIsScrolling(true);
      // Additional logic for handling scrolling if needed
      closePopup();
    };

    const handleScrollEnd = () => {
      setIsScrolling(false);
    };

    // window.addEventListener('scroll', handleScroll2);
    // window.addEventListener('scrollend', handleScrollEnd);
    document.querySelector('body').addEventListener('scroll', handleScroll2);
    document.querySelector('body').addEventListener('scrollend', handleScrollEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll2);
      window.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [closePopup]);

  // const handleMouseMove = () => {
  //   // If the user moves the cursor, clear the timeout to reset the timer
  //   closePopup();
  // };

  const movieClickHandler = (movie) => {
    let name = movie?.original_title || movie?.name || movie?.original_name || movie?.title;
    let id = movie?.show_id || movie?.id;
    // console.log(epName, id, movie, name);

    const url = `/v1/moviePart/${id}?name=${name}&episode=&sno=`;
    navigate(url);
  };

  const showClickHandler = async (movie) => {
    // console.log(movie);
    let name = movie?.title || movie?.name || movie?.original_name || movie?.original_title;
    let id = movie?.id;

    setEpName(name);
    setTotal('');
    setData([]);

    const response = await axios.get(`/search/multi?query=${name}&include_adult=false&language=en-US&page=1`, {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
      }
    });

    // console.log(response.data.results);

    let filterData = response.data.results.filter(i => {
      return i.id === id;
    });

    if (filterData.length === 0) {
      filterData = response.data.results.filter((i, index) => {
        return index === 0;
      });
    }

    // console.log(filterData, filterData[0].media_type);

    let mediaType = "movie";

    if (filterData[0]?.media_type === 'tv') {
      mediaType = "tv";
      setMType(mediaType);
    }

    else if (filterData[0]?.media_type === 'movie') {
      mediaType = "movie"
      setMType(mediaType);
    }

    const response2 = await axios.get(`/${mediaType}/${filterData[0]?.id}?append_to_response=credits&language=en-US`, {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
      }
    });

    setCast(response2.data.credits?.cast);
    setGenre(response2.data?.genres);

    // console.log(response2.data);

    if (response2.data.hasOwnProperty('number_of_seasons') && response2.data?.number_of_seasons !== null) {
      const sID = response2.data?.id;
      const sid = response2.data?.seasons[0].id;

      // console.log(sID, sid);
      const filteredSeasons = response2.data?.seasons.filter(season => season.season_number !== 0);
      // console.log(response2.data?.seasons);
      // console.log(filteredSeasons);

      const response5 = await axios.get(`/tv/${sID}/similar`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
        }
      })

      // console.log(response5.data?.results);

      setEpId(response2.data?.id);
      setSeasons(filteredSeasons);
      setClickData(response2.data);
      setSimilarMovies(response5.data?.results);
      // setSelectedSeason(sid);

      const formData = new FormData();
      formData.append('tmdbId', sID);

      const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxBodyLength: Infinity,
      });

      setData(response50.data);
      return response2.data;
    }

    else if (response2.data.hasOwnProperty('belongs_to_collection') && response2.data?.belongs_to_collection !== null) {
      // console.log(response2.data);

      if (response2.data?.belongs_to_collection !== '') {
        const id = response2.data.belongs_to_collection?.id;
        const sID = response2.data?.id;
        setEpId(response2.data?.id);

        // const url = `/collection/${id}`;
        const response4 = await axios.get(`/collection/${id}`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
          }
        })

        // console.log(response4.data);

        const response5 = await axios.get(`/movie/${sID}/similar`, {
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
          }
        })

        // console.log(response5.data.results);

        setSimilarMovies(response5.data.results);
        setCollection(response4.data?.parts);
        setSelectedCollection(response4.data.parts[0]?.id);

        const formData = new FormData();
        formData.append('tmdbId', id);

        const response50 = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxBodyLength: Infinity,
        });

        setData(response50.data);
      }
      setClickData(response2.data);
      return response2.data;
    }

    else {
      // console.log("3");

      const response5 = await axios.get(`/${mediaType}/${id}/similar`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
        }
      })

      setSimilarMovies(response5.data.results);
      setClickData(response2.data);

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

  const handleClick = (movie) => {
    if (width >= 600) {
      showClickHandler(movie);
    } else {
      closePopup();
      movieClickHandler(movie);
    }
  };

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

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

  async function seasonClickHandler(id, seasonNumber) {
    // console.log(id);
    setSelectedSeason(id);
    const url = `/tv/${epId}?language=en-US&append_to_response=season/${seasonNumber}`;
    const response3 = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmQzOGRlNzRlYTUwZDRkNDE5Mzk0OTM0OTczYTA0MCIsInN1YiI6IjY1OWUyYzkzOGU4ZDMwMDE0YzIwMjExYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.D0rTluAv1sY7ne6WtCShIY8TfJIsx7HQ6FajTpbXC-w'
      }
    })

    const sData = response3.data['season/'+seasonNumber].episodes;

    // console.log(sData);

    setEpisodeData(sData);
  }

  const collectionClickHandler = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  document.addEventListener('click', function(event) {
    const imgContainer = document.querySelector('.imgContainer');
    const targetElement = event.target;
    
    if (targetElement instanceof Element) {
      const classNames = (targetElement.className || '').split(" ");
        
      if (!classNames.includes("imgContainer")) {
        setEpisodeData(null);
        closeAllPopups();
      }
    }
  });

  function closeAllPopups() {
    setPopupData(null);
  }

  function handleEpisode(episode, type) {
    // console.log(episode);
    let id = episode?.episode_number;
    let show_id = '';
    let name = epName;
    if (type === 'tv') {
      show_id = episode?.show_id;
    }
    else {
      show_id = episode?.id;
      name = episode?.title || episode?.name || episode?.original_name || episode?.original_title;
    }
    let sno = episode?.season_number;

    // console.log(episode, name);

    // console.log(epName, type, episode, name);
    navigate(`/v1/moviePart/${show_id}?name=${name}&episode=${id}&sno=${sno}`);
    // setClickData(episode);
  }

  const smClickHandler = (smovie) => {
    let name = smovie?.title || smovie?.name || smovie?.original_name || smovie?.original_title;
    let id = smovie?.id;

    // console.log(id, name);

    navigate(`/v1/moviePart/${id}?name=${name}&episode=&sno=`);

      // console.log(name, id, smovie);
  }

  const handleButtonClick = () => {
    setClickData(null);
  }

  const handlePlayClick = async (clickData, type) => {
    if (type === 'tv') {
      if (isPremium && isPremium !== "no") {
        window.location.href = `https://vidsrc.xyz/embed/tv?tmdb=${clickData?.id}&season=${clickData?.season_number}&episode=${clickData?.episode_number}`;
      }
      else {
        navigate(`/v1/first/?type=tv&id=${clickData?.id}&season=${clickData?.season_number}&episode=${clickData?.episode_number}`);
        window.location.reload();
      }
    }
    else {
      if (isPremium && isPremium !== "no") {
        window.location.href = `/v1/watchMovie/movie?tmdb=${clickData?.id}&type=movie`;
        // window.location.href = `https://hello-world-yellow-recipe-da50.oizkw1ft.workers.dev/proxy/eyJ1cmwiOiJodHRwczovL215ZmlsZXN0b3JhZ2UueHl6Lzc2MzIxNS5tcDQiLCJyZWZlcmVyIjoiaHR0cHM6Ly9iZmxpeC5ncy8ifQ%3D%3D/${clickData?.id}.mp4`;
      }
      else {
        navigate(`/v1/first/?type=movie&id=${clickData?.id}`);
        window.location.reload();
      }
    }
  }

  useEffect(() => {
    if (data.length >= 1) {
      const totalAmount = data.reduce((acc, red) => {
        return acc + parseFloat(red.total_donation);
      }, 0);

      setTotal(totalAmount);
    }
  }, [data]);

  // console.log(similarMovies);

  // console.log(data, total);

  // console.log(epId, clickData?.episode_run_time);

  return (
    <>
      {isLoading ? (
        <Spinner2 />
      ) : (
        <div className="container-fluid p-0">
          <div className="row">
            <div className="col-12 col-sm-12 mb-2 text-uppercase title">{title}</div>
            <div className="col-12 col-sm-12 border-0 imgScroller" style={{ whiteSpace: 'nowrap', overflowX: 'scroll' }}>
              {movies.map((movie, index) => (
                <div
                  key={index}
                  onClick={() => handleClick(movie)}
                  onMouseOver={(event) => handleMouseEnter(movie, event)}
                  onMouseOut={handleMouseLeave}
                  className={`imgContainer ${isLargeRow ? 'row_poster_large' : ''}`}
                >
                  <Image
                    className="border"
                    decoding="async"
                    src={`${base_url}${isLargeRow ? movie?.poster_path : movie?.backdrop_path || movie?.poster_path}`}
                    alt="piratedTV"
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
                    url={`${window.location.protocol}//www.youtube.com/embed/${popupData.videos}?version=3&autoplay=1&mute=1&controls=0&enablejsapi=1&origin=https://mateys.xyz/`}
                    className="row_video1"
                    width="100%"
                    height="auto"
                    controls={false}
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

            <div className="col-12 col-sm-12 mb-2 preview2__div">
              {clickData && (
                <div className="preview2">
                  <header className="banner1"
                    style={{
                      backgroundSize: 'cover',
                      backgroundImage: `url(${base_url}${clickData?.backdrop_path || clickData?.still_path})`,
                      backgroundPosition: 'center center',
                    }}
                    onClick={() => movieClickHandler(clickData)}
                  >
                    <div className="banner__contents">
                      <h2 className="banner__title" style={{ wordSpacing: '5px' }}>
                        {truncate(clickData?.title || clickData?.name || clickData?.original_name, 20)}
                      </h2>

                      <div className="">
                        {mType === 'tv' ? (
                          <button
                            type="button"
                            className="text-uppercase btn btn__row"
                            style={{ textDecoration: 'none' }}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayClick(clickData, 'tv');
                            }}
                          >
                            <i className="fa-solid fa-play me-2" style={{ color: '#FFFFFF' }}></i>
                            PLAY
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="text-uppercase btn btn__row"
                            style={{ textDecoration: 'none' }}
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayClick(clickData, 'movie')
                            }}
                          >
                            <i className="fa-solid fa-play me-2" style={{ color: '#FFFFFF' }}></i>
                            PLAY
                          </button>
                        )}
                      </div>

                      <h1 className="banner__description div_description1" style={{ wordSpacing: '1px', fontSize: '15px' }}>
                        {truncate(clickData?.overview, 150)}
                      </h1>
                    </div>

                    <div className="banner--fadeBottom" />
                  </header>

                  <section>
                    <div className="close_btn border-0">
                      <button type="button" className="btn p-0" onClick={handleButtonClick} aria-label="Close Movie">
                        <i className="fa-solid fa-x" style={{ color: '#ffffff' }}></i>
                      </button>
                    </div>
                  </section>

                  <section>
                    <div className="container-fluid border-0">
                      <div className="row">
                        <div className="col-12 d-flex flex-row flex-wrap p-0" id="mpDiv4">
                          <div className="col-12 col-sm-12 col-md-6 ps-3 pt-2 pb-2 mt-2 mb-2">
                            <div className="flex-item mb-2">
                              <p>
                                <span className="me-2">
                                  {clickData.hasOwnProperty('first_air_date')
                                    ? new Date(clickData?.first_air_date).getFullYear()
                                    : clickData.release_date
                                    ? new Date(clickData?.release_date).getFullYear()
                                    : ''
                                  }
                                </span>
                                {clickData.hasOwnProperty('episode_run_time') ? 
                                  (clickData?.episode_run_time && clickData?.episode_run_time.length === 1 &&
                                    clickData?.episode_run_time.map((time, index) => (
                                      <span key={index}>{formatTime(time)} </span>
                                  ))) 
                                  : clickData?.runtime 
                                  ? <span>{formatTime(clickData.runtime)} </span>
                                  : '' 
                                }
                                {clickData.hasOwnProperty('episode_run_time') && clickData?.episode_run_time.length >= 1 &&
                                  (() => {
                                    const totalRunTime = clickData?.episode_run_time.reduce((accumulator, time) => accumulator + time);
                                    const formattedTime = formatTime(totalRunTime);
                                    // console.log(formattedTime);
                                    return <span>{formattedTime}</span>;
                                  })()
                                }
                              </p>
                              <p>
                                <span 
                                  className="me-1" 
                                  style={{ backgroundColor: 'yellow', padding: '1px 5px', color: 'black', borderRadius: '5px', fontWeight: '500' }}>
                                    12+
                                </span>
                                {genre && genre.map(i => (<span key={i.id} style={{ wordSpacing: '5px' }}>{i.name}, </span>))}
                              </p>
                            </div>
                            <div 
                              className="flex-item mb-2" 
                              style={{ fontSize: '20px', fontWeight: '500', wordSpacing: '5px' }}
                            >
                              No.{Math.floor(Math.random() * 10) + 1} in Films Today
                            </div>
                            <div className="text-wrap div_description1" style={{ fontSize: '16px', letterSpacing: '0.1px' }}>
                              {truncate(clickData.overview, 100)}
                            </div>
                          </div>

                          <div className="col-12 col-sm-12 col-md-6 p-2 mt-2 mb-2">
                            <div className="flex-item mb-3" style={{ fontFamily: "myCR" }}>
                                <span style={{ color: 'grey', fontWeight: '500', fontFamily: "myFont" }}>Cast: </span> 
                                {truncate(((cast && cast.map(i => i.original_name).join(', ')) || '') + ((clickData.guest_stars && clickData.guest_stars.map(i => i.original_name).join(', ')) || ''), 150)}
                            </div>
                            <div className="flex-item mb-3">
                              <span style={{ color: 'grey', fontWeight: '500' }}>Genres:</span> {genre && genre.map(i => (<span key={i.id} className="div_description1" style={{ fontSize: '17px', letterSpacing: '0.3px' }}>{i.name}, </span>))}
                            </div>
                            <div className="flex-item mb-3">
                              <span style={{ color: 'grey', fontWeight: '500' }}>This film is:</span> <span className="div_description1" style={{ fontSize: '17px', letterSpacing: '0.3px' }}>Chilling, Ominous</span>
                            </div>
                            <div className="border-0 mt-3 ms-2 mb-3">
                              <Link to={`/v1/payments/${clickData?.id}`} 
                                className="btn text-uppercase border dBtn" 
                                style={{ textDecoration: 'none', color: 'white', borderRadius: '70px', padding: '5px 20px' }}
                              >
                                donate now
                              </Link>
                            </div>
                            <div className="ms-2">
                              {total && (
                                <>Total Donation: {total} SOL</>
                              )}
                            </div>
                          </div>

                          <div className="col-12 col-sm-12 ps-3" id="mpDiv5">
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

                          <div className="col-12 col-sm-12 mp__div6 justify-content-center mb-3">
                            {episodeData !== null &&
                              episodeData.map((episode, index) => (
                                <div key={index} className="nav__div6" onClick={() => handleEpisode(episode, 'tv')}>
                                        <div className="col-1 text-center border-0 align-self-center" style={{ fontSize: '25px' }}>{episode.episode_number}</div>
                                        <div className="col text-center align-self-center border-0">
                                          {episode.still_path ? (
                                            <img 
                                              decoding="async" 
                                              src={`https://image.tmdb.org/t/p/original${episode?.still_path}`} 
                                              alt="piratedTV" 
                                              className="mImg" 
                                            />
                                    ) : (
                                        <div className="mImg" style={{ border: "1px dotted grey" }}></div>
                                    )}
                                        </div>
                                        <div className="col-9 ps-2 d-flex flex-column justify-content-between border-0 p-2">
                                          <div className="d-flex flex-row justify-content-between align-items-center border-0" style={{ fontWeight: '600' }}>
                                            <div style={{ letterSpacing: '0.1px' }}>{episode.name}</div>
                                            {episode.runtime && (
                                              <div className="me-3">{episode.runtime}m</div>
                                            )}
                                          </div>
                                          <div className="div_description1" style={{ fontSize: '16px', letterSpacing: '0.1px' }}>
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
                                  <div key={index} className="nav__div6" onClick={() => handleEpisode(episode, 'movie')}>
                                    <div className="justify-content-start border-0">
                                      {episode.backdrop_path ? (
                                        <img decoding="async" src={`https://image.tmdb.org/t/p/original${episode?.backdrop_path}`} alt="piratedTV" className="mImg" />
                                      ) : (
                                        <div className="mImg" style={{ border: "1px dotted grey" }}></div>
                                      )}
                                    </div>
                                    <div className="d-flex flex-column justify-content-between border-0 p-2">
                                      <div className="d-flex flex-row justify-content-between align-items-center" style={{ fontWeight: '600' }}>
                                        <div>{episode.title}</div>
                                      </div>
                                      <div className="div_description1" style={{ fontSize: '16px', letterSpacing: '0.1px' }}>
                                        {truncate(episode?.overview, 150)}
                                      </div>
                                    </div>
                                  </div>
                                ))
                            }
                          </div>

                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="container-fluid border-0">
                      {similarMovies.length >= 1 && (
                        <div className="row">
                          <div className="col-12 col-sm-12 mb-3">
                            <p className="mb-1" style={{ fontSize: '19px', fontWeight: '500' }}>More Like This</p>
                            <hr />
                          </div>

                          <div className="col-12 col-sm-12 mp__div7">
                            {similarMovies && (
                              <div className="mp__div8">                    
                                {similarMovies.map((smovie, index) => (
                                  <React.Fragment key={index}>
                                  {smovie?.backdrop_path && ( 
                                    <div key={index} className="border-0 nav__div8" onClick={() => smClickHandler(smovie)}>
                                      {smovie?.backdrop_path && (
                                        <img decoding="async" src={`https://image.tmdb.org/t/p/original${smovie?.backdrop_path}`} alt="piratedTV" className="smImg1" />
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
                                            <button className="btn border text-white" style={{ borderRadius: '50%' }}>+</button>
                                          </div>
                                          <div className="smText2">
                                            <span className="div_description1" style={{ fontSize: '16px', letterSpacing: '0.1px' }}>{smovie?.overview && truncate(smovie.overview, 100)}</span>
                                            {smovie?.name && <span>{smovie.name}</span>}
                                            {smovie?.original_name && <span>{smovie.original_name}</span>}
                                          </div>
                                    </div>
                                  )}
                                  </React.Fragment>
                                )).slice(0, 6)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Row4;
