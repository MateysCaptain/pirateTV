import { useCallback, useState } from 'react';
import './login.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { authentication } from './firebase-config';
import { signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import Cookies from 'js-cookie';

function Login() {
	const [profile, setProfile] = useState('');

  	const location = useLocation();
  	const queryParams = new URLSearchParams(location.search);
  	let id = queryParams.get('id');

  	const navigate = useNavigate();

  	// console.log("Current ID:", id);
    // console.log("Current Profile:", profile);

    // const REDIRECT_URI = 'https://mateys.xyz/home';

    // const { connection } = useConnection();
    const { publicKey, wallet, wallets } = useWallet();

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleApiCall = async (pkey, pkey2, isTwitterL) => {
	    try {
	    	// console.log("bye...");
	    	
	      const formData = new FormData();
	      formData.append('walletAddress', pkey);
	      formData.append('twitter', pkey2);
	      formData.append('isTwitterLogin', isTwitterL);

	      const response = await axios.post('https://mateys.xyz/web_api/create_user.php', formData, {
	        headers: {
          	'Content-Type': 'multipart/form-data', // Set the content type for FormData
        	},
	        maxBodyLength: Infinity,
	      });

	      // console.log(JSON.stringify(response.data));
	      
	      const btnData = JSON.stringify(response.data);
	      const data = JSON.parse(btnData);

	      // console.log("abcd", data);

	      if (data.id) {
	      	Cookies.set('isLoggedIn', true);
			Cookies.set('userId', data.id);
			Cookies.set('bool', data.isPremium);
			Cookies.set('isSkip', '');
			navigate("/v1/home3");
	      }
	      else {
	      	Cookies.set('isLoggedIn', false);
			Cookies.set('userId', '');
			Cookies.set('bool', '');
			Cookies.set('isSkip', '');
			navigate("/v1/home3");
	      }
	    } catch (error) {
	      console.error(error);
	    }
	};

    const handleClick = async () => {
	    setIsButtonDisabled(false);
	    console.log("hii..");
	    handleApiCall(publicKey.toString(), '', 'false');
	};

	const handleTwitterClick = async () => {
		setIsButtonDisabled(false);
		handleApiCall('', profile, 'true');
	}

	const signInWithTwitter = () => {
    	const provider = new TwitterAuthProvider();

    	signInWithPopup(authentication, provider)
      	  .then((result) => {
        	// console.log(result.user.reloadUserInfo.screenName);
        	setProfile(result.user.reloadUserInfo.screenName);
      	  })
	      .catch((error) => {
	        // console.log(error);
	        navigate("/login2");
	      })
  	}

	return (
		<div className="bg-black text-white" id="loginDiv">
			<header>
				<div className="container-fluid border-0" id="header">
					<div className="row">
						<div className="col-12 pt-0 pb-0 ps-5 pe-5">
							<img src="https://i.ibb.co/GFvwssk/pirate-logo-removebg-preview.png" alt="netflix" width="100" height="100" id="logo1" />
						</div>
					</div>
				</div>
			</header>

			<section>
				<div className="container-fluid p-0">
					<div className="row justify-content-center">
						<div className="col-12 col-sm-2 col-lg-3 col-xl-4"></div>
						<div className="col-12 col-sm-8 col-lg-6 col-xl-4 p-5" id="loginDiv2">
							<div>
							  <h2 className="text-capitalize" style={{ overflow: 'hidden' }}>sign in</h2>
							</div>

							{id === '1' && (
								<div className="mt-4 text-white text-center">
									<div className="containerWithoutScrollbar" style={{ margin: 0 }}>
	            						<WalletMultiButton />
	        						</div>
	        				
	        						<div className="mt-4 text-center">
								  		{wallet && publicKey ? (
								          <>
								            <Link
								             	to="/v1/home3"
								             	className="btn p-2 border"
								             	style={{ color: 'white', borderRadius: '10px', fontWeight: '900' }}
								             	onClick={handleClick}
								            >
								             	CONTINUE
								            </Link>
								          </>
						         		) : (
								            <button className="btn p-2" style={{ color: 'white', backgroundColor: 'grey', fontWeight: '900' }} disabled>
								              CONTINUE
								            </button>
							        	)}
							        	{ /* <p className="mt-3 mb-3" style={{ fontWeight: "500", fontSize: "20px" }}>OR</p>
								<Link 
									to="/login/?id=2" 
									className="btn link__div__l"
								>VIA X
								</Link> */}
	        						</div>
								</div>
							)}

							{id === '2' && (
								<>
									<div className="mt-2 d-flex justify-content-center">
										<button className="btn twitter__btn d-flex align-items-center" onClick={signInWithTwitter}>
											<i className="fa-brands fa-twitter me-2" style={{ color: '#fafafa' }}></i> Login with Twitter
										</button>
									</div>

									<div className="mt-4 text-center">
										{profile && (
											<>
									            <Link
									             	to="/v1/home3"
									             	className="btn pt-2 pb-2 pe-4 ps-4"
									             	style={{ color: '#1DA1F2', backgroundColor: 'white', fontWeight: '900' }}
									             	onClick={handleTwitterClick}
									            >
									             	CONTINUE
									            </Link>
									        </>
										)}
									</div>
								</>
							)}
						</div>
						<div className="col-12 col-sm-2 col-lg-3 col-xl-4"></div>
					</div>
				</div>
			</section>

			<section>
				<div className="container-fluid mt-2 d-none">
					<div className="row">
						<div className="col-12 col-sm-12 col-lg-3 col-xl-4">
						</div>
					</div>
				</div>
			</section>

			<footer>
				<div className="container-fluid p-0">
					<div className="row justify-content-center">
						<div className="col-12 col-sm-12">
							Questions? Call 000-800-919-1694
						</div>
						<div className="col-12 col-sm-12 footer_div">
							<div>FAQ</div>
							<div>Help Centre</div>
							<div>Terms of Use</div>
							<div>Privacy</div>
							<div>Cookie Prefrences</div>
							<div>Corporate Information</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default Login;
