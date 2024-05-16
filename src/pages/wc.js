import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function WC(props) {
	const { Component } = props;

    const isWallet = Cookies.get('isWallet') ;
    // console.log(isWallet, isWallet == 'true');

	useEffect(() => {
		if (isWallet) {
			window.location = "/v1/home3";
		}
		else {}
	}, [isWallet])

	return (
		<div>
			<Component />
		</div>
	);
}

export default WC;