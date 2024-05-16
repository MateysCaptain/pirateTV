import { useState, useRef, useEffect, useCallback } from 'react';
import './settings.css';
import Navbar1 from './Navbar1';
import Navbar2 from './Navbar2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useWallet } from '@solana/wallet-adapter-react';
import Spinner2 from './Spinner2';

function Settings() {
	const [title, setEnteredTitle] = useState('');
	const [image, setEnteredImage] = useState('');
	const [daysLeft, setDaysLeft] = useState('');
	const [planName, setPlanName] = useState('');
	const [toggle, setToggle] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [nameChanged, setNameChanged] = useState(false);
  	const [imageChanged, setImageChanged] = useState(false);

	const userId = Cookies.get('userId');

	const { connected, publicKey } = useWallet();

	const uploadedImage = useRef('https://i.ibb.co/ZgtPYKS/icons8-image-upload-64.png');

	const fetchData = useCallback(async () => {
	  const formData = new FormData();
	  formData.append('id', userId);

	  const response = await axios.post(`https://mateys.xyz/web_api/getUserData.php`, formData, {
	    headers: {
	      'Content-Type': 'multipart/form-data',
	    },
	    maxBodyLength: Infinity,
	  });

	  // console.log(response.data);

	  if (response.data[0].username) {
	    Cookies.set('uname', response.data[0].username);
	    Cookies.set('bool', response.data[0].isPremium);
	    setEnteredTitle(response.data[0].username);
	  }
	  if (response.data[0].image) {
	    setEnteredImage(response.data[0].image);
	  }
	  if (response.data[0].planId !== '0') {
		const response2 = await axios.get(`https://mateys.xyz/web_api/getDaysLeft.php/?id=${userId}`, {
		    headers: {
			    'accept': 'application/json', // Set the content type for FormData
			}
		});

		// console.log(response2.data);

		setPlanName(response2.data.planName);

	  	setDaysLeft(response2.data.daysLeft);
	  }
	  setIsLoading(false);
	}, [userId]);

	const handleImageUpload = useCallback(async (e) => {
	  const [file] = e.target.files;
	  if (file) {
	    const reader = new FileReader();

	    reader.onload = (e) => {
	      const fileData = e.target.result;
	      const imageUrl = URL.createObjectURL(file);
	      uploadedImage.current.src = imageUrl;
	    };

	    reader.readAsDataURL(file);

	    setEnteredImage(file);
	    setImageChanged(true);
	  }
	}, []);

	const titleChangeHandler = useCallback((event) => {
	  setEnteredTitle(event.target.value);
	  setNameChanged(true);
	}, []);

	const submitHandler = async (event) => {
	  event.preventDefault();

	  if (userId) {
	    const formData = new FormData();
	    formData.append("fileToUpload", image);
	    formData.append('id', userId);
	    formData.append('username', title);

	    const response = await axios.post('https://mateys.xyz/web_api/upload_image.php', formData, {
	      headers: {
	        'Content-Type': 'multipart/form-data',
	      },
	      maxBodyLength: Infinity,
	    });

	    setEnteredTitle('');
	    setEnteredImage('');
	    window.location.reload();
	  } else {
	    alert("Please log in to access this page.");
	  }
	}

	const showUploadHandler = () => {
	  setToggle((prevState) => !prevState);
	}

	useEffect(() => {
	  if (userId) {
	    fetchData();
	  }
	}, [fetchData, userId]);

	return (
	  <>
	    {isLoading ? (
	      <Spinner2 />
	    ) : (
	      <div className="bg-black text-white">
	        <div className="container-fluid s__div1">
	          <div className="row">
	            <Navbar2 />

	            <div className="col-12 col-sm-3"></div>
	            <div className="col-12 col-sm-6 border s__div2">
	              <form
	                onSubmit={submitHandler}
	              >
	                <div className="mb-4">
	                  <label htmlFor="exampleInput1" className="form-label">Name</label>
	                  <input type="text" className="form-control" id="exampleInput1" aria-describedby="textHelp" value={title} onChange={titleChangeHandler} />
	                </div>
	                {toggle && (
	                  <div className="image-uploader mb-4">
	                    <label htmlFor="upload" className="upload-label">Upload image here</label>
	                    <input type="file" id="formFile" className="upload-input" accept="image/*" onChange={handleImageUpload} />
	                  </div>
	                )}

	                {(nameChanged || imageChanged) && (
	                	<button type="submit" className="btn btn-dark">Submit</button>
	                )}

	                {connected && (
	                  <div className="mt-4 text-center ss__bw">
	                    {publicKey.toBase58()}
	                  </div>
	                )}

	                {planName ? (
	                	<div className="mt-4 mb-3 text-white text-center">
	                		Plan Name : {planName}
	                	</div>
	                ) : ''}

	                {daysLeft ? (
	                	<div className="text-white text-center">
	                		Subscription ends in <span style={{ fontWeight: '600', fontSize: '25px' }}>{daysLeft}</span> days
	                	</div>
	                ) : ''}
	              </form>
	            </div>
	            <div className="col-12 col-sm-3"></div>

	            <div className="s__img border bg-black" onClick={showUploadHandler}>
	              <img
	                ref={uploadedImage}
	                className={image ? "border-0 img2" : "border-0 img1"}
	                decoding="async"
	                src={image ? `https://mateys.xyz/web_api/uploads/${image}` : "https://i.ibb.co/ZgtPYKS/icons8-image-upload-64.png"}
	                alt="piratedTV"
	              />
	            </div>

	            <div className="col-12" style={{ height: '100px' }}></div>

	            <Navbar1 />
	          </div>
	        </div>
	      </div>
	    )}
	  </>
	);
}

export default Settings;