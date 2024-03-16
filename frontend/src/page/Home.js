/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Footer from '../components/Footer/Footer'
import EV2 from '../assets/images/EV_Logo2.png';

const Home = ({ userInfo, handleLogout ,children}) => {
    return (
        <div className="container-fluid">
        <div className="row ">
            {/* Navbar */}
            <nav className="navbar container-fluid navbar-expand-lg navbar-light bg-none shadow-none p-none "> 
                <a className="navbar-brand" href="#">
                <img src={EV2} className='ml-2' alt="logo" style={{ width: '120px' }} /> {/* Increased width to 80px */}
                </a>
            </nav>
            <div className="input-group md-form form-sm form-2 mt-2 ml-2" >
                <input className="form-control my-0 py-1 red-border" type="text" placeholder="Search" aria-label="Search" style={{ borderRadius: '500px' }}/>
                <div className="input-group-append">
                    <span className="input-group-text bg-success" id="basic-text1" style={{ borderRadius: '500px' }}><i className="fas fa-search text-white" aria-hidden="true"></i></span>
                </div>
            </div>


            {/* Main content */}
            <main
                role="main"
                className="col-md-9 ml-sm-auto mr-auto col-lg-9 px-md-4 bg-white  content-wrapper"
            >
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap bg-white align-items-center pt-3 pb-2 mb-3 ">
                    <div className="container  ">

                    </div>
                </div>
                {children}
            </main>
            {/* Footer */}
            <Footer userInfo={userInfo} handleLogout={handleLogout} />
        </div>
    </div>
    )
};

export default Home;
