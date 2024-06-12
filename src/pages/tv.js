import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './tv.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import Spinner2 from './Spinner2';

// Create your VideoPage component
const TV = () => {
  const [text1, setText1] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = Cookies.get('isLoggedIn');

  useEffect(() => {
    async function abcd() {
      const resp = await axios.get("https://iptv-org.github.io/iptv/languages/eng.m3u");
      const data5 = resp.data;

      // console.log(data5);

      const lines = data5.trim().split('\n');

      // Remove the first line as it contains #EXTM3U
      lines.shift();

      // Process each line
      const entries = lines.map(line => {
        const match = line.match(/tvg-id="([^"]+)" tvg-logo="([^"]+)" group-title="([^"]+)",(.+)$/);
        if (match) {
          const [, id, logo, groupTitle, title] = match;
          const url = lines[lines.indexOf(line) + 1].trim(); // Next line is assumed to be the URL
          return { id, logo, title, groupTitle, url };
        }
        return null; // Return null for lines that don't match the pattern
      }).filter(entry => entry !== null).slice(0, 800);

      // console.log(entries);                                   
      setAllEntries(entries);
      setText1(entries);
      setIsLoading(false);
    }

    abcd();
  }, [])

  useEffect(() => {
    const filteredEntries = allEntries.filter(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // console.log(filteredEntries);
    setText1(searchQuery === '' ? allEntries : filteredEntries);
  }, [searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // const [text1, setText1] = useState([]);
  // const [pageNumber, setPageNumber] = useState(1); // Track the page number for pagination
  
  const navigate = useNavigate();

  const clickHandler = (url1) => {
    // console.log(url1);
    const url2 = `/v1/play/?url=${url1}`;

    navigate(url2);
  }

  return (
    <>
      {isLoading ? (
        <Spinner2 />
      ) : (
        <div className="container-fluid mt-4 ps-3 pe-3 pt-1 pb-1">
          <div className="row">
            <header className="tv__header">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 col-sm-12">
                    <div className="tv_nav_div">
                      <div className="text-white">
                        <Link to="/v1/home3" className="nav__link" style={{ fontFamily: 'myFont' }}>Home</Link>
                      </div>
                      <div className="tv_nav1">    
                          <input 
                            className="form-control me-2" 
                            type="search" 
                            placeholder="Search" 
                            aria-label="Search"
                            onKeyUp={handleSearchInputChange} 
                          />
                      </div>
                      <div className="text-white">
                        {!isLoggedIn ? (
                          <Link to="/login2" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                            <img src="https://i.ibb.co/bL3YgVS/84c20033850498-56ba69ac290ea.png" alt="netflix" width="40" height="40" style={{ borderRadius: '25px' }} />
                          </Link>
                        ): (
                          <img src="https://i.ibb.co/st75bQ5/pirate-logo.png" alt="netflix" width="40" height="40" style={{ cursor: 'auto', borderRadius: '25px', border: '1px solid white' }} />
                        )}
                      </div>
                    </div>
                    <div className="tv_nav2">    
                        <input 
                          className="form-control me-2" 
                          type="search" 
                          placeholder="Search" 
                          aria-label="Search" 
                          onKeyUp={handleSearchInputChange}
                        />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="col-12 col-sm-12 tv__div1 mt-4">
              {text1 && text1.map((item, index) => (
                <div key={index} className="text-white text-center border" onClick={() => clickHandler(item.url)}>
                  <img src={item.logo} alt="netflix" width="auto" height="50" />
                  <p className="mt-1" style={{ fontSize: "20px", fontWeight: '700' }}>{item.title.split("(")[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TV;
