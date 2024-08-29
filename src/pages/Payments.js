import { useState, useEffect } from 'react';
import './p.css';
import { useWallet } from '@solana/wallet-adapter-react';
import Wallet from './Wallet';
import PayButton from './PayButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import Spinner2 from './Spinner2';

function Payments() {
	const [donationAmount, setDonationAmount] = useState('');
	const [customAmount, setCustomAmount] = useState('');
	// const [name, setName] = useState([]);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState('');
	const [pKey, setPKey] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
    // const [clickData, setClickData] = useState(null);

	let { id } = useParams();
	let filteredName2 = [];

	const handleAmountClick = (amount) => {
	  setDonationAmount(amount);
	};

	const handleCustomAmountChange = (event) => {
	  setCustomAmount(event.target.value);
	};

	useEffect(() => {
	  if (data !== null) {
	    // const name3 = data.map(i => {
	    //   if (i.wallet_address) {
	    //     return {
	    //       name: i.wallet_address,
	    //       amt: i.total_donation
	    //     };
	    //   }
	    // });
	    // const filteredName2 = name3.filter((_, index) => index !== name3.length - 1);
	    // setName(filteredName2);
	    const totalAmount = data.reduce((acc, red) => {
  			return acc + parseFloat(red.total_donation);
		}, 0);

		// console.log(totalAmount, totalAmount > 0);
		if (totalAmount > 0) {
	    	setTotal(totalAmount.toFixed(5));
		}
	    // console.log(total);
	  }
	}, [data]);

	const { connected, sendTransaction, publicKey } = useWallet();

	const getUserData = async (pkey1) => {
	  try {
	    const formData = new FormData();
	    formData.append('crypto', pkey1);

	    const response = await axios.post('https://mateys.xyz/web_api/getUser.php', formData, {
	      headers: {
	        'Content-Type': 'multipart/form-data',
	      },
	      maxBodyLength: Infinity,
	    });

	    const data = response.data;

	    if (data.id) {
	      const formData2 = new FormData();
	      formData2.append('id', data.id);

	      const response2 = await axios.post("https://mateys.xyz/web_api/check_premium.php", formData2, {
	        headers: {
	          'Content-Type': 'multipart/form-data',
	        },
	        maxBodyLength: Infinity,
	      });


	      const { isPremium } = response2.data;

	      Cookies.set('isLoggedIn', true);
	      Cookies.set('userId', data.id);
	      Cookies.set('bool', isPremium);
	      Cookies.set('isSkip', '');
	      setPKey(true);
	    }
	    else {
	      Cookies.set('isLoggedIn', false);
	      Cookies.set('userId', '');
	      Cookies.set('bool', '');
	      Cookies.set('isSkip', '');
	    }
	  }
	  catch(error) {
	    console.log(error);
	  }
	}

	// const lbHandler = async () => {
	// 	setClickData(!clickData);
	// }

	useEffect(() => {
	  if (id) {
	    async function fetchData() {
	      const formData = new FormData();
	      formData.append('tmdbId', id);

	      const response = await axios.post(`https://mateys.xyz/web_api/get_video_donors.php`, formData, {
	        headers: {
	          'Content-Type': 'multipart/form-data',
	        },
	        maxBodyLength: Infinity,
	      });

	      // console.log(response.data);

	      setData(response.data);
	      setTotal('');
	      setIsLoading(false);
	    }

	    fetchData();
	  }
	}, [id]);

	useEffect(() => {
	  if (connected) {
	    getUserData(publicKey.toString());
	  }
	}, [connected, publicKey]);

	// console.log(data);

	return (
		<div className="container-fluid p-0 pt-3" id="pay__div1">
			{isLoading ? (
        		<Spinner2 />
      		) : (
      		<>
				<div className="row justify-content-center mt-5">
					<div className="col-12 col-sm-4 col-md-2"></div>
					<div className="col-12 col-sm-4 col-md-8 pav__div2">
						<div className="text-uppercase text-center text-white donate__div" style={{ fontSize: "20px", fontWeight: "500" }}>
							donate now
						</div>

						{total && (
							<div className="text-uppercase text-white mt-3 text-center" style={{ fontSize: "16px", fontWeight: "500" }}>
								Total Donation: {total}
							</div>
						)}

						<div className="mt-1 ps-4 row g-4 align-items-center donate__btn__div">
							<button 
									className="col-auto amtBtn text-white" 
									onClick={() => handleAmountClick(0.1)}
									style={{ backgroundColor: donationAmount === 0.1 ? '#45b6fe' : 'transparent', color: donationAmount === 0.1 ? 'white' : 'black', border: donationAmount === 0.1 ? 'none' : '1px solid grey' }}
							>0.1</button>
							<button 
									className="col-auto amtBtn text-white" 
									onClick={() => handleAmountClick(0.5)}
									style={{ backgroundColor: donationAmount === 0.5 ? '#45b6fe' : 'transparent', color: donationAmount === 0.5 ? 'white' : 'black', border: donationAmount === 0.5 ? 'none' : '1px solid grey' }}
							>0.5</button>
							<button 
									className="col-auto amtBtn text-white" 
									onClick={() => handleAmountClick(1.0)}
									style={{ backgroundColor: donationAmount === 1.0 ? '#45b6fe' : 'transparent', color: donationAmount === 1.0 ? 'white' : 'black', border: donationAmount === 1.0 ? 'none' : '1px solid grey' }}
							>1.0</button>
							<div className="col-auto input-group input-group-lg p-2 sol__div1">
								<span className="input-group-text" style={{ backgroundColor: 'white' }}>SOL</span>
								<input 
								 	type="number" 
								    className="border ps-3" 
								  	placeholder="Other Amount" 
								  	aria-label="Amount (to the nearest sol)"
								  	value={customAmount}
	                                onChange={handleCustomAmountChange} 
								/>
							</div>
							<div className="col-auto sol__div2">
							    <input 
							    	type="number" 
							    	className="border p-3"
							    	placeholder="Enter Amount in (SOL)" 
							    	value={customAmount}
	                                onChange={handleCustomAmountChange} 
	                                aria-describedby="solHelp"
	                            />
							</div>
						</div>

						{data.length >= 1 && (
							<div className="mt-3 ps-4 text-center text-white">
								<h4 style={{ overflowY: 'hidden' }}>Donors</h4>
								<div>
									<marquee 
										style={{ color: 'white', fontSize: '20px', fontWeight: '500' }}
									>
										{data.map(item => `${item.wallet_address} - ${item.total_donation}`).join(', ')}
									</marquee>
							    </div>
							</div>
						)}

						<div className="mt-2 text-center">
							{pKey ? (
								<>
									<Wallet donationAmount={donationAmount} customAmount={customAmount} type="donation" plan='' tmdbId={id} />
								</>
							): (
								<PayButton />
							)}
						</div>
					</div>
					<div className="col-12 col-sm-4 col-md-2"></div>

					<div className="col-12 col-sm-12 mobile__div"></div>
				</div>
			</>
			)}
		</div>
	);
}

export default Payments;