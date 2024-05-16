import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useWallet } from '@solana/wallet-adapter-react';

function Navbar1() {
	const navigate = useNavigate();
    const { disconnect } = useWallet();

    const isPremium = Cookies.get('bool');
	const isLoggedIn = Cookies.get('isLoggedIn');
    // console.log("nav1", isPremium, isPremium !== 'yes');

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

	return (
		<div className="text-white d-flex justify-content-evenly align-items-center border-0" id="navbar1" style={{ backgroundColor: '#111' }}>
			<Link to="/search">
				<i className="fa-solid fa-magnifying-glass" style={{ color: '#fafafa' }}></i>
			</Link>
			<Link to="/v1/home3">
				<i className="fa-solid fa-house" style={{ color: '#fafafa' }}></i>
			</Link>
			<a href="https://mateys.gitbook.io" target="_blank" rel="noopener noreferrer">
				<i className="fa-solid fa-scroll" style={{ color: '#fafafa' }}></i>
			</a>
			<a href="https://t.me/piratecoinsol" target="_blank" rel="noopener noreferrer">
				<i className="fa-brands fa-telegram" style={{ color: '#fafafa' }}></i>
			</a>
			<a href="https://x.com/piratecoin_" target="_blank" rel="noopener noreferrer">
				<i className="fa-brands fa-x-twitter" style={{ color: '#fafafa' }}></i>
			</a>
			{isPremium !== 'yes' ? (
				<Link to="/v1/pricing">
					<i className="fa-solid fa-crown" style={{ color: '#fafafa' }}></i>
				</Link>
			) : '' }
			<Link to="/v1/iptv">
				<i className="fa-solid fa-desktop" style={{ color: '#fafafa' }}></i>
			</Link>
			{isLoggedIn ? (
				<>
				<Link to="/v1/settings">
					<i className="fa-solid fa-gear" style={{ color: '#fafafa' }}></i>
				</Link>
				<button className="border-0 bg-transparent" onClick={logoutClickHandler}>
					<i className="fa-solid fa-right-from-bracket" style={{ color: '#fafafa' }}></i>
				</button>
				</>
			) : (
				<>
				<Link to="/v1/leaderboard">
					<i className="fa-solid fa-trophy" style={{ color: '#fafafa' }}></i>
				</Link>
				<Link to="/login2">
					<i className="fa-solid fa-user" style={{ color: '#fafafa' }}></i>
				</Link>
				</>
			)}
		</div>
	);
}

export default Navbar1;
