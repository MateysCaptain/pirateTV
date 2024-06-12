import { useState, useEffect, useCallback } from 'react';
import './lb.css';
import Navbar5 from './Navbar5';
import axios from 'axios';
import Spinner2 from './Spinner2';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useWallet } from '@solana/wallet-adapter-react';

function LeaderBoard() {
	const [ data, setData ] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [offset, setOffset] = useState(0);

	const fetchUrl = `https://mateys.xyz/web_api/leaderboard.php/?offset=${offset}`

	const fetchData = useCallback(async () => {
	    const response = await axios.get(fetchUrl, {
	        headers: {
	            'accept': 'application/json',
	        }
	    });
	    setData((prevMovie) => [...prevMovie, ...response.data]);
	    setIsLoading(false);
	}, [fetchUrl, setData, setIsLoading]);

	const handleLoadMore = async () => {
		setOffset((prevPage) => prevPage + 10);
  		setIsLoading(true);
	}

	useEffect(() => {
		fetchData()
	}, [offset, fetchData])

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
		<div className="bg-black text-white">
			{isLoading ? (
        		<Spinner2 />
      		) : (
		        <div className="container-fluid lb__div1">
		          	<div className="row">
		            	<Navbar5 />

		            	<div className="col-12 col-sm-12 lb__div2">
		            		<div className="text-uppercase text-center text-white mb-3">LeaderBoard</div>

		            		<table className="table table-borderless table-responsive-xxl">
								<thead className="table-light text-center">
								    <tr>
								      <th scope="col">#</th>
								      <th scope="col">Username</th>
								      <th scope="col">Wallet Address</th>
								      <th scope="col">Total Donations</th>
								      <th scope="col">Member Since Date</th>
								    </tr>
		  						</thead>
		  						<tbody>
		  							{data && data.map((i, index) => (
		  								<tr key={index}>
									        <th scope="row" className="text-white">{index+1}</th>
									        <td>{i.username}</td>
									        <td 
									        	onClick={() => {
									                navigator.clipboard.writeText(i.wallet_address);
									                window.alert('Address copied!');
									            }}
									        	style={{ cursor: 'pointer' }}
									        >
									        	{i.wallet_address}
									        </td>
									        <td>{i.total_donation} SOL</td>
									        <td>{i.member_since}</td>
									    </tr>
		  							))}
		                        </tbody>
							</table>

							<div className="text-center lb__div4">
		            			{data && data.map((i, index) => (
		            				<div className="lb__div3" key={index}>
		            					<div className="mb-4">
		            						<p className="text-break">{i.username}</p>
		            						<p className="text-break" 
		            							onClick={() => {
									                navigator.clipboard.writeText(i.wallet_address);
									                window.alert('Address copied!');
									            }}
									        	style={{ cursor: 'pointer' }}
									        >
									        	{i.wallet_address}
									        </p>
		            						<p className="text-break">{i.total_donation} SOL</p>
		            						<p className="text-break">{i.member_since}</p>
		            					</div>
		            				</div>
		            			))}
		            		</div>
		            	</div>

		            	{isLoading && <Spinner2 />}
		            	{data.length >= 10 && (
					        <div className="col-12 col-sm-12 mb-5 text-center">
					        	<button type="button" className="btn border pt-2 pb-2 pe-4 ps-4 text-white" onClick={handleLoadMore} style={{ borderRadius: '20px' }}>Load More</button>
					        </div>
					    )}

		            	<div className="text-white d-flex justify-content-evenly align-items-center border-0" id="navbar10" style={{ backgroundColor: '#111' }}>
							<Link to="/search">
								<i className="fa-solid fa-magnifying-glass" style={{ color: '#fafafa' }}></i>
							</Link>
							<Link to="/v1/home3">
								<i className="fa-solid fa-house" style={{ color: '#fafafa' }}></i>
							</Link>
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
		          	</div>
		        </div>
		    )}
	    </div>
	);
}

export default LeaderBoard;