import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar4() {
	return (
		<div id="navbar4">
			<nav className="navbar navbar-expand-lg border-body p-0 w-100">
				<div className="container-fluid p-0 w-100">
					<div className="row border-0 w-100 p-0">
						<div className="col-12 col-sm-12 border-0 d-flex justify-content-between align-items-center p-0">
							<div className="border-0 p-0">
								<img src="https://i.ibb.co/GFvwssk/pirate-logo-removebg-preview.png" alt="netflix" className="nav__logo" />
							</div>

							<div className="d-flex justify-content-center align-items-center p-0 mh__div border-0">
								<Link to="/v1/home3" className="ms-5 me-5" style={{ textDecoration: 'none', color: 'white' }}>
									Home
								</Link>
								<Link to="/search" className="me-5" style={{ textDecoration: 'none', color: 'white' }}>
									Search
								</Link>
								<Link to="/v1/iptv" className="me-5" style={{ textDecoration: 'none', color: 'white' }}>
									LIVE
								</Link>
								<a href="https://mateys.gitbook.io" target="_blank" rel="noopener noreferrer" className="me-5">
				                  <i className="fa-solid fa-scroll" style={{ color: '#fafafa' }}></i>
				                </a>
				                <a href="https://t.me/piratecoinsol" target="_blank" rel="noopener noreferrer" className="me-5">
				                  <i className="fa-brands fa-telegram" style={{ color: '#fafafa' }}></i>
				                </a>
				                <a href="https://x.com/piratecoin_" target="_blank" rel="noopener noreferrer" className="me-5">
				                  <i className="fa-brands fa-x-twitter" style={{ color: '#fafafa' }}></i>
				                </a>
							</div>

							<div className="p-0">
				                <img src="https://i.ibb.co/st75bQ5/pirate-logo.png" alt="netflix" className="nav__avatar" />
				            </div>
						</div>
					</div>
				</div>
			</nav>
		</div>
	)
}

export default Navbar4;