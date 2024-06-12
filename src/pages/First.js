import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './vp.css';
import Spinner2 from "./Spinner2";
// import Cookies from 'js-cookie';

function First() {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [video, setVideo] = useState('');
    const [showSkipButton, setShowSkipButton] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    let type = queryParams.get('type');
    let id = queryParams.get('id');
    let season = queryParams.get('season');
    let episode = queryParams.get('episode');

    const videoRef = useRef(null);
    
    const navigate = useNavigate();

    const skipButtonClicked = window.sessionStorage.getItem('videoAdShown');

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get('https://mateys.xyz/web_api/admin/getVideos.php', {
                headers: {
                    'accept': 'application/json',
                },
            });

            // console.log(response.data);

            if (response.data.length >= 1) {
                // console.log("hii...");
                const randomVideoNumber = Math.floor(Math.random() * response.data.length);
                // console.log(randomVideoNumber, response.data[randomVideoNumber].video);
                setVideo(response.data[randomVideoNumber].video);
            }

            else {
                setVideo(response.data[0].video);
            }
            setVideoDuration(Number(response.data[0].skip_duration));

            setVideoLoaded(true);
            setLoading(false);
        }

        fetchData();
    }, []);

    useEffect(() => {
        const handleTimeUpdate = () => {
            const currentVideoRef = videoRef.current; // Copy videoRef.current to a variable
            if (currentVideoRef && currentVideoRef.currentTime >= videoDuration) {
                setShowSkipButton(true);
            }
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }

        return () => {
            const currentVideoRef = videoRef.current; // Use the variable in the cleanup function
            if (currentVideoRef) {
                currentVideoRef.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [videoRef, videoDuration]);

    const handleVideoLoaded = () => {
        setVideoLoaded(true);
    };

    const handleSkipClick = async () => {
        // Cookies.set('isSkip', true);
        window.sessionStorage.setItem("videoAdShown", 'true');
        // if (!link1.includes("/v1/home3")) {
        //     link1 = link1+`&episode=${episode}&sno=${season}`;
        // }

        if (type === 'tv') {
            // console.log(id, season, episode);

            window.location.href = `/v1/watchMovie/tv?tmdb=${id}&season=${season}&episode=${episode}&type=tv`;
        }
        else {
            window.location.href = `/v1/watchMovie/movie?tmdb=${id}&type=movie`;
        }
    }

    useEffect(() => {
        // Check if skip button has been clicked previously
        // console.log("abcd", skipButtonClicked);
        if (skipButtonClicked) {
            navigate(-1);
        }
    }, [navigate, skipButtonClicked]);

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

    if (loading) {
        return <Spinner2 />;
    }

    return (
        <div className="bg-dark" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            {videoLoaded && (
                <figure>
                    <video
                       ref={videoRef}
                       autoPlay="autoplay" 
                       playsInline="playsInLine" 
                       loop={true} 
                       muted={true} 
                       className="play__video"
                       onLoadedData={handleVideoLoaded}
                    >
                        <source src={video} type="video/mp4" />
                    </video>
                    <figcaption>
                        <button id="play" aria-label="Play">►</button>
                        <progress id="progress" max="100" value="0">Progress</progress>
                    </figcaption>
                </figure>
            )}
            {showSkipButton && (
                <button
                    type="button" 
                    className="skip__btn"
                    style={{ textDecoration: 'none' }}
                    rel="noopener noreferrer"
                    onClick={handleSkipClick}
                >
                    Skip &gt;&gt;
                </button>
            )}
        </div>
    );
}

export default First;