import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pricing.css';
import { useWallet } from '@solana/wallet-adapter-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Spinner2 from './Spinner2';

function Pricing() {
	const [plans, setPlans] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const navigate = useNavigate();

	const userId = Cookies.get('userId');
	// console.log(userId);

    const { connected } = useWallet();

	const btnClickHandler = (id) => {
		if (userId && connected) {
			navigate(`/v1/paynow/${id}`);
		}
		else {
			navigate(`/v1/payBtn2/?type=crown&id=${id}`);
		}
	}

	const fetchData = async () => {
		const response = await axios.get('https://mateys.xyz/web_api/admin/getPlans.php', {
	        headers: {
          	'accept': 'application/json', // Set the content type for FormData
        	},
	    });

	    // console.log(response.data);
	    setPlans(response.data);
	    setIsLoading(false);
	}

	useEffect(() => {
		fetchData();
	}, [])

	return (
		<div className="container-fluid p__div1">
			<div className="row">
				{isLoading && <Spinner2 />}

				<div className="col-12 col-sm-12 text-center text-white border-0 p__div2">
					<h3>PREMIUM</h3>
				</div>
				<div className="border-0 p__div4">
					{plans && plans.map((i, index) => (
						<div className="p__div3" key={index}>
							{Math.floor(i.duration / 30) > 0 && Math.floor(i.duration / 30) < 12 && (
							  <div className="text-center">{Math.floor(i.duration / 30)} month</div>
							)}
							{Math.floor(i.duration / 365) >= 2 ? (
							  <div className="text-center">{Math.floor(i.duration / 365)} years</div>
							) : (
							  Math.floor(i.duration / 365) > 0 && (
							    <div className="text-center">{Math.floor(i.duration / 365)} year</div>
							  )
							)}
							<div className="p__div__price text-center">{i.amount} SOL</div>
							<div>
								<ul style={{ 'listStyleType': 'circle' }}>
									<li>review content out of stars (1-10)</li>
									<li>comment on each post</li>
									<li>no Ads</li>
								</ul>
							</div>

							<div className="text-center">
								<button className="btn border text-white" onClick={() => btnClickHandler(i.id)}>Subscribe</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Pricing;