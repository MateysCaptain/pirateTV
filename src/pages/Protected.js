import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Protected(props) {
	const { Component } = props;
	const navigate = useNavigate();

	useEffect(() => {
		const isLoggedIn = Cookies.get('isLoggedIn');

		// console.log(isLoggedIn);

		if (isLoggedIn == undefined) {
			navigate('/login2');
		}
		else {}
	}, [])

	return (
		<div>
			<Component />
		</div>
	);
}

export default Protected;