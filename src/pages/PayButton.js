import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import './payBtn.css';
import axios from 'axios';
import Cookies from 'js-cookie';

function PayButton() {
	const location = useLocation();
  	const queryParams = new URLSearchParams(location.search);

  	let type = queryParams.get('type') || '';
  	let id = queryParams.get('id') || '';
  	const userId = Cookies.get('userId');

  	// console.log(userId);
  	// console.log(type);

	const navigate = useNavigate();

    const { publicKey, wallet, disconnect, connected } = useWallet();
    // console.log(publicKey);

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  	// console.log(userId, connected);

    const getUserData = async (pkey1) => {
    	try {
    		const formData = new FormData();
	      	formData.append('crypto', pkey1);

	      	const response = await axios.post('https://mateys.xyz/web_api/getUser.php', formData, {
	        	headers: {
          		'Content-Type': 'multipart/form-data', // Set the content type for FormData
        		},
	        	maxBodyLength: Infinity,
	      	});

	      	// console.log(response.data);

	      	const data = response.data;

	      	// console.log(data.id, data.isPremium);

	      	if (data.id) {
	      		const formData2 = new FormData();
		      	formData2.append('id', data.id);

		      	const response2 = await axios.post("https://mateys.xyz/web_api/check_premium.php", formData2, {
			        headers: {
		          	'Content-Type': 'multipart/form-data', // Set the content type for FormData
		        	},
			        maxBodyLength: Infinity,
		      	});

		      	const { isPremium } = response2.data;

		      	Cookies.set('isLoggedIn', true);
				Cookies.set('userId', data.id);
				Cookies.set('bool', isPremium);
				Cookies.set('isSkip', '');
				if (type === 'crown') {
					navigate(`/v1/paynow/${id}`);
				}
	      	}
	      	else {
		      	Cookies.set('isLoggedIn', false);
				Cookies.set('userId', '');
				Cookies.set('bool', '');
				Cookies.set('isSkip', '');
				navigate("/v1/home3");
	      	}
    	}
    	catch(error) {
    		console.log(error);
    	}
    }

    const handleApiCall = async (pkey, pkey2, isTwitterL) => {
	    try {
	      const formData = new FormData();
	      formData.append('walletAddress', pkey);
	      formData.append('twitter', '');
	      formData.append('isTwitterLogin', isTwitterL);

	      const response = await axios.post('https://mateys.xyz/web_api/create_user.php', formData, {
	        headers: {
          	'Content-Type': 'multipart/form-data', // Set the content type for FormData
        	},
	        maxBodyLength: Infinity,
	      });

	      // console.log(response.data);
	      
	      const btnData = JSON.stringify(response.data);
	      const data = JSON.parse(btnData);

	      // console.log(data);

	      if (data.id) {
	      	Cookies.set('isLoggedIn', true);
			Cookies.set('userId', data.id);
			Cookies.set('bool', data.isPremium);
			Cookies.set('isSkip', '');
			if (type === 'crown') {
				navigate(`/v1/paynow/${id}`);
			}
	      }
	      else {
	      	Cookies.set('isLoggedIn', false);
			Cookies.set('userId', '');
			Cookies.set('bool', '');
			Cookies.set('isSkip', '');
			navigate("/v1/home3");
	      }
	    } 
	    catch (error) {
	      console.log(error);
	    }
	};

    const handleClick = () => {
	    setIsButtonDisabled(false);
	    // console.log(connected);
	    if (connected) {
	    	getUserData(publicKey.toString());
	    }
	    else {
	    	handleApiCall(publicKey.toString(), '', 'false');
	    }
	};

	const clickHandle2 = () => {
		setIsButtonDisabled(false);
	    // console.log(connected);
	    if (connected) {
	    	getUserData(publicKey.toString());
	    }
	    else {
	    	handleApiCall(publicKey.toString(), '', 'false');
	    }
	}

	// console.log(connected);

	return (
		<div className="text-white" id="payDiv">

			<section>
				<div className="container-fluid p-0">
					<div className="row justify-content-center">

						<div className="col-12 col-sm-12 col-lg-6 col-xl-4">
							<div className="mt-2 text-white text-center">
								<div className="containerWithoutScrollbar" style={{ margin: 0 }}>
            						<WalletMultiButton />
        						</div>
        				
        						<div className="mt-4 text-center">
								  	{wallet && publicKey ? (
								        <>
								            <button type="button"
								             	className="btn pt-2 pb-2 ps-4 pe-4 bg-black"
								             	style={{ color: 'white', fontWeight: '900', border: '1px solid grey', cursor: 'pointer' }}
								             	onClick={type === 'crown' ? clickHandle2 : handleClick}
								            >
								             	CONTINUE
								            </button>

								            <div style={{ height: '50px' }}></div>
								        </>
						         	) : (
						         		<>
									        <button className="btn p-2" style={{ color: 'white', backgroundColor: 'grey', fontWeight: '900' }} disabled>
									            CONTINUE
									        </button>
								            <br/>
								            {wallet && (
								            	<button className="btn p-2 mt-4 bg-transparent border" style={{ color: 'white', fontWeight: '900', cursor: 'pointer' }} onClick={disconnect}>Disconnect</button>
								            )}
								        </>
							        )}
        					    </div>
        					 </div>
						</div>

					</div>
				</div>
			</section>

		</div>
	)
}

export default PayButton;