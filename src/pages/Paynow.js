import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Wallet from './Wallet';
import PayButton from './PayButton';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import './payNow.css';

function Paynow() {
	const { id } = useParams();
	const [amt, setAmt] = useState('');
	const [pKey, setPKey] = useState(false);

    const userId = Cookies.get('userId');

	// console.log(userId);

	const fetchData = async () => {
		const response = await axios.get(`https://mateys.xyz/web_api/admin/editPlan.php/?id=${id}`, {
		    headers: {
          		'accept': 'application/json', // Set the content type for FormData
        	},
		});

	    setAmt(response.data[0].amount);
	}

	useEffect(() => {
		fetchData()
	})

	const { connected, publicKey } = useWallet();

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
		      	Cookies.set('isLoggedIn', true);
				Cookies.set('userId', data.id);
				Cookies.set('bool', data.isPremium);
				setPKey(true);
	      	}
	      	else {
		      	Cookies.set('isLoggedIn', false);
				Cookies.set('userId', '');
				Cookies.set('bool', '');
				// navigate("/v1/home3");
				window.location = "/v1/home3";
	      	}
    	}
    	catch(error) {
    		console.log(error);
    	}
    }

	useEffect(() => {
	  if (connected) {
	  	getUserData(publicKey.toString());
	  }
	}, [connected, publicKey]);

	// console.log(connected, userId, publicKey);

	return (
		<div className="container-fluid bg-black" style={{ height: '100vh' }}>
			<div className="row">
				<div className="col-12 col-sm-12 col-md-3"></div>
				<div className="col-12 col-sm-12 col-md-6" style={{ marginTop: '100px' }}>
					<div className="mt-2 text-center">
						{pKey ? (
							<>
								<Wallet donationAmount={amt} customAmount='' type="premium" plan={id} tmdbId='' />
							</>
						): (
							<PayButton />
						)}
					</div>
				</div>
				<div className="col-12 col-sm-12 col-md-3"></div>
			</div>
		</div>
	);
}

export default Paynow;