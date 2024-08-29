import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './watch.css';

function Movie() {
	const location = useLocation();
  	const queryParams = new URLSearchParams(location.search);

  	let id = queryParams.get('tmdb');
  	let episode = queryParams.get('episode') || '';
  	let season = queryParams.get('season') || '';
  	let type = queryParams.get('type');

  	const isPremium = Cookies.get('bool');

  	useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        };

        window.onpageshow = handlePageShow;

        return () => {
            window.onpageshow = null;
        };
    }, []);

  	// console.log(id, episode, season, type, isPremium, isPremium == undefined);

	return (
		<div className="container-fluid p-0 m-0">
			<div className="row">
				<div className="col-12">
					{type === 'tv' && isPremium ? (
						<iframe 
							src={`https://vidsrc.xyz/embed/${type}?tmdb=${id}&season=${season}&episode=${episode}`} 
							referrerpolicy="origin"
							title="frame1"
							frameborder="0" 
						    marginheight="0" 
						    marginwidth="0" 
						    width="100%" 
						    height="100vh" 
						    scrolling="auto"
						    allowFullScreen
						></iframe>
					) : type === 'tv' && isPremium === undefined ? (
					  	<iframe 
							src={`https://vidsrc.xyz/embed/${type}?tmdb=${id}&season=${season}&episode=${episode}`}
							title="frame2"
							frameborder="0" 
						    marginheight="0" 
						    marginwidth="0" 
						    width="100%" 
						    height="100vh" 
						    scrolling="auto"
						    allowFullScreen
						></iframe>
					) : type === 'movie' && isPremium ? (
					  	<iframe 
						    src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`} 
						    referrerpolicy="origin"
						    title="frame3"
						    frameborder="0" 
						    marginheight="0" 
						    marginwidth="0" 
						    width="100%" 
						    height="100vh" 
						    scrolling="auto"
						    allowFullScreen
					  	></iframe>
					) : (
					  	<iframe 
						    src={`https://vidsrc.xyz/embed/movie?tmdb=${id}`}
						    title="frame4"
						    frameborder="0" 
						    marginheight="0" 
						    marginwidth="0" 
						    width="100%" 
						    height="100vh" 
						    scrolling="auto"
						    allowFullScreen
					  	></iframe>
					)}
				</div>
			</div>
		</div>
	);
}

export default Movie;