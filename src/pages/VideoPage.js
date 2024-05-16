// import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPlayer from 'react-player';
import './vp.css';
// import axios from 'axios';

// Create your VideoPage component
const VideoPage = () => {
  // let { url1 } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // console.log(url1);
  let name = queryParams.get('url');

  // console.log(name);

  // useEffect(() => {
  //   // async function getData() {
  //     // const response = await axios.get("https://iptv-org.github.io/api/guides.json");
  //     // const data = response.data;

  //     // const x = data.filter(i => i.lang == 'en' && i.channel !== null);

  //     // console.log(x[0]);

  //     // const response2 = await axios.get("https://iptv-org.github.io/api/channels.json");
  //     // const data2 = response2.data;

  //     // const y = data2.filter(j => j.languages.includes("eng")).map(i => {
  //     //   return {
  //     //     id: i.id,
  //     //     logo: i.logo,
  //     //     name: i.name
  //     //   }
  //     // });

  //     // console.log(y[0], y.length);

  //     // const response3 = await axios.get("https://iptv-org.github.io/api/streams.json");
  //     // const data3 = response3.data;

  //     // const z = data3.filter(i => i.channel == id).map(j => j.url);

  //     // console.log(z);
  //   // }

  //   // getData();
  // }, [])

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