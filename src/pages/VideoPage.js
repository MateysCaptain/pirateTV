import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './vp.css';

// Create your VideoPage component
const VideoPage = () => {
  // let { url1 } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // console.log(url1);
  let name = queryParams.get('url');

  // console.log(name);

  return (
    <div className="bg-dark" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ReactPlayer
        url={name ? name : "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"}
        className="play__video"
        playing={true}
        controls={true}
        loop={true}
        muted={false}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        fullscreen="true"
      />
    </div>
  );
};

export default VideoPage;