import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import './nav5.css'

function Navbar2() {
  const [show, handleShow] = useState(false);
  const [gImg, setGImg] = useState('');

  const isLoggedIn = Cookies.get('isLoggedIn');
  const userId = Cookies.get('userId');
  // const uname = Cookies.get('uname');

  // console.log('isLoggedIn:', isLoggedIn);
  // console.log('userId:', userId);
  // console.log('uname:', uname);

  const navigate = useNavigate();
  const { disconnect } = useWallet();

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        handleShow(true);
      } else {
        handleShow(false);
      }
    });

    return () => {
      window.removeEventListener("scroll", {});
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      async function fetchData() {
        const formData = new FormData();
          formData.append('id', userId);

        const response = await axios.post(`https://mateys.xyz/web_api/getUserData.php`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type for FormData
            },
            maxBodyLength: Infinity,
        });

        // console.log(response.data);
        // if (response.data[0].username) {
        //  setEnteredTitle(response.data[0].username);
        // }
        if (response.data[0].image) {
          // console.log(response.data[0].image);
          setGImg(response.data[0].image);
        }
      }

      fetchData(); 
    }
  }, [isLoggedIn, userId])

  const logoutClickHandler = () => {
    Cookies.remove('isLoggedIn');
    Cookies.remove('userId');
    Cookies.remove('uname');
    Cookies.remove('bool');
    Cookies.remove('isSkip');
    Cookies.remove('isWallet');
    disconnect();
    navigate("/");
  }

  // console.log(show);

  return (
    <div className={`col-12 col-sm-12 text-white text-center p-0 ${show ? 'nav__black' : ''}`} id="navbar2">
      <div className="container-fluid p-0">
        <div className="row p-0">
          <div className="col-12 col-sm-12 d-flex justify-content-between align-items-center">
            <div>
              <img src="https://i.ibb.co/GFvwssk/pirate-logo-removebg-preview.png" alt="netflix" className="nav__logo" />
            </div>
            <div className="border-0 bg-transparent nav__div pt-2 ms-5">
                <Link to="/v1/home3" className="nav__link">Home</Link>
                <Link to="/search" className="nav__link">Search</Link>
                <Link to="/v1/iptv" className="nav__link">LIVE</Link>
                <a href="https://mateys.gitbook.io" target="_blank" rel="noopener noreferrer" className="nav__link">
                  <i className="fa-solid fa-scroll" style={{ color: '#fafafa' }}></i>
                </a>
                <a href="https://t.me/piratecoinsol" target="_blank" rel="noopener noreferrer" className="nav__link">
                  <i className="fa-brands fa-telegram" style={{ color: '#fafafa' }}></i>
                </a>
                <a href="https://x.com/piratecoin_" target="_blank" rel="noopener noreferrer" className="nav__link">
                  <i className="fa-brands fa-x-twitter" style={{ color: '#fafafa' }}></i>
                </a>
                <button className="nav__link border-0 bg-transparent" onClick={logoutClickHandler}>Logout</button>
            </div>
              {isLoggedIn ? (
                <img src={gImg ? `https://mateys.xyz/web_api/uploads/${gImg}`: 'https://i.ibb.co/st75bQ5/pirate-logo.png'} alt="netflix" className="nav__avatar1" style={{ borderRadius: '25px' }} />
              ): (
                <Link to="/login2" className="nav__link" style={{ borderRadius: '25px' }}>
                  <img src="https://i.ibb.co/bL3YgVS/84c20033850498-56ba69ac290ea.png" alt="netflix" className="nav__avatar1" />
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar2;
