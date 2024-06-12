import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav5.css';
import Cookies from 'js-cookie';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

function Navbar5() {
	const [width, setWidth] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false);
	const [gImg, setGImg] = useState('');

	const isLoggedIn = Cookies.get('isLoggedIn');
	const userId = Cookies.get('userId');
	const isPremium = Cookies.get('bool');
	// const uname = Cookies.get('uname');

	// console.log(isPremium);

	// console.log(isPremium, isPremium == 'undefined', isPremium == 'yes', isPremium !== 'yes');

	// console.log('isLoggedIn:', isLoggedIn);
	// console.log('userId:', userId);
	// console.log('uname:', uname);
	// https://i.ibb.co/fYtL5qJ/pngwing-com.jpg

	const navigate = useNavigate();
	const { disconnect } = useWallet();

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
				// 	setEnteredTitle(response.data[0].username);
				// }
				Cookies.set('bool', response.data[0].isPremium);
				if (response.data[0].image) {
					// console.log(response.data[0].image);
					setGImg(response.data[0].image);
				}
			}

			fetchData(); 
		}
	}, [isLoggedIn, userId])

  	window.onscroll = () => {
  		setIsScrolled(window.pageYOffset === 0 ? false : true);
  		return () => (window.onscroll = null);
  	}

  	// console.log(isScrolled);

  	// Function to toggle the visibility of the options div
  	const toggleOptions = () => {
		const caretIcon = document.querySelector('.fa-caret-up');
		const optionsDiv = document.querySelector('.options');

		if (optionsDiv.style.display == 'flex') {
		   	optionsDiv.style.display = 'none';
		   	return;
		}

		optionsDiv.style.display = 'flex';

		function adjustOptionsPosition() {
		    const caretIconRect = caretIcon.getBoundingClientRect();
		    const x = optionsDiv.getBoundingClientRect();
		    const caretIconRight = caretIconRect.right;
		    const y = x.right - caretIconRight;

		    // console.log(caretIconRight, x.right, y);

		    optionsDiv.style.right = `${y}px`;
		    setWidth(window.innerWidth);
		}

		window.addEventListener('resize', adjustOptionsPosition);
		adjustOptionsPosition();

		return () => {
		    window.removeEventListener('resize', adjustOptionsPosition);
		};
	}

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

	const handleDropdownChange = (id, name) => {
    	navigate(`/v1/genre/${id}/?name=${name}`);
    	window.location.reload();
  	};

  	useEffect(() => {
  		// const dropdownIcon = document.querySelector('.fa-caret-down');
		const dropdownMenu = document.querySelector('.nav_dropdown_menu');
		const dropdownBtn = document.querySelector('.dropdown_icon__btn');

		// dropdownIcon.addEventListener('click', toggleDropdown);
        dropdownBtn.addEventListener('click', toggleDropdown);

		function toggleDropdown() {
		    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
		      dropdownMenu.style.display = 'flex';
		      dropdownMenu.style.position = 'sticky';
		    } else {
		      dropdownMenu.style.display = 'none';
		    }
		}
  	}, []);

	return (
		<>
			<div className={ isScrolled ? "navbar scrolled" : "navbar" }>
				<div className="container-fluid border-0">
					<div className="left">
						<img 
							src="https://i.ibb.co/GFvwssk/pirate-logo-removebg-preview.png" 
							alt="netflix" 
							className="p-0"
						/>

						<Link
							to="/v1/home3"
							className="nav__link__div"
						>Homepage</Link>

						{isPremium !== 'yes' ? (
							<Link
								to="/v1/pricing"
								className="nav__link__div pre__div"
							>Premium</Link>
						) : ''}

						<Link
							to="/v1/iptv"
							className="nav__link__div tv__div"
						>LIVE</Link>

						<div className="dropdown border-0">
						  <button className="btn text-white dropdown_icon__btn" type="button">
						    Categories
						  </button>
						  { /* <i className="fa-solid fa-caret-down dropdown_icon" style={{ color: '#ffffff', cursor: 'pointer' }}></i> */ }
						</div>
					</div>

					<div className="right">
						<Link 
							to="/search" 
							className="search__div"
						><i className="fa-solid fa-magnifying-glass icon" style={{ color: '#ffffff' }}></i>
						</Link>
						<Link 
							to="/search" 
							className="nav__link__div1 nav__search__div"
						><i className="fa-solid fa-magnifying-glass icon" style={{ color: '#ffffff' }}></i>
						</Link>
						{isPremium !== 'yes' ? (
							<Link to="/v1/pricing" className="cr__div">
								<i className="fa-solid fa-crown" style={{ color: '#fafafa' }}></i>
							</Link>
						) : ''}
						<Link to="/v1/iptv" className="dsk__div">
							<i className="fa-solid fa-desktop" style={{ color: '#fafafa' }}></i>
						</Link>
						<a href="https://mateys.gitbook.io" target="_blank" rel="noopener noreferrer" className="me-2 book__div">
							<i className="fa-solid fa-scroll" style={{ color: '#fafafa' }}></i>
						</a>
						<Link to="/v1/leaderboard" className="me-2 lb__div">
							<i className="fa-solid fa-trophy" style={{ color: '#fafafa' }}></i>
						</Link>
						{ /* <Link 
							to="/search" 
							className="search__div"
						><i className="fa-solid fa-magnifying-glass icon" style={{ color: '#ffffff' }}></i>
						</Link>
						<Link 
							to="/search" 
							className="nav__link__div nav__search__div"
						><i className="fa-solid fa-magnifying-glass icon" style={{ color: '#ffffff' }}></i>
						</Link> */ }
						<a href="https://t.me/piratecoinsol" target="_blank" rel="noopener noreferrer" className="me-2 tele__div">
							<i className="fa-brands fa-telegram" style={{ color: '#fafafa' }}></i>
						</a>
						<a href="https://x.com/piratecoin_" target="_blank" rel="noopener noreferrer" className="me-2 x__div">
							<i className="fa-brands fa-x-twitter" style={{ color: '#fafafa' }}></i>
						</a>
						<span className="nav__bell_div">
							<i className="fa-solid fa-bell icon" style={{ color: '#ffffff' }}></i>
						</span>
						{isLoggedIn ? (
							<img src={gImg ? `https://mateys.xyz/web_api/uploads/${gImg}`: 'https://i.ibb.co/st75bQ5/pirate-logo.png'} alt="netflix" style={{ cursor: 'auto', borderRadius: '25px' }} />
						): (
							<Link to="/login2" style={{ textDecoration: 'none', cursor: 'pointer' }}>
								<img src="https://i.ibb.co/bL3YgVS/84c20033850498-56ba69ac290ea.png" alt="netflix" />
							</Link>
						)}
						{isLoggedIn ? (
						<div className="profile">
							<i className="fa-solid fa-caret-up fa-rotate-180 icon" style={{ color: '#ffffff' }} onClick={toggleOptions}></i>
						</div>
						) : '' }
					</div>
				</div>
			</div>

			<div className="options" style={{ display: 'none', position: 'absolute', top: '70px', right: '30px' }}>
				<Link to="/v1/settings" style={{ textDecoration: 'none', color: 'white' }}>Settings</Link>
				<button type="button" className="border-0 bg-transparent text-white mt-2" onClick={logoutClickHandler}>Logout</button>
			</div>

			<div className="nav_dropdown_menu bg-black" style={{ display: 'none', borderRadius: '20px', border: '1px solid grey' }}>
				<Link 
					to="/v1/genre/28/?name=Action" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(28, 'Action')}
				>Action</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/12/?name=Adventure" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(12, 'Adventure')}
				>Adventure</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/16/?name=Animation" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(16, 'Animation')}
				>Animation</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/35/?name=Comedy" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(35, 'Comedy')}
				>Comedy</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/80/?name=Crime" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(80, 'Crime')}
				>Crime</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/27/?name=Horror" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(27, 'Horror')}
				>Horror</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/18/?name=Drama" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(18, 'Drama')}
				>Drama</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/9648/?name=Mystery" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(9648, 'Mystery')}
				>Mystery</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/10749/?name=Romance" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(10749, 'Romance')}
				>Romance</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/53/?name=Thriller" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(53, 'Thriller')}
				>Thriller</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/14/?name=Fantasy" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(14, 'Fantasy')}
				>Fantasy</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/36/?name=History" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(36, 'History')}
				>History</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/99/?name=Documentary" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(99, 'Documentary')}
				>Documentary</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/878/?name=Science Fiction" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(878, 'Science Fiction')}
				>Science Fiction</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/10752/?name=War" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(10752, 'War')}
				>War</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/37/?name=Western" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(37, 'Western')}
				>Western</Link>
				<div className="text-white" style={{ fontWeight: '600', fontSize: '20px' }}>.</div>

				<Link 
					to="/v1/genre/10751/?name=Children & Family" 
					className="nav_dropdown_btn text-white"
					onClick={() => handleDropdownChange(10751, 'Children & Family')}
				>Children & Family</Link>
			</div>
		</>
	);
}

export default Navbar5;